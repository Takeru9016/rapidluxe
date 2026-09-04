import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  apiLimiter,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

const validateCouponSchema = z.object({
  code: z.string().min(1),
  // Raw pre-discount subtotal — minAmount is checked against this, unchanged
  // by Deal stacking.
  baseAmount: z.number().nonnegative(),
  // Post-Deal amount to calculate the discount against, when a Deal is
  // applied. Omitted (or equal to baseAmount) when there is no Deal — the
  // no-Deal behavior is unchanged from before.
  applicableAmount: z.number().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await checkRateLimit(apiLimiter, ip);
  if (!success) return rateLimitResponse(reset);

  const body: unknown = await req.json();
  const parsed = validateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { code, baseAmount, applicableAmount } = parsed.data;
  const discountBasis = applicableAmount ?? baseAmount;

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  }
  if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
    return NextResponse.json(
      { error: "This coupon has expired" },
      { status: 400 },
    );
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json(
      { error: "This coupon has reached its usage limit" },
      { status: 400 },
    );
  }
  if (coupon.minAmount !== null && baseAmount < coupon.minAmount) {
    return NextResponse.json(
      {
        error: `Minimum order amount of ₹${coupon.minAmount.toLocaleString("en-IN")} required`,
      },
      { status: 400 },
    );
  }

  // PERCENT is clamped to 100 defensively — createCouponSchema/update also
  // enforce this at write time, but a coupon created before that check
  // existed must not be able to produce a negative charged amount.
  const rawDiscount =
    coupon.discountType === "PERCENT"
      ? (discountBasis * Math.min(coupon.discountValue, 100)) / 100
      : coupon.discountValue;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), discountBasis);

  return NextResponse.json({ data: { coupon, discountAmount } });
}
