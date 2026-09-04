"use client";

import { BookOpen, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookingCardSkeleton } from "@/components/shared/Skeletons";
import { useBookings, usePayBooking } from "@/hooks/api/useBookings";
import { BOOKING_STATUS_CONFIG } from "@/lib/booking-status";
import { calculateGST, formatDateRange, formatPrice } from "@/lib/utils";
import type { DisplayStatus, UserBooking } from "@/types/booking";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterStatus = "all" | DisplayStatus;

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ── Booking Card ──────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: UserBooking }) {
  const { label, description, variant } = BOOKING_STATUS_CONFIG[booking.status];
  const coverImage = booking.package.images[0] ?? "";
  const payMutation = usePayBooking();

  const handlePayNow = () => {
    payMutation.mutate(booking.id, {
      onSuccess: (data) => {
        window.location.href = data.payUrl;
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Payment is not available for this booking.",
        );
      },
    });
  };

  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
      <div className="relative w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden shrink-0">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={booking.package.title}
            fill
            className="object-cover"
            sizes="100px"
          />
        ) : (
          <div className="w-full h-full bg-(--color-navy-border)" />
        )}
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
            {booking.package.title}
          </p>
          <Badge variant={variant} size="sm" className="shrink-0">
            {label}
          </Badge>
        </div>
        <p className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
          {booking.bookingRef ? `#${booking.bookingRef}` : "—"}
        </p>
        <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
          {description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-(--color-white-muted) font-['DM_Sans']">
          {booking.returnDate ? (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-(--color-gold) shrink-0" />
              {formatDateRange(booking.departureDate, booking.returnDate)}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-(--color-gold) shrink-0" />
              {new Date(booking.departureDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-(--color-gold) shrink-0" />
            {booking.adults} Adults
            {booking.children > 0 ? ` · ${booking.children} Children` : ""}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1 gap-3">
          <span className="font-['JetBrains_Mono'] text-(--color-gold) text-base">
            {formatPrice(
              calculateGST(booking.quotedAmount ?? booking.baseAmount).total,
            )}
          </span>
          <div className="flex items-center gap-4 shrink-0">
            {booking.status === "AWAITING_PAYMENT" && (
              <button
                type="button"
                onClick={handlePayNow}
                disabled={payMutation.isPending}
                className="font-['DM_Sans'] text-xs font-medium text-(--color-navy) bg-(--color-gold) hover:bg-(--color-gold-light) disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors"
              >
                {payMutation.isPending ? "Redirecting…" : "Pay Now"}
              </button>
            )}
            <Link
              href={`/bookings/${booking.id}`}
              className="text-xs font-['DM_Sans'] font-medium text-(--color-gold) hover:text-(--color-gold-light) transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { data, isLoading } = useBookings();

  const bookings = data?.data ?? [];
  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.displayStatus === filter);

  return (
    <div className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-8">
          My Bookings
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
                filter === value
                  ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={
              filter === "all" ? "No bookings yet" : `No ${filter} bookings`
            }
            description={
              filter === "all"
                ? "When you book a journey it will appear here."
                : `You have no ${filter} bookings.`
            }
            action={
              filter === "cancelled"
                ? undefined
                : { label: "Explore Journeys", href: "/packages" }
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
