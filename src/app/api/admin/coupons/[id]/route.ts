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

// discountType is intentionally not editable here — changing PERCENT/FIXED
// on a coupon that already has usedCount > 0 would make past redemptions
// impossible to interpret consistently.
const updateCouponSchema = z.object({
  discountValue: z.number().positive().optional(),
  minAmount: z.number().min(0).nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body: unknown = await req.json().catch(() => ({}));
  const parsed = updateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  // No body fields = simple isActive toggle (used by the table's status pill)
  if (Object.keys(parsed.data).length === 0) {
    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
    return NextResponse.json({ data: updated });
  }

  const { discountValue, minAmount, maxUses, expiresAt, isActive } =
    parsed.data;

  if (
    discountValue !== undefined &&
    coupon.discountType === "PERCENT" &&
    discountValue > 100
  ) {
    return NextResponse.json(
      { error: "Percent discount cannot exceed 100" },
      { status: 400 },
    );
  }

  let expiry: Date | null | undefined;
  if (expiresAt !== undefined) {
    if (expiresAt === null) {
      expiry = null;
    } else {
      expiry = new Date(expiresAt);
      if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
        return NextResponse.json(
          { error: "Expiry date must be in the future" },
          { status: 400 },
        );
      }
    }
  }

  try {
    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(discountValue !== undefined && { discountValue }),
        ...(minAmount !== undefined && { minAmount }),
        ...(maxUses !== undefined && { maxUses }),
        ...(expiry !== undefined && { expiresAt: expiry }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json({ data: updated });
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.coupon.delete({ where: { id } });

  return NextResponse.json({ data: { deleted: true } });
}
