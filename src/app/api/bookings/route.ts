import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sendEnquiryReceivedEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  rateLimitResponse,
  strictLimiter,
} from "@/lib/rate-limit";
import { calculateBookingBaseAmount, calculateGST } from "@/lib/utils";
import { createBookingSchema } from "@/lib/validations/booking";
import type { DbBookingStatus, DisplayStatus } from "@/types/booking";

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

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return NextResponse.json({ data: [] });

    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      select: {
        id: true,
        bookingRef: true,
        status: true,
        departureDate: true,
        returnDate: true,
        adults: true,
        children: true,
        totalAmount: true,
        package: {
          select: {
            title: true,
            images: true,
            destination: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const data = bookings.map((b) => ({
      ...b,
      departureDate: b.departureDate.toISOString(),
      returnDate: b.returnDate?.toISOString() ?? null,
      displayStatus: computeDisplayStatus(
        b.status as DbBookingStatus,
        b.departureDate,
        now,
      ),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("bookings list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success, reset } = await checkRateLimit(
      strictLimiter,
      `booking:${userId}`,
    );
    if (!success) return rateLimitResponse(reset);

    const body: unknown = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const pkg = await prisma.package.findFirst({
      where: { id: data.packageId, status: "PUBLISHED" },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const { baseAmount } = calculateBookingBaseAmount(
      pkg,
      data.adults,
      data.children,
      data.infants,
    );

    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: data.couponCode,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      const minAmountMet = !coupon?.minAmount || baseAmount >= coupon.minAmount;
      if (
        coupon &&
        minAmountMet &&
        coupon.usedCount < (coupon.maxUses ?? Infinity)
      ) {
        discountAmount =
          coupon.discountType === "PERCENT"
            ? (baseAmount * coupon.discountValue) / 100
            : coupon.discountValue;
      }
    }

    const { gst, total } = calculateGST(baseAmount - discountAmount);

    // User must exist via Clerk webhook sync
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookingRef = `RL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const booking = await prisma.booking.create({
      data: {
        userId: dbUser.id,
        packageId: data.packageId,
        departureDate: new Date(data.departureDate),
        adults: data.adults,
        children: data.children,
        infants: data.infants ?? 0,
        occasion: data.occasion ?? null,
        dietaryRequirements: data.dietaryRequirements ?? [],
        specialRequests: data.specialRequests ?? "",
        travelers: [],
        baseAmount,
        gstAmount: gst,
        discountAmount,
        totalAmount: total,
        couponCode: data.couponCode ?? null,
        bookingRef,
        status: "ENQUIRY",
      },
      include: { user: true, package: { include: { destination: true } } },
    });

    if (data.couponCode && discountAmount > 0) {
      await prisma.coupon.update({
        where: { code: data.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    await sendEnquiryReceivedEmail(booking);

    return NextResponse.json(
      { data: { bookingRef, bookingId: booking.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("booking create error:", error);
    return NextResponse.json(
      { error: "Failed to create booking request" },
      { status: 500 },
    );
  }
}
