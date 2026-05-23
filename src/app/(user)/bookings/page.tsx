"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, BookOpen } from "lucide-react";

import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPrice, formatDateRange } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type BookingStatus = "upcoming" | "completed" | "cancelled" | "refunded";
type FilterStatus = "all" | BookingStatus;

interface DummyBooking {
  id: string;
  bookingRef: string;
  packageTitle: string;
  packageImage: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  totalAmount: number;
  status: BookingStatus;
}

// ── Dummy Data ────────────────────────────────────────────────────────────────

const dummyBookings: DummyBooking[] = [
  {
    id: "bk-001234",
    bookingRef: "#BK-001234",
    packageTitle: "Bali Serenity Escape",
    packageImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    departureDate: "2025-09-14",
    returnDate: "2025-09-21",
    adults: 2,
    totalAmount: 170000,
    status: "upcoming",
  },
  {
    id: "bk-002345",
    bookingRef: "#BK-002345",
    packageTitle: "Maldives Overwater Luxury",
    packageImage:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    departureDate: "2025-03-05",
    returnDate: "2025-03-10",
    adults: 2,
    totalAmount: 290000,
    status: "completed",
  },
  {
    id: "bk-003456",
    bookingRef: "#BK-003456",
    packageTitle: "Santorini Sunset Romance",
    packageImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    departureDate: "2025-07-20",
    returnDate: "2025-07-27",
    adults: 2,
    totalAmount: 310000,
    status: "cancelled",
  },
];

// ── Status Config ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  BookingStatus,
  { label: string; variant: "teal" | "ghost" | "coral" | "gold" }
> = {
  upcoming: { label: "Upcoming", variant: "teal" },
  completed: { label: "Completed", variant: "ghost" },
  cancelled: { label: "Cancelled", variant: "coral" },
  refunded: { label: "Refunded", variant: "gold" },
};

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

// ── Booking Card ──────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: DummyBooking }) {
  const { label, variant } = statusConfig[booking.status];
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
      <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden shrink-0">
        <Image
          src={booking.packageImage}
          alt={booking.packageTitle}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
            {booking.packageTitle}
          </p>
          <Badge variant={variant} size="sm" className="shrink-0">
            {label}
          </Badge>
        </div>
        <p className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
          {booking.bookingRef}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-(--color-white-muted) font-['DM_Sans']">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-(--color-gold) shrink-0" />
            {formatDateRange(booking.departureDate, booking.returnDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-(--color-gold) shrink-0" />
            {booking.adults} Adults
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-['JetBrains_Mono'] text-(--color-gold) text-base">
            {formatPrice(booking.totalAmount)}
          </span>
          <Link
            href={`/bookings/${booking.id}`}
            className="text-xs font-['DM_Sans'] font-medium text-(--color-gold) hover:text-(--color-gold-light) transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all"
      ? dummyBookings
      : dummyBookings.filter((b) => b.status === filter);

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-8">
          My Bookings
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${filter === value
                  ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={
              filter === "all"
                ? "No bookings yet"
                : `No ${filter} bookings`
            }
            description={
              filter === "all"
                ? "When you book a package it will appear here."
                : `You have no ${filter} bookings.`
            }
            action={{ label: "Explore Packages", href: "/packages" }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
