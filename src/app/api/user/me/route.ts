import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Broad international format — accepts +country code and common separators
// without assuming any single country's numbering plan.
const phoneRegex = /^[+]?[0-9()\-\s]{7,20}$/;
// Passports are alphanumeric identifiers with no universal country-specific
// format — length/charset check only, no country assumption.
const passportRegex = /^[A-Za-z0-9]{3,20}$/;
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

interface CalendarDate {
  y: number;
  m: number;
  d: number;
}

// Parses a YYYY-MM-DD string as calendar-date components and rejects dates
// that don't actually exist (e.g. 2026-02-31), which `new Date()` would
// otherwise silently roll forward into March.
function parseCalendarDate(v: string): CalendarDate | null {
  if (!dateOnlyRegex.test(v)) return null;
  const [y, m, d] = v.split("-").map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

// Deliberately UTC-based (not the server process's local timezone) so the
// comparison is deterministic regardless of where this code runs.
function todayUTC(): CalendarDate {
  const now = new Date();
  return {
    y: now.getUTCFullYear(),
    m: now.getUTCMonth() + 1,
    d: now.getUTCDate(),
  };
}

function compareCalendarDate(a: CalendarDate, b: CalendarDate): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

const updateSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Enter a valid phone number")
      .nullable()
      .optional(),
    // Calendar-date comparison only — never mix a date-only value with a
    // point-in-time instant (Date.now()), which previously rejected a
    // user's own "today" during part of the day for positive UTC-offset
    // timezones.
    dateOfBirth: z
      .string()
      .nullable()
      .optional()
      .refine((v) => !v || parseCalendarDate(v) !== null, "Enter a valid date")
      .refine((v) => {
        if (!v) return true;
        const parsed = parseCalendarDate(v);
        if (!parsed) return true; // already reported by the previous refine
        return compareCalendarDate(parsed, todayUTC()) <= 0;
      }, "Date of birth cannot be in the future"),
    nationality: z
      .string()
      .trim()
      .min(1, "Nationality cannot be empty")
      .nullable()
      .optional(),
    passportNumber: z
      .string()
      .trim()
      .regex(passportRegex, "Enter a valid passport number")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No changes provided",
  });

// The Prisma User row is normally created by the Clerk `user.created`
// webhook, but webhook delivery is async and not guaranteed to land before
// the client's next request. This closes that race by creating the row
// on demand from Clerk's own authoritative user data — the webhook remains
// the system of record for ongoing sync (role changes, profile edits made
// in the Clerk dashboard, etc.), this only handles the first-request gap.
async function ensureDbUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);
  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  // Mirrors the webhook: phone-only signups have no email, and User.email
  // is required + unique, so there's nothing safe to create here yet.
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
  const phone = clerkUser.phoneNumbers[0]?.phoneNumber ?? null;
  const role = clerkUser.publicMetadata?.role === "admin" ? "ADMIN" : "USER";

  try {
    return await prisma.user.create({
      data: { clerkId, email, name, phone, role },
    });
  } catch (err) {
    // The webhook (or a concurrent request) won the race and created the
    // row first — read what it created instead of erroring or duplicating.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return prisma.user.findUniqueOrThrow({ where: { clerkId } });
    }
    throw err;
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await ensureDbUser(userId);
  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const user = await prisma.user.findUnique({
    where: { id: dbUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      nationality: true,
      passportNumber: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    data: {
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );

  const { name, phone, dateOfBirth, nationality, passportNumber } = parsed.data;

  const dbUser = await ensureDbUser(userId);
  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Only fields the client actually sent are included here — a field the
  // caller omitted is left untouched in the database, so an unrelated edit
  // never re-validates (and can never be blocked by) another field's
  // pre-existing legacy value.
  const data: Prisma.UserUpdateInput = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;
  if (dateOfBirth !== undefined)
    data.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  if (nationality !== undefined) data.nationality = nationality;
  if (passportNumber !== undefined) data.passportNumber = passportNumber;

  const user = await prisma.user.update({
    where: { id: dbUser.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      nationality: true,
      passportNumber: true,
      role: true,
      createdAt: true,
    },
  });

  // Clerk sync is best-effort and name-only — only attempted when the name
  // actually changed, so an unrelated field-only save never touches Clerk.
  if (name !== undefined) {
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || undefined;

    try {
      const client = await clerkClient();
      await client.users.updateUser(userId, { firstName, lastName });
    } catch (err) {
      console.error("clerk name sync error:", err);
    }
  }

  return NextResponse.json({
    data: {
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
}
