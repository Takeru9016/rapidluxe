import { auth, currentUser } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  rateLimitResponse,
  strictLimiter,
} from "@/lib/rate-limit";
import { calculateGST } from "@/lib/utils";
import { createBookingSchema } from "@/lib/validations/booking";

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

    const baseAmount = pkg.pricePerPerson * (data.adults + data.children);

    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: data.couponCode,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (coupon && coupon.usedCount < (coupon.maxUses ?? Infinity)) {
        discountAmount =
          coupon.discountType === "PERCENT"
            ? (baseAmount * coupon.discountValue) / 100
            : coupon.discountValue;
      }
    }

    const { gst, total } = calculateGST(baseAmount - discountAmount);

    // No Clerk→DB user sync exists yet, so upsert instead of 404ing
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email,
        name:
          [clerkUser?.firstName, clerkUser?.lastName]
            .filter(Boolean)
            .join(" ") || null,
      },
    });

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

    // await sendEnquiryReceivedEmail(booking)   — wired in 2E-2
    // await sendAdminNewEnquiryEmail(booking)   — wired in 2E-2

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
