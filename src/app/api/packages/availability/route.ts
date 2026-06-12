import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const packageId = searchParams.get("packageId");
  const date = searchParams.get("date");
  const adults = Number(searchParams.get("adults") ?? 1);
  const children = Number(searchParams.get("children") ?? 0);

  if (!packageId || !date) {
    return NextResponse.json(
      { error: "packageId and date are required" },
      { status: 400 },
    );
  }

  const departureDate = new Date(date);
  if (isNaN(departureDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const [pkg, bookedCount] = await Promise.all([
    prisma.package.findUnique({
      where: { id: packageId },
      select: { maxGroupSize: true },
    }),
    prisma.booking.count({
      where: {
        packageId,
        departureDate,
        status: { in: ["PAID", "CONFIRMED"] },
      },
    }),
  ]);

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const requested = adults + children;
  const remainingSlots = pkg.maxGroupSize - bookedCount;
  const available = remainingSlots >= requested;

  return NextResponse.json({ available, remainingSlots });
}
