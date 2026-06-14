import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type BookingStatusParam =
  | "ENQUIRY"
  | "QUOTE_SENT"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "CANCELLED";

const VALID_STATUSES: BookingStatusParam[] = [
  "ENQUIRY",
  "QUOTE_SENT",
  "AWAITING_PAYMENT",
  "PAID",
  "CONFIRMED",
  "CANCELLED",
];

export async function GET(req: NextRequest) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.includes(statusParam as BookingStatusParam)
      ? (statusParam as BookingStatusParam)
      : undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
  );

  const where = status ? { status } : {};

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
