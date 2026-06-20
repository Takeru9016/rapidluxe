import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  const deals = await prisma.deal.findMany({
    where: {
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    include: {
      package: { include: { destination: true } },
    },
    orderBy: { expiresAt: "asc" },
  });

  return NextResponse.json({ data: deals });
}
