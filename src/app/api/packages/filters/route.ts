import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const [destinations, priceRange, durations, tagRows] = await Promise.all([
    prisma.destination.findMany({
      where: { packages: { some: { status: "PUBLISHED" } } },
      select: { id: true, name: true, country: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.package.aggregate({
      where: { status: "PUBLISHED" },
      _min: { pricePerPerson: true },
      _max: { pricePerPerson: true },
    }),
    prisma.package.findMany({
      where: { status: "PUBLISHED" },
      select: { durationNights: true },
      distinct: ["durationNights"],
      orderBy: { durationNights: "asc" },
    }),
    prisma.package.findMany({
      where: { status: "PUBLISHED" },
      select: { tags: true },
    }),
  ]);

  const tags = Array.from(new Set(tagRows.flatMap((p) => p.tags))).sort();

  return NextResponse.json({
    destinations,
    priceRange: {
      min: priceRange._min.pricePerPerson ?? 0,
      max: priceRange._max.pricePerPerson ?? 0,
    },
    durations: durations.map((d) => d.durationNights),
    tags,
  });
}
