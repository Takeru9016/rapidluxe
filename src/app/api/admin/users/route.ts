import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      clerkId: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const clerkIds = users.map((u) => u.clerkId);
  let bannedIds = new Set<string>();
  try {
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({
      userId: clerkIds,
      limit: 500,
    });
    bannedIds = new Set(
      clerkUsers.data.filter((cu) => cu.banned).map((cu) => cu.id),
    );
  } catch (err) {
    console.error("clerk getUserList error:", err);
  }

  const data = users.map((u) => ({
    id: u.id,
    clerkId: u.clerkId,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    bookingsCount: u._count.bookings,
    createdAt: u.createdAt.toISOString(),
    banned: bannedIds.has(u.clerkId),
  }));

  return NextResponse.json({ data });
}
