import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  apiLimiter,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getRazorpay } from "@/lib/razorpay";
import { calculateGST } from "@/lib/utils";

const createOrderSchema = z.object({ token: z.string().min(1) });

function respondWithOrder(
  order: { id: string; amount: number | string; currency: string },
  bookingId: string,
) {
  return NextResponse.json({
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { success, reset } = await checkRateLimit(
      apiLimiter,
      `payment:${parsed.data.token}`,
    );
    if (!success) return rateLimitResponse(reset);

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
    const expectedAmountPaise = Math.round(total * 100);
    const razorpay = getRazorpay();

    // One-active-order invariant: reuse the booking's existing Razorpay
    // order instead of minting a new one whenever the existing order can
    // still accept this exact payment. This is the fix for the audit's
    // P0-3 — without it, a second order silently orphans the first one
    // (nobody who already opened a checkout against order A can be
    // reconciled once razorpayOrderId is overwritten to order B).
    if (booking.razorpayOrderId) {
      try {
        const existingOrder = await razorpay.orders.fetch(
          booking.razorpayOrderId,
        );
        const stillPayable = existingOrder.status !== "paid";
        const amountMatches =
          Number(existingOrder.amount) === expectedAmountPaise &&
          existingOrder.currency === "INR";
        if (stillPayable && amountMatches) {
          return respondWithOrder(existingOrder, booking.id);
        }
        if (!stillPayable) {
          // Razorpay says this order is fully paid, but our own status is
          // not yet PAID/CONFIRMED — the client-side verify call or the
          // webhook for that payment hasn't landed yet. Do not create a
          // second order for an already-settled payment; let the existing
          // verify/webhook idempotency mechanisms — not this endpoint —
          // be the ones to transition the booking's status.
          return NextResponse.json(
            {
              error:
                "A payment for this booking has already been completed. Please refresh this page.",
            },
            { status: 409 },
          );
        }
        // Amount mismatch on an otherwise-payable order should not happen
        // under the existing quote-freeze invariant; fall through and
        // create a replacement rather than reusing a wrong-amount order.
      } catch (fetchError) {
        // Could not confirm the existing order's state (e.g. transient
        // Razorpay/network error) — proceed to create a replacement below
        // rather than blocking payment entirely.
        console.error(
          "create-order: failed to fetch existing order",
          fetchError,
        );
      }
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: expectedAmountPaise,
      currency: "INR",
      receipt: booking.bookingRef ?? `rl_${Date.now()}`,
    });

    // Concurrency guard: two requests can both reach this point having
    // seen no usable existing order and both create a Razorpay order.
    // This conditional update is a compare-and-swap on razorpayOrderId —
    // only the request whose read of the prior value is still current
    // gets to persist (and thus "win" — be the only order any client
    // ever receives and can open a checkout against) its new order.
    const { count } = await prisma.booking.updateMany({
      where: { id: booking.id, razorpayOrderId: booking.razorpayOrderId },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    if (count === 0) {
      // Lost the race — a concurrent request already saved a different
      // order. Return that winning order instead of the one just created
      // here (which is now an orphan at Razorpay's end that no client
      // will ever be given, so it can never be paid against).
      const fresh = await prisma.booking.findUniqueOrThrow({
        where: { id: booking.id },
      });
      if (fresh.razorpayOrderId) {
        const winningOrder = await razorpay.orders.fetch(fresh.razorpayOrderId);
        return respondWithOrder(winningOrder, booking.id);
      }
    }

    return respondWithOrder(razorpayOrder, booking.id);
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
