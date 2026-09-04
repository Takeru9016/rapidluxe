import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { chargedTotal } from "@/lib/utils";

type Range = "7D" | "30D" | "90D" | "12M";

function sinceDate(range: Range): Date {
  const d = new Date();
  if (range === "7D") d.setDate(d.getDate() - 7);
  else if (range === "30D") d.setDate(d.getDate() - 30);
  else if (range === "90D") d.setDate(d.getDate() - 90);
  else d.setFullYear(d.getFullYear() - 1);
  return d;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "short" });
}

export async function GET(req: NextRequest) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rangeParam = req.nextUrl.searchParams.get("range");
  const range: Range =
    rangeParam === "7D" ||
    rangeParam === "30D" ||
    rangeParam === "90D" ||
    rangeParam === "12M"
      ? rangeParam
      : "12M";

  const since = sinceDate(range);

  // Revenue + destination data — need package + destination info
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["PAID", "CONFIRMED"] },
      createdAt: { gte: since },
    },
    select: {
      createdAt: true,
      totalAmount: true,
      quotedAmount: true,
      packageId: true,
      package: {
        select: {
          title: true,
          destination: { select: { continent: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Revenue by month
  const revenueMap = new Map<string, { label: string; revenue: number }>();
  for (const b of bookings) {
    const d = new Date(b.createdAt);
    const key = monthKey(d);
    const amount = chargedTotal(b);
    const existing = revenueMap.get(key);
    if (existing) {
      existing.revenue += amount;
    } else {
      revenueMap.set(key, { label: monthLabel(d), revenue: amount });
    }
  }
  const revenueData = [...revenueMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ month: v.label, revenue: Math.round(v.revenue) }));

  // Top packages by booking count
  const pkgCountMap = new Map<string, { name: string; bookings: number }>();
  for (const b of bookings) {
    const id = b.packageId;
    const existing = pkgCountMap.get(id);
    if (existing) {
      existing.bookings += 1;
    } else {
      pkgCountMap.set(id, {
        name: b.package?.title ?? "Unknown",
        bookings: 1,
      });
    }
  }
  const packageData = [...pkgCountMap.values()]
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  // Destination distribution (raw counts, client converts to %)
  const destCountMap = new Map<string, number>();
  for (const b of bookings) {
    const continent = b.package?.destination?.continent;
    if (continent) {
      destCountMap.set(continent, (destCountMap.get(continent) ?? 0) + 1);
    }
  }
  const destTotal = [...destCountMap.values()].reduce((s, n) => s + n, 0);
  const destinationData = [...destCountMap.entries()]
    .map(([name, count]) => ({
      name,
      value: destTotal > 0 ? Math.round((count / destTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // New users by month
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const userMap = new Map<string, { label: string; users: number }>();
  for (const u of users) {
    const d = new Date(u.createdAt);
    const key = monthKey(d);
    const existing = userMap.get(key);
    if (existing) {
      existing.users += 1;
    } else {
      userMap.set(key, { label: monthLabel(d), users: 1 });
    }
  }
  const usersData = [...userMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ month: v.label, users: v.users }));

  // Summary stats
  const now = new Date();
  const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalBookings,
    revenueMTDRows,
    activePackages,
    activeEnquiries,
    quotesAwaitingAction,
    paymentsAwaiting,
    confirmedBookings,
    recentBookingRows,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
    // Selected (not aggregated) because the authoritative charged amount is
    // computed per-row from quotedAmount, not a plain totalAmount sum — see
    // chargedTotal() above.
    prisma.booking.findMany({
      where: {
        status: { in: ["PAID", "CONFIRMED"] },
        createdAt: { gte: mtdStart },
      },
      select: { totalAmount: true, quotedAmount: true },
    }),
    prisma.package.count({ where: { status: "PUBLISHED" } }),
    prisma.enquiry.count({ where: { isRead: false } }),
    prisma.booking.count({ where: { status: "QUOTE_SENT" } }),
    prisma.booking.count({ where: { status: "AWAITING_PAYMENT" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bookingRef: true,
        departureDate: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        package: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const revenueMTD = Math.round(
    revenueMTDRows.reduce(
      (sum: number, b: { totalAmount: number; quotedAmount: number | null }) =>
        sum + chargedTotal(b),
      0,
    ),
  );

  const recentBookings = recentBookingRows.map((b) => ({
    id: b.id,
    bookingRef: b.bookingRef,
    packageTitle: b.package?.title ?? "—",
    userName: b.user?.name ?? b.user?.email ?? "—",
    departureDate: b.departureDate.toISOString(),
    totalAmount: b.totalAmount,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));

  return NextResponse.json({
    data: {
      revenue: revenueData,
      packages: packageData,
      destinations: destinationData,
      users: usersData,
      summary: {
        totalBookings,
        revenueMTD,
        activePackages,
        activeEnquiries,
        quotesAwaitingAction,
        paymentsAwaiting,
        confirmedBookings,
      },
      recentBookings,
    },
  });
}
