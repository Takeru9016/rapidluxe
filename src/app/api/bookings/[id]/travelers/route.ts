import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { saveTravelersSchema } from "@/lib/validations/booking";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: unknown = await req.json();
    const parsed = saveTravelersSchema.safeParse(
      typeof body === "object" && body !== null
        ? { ...body, bookingId: id }
        : body,
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const booking = await prisma.booking.findFirst({
      where: { id, user: { clerkId: userId } },
    });
    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is cancelled" },
        { status: 400 },
      );
    }

    // PAN is mandatory above ₹2,00,000 (FEMA)
    const panCard = data.panCard ?? booking.panCard;
    if (booking.totalAmount > 200000 && !panCard) {
      return NextResponse.json(
        { error: "PAN card is required for bookings above ₹2,00,000" },
        { status: 400 },
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        travelers: data.travelers as Prisma.InputJsonValue,
        panCard,
        specialRequests: data.specialRequests ?? booking.specialRequests,
        dietaryRequirements: data.dietaryRequirements,
      },
    });

    return NextResponse.json({ data: { bookingId: updated.id } });
  } catch (error) {
    console.error("save travelers error:", error);
    return NextResponse.json(
      { error: "Failed to save traveler details" },
      { status: 500 },
    );
  }
}
