import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sendCancellationEmail } from "@/lib/email";
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

  const existing = await prisma.booking.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Atomic conditional transition: any status except CANCELLED can win —
  // preserves the existing rule that admin cancel is allowed from any
  // non-terminal state, unlike the customer's narrower self-cancel.
  const { count } = await prisma.booking.updateMany({
    where: { id, status: { not: "CANCELLED" } },
    data: {
      status: "CANCELLED",
      // invalidate any outstanding payment link
      paymentToken: null,
      paymentTokenExpiry: null,
    },
  });
  if (count === 0) {
    return NextResponse.json({ error: "Already cancelled" }, { status: 409 });
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id },
    include: { user: true, package: true },
  });

  await sendCancellationEmail(booking);

  return NextResponse.json({ data: { status: "CANCELLED" } });
}
