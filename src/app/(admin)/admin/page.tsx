"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Calendar, IndianRupee, Package, MessageSquare } from "lucide-react";
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

// ── Types ─────────────────────────────────────────────────────────────────────

type BookingStatus =
  | "ENQUIRY"
  | "QUOTE_SENT"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "CANCELLED";

interface RecentBooking {
  id: string;
  bookingRef: string | null;
  packageTitle: string;
  userName: string;
  departureDate: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

interface AnalyticsData {
  revenue: { month: string; revenue: number }[];
  packages: { name: string; bookings: number }[];
  summary: {
    totalBookings: number;
    revenueMTD: number;
    activePackages: number;
    activeEnquiries: number;
  };
  recentBookings: RecentBooking[];
}

// ── Status → badge variant ────────────────────────────────────────────────────

const statusVariant: Record<BookingStatus, "teal" | "ghost" | "coral"> = {
  ENQUIRY: "ghost",
  QUOTE_SENT: "ghost",
  AWAITING_PAYMENT: "ghost",
  PAID: "teal",
  CONFIRMED: "teal",
  CANCELLED: "coral",
};

const statusLabel: Record<BookingStatus, string> = {
  ENQUIRY: "Enquiry",
  QUOTE_SENT: "Quote Sent",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

// ── Pie colours for top packages ─────────────────────────────────────────────

const PIE_COLORS = ["#C9A84C", "#4ECDC4", "#A78BFA", "#F87171", "#60A5FA"];

// ── Table Columns ─────────────────────────────────────────────────────────────

const columns: ColumnDef<RecentBooking>[] = [
  {
    accessorKey: "bookingRef",
    header: "Ref",
    cell: ({ getValue }) => (
      <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
        {getValue<string | null>() ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "packageTitle",
    header: "Package",
    cell: ({ getValue }) => (
      <span className="text-white text-sm">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "userName",
    header: "Traveller",
    cell: ({ getValue }) => (
      <span className="text-(--color-white-muted) text-sm">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "departureDate",
    header: "Departure",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
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
      const s = getValue<BookingStatus>();
      return (
        <Badge variant={statusVariant[s]} size="sm">
          {statusLabel[s]}
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

  const { data, isLoading } = useQuery<{ data: AnalyticsData }>({
    queryKey: ["admin-analytics-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics?range=12M");
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json() as Promise<{ data: AnalyticsData }>;
    },
  });

  const analytics = data?.data;
  const summary = analytics?.summary;
  const revenueData = analytics?.revenue ?? [];
  const packageData = analytics?.packages ?? [];
  const recentBookings = analytics?.recentBookings ?? [];

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
          value={summary?.totalBookings ?? 0}
          icon={Calendar}
        />
        <StatsCard
          label="Revenue (MTD)"
          value={summary?.revenueMTD ?? 0}
          icon={IndianRupee}
          format="currency"
        />
        <StatsCard
          label="Active Packages"
          value={summary?.activePackages ?? 0}
          icon={Package}
        />
        <StatsCard
          label="Active Enquiries"
          value={summary?.activeEnquiries ?? 0}
          icon={MessageSquare}
        />
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <p className="font-['Cormorant_Garamond'] text-xl text-white mb-6">
            Revenue Overview
          </p>
          {isLoading ? (
            <div className="h-[220px] flex items-center justify-center">
              <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                Loading…
              </span>
            </div>
          ) : revenueData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                No revenue data yet
              </span>
            </div>
          ) : (
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
                <Tooltip
                  content={<RevenueTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-gold)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Packages */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <p className="font-['Cormorant_Garamond'] text-xl text-white mb-6">
            Top Packages
          </p>
          {isLoading ? (
            <div className="h-[180px] flex items-center justify-center">
              <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                Loading…
              </span>
            </div>
          ) : packageData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center">
              <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                No bookings yet
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <PieChart width={140} height={140}>
                  <Pie
                    data={packageData}
                    cx={65}
                    cy={65}
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="bookings"
                    strokeWidth={0}
                  >
                    {packageData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <ul className="space-y-2.5">
                {packageData.map((pkg, i) => (
                  <li
                    key={pkg.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
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
            </>
          )}
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
        {isLoading ? (
          <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) py-8 text-center">
            Loading…
          </p>
        ) : recentBookings.length === 0 ? (
          <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) py-8 text-center">
            No bookings yet
          </p>
        ) : (
          <DataTable columns={columns} data={recentBookings} />
        )}
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
