import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

const updateDealSchema = z.object({
  packageId: z.string().min(1).optional(),
  type: z
    .enum(["FLASH_SALE", "EARLY_BIRD", "LAST_MINUTE", "SEASONAL"])
    .optional(),
  discountPct: z.number().min(1).max(100).optional(),
  expiresAt: z.string().optional(),
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
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body: unknown = await req.json().catch(() => ({}));
  const parsed = updateDealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  // No body fields = simple isActive toggle (used by the table's status pill)
  if (Object.keys(parsed.data).length === 0) {
    const updated = await prisma.deal.update({
      where: { id },
      data: { isActive: !deal.isActive },
      include: { package: { include: { destination: true } } },
    });
    return NextResponse.json({ data: updated });
  }

  const { packageId, type, discountPct, expiresAt, isActive } = parsed.data;

  if (packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
  }

  let expiry: Date | undefined;
  if (expiresAt !== undefined) {
    expiry = new Date(expiresAt);
    if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 },
      );
    }
  }

  const updated = await prisma.deal.update({
    where: { id },
    data: {
      ...(packageId && { packageId }),
      ...(type && { type }),
      ...(discountPct !== undefined && { discountPct }),
      ...(expiry && { expiresAt: expiry }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { package: { include: { destination: true } } },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.deal.delete({ where: { id } });

  return NextResponse.json({ data: { deleted: true } });
}
