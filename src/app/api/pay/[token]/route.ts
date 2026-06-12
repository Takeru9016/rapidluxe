import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { calculateGST } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { paymentToken: token },
    include: { package: { include: { destination: true } }, user: true },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Invalid payment link" },
      { status: 404 },
    );
  }

  if (booking.status === "PAID" || booking.status === "CONFIRMED") {
    return NextResponse.json(
      { error: "already_paid", bookingRef: booking.bookingRef },
      { status: 409 },
    );
  }

  if (booking.paymentTokenExpiry && booking.paymentTokenExpiry < new Date()) {
    return NextResponse.json({ error: "link_expired" }, { status: 410 });
  }

  const { gst, total } = calculateGST(booking.quotedAmount ?? 0);

  return NextResponse.json({
    data: {
      bookingRef: booking.bookingRef,
      packageName: booking.package.title,
      packageImage: booking.package.images[0] ?? null,
      destination: booking.package.destination?.name,
      departureDate: booking.departureDate,
      adults: booking.adults,
      children: booking.children,
      quotedAmount: booking.quotedAmount,
      quoteNotes: booking.quoteNotes,
      gstAmount: gst,
      totalAmount: total,
      expiresAt: booking.paymentTokenExpiry,
      userName: booking.user.name,
      userEmail: booking.user.email,
    },
  });
}
