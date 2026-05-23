"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatPrice, formatDate, calculateGST } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type BookingStatus = "upcoming" | "completed" | "cancelled" | "refunded";
type TabValue = "all" | BookingStatus;

interface AdminBooking {
  id: string;
  bookingRef: string;
  user: string;
  package: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  baseAmount: number;
  status: BookingStatus;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────

const dummyAdminBookings: AdminBooking[] = [
  { id: "bk-001234", bookingRef: "BK-001234", user: "Arjun Sharma", package: "Bali Serenity Escape", departureDate: "2025-09-14", returnDate: "2025-09-21", travelers: 2, baseAmount: 170000, status: "upcoming" },
  { id: "bk-002345", bookingRef: "BK-002345", user: "Priya Mehta", package: "Maldives Overwater Luxury", departureDate: "2025-03-05", returnDate: "2025-03-10", travelers: 2, baseAmount: 290000, status: "completed" },
  { id: "bk-003456", bookingRef: "BK-003456", user: "Rahul Verma", package: "Santorini Sunset Romance", departureDate: "2025-07-20", returnDate: "2025-07-27", travelers: 2, baseAmount: 310000, status: "cancelled" },
  { id: "bk-004567", bookingRef: "BK-004567", user: "Sneha Patel", package: "Dubai Desert Luxury", departureDate: "2025-08-15", returnDate: "2025-08-22", travelers: 3, baseAmount: 215000, status: "completed" },
  { id: "bk-005678", bookingRef: "BK-005678", user: "Vikram Nair", package: "Kerala Backwaters Bliss", departureDate: "2025-10-01", returnDate: "2025-10-08", travelers: 2, baseAmount: 125000, status: "upcoming" },
  { id: "bk-006789", bookingRef: "BK-006789", user: "Anita Desai", package: "Switzerland Alpine Dream", departureDate: "2025-06-10", returnDate: "2025-06-17", travelers: 2, baseAmount: 380000, status: "refunded" },
  { id: "bk-007890", bookingRef: "BK-007890", user: "Karan Kapoor", package: "Rajasthan Royal Circuit", departureDate: "2025-11-20", returnDate: "2025-11-27", travelers: 4, baseAmount: 95000, status: "upcoming" },
  { id: "bk-008901", bookingRef: "BK-008901", user: "Meera Joshi", package: "Singapore City & Sentosa", departureDate: "2025-05-01", returnDate: "2025-05-05", travelers: 2, baseAmount: 145000, status: "completed" },
];

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: "teal" | "ghost" | "coral" | "gold" }> = {
  upcoming: { label: "Upcoming", variant: "teal" },
  completed: { label: "Completed", variant: "ghost" },
  cancelled: { label: "Cancelled", variant: "coral" },
  refunded: { label: "Refunded", variant: "gold" },
};

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<AdminBooking>[] = [
  {
    id: "bookingRef",
    header: "Booking ID",
    cell: ({ row }) => (
      <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
        #{row.original.bookingRef}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ getValue }) => (
      <span className="text-white font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ getValue }) => (
      <span className="text-(--color-white-muted) truncate max-w-[180px] block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: "dates",
    header: "Dates",
    cell: ({ row }) => (
      <span className="text-xs text-(--color-text-secondary) whitespace-nowrap">
        {formatDate(row.original.departureDate)} → {formatDate(row.original.returnDate)}
      </span>
    ),
  },
  {
    accessorKey: "travelers",
    header: "Travelers",
    cell: ({ getValue }) => (
      <span className="block text-center text-(--color-white-muted)">{getValue<number>()}</span>
    ),
  },
  {
    id: "gst",
    header: "GST (5%)",
    cell: ({ row }) => (
      <span className="font-['JetBrains_Mono'] text-sm text-(--color-text-secondary)">
        {formatPrice(calculateGST(row.original.baseAmount).gst)}
      </span>
    ),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-['JetBrains_Mono'] text-sm text-(--color-gold) whitespace-nowrap">
        {formatPrice(calculateGST(row.original.baseAmount).total)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<BookingStatus>();
      const { label, variant } = STATUS_BADGE[s];
      return <Badge variant={variant} size="sm">{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <select
        defaultValue={row.original.status}
        className="bg-(--color-navy) border border-(--color-navy-border) rounded-md px-2 py-1 text-xs font-['DM_Sans'] text-(--color-white-muted)"
      >
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="refunded">Refunded</option>
      </select>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<TabValue>("all");

  const filtered =
    tab === "all"
      ? dummyAdminBookings
      : dummyAdminBookings.filter((b) => b.status === tab);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Bookings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
              tab === value
                ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
