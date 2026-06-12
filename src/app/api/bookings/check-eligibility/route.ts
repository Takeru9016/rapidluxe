import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const packageId = req.nextUrl.searchParams.get("packageId");
  if (!packageId) {
    return NextResponse.json(
      { error: "packageId is required" },
      { status: 400 },
    );
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) {
    return NextResponse.json({ eligible: false });
  }

  const booking = await prisma.booking.findFirst({
    where: { userId: dbUser.id, packageId, status: "CONFIRMED" },
  });

  return NextResponse.json({ eligible: !!booking });
}
