import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

const createDealSchema = z.object({
  packageId: z.string().min(1),
  type: z.enum(["FLASH_SALE", "EARLY_BIRD", "LAST_MINUTE", "SEASONAL"]),
  discountPct: z.number().min(1).max(100),
  expiresAt: z.string(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deals = await prisma.deal.findMany({
    include: { package: { include: { destination: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: deals });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = createDealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { packageId, type, discountPct, expiresAt, isActive } = parsed.data;

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
    return NextResponse.json(
      { error: "Expiry date must be in the future" },
      { status: 400 },
    );
  }

  const deal = await prisma.deal.create({
    data: { packageId, type, discountPct, expiresAt: expiry, isActive },
    include: { package: { include: { destination: true } } },
  });

  return NextResponse.json({ data: deal }, { status: 201 });
}
