import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) {
    return NextResponse.json({ data: [] });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: dbUser.id },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: wishlist });
}

const toggleSchema = z.object({ packageId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { packageId } = parsed.data;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_packageId: { userId: dbUser.id, packageId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ wishlisted: false });
  }

  await prisma.wishlist.create({ data: { userId: dbUser.id, packageId } });
  return NextResponse.json({ wishlisted: true }, { status: 201 });
}
