"use client";

import Link from "next/link";
import {
  Calendar,
  IndianRupee,
  Package,
  UserPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { ColumnDef } from "@tanstack/react-table";

import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

// ── Dummy Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jun", revenue: 1850000 },
  { month: "Jul", revenue: 2200000 },
  { month: "Aug", revenue: 1950000 },
  { month: "Sep", revenue: 2600000 },
  { month: "Oct", revenue: 2100000 },
  { month: "Nov", revenue: 1800000 },
  { month: "Dec", revenue: 3100000 },
  { month: "Jan", revenue: 2750000 },
  { month: "Feb", revenue: 2400000 },
  { month: "Mar", revenue: 2900000 },
  { month: "Apr", revenue: 3200000 },
  { month: "May", revenue: 2840000 },
];

const packagePerformance = [
  { name: "Maldives Overwater", bookings: 42, color: "#C9A84C" },
  { name: "Bali Serenity", bookings: 38, color: "#4ECDC4" },
  { name: "Santorini Romance", bookings: 31, color: "#A78BFA" },
  { name: "Dubai Luxury", bookings: 24, color: "#F87171" },
  { name: "Paris Getaway", bookings: 19, color: "#60A5FA" },
];

type BookingStatus = "upcoming" | "completed" | "cancelled";

interface RecentBooking {
  id: string;
  package: string;
  traveller: string;
  date: string;
  amount: number;
  status: BookingStatus;
}

const recentBookings: RecentBooking[] = [
  {
    id: "BK-009821",
    package: "Maldives Overwater Luxury",
    traveller: "Arjun Sharma",
    date: "2025-09-14",
    amount: 290000,
    status: "upcoming",
  },
  {
    id: "BK-009820",
    package: "Bali Serenity Escape",
    traveller: "Priya Mehta",
    date: "2025-09-10",
    amount: 170000,
    status: "upcoming",
  },
  {
    id: "BK-009819",
    package: "Santorini Sunset Romance",
    traveller: "Rahul Verma",
    date: "2025-08-22",
    amount: 310000,
    status: "completed",
  },
  {
    id: "BK-009818",
    package: "Dubai Desert Luxury",
    traveller: "Sneha Patel",
    date: "2025-08-15",
    amount: 215000,
    status: "completed",
  },
  {
    id: "BK-009817",
    package: "Paris Romantic Getaway",
    traveller: "Vikram Nair",
    date: "2025-08-01",
    amount: 195000,
    status: "cancelled",
  },
];

const statusVariant: Record<
  BookingStatus,
  "teal" | "ghost" | "coral"
> = {
  upcoming: "teal",
  completed: "ghost",
  cancelled: "coral",
};

// ── Table Columns ─────────────────────────────────────────────────────────────

const columns: ColumnDef<RecentBooking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ getValue }) => (
      <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
        #{getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "package",
    header: "Package",
  },
  {
    accessorKey: "traveller",
    header: "Traveller",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-['JetBrains_Mono'] text-(--color-gold)">
        {formatPrice(getValue<number>())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<BookingStatus>();
      return (
        <Badge variant={statusVariant[status]} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2">
      <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1">
        {label}
      </p>
      <p className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-8 py-8">

      {/* Page Title */}
      <div>
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white">
          Dashboard
        </h1>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) mt-1">
          {today}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <StatsCard
          label="Total Bookings"
          value={248}
          icon={Calendar}
          change={{ value: 12, direction: "up" }}
        />
        <StatsCard
          label="Revenue (MTD)"
          value={2840000}
          icon={IndianRupee}
          format="currency"
          change={{ value: 8, direction: "up" }}
        />
        <StatsCard
          label="Active Packages"
          value={32}
          icon={Package}
        />
        <StatsCard
          label="New Users"
          value={47}
          icon={UserPlus}
          change={{ value: 3, direction: "down" }}
        />
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <p className="font-['Cormorant_Garamond'] text-xl text-white mb-6">
            Revenue Overview
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={revenueData}
              barCategoryGap="35%"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{
                  fill: "var(--color-text-secondary)",
                  fontSize: 11,
                  fontFamily: "DM Sans",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "var(--color-text-secondary)",
                  fontSize: 11,
                  fontFamily: "DM Sans",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000000 ? `₹${v / 1000000}M` : `₹${v / 1000}K`
                }
                width={52}
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar
                dataKey="revenue"
                fill="var(--color-gold)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Package Performance */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <p className="font-['Cormorant_Garamond'] text-xl text-white mb-6">
            Top Packages
          </p>
          <div className="flex justify-center mb-4">
            <PieChart width={140} height={140}>
              <Pie
                data={packagePerformance}
                cx={65}
                cy={65}
                innerRadius={40}
                outerRadius={65}
                dataKey="bookings"
                strokeWidth={0}
              >
                {packagePerformance.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <ul className="space-y-2.5">
            {packagePerformance.map((pkg) => (
              <li
                key={pkg.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: pkg.color }}
                  />
                  <span className="font-['DM_Sans'] text-xs text-(--color-white-muted) truncate">
                    {pkg.name}
                  </span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary) shrink-0">
                  {pkg.bookings}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="font-['Cormorant_Garamond'] text-xl text-white">
            Recent Bookings
          </p>
          <Link
            href="/admin/bookings"
            className="font-['DM_Sans'] text-sm text-(--color-gold) hover:text-(--color-gold-light) transition-colors"
          >
            View All →
          </Link>
        </div>
        <DataTable columns={columns} data={recentBookings} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        {[
          { label: "Add Package", href: "/admin/packages/new" },
          { label: "Create Deal", href: "/admin/deals/new" },
          { label: "View Enquiries", href: "/admin/enquiries" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="px-5 py-2.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) font-['DM_Sans'] text-sm font-medium hover:bg-(--color-gold)/10 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

    </div>
  );
}
