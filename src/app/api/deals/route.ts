import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { packageHasExistingDiscount } from "@/lib/utils";

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

  // A Deal only applies to a Package that isn't already discounted — Prisma
  // can't compare two columns of the same row in a standard where, so this
  // eligibility filter runs in JS. This is the single source of truth for
  // which deals are publicly visible at all.
  const eligible = deals.filter((d) => !packageHasExistingDiscount(d.package));

  return NextResponse.json({ data: eligible });
}
