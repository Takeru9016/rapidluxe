import crypto from "crypto";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendPaymentConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  apiLimiter,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  bookingId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = parsed.data;

    const { success, reset } = await checkRateLimit(
      apiLimiter,
      `payment-verify:${bookingId}`,
    );
    if (!success) return rateLimitResponse(reset);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature);
    const providedBuf = Buffer.from(razorpay_signature);
    const validSignature =
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf);

    if (!validSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // bind the signed order to the booking so a valid signature for one
    // order can't mark a different booking as paid
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!existing || existing.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { error: "Order does not match booking" },
        { status: 400 },
      );
    }

    // Conditional transition: only a call that actually flips the status
    // away from PAID/CONFIRMED/CANCELLED may send the confirmation email
    // or consume the coupon. This keeps a client retry and the razorpay
    // webhook from racing each other into double side effects, and keeps
    // a cancelled booking from ever being marked PAID even if a
    // still-open checkout completes after the cancellation.
    const { count } = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        status: { notIn: ["PAID", "CONFIRMED", "CANCELLED"] },
      },
      data: { status: "PAID", razorpayPaymentId: razorpay_payment_id },
    });

    if (count === 1) {
      const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId },
        include: { package: true, user: true },
      });

      if (booking.couponCode) {
        await prisma.coupon.update({
          where: { code: booking.couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      await sendPaymentConfirmationEmail(booking);
    }

    return NextResponse.json({
      data: { bookingRef: existing.bookingRef, bookingId: existing.id },
    });
  } catch {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
