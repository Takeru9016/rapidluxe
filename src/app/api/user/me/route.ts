import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
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

  const user = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      name,
      phone: phone ?? null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      nationality: nationality ?? null,
      passportNumber: passportNumber ?? null,
    },
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

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || undefined;

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName, lastName });
  } catch (err) {
    console.error("clerk name sync error:", err);
  }

  return NextResponse.json({
    data: {
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
}
