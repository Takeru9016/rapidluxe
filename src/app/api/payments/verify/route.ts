import crypto from "crypto";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendPaymentConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

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

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
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

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PAID", razorpayPaymentId: razorpay_payment_id },
      include: { package: true, user: true },
    });

    await sendPaymentConfirmationEmail(booking);

    return NextResponse.json({
      data: { bookingRef: booking.bookingRef, bookingId: booking.id },
    });
  } catch {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
