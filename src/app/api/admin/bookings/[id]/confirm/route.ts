import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.status !== "PAID") {
    return NextResponse.json(
      { error: "Only paid bookings can be confirmed" },
      { status: 400 },
    );
  }

  await prisma.booking.update({
    where: { id },
    data: { status: "CONFIRMED" },
    include: { user: true, package: true },
  });

  // await sendBookingConfirmedEmail(booking)   — wired in 2E-2

  return NextResponse.json({ data: { status: "CONFIRMED" } });
}
