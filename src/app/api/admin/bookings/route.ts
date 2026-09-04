import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { chargedTotal } from "@/lib/utils";
import { adminBookingFiltersSchema } from "@/lib/validations/booking";

export async function GET(req: NextRequest) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const parsed = adminBookingFiltersSchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid filters", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const { status, search, dateFrom, dateTo, page, limit } = parsed.data;

  const where: Prisma.BookingWhereInput = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { bookingRef: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
    // Admin Bookings date filtering intentionally operates on departureDate
    // (the trip date), not createdAt — see adminBookingFiltersSchema.
    // dateTo is exclusive of the following day's start rather than an
    // inclusive end-of-day literal, so a booking departing at any time on
    // the supplied end date is included regardless of its time component.
    ...((dateFrom || dateTo) && {
      departureDate: {
        ...(dateFrom && { gte: new Date(`${dateFrom}T00:00:00.000Z`) }),
        ...(dateTo && {
          lt: new Date(
            new Date(`${dateTo}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000,
          ),
        }),
      },
    }),
  };

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      select: {
        id: true,
        bookingRef: true,
        departureDate: true,
        adults: true,
        children: true,
        status: true,
        totalAmount: true,
        quotedAmount: true,
        user: { select: { name: true, email: true } },
        package: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const data = bookings.map(({ totalAmount, quotedAmount, ...rest }) => ({
    ...rest,
    quotedAmount,
    chargedTotal: chargedTotal({ totalAmount, quotedAmount }),
  }));

  return NextResponse.json({
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
