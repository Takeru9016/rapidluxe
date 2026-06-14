import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { DisplayStatus, DbBookingStatus } from "@/types/booking";

function computeDisplayStatus(
  status: DbBookingStatus,
  departureDate: Date,
  now: Date,
): DisplayStatus {
  if (status === "CANCELLED") return "cancelled";
  if ((status === "PAID" || status === "CONFIRMED") && departureDate < now)
    return "completed";
  return "upcoming";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const booking = await prisma.booking.findFirst({
      where: { id, userId: dbUser.id },
      select: {
        id: true,
        bookingRef: true,
        status: true,
        departureDate: true,
        returnDate: true,
        adults: true,
        children: true,
        infants: true,
        travelers: true,
        baseAmount: true,
        gstAmount: true,
        discountAmount: true,
        totalAmount: true,
        couponCode: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        package: {
          select: {
            title: true,
            images: true,
            durationNights: true,
            tags: true,
            destination: { select: { name: true } },
          },
        },
      },
    });

    if (!booking)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const now = new Date();
    const data = {
      ...booking,
      departureDate: booking.departureDate.toISOString(),
      returnDate: booking.returnDate?.toISOString() ?? null,
      displayStatus: computeDisplayStatus(
        booking.status as DbBookingStatus,
        booking.departureDate,
        now,
      ),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("booking detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}
