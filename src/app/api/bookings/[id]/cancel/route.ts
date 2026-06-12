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

    // users may only self-cancel before any payment is taken
    if (booking.status !== "ENQUIRY" && booking.status !== "QUOTE_SENT") {
      return NextResponse.json(
        { error: "Booking can no longer be cancelled online — contact us" },
        { status: 400 },
      );
    }

    await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        paymentToken: null,
        paymentTokenExpiry: null,
      },
    });

    // await sendCancellationEmail(booking)   — wired in 2E-2

    return NextResponse.json({ data: { status: "CANCELLED" } });
  } catch (error) {
    console.error("booking cancel error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
