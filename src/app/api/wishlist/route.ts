import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// The Prisma User row is normally created by the Clerk `user.created`
// webhook, but webhook delivery is async and not guaranteed to land before
// the client's next request. This closes that race by creating the row
// on demand from Clerk's own authoritative user data — the webhook remains
// the system of record for ongoing sync, this only handles the first-request
// gap. Same pattern as bookings/route.ts and user/me/route.ts.
async function ensureDbUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);
  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
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
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureDbUser(userId);
  if (!dbUser) {
    return NextResponse.json({ data: [] });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: dbUser.id, package: { status: "PUBLISHED" } },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: wishlist });
}

const toggleSchema = z.object({ packageId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { packageId } = parsed.data;

  const dbUser = await ensureDbUser(userId);
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_packageId: { userId: dbUser.id, packageId } },
  });

  // Check-then-act, so a concurrent duplicate request can race the branch
  // taken here. The unique constraint (create) and row-existence (delete)
  // are the actual arbiters — a lost race on either side means the *other*
  // outcome already reflects the persisted state, so we report that instead
  // of erroring or guessing.
  if (existing) {
    try {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ wishlisted: false });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        // Already deleted by a concurrent request — that's the state we
        // wanted anyway.
        return NextResponse.json({ wishlisted: false });
      }
      throw err;
    }
  }

  try {
    await prisma.wishlist.create({ data: { userId: dbUser.id, packageId } });
    return NextResponse.json({ wishlisted: true }, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // A concurrent request already created it — the row exists, which is
      // exactly the state this request was trying to reach.
      return NextResponse.json({ wishlisted: true });
    }
    throw err;
  }
}
