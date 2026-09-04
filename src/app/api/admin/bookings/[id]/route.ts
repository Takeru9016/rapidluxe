import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { chargedTotal } from "@/lib/utils";
import type { AdminBookingDetail, AdminTravelerSummary } from "@/types/booking";

interface RawTraveler {
  name?: string;
  isLead?: boolean;
  passportNo?: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: {
      id: true,
      bookingRef: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      departureDate: true,
      returnDate: true,
      adults: true,
      children: true,
      infants: true,
      travelers: true,
      occasion: true,
      dietaryRequirements: true,
      specialRequests: true,
      quoteNotes: true,
      paymentDueDate: true,
      baseAmount: true,
      quotedAmount: true,
      discountAmount: true,
      gstAmount: true,
      totalAmount: true,
      panCard: true,
      user: { select: { name: true, email: true, phone: true } },
      package: {
        select: {
          id: true,
          title: true,
          destination: { select: { name: true } },
        },
      },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Mask travelers — never return raw passport numbers to the admin UI.
  const rawTravelers = Array.isArray(booking.travelers)
    ? (booking.travelers as unknown as RawTraveler[])
    : [];
  const travelers: AdminTravelerSummary[] = rawTravelers.map((t) => ({
    name: t.name ?? "—",
    isLead: t.isLead ?? false,
    hasDocument: !!t.passportNo,
  }));

  const data: AdminBookingDetail = {
    id: booking.id,
    bookingRef: booking.bookingRef,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    user: booking.user,
    package: {
      id: booking.package.id,
      title: booking.package.title,
      destination: booking.package.destination?.name ?? null,
    },
    departureDate: booking.departureDate.toISOString(),
    returnDate: booking.returnDate ? booking.returnDate.toISOString() : null,
    adults: booking.adults,
    children: booking.children,
    infants: booking.infants,
    travelers,
    occasion: booking.occasion,
    dietaryRequirements: booking.dietaryRequirements,
    specialRequests: booking.specialRequests,
    quoteNotes: booking.quoteNotes,
    paymentDueDate: booking.paymentDueDate
      ? booking.paymentDueDate.toISOString()
      : null,
    baseAmount: booking.baseAmount,
    quotedAmount: booking.quotedAmount,
    discountAmount: booking.discountAmount,
    gstAmount: booking.gstAmount,
    chargedTotal: chargedTotal(booking),
    hasPanOnFile: !!booking.panCard,
  };

  return NextResponse.json({ data });
}
