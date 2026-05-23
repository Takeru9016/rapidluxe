"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { formatPrice } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type DateRange = "7D" | "30D" | "90D" | "12M";

// ── Dummy Data ─────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jun", revenue: 1200000 },
  { month: "Jul", revenue: 1850000 },
  { month: "Aug", revenue: 1620000 },
  { month: "Sep", revenue: 2100000 },
  { month: "Oct", revenue: 1980000 },
  { month: "Nov", revenue: 1450000 },
  { month: "Dec", revenue: 2750000 },
  { month: "Jan", revenue: 2300000 },
  { month: "Feb", revenue: 1900000 },
  { month: "Mar", revenue: 2450000 },
  { month: "Apr", revenue: 2680000 },
  { month: "May", revenue: 2200000 },
];

const packageBookings = [
  { name: "Maldives Overwater", bookings: 42 },
  { name: "Bali Serenity", bookings: 38 },
  { name: "Santorini Romance", bookings: 31 },
  { name: "Dubai Luxury", bookings: 24 },
  { name: "Kerala Backwaters", bookings: 19 },
];

const destinationData = [
  { name: "Asia", value: 58, color: "#C9A84C" },
  { name: "Europe", value: 24, color: "#4ECDC4" },
  { name: "Middle East", value: 12, color: "#A78BFA" },
  { name: "Oceania", value: 6, color: "#F87171" },
];

const newUsersData = [
  { month: "Jun", users: 28 },
  { month: "Jul", users: 35 },
  { month: "Aug", users: 31 },
  { month: "Sep", users: 42 },
  { month: "Oct", users: 38 },
  { month: "Nov", users: 29 },
  { month: "Dec", users: 51 },
  { month: "Jan", users: 44 },
  { month: "Feb", users: 39 },
  { month: "Mar", users: 47 },
  { month: "Apr", users: 53 },
  { month: "May", users: 47 },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  isCurrency?: boolean;
}

function ChartTooltip({ active, payload, label, isCurrency = false }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2">
      <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1">{label}</p>
      <p className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
        {isCurrency ? formatPrice(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
}

// ── Axis defaults ─────────────────────────────────────────────────────────────

const axisProps = {
  fill: "var(--color-text-secondary)",
  fontSize: 11,
  fontFamily: "DM Sans",
  axisLine: false,
  tickLine: false,
} as const;

// ── Page ──────────────────────────────────────────────────────────────────────

const DATE_RANGES: DateRange[] = ["7D", "30D", "90D", "12M"];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<DateRange>("12M");

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Analytics
        </h1>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
                range === r
                  ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Revenue — full width */}
        <div className="lg:col-span-2 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-4">
            Revenue
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barCategoryGap="30%">
              <XAxis dataKey="month" {...axisProps} />
              <YAxis
                {...axisProps}
                tickFormatter={(v: number) =>
                  v >= 1_000_000 ? `₹${v / 1_000_000}M` : `₹${v / 1_000}K`
                }
              />
              <Tooltip
                content={<ChartTooltip isCurrency />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="revenue" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Packages */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-4">
            Top Packages
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={packageBookings} layout="vertical" barCategoryGap="25%">
              <XAxis type="number" {...axisProps} />
              <YAxis
                type="category"
                dataKey="name"
                {...axisProps}
                width={120}
                tick={{ fill: "var(--color-text-secondary)", fontSize: 11, fontFamily: "DM Sans" }}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="bookings" fill="var(--color-gold)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Destination Split */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-4">
            Destination Split
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={destinationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
              >
                {destinationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as { name: string; value: number };
                  return (
                    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2">
                      <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1">
                        {item.name}
                      </p>
                      <p className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
                        {item.value}%
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            {destinationData.map((item) => (
              <li key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                  {item.name} <span className="text-(--color-white-muted)">{item.value}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* New Users */}
        <div className="lg:col-span-2 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-4">
            New Users
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={newUsersData}>
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--color-teal)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-teal)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
