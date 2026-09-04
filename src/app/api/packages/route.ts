import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  apiLimiter,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  createPackageSchema,
  packageFiltersSchema,
} from "@/lib/validations/package";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success) return rateLimitResponse(rl.reset);

  const { searchParams } = req.nextUrl;
  const all = searchParams.get("all") === "true";

  if (all) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const raw = {
    destination: searchParams.get("destination") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    // status filtering is admin-only (all=true) — a public request cannot
    // use this to see non-PUBLISHED packages, enforced below in `where`.
    status: all ? (searchParams.get("status") ?? undefined) : undefined,
    priceMin: searchParams.get("priceMin") ?? undefined,
    priceMax: searchParams.get("priceMax") ?? undefined,
    duration: searchParams.get("duration") ?? undefined,
    durationMin: searchParams.get("durationMin") ?? undefined,
    durationMax: searchParams.get("durationMax") ?? undefined,
    tags: searchParams.getAll("tags"),
    type: searchParams.get("type") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    // When all=true (admin), skip schema limit so max(50) doesn't reject admin requests
    limit: all ? undefined : (searchParams.get("limit") ?? undefined),
  };

  const parsed = packageFiltersSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid filters", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const {
    destination,
    search,
    status,
    priceMin,
    priceMax,
    duration,
    durationMin,
    durationMax,
    tags,
    sort,
    page,
    limit: parsedLimit,
  } = parsed.data;
  // Admin can request up to 500; public is capped by schema at 50
  const limit = all
    ? Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? "100")))
    : parsedLimit;

  const orderBy = (() => {
    switch (sort) {
      case "price_asc":
        return { pricePerPerson: "asc" as const };
      case "price_desc":
        return { pricePerPerson: "desc" as const };
      case "duration_asc":
        return { durationNights: "asc" as const };
      case "duration_desc":
        return { durationNights: "desc" as const };
      case "featured":
        return { isFeatured: "desc" as const };
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const destinationSlugs = destination
    ? destination.split(",").filter(Boolean)
    : [];

  const where = {
    ...(!all && { status: "PUBLISHED" as const }),
    ...(all && status !== undefined && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(destinationSlugs.length > 0 && {
      destination: { slug: { in: destinationSlugs } },
    }),
    ...(priceMin !== undefined && { pricePerPerson: { gte: priceMin } }),
    ...(priceMax !== undefined && {
      pricePerPerson: {
        ...(priceMin !== undefined ? { gte: priceMin } : {}),
        lte: priceMax,
      },
    }),
    ...(duration !== undefined && { durationNights: duration }),
    ...(durationMin !== undefined && { durationNights: { gte: durationMin } }),
    ...(durationMax !== undefined && {
      durationNights: {
        ...(durationMin !== undefined ? { gte: durationMin } : {}),
        lte: durationMax,
      },
    }),
    ...(tags.length > 0 && { tags: { hasSome: tags } }),
  };

  const [total, packages] = await Promise.all([
    prisma.package.count({ where }),
    prisma.package.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { destination: { select: { name: true, slug: true } } },
    }),
  ]);

  return NextResponse.json({
    data: packages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = createPackageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const existing = await prisma.package.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This slug is already in use by another package." },
      { status: 409 },
    );
  }

  const pkg = await prisma.package.create({ data: parsed.data });
  return NextResponse.json({ data: pkg }, { status: 201 });
}
