import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  strictLimiter,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { createReviewSchema } from "@/lib/validations/review";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const all = searchParams.get("all") === "true";

  if (all) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviews = await prisma.review.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ data: reviews });
  }

  const packageId = searchParams.get("packageId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
  );

  if (!packageId) {
    return NextResponse.json(
      { error: "packageId is required" },
      { status: 400 },
    );
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { packageId, isApproved: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { packageId, isApproved: true } }),
  ]);

  return NextResponse.json({
    data: reviews,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(strictLimiter, `review:${userId}`);
  if (!rl.success) return rateLimitResponse(rl.reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { packageId, rating, title, body: reviewBody, images } = parsed.data;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const confirmedBooking = await prisma.booking.findFirst({
    where: { userId: dbUser.id, packageId, status: "CONFIRMED" },
  });
  if (!confirmedBooking) {
    return NextResponse.json(
      { error: "You must have a confirmed booking to leave a review" },
      { status: 403 },
    );
  }

  const existing = await prisma.review.findFirst({
    where: { userId: dbUser.id, packageId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this package" },
      { status: 409 },
    );
  }

  const review = await prisma.review.create({
    data: {
      userId: dbUser.id,
      packageId,
      rating,
      title: title ?? null,
      body: reviewBody,
      images: images ?? [],
      isVerified: true,
      isApproved: false,
    },
  });

  return NextResponse.json({ data: review }, { status: 201 });
}
