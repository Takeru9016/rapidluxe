import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export const createCouponSchema = z
  .object({
    code: z.string().min(2).max(20),
    discountType: z.enum(["PERCENT", "FIXED"]),
    discountValue: z.number().positive(),
    minAmount: z.number().min(0).optional(),
    maxUses: z.number().int().positive().optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) => data.discountType !== "PERCENT" || data.discountValue <= 100,
    { message: "Percent discount cannot exceed 100", path: ["discountValue"] },
  );

export async function GET(_req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  return NextResponse.json({ data: coupons });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = createCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { code, discountType, discountValue, minAmount, maxUses, expiresAt } =
    parsed.data;

  if (expiresAt) {
    const expiry = new Date(expiresAt);
    if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 },
      );
    }
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minAmount: minAmount ?? null,
        maxUses: maxUses ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json({ data: coupon }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 },
      );
    }
    throw error;
  }
}
