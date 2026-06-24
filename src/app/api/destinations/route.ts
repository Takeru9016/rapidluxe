import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { destinationFiltersSchema } from "@/lib/validations/destination";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const raw = { continent: searchParams.get("continent") ?? undefined };

  const parsed = destinationFiltersSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid filters", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { continent } = parsed.data;

  const destinations = await prisma.destination.findMany({
    where: {
      ...(continent && { continent }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      continent: true,
      imageUrl: true,
      bestMonths: true,
      _count: { select: { packages: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: destinations });
}
