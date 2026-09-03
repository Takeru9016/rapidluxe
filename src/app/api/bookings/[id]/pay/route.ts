import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findFirst({
      where: { id, user: { clerkId: userId } },
    });
    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (booking.status !== "AWAITING_PAYMENT") {
      return NextResponse.json(
        { error: "This booking is not awaiting payment." },
        { status: 409 },
      );
    }
    if (!booking.paymentToken) {
      return NextResponse.json(
        { error: "No active payment link for this booking." },
        { status: 409 },
      );
    }
    if (booking.paymentTokenExpiry && booking.paymentTokenExpiry < new Date()) {
      return NextResponse.json(
        {
          error:
            "Your payment link has expired. Please contact us for a new one.",
        },
        { status: 410 },
      );
    }

    return NextResponse.json({
      data: { payUrl: `/pay/${booking.paymentToken}` },
    });
  } catch (error) {
    console.error("booking pay redirect error:", error);
    return NextResponse.json(
      { error: "Failed to start payment" },
      { status: 500 },
    );
  }
}
