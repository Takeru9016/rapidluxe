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
  baseAmount: z.number().nonnegative(),
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

  const { code, baseAmount } = parsed.data;

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

  const discountAmount =
    coupon.discountType === "PERCENT"
      ? (baseAmount * coupon.discountValue) / 100
      : Math.min(coupon.discountValue, baseAmount);

  return NextResponse.json({ data: { coupon, discountAmount } });
}
