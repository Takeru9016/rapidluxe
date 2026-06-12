import crypto from "crypto";

import { NextResponse } from "next/server";

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
      await prisma.booking.updateMany({
        where: { razorpayOrderId: order_id },
        data: { status: "PAID", razorpayPaymentId: id },
      });
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
