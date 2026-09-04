import crypto from "crypto";

import { NextResponse } from "next/server";

import { sendPaymentConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import type { RazorpayWebhookEvent } from "@/types/razorpay";

// Backup verification for payments — primary path is POST /api/payments/verify.
// Prisma (pg adapter) + node:crypto require the Node runtime, not edge.
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    const valid =
      signature.length === expectedSig.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body) as RazorpayWebhookEvent;

    if (event.event === "payment.captured") {
      const { order_id, id } = event.payload.payment.entity;

      // Conditional transition: only a call that actually flips the status
      // away from PAID/CONFIRMED may send the confirmation email or
      // consume the coupon. This is the backup path to /api/payments/verify
      // — either can run first, or both can run for the same payment, so
      // whichever one wins the transition is the only one allowed to act.
      const { count } = await prisma.booking.updateMany({
        where: {
          razorpayOrderId: order_id,
          status: { notIn: ["PAID", "CONFIRMED", "CANCELLED"] },
        },
        data: { status: "PAID", razorpayPaymentId: id },
      });

      if (count === 1) {
        const booking = await prisma.booking.findFirst({
          where: { razorpayOrderId: order_id },
          include: { package: true, user: true },
        });

        if (booking) {
          if (booking.couponCode) {
            await prisma.coupon.update({
              where: { code: booking.couponCode },
              data: { usedCount: { increment: 1 } },
            });
          }

          await sendPaymentConfirmationEmail(booking);
        }
      }
    }

    if (event.event === "payment.failed") {
      const orderId = event.payload.payment.entity.order_id;
      // late/retried "failed" events must never downgrade a paid booking
      await prisma.booking.updateMany({
        where: {
          razorpayOrderId: orderId,
          status: { notIn: ["PAID", "CONFIRMED"] },
        },
        data: { status: "AWAITING_PAYMENT" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
