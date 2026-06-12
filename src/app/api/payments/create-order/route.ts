import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { calculateGST } from "@/lib/utils";

const createOrderSchema = z.object({ token: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { paymentToken: parsed.data.token },
    });
    if (!booking) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }
    if (!booking.quotedAmount) {
      return NextResponse.json({ error: "No amount set" }, { status: 400 });
    }
    if (booking.paymentTokenExpiry && booking.paymentTokenExpiry < new Date()) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }
    if (booking.status === "PAID" || booking.status === "CONFIRMED") {
      return NextResponse.json({ error: "Already paid" }, { status: 409 });
    }

    const { total } = calculateGST(booking.quotedAmount);

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: booking.bookingRef ?? `rl_${Date.now()}`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: "INR",
        bookingId: booking.id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
