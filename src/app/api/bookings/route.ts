import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
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

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dbUser = await ensureDbUser(userId);
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
        baseAmount: true,
        quotedAmount: true,
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

    // PAN card is mandatory above ₹2,00,000 (FEMA) — validated at creation
    // time since traveler/PAN capture now happens in this same request.
    if (total > 200000 && !data.panCard) {
      return NextResponse.json(
        { error: "PAN card is required for bookings above ₹2,00,000" },
        { status: 400 },
      );
    }

    // Normally synced by the Clerk webhook; ensureDbUser closes the race
    // if this request arrives before that webhook does.
    const dbUser = await ensureDbUser(userId);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const departureDateValue = new Date(data.departureDate);

    // Idempotency: the client sends one stable UUID for the whole Step 3
    // submission attempt, reused verbatim on any retry (timeout, double
    // click). (userId, idempotencyKey) has a DB-level unique constraint
    // (see the booking_idempotency_key migration), so a retry that races
    // the original request is resolved by the database, not by a
    // check-then-act read here — see the P2002 handling below.
    const existingByKey = await prisma.booking.findFirst({
      where: { userId: dbUser.id, idempotencyKey: data.idempotencyKey },
    });
    if (existingByKey?.bookingRef) {
      return NextResponse.json(
        {
          data: {
            bookingRef: existingByKey.bookingRef,
            bookingId: existingByKey.id,
          },
        },
        { status: 200 },
      );
    }

    const bookingRef = `RL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    let booking: Prisma.BookingGetPayload<{
      include: { user: true; package: { include: { destination: true } } };
    }>;
    try {
      booking = await prisma.booking.create({
        data: {
          userId: dbUser.id,
          packageId: data.packageId,
          departureDate: departureDateValue,
          adults: data.adults,
          children: data.children,
          infants: data.infants ?? 0,
          occasion: data.occasion ?? null,
          dietaryRequirements: data.dietaryRequirements ?? [],
          specialRequests: data.specialRequests ?? "",
          travelers: data.travelers as Prisma.InputJsonValue,
          panCard: data.panCard ?? null,
          baseAmount,
          gstAmount: gst,
          discountAmount,
          totalAmount: total,
          couponCode: data.couponCode ?? null,
          bookingRef,
          idempotencyKey: data.idempotencyKey,
          status: "ENQUIRY",
        },
        include: { user: true, package: { include: { destination: true } } },
      });
    } catch (error) {
      // Two requests for the same attempt raced past the findFirst check
      // above and both reached create(); the unique constraint on
      // (userId, idempotencyKey) lets exactly one succeed. The loser
      // re-reads and returns the winner's booking instead of erroring.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const winner = await prisma.booking.findFirst({
          where: { userId: dbUser.id, idempotencyKey: data.idempotencyKey },
        });
        if (winner?.bookingRef) {
          return NextResponse.json(
            { data: { bookingRef: winner.bookingRef, bookingId: winner.id } },
            { status: 200 },
          );
        }
      }
      throw error;
    }

    // Coupon usedCount is consumed on successful payment (see
    // /api/payments/verify and /api/webhooks/razorpay), not here — an
    // abandoned enquiry must not permanently burn a limited-use coupon.

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
