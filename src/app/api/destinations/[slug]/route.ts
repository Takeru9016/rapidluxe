import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      packages: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          pricePerPerson: true,
          durationNights: true,
          images: true,
          tags: true,
          isFeatured: true,
        },
        orderBy: { isFeatured: "desc" },
      },
    },
  });

  if (!destination) {
    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: destination });
}
