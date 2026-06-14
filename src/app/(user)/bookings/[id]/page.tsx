"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  Package,
  CreditCard,
  Download,
  HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/shared/Badge";
import { formatPrice, formatDate, calculateGST } from "@/lib/utils";
import { useBooking } from "@/hooks/api/useBookings";
import type { DisplayStatus } from "@/types/booking";

// ── Status Config ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  DisplayStatus,
  { label: string; variant: "teal" | "ghost" | "coral" | "gold" }
> = {
  upcoming: { label: "Upcoming", variant: "teal" },
  completed: { label: "Completed", variant: "ghost" },
  cancelled: { label: "Cancelled", variant: "coral" },
  refunded: { label: "Refunded", variant: "gold" },
};

// ── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
      {children}
    </p>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {[120, 200, 160, 180, 220].map((h, i) => (
        <div
          key={i}
          className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border)"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useBooking(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-navy) pt-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  if (isError || !data) notFound();

  const booking = data.data;
  const { label, variant } = statusConfig[booking.displayStatus];
  const { base, gst, total } = calculateGST(booking.baseAmount);
  const coverImage =
    booking.package.images[0] ??
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80";
  const packageType = booking.package.tags[0] ?? "Travel";
  const leadTraveler =
    booking.travelers.find((t) => t.isLead) ?? booking.travelers[0];

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
        {/* Back */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
        >
          <ArrowLeft size={14} />
          All Bookings
        </Link>

        {/* ── Booking Header ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant={variant} size="sm" className="mb-3">
                {label}
              </Badge>
              <p className="font-['JetBrains_Mono'] text-2xl md:text-3xl text-white">
                #{booking.bookingRef ?? id.slice(-6).toUpperCase()}
              </p>
            </div>
            {booking.returnDate && (
              <div className="text-right">
                <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1">
                  Travel Dates
                </p>
                <p className="font-['DM_Sans'] text-sm text-(--color-white-muted)">
                  {formatDate(booking.departureDate)} →{" "}
                  {formatDate(booking.returnDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Package Summary ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={coverImage}
              alt={booking.package.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-(--color-navy-surface) to-transparent" />
          </div>
          <div className="p-6 -mt-8 relative">
            <SectionLabel>Package</SectionLabel>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-white leading-tight mb-1">
              {booking.package.title}
            </h2>
            <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              {booking.package.durationNights} nights · {packageType}
            </p>
          </div>
        </div>

        {/* ── Trip Details ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <SectionLabel>Trip Details</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Calendar,
                label: "Departure",
                value: formatDate(booking.departureDate),
              },
              {
                icon: Calendar,
                label: "Return",
                value: booking.returnDate
                  ? formatDate(booking.returnDate)
                  : "TBD",
              },
              {
                icon: Users,
                label: "Travelers",
                value: `${booking.adults} Adults${booking.children > 0 ? ` · ${booking.children} Children` : ""}`,
              },
              {
                icon: Package,
                label: "Package Type",
                value: packageType,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1 p-3 rounded-lg bg-(--color-navy)/50"
              >
                <Icon size={14} className="text-(--color-gold)" />
                <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary) mt-1">
                  {label}
                </p>
                <p className="text-sm font-['DM_Sans'] text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Traveler Info ── */}
        {leadTraveler && (
          <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
            <SectionLabel>Traveler Information</SectionLabel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-['DM_Sans']">
                <thead>
                  <tr className="border-b border-(--color-navy-border)">
                    {["Name", "Passport No.", "Date of Birth"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-(--color-text-secondary) uppercase tracking-wide pb-3 pr-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pt-4 pr-4 text-white">
                      {leadTraveler.name}
                      <span className="ml-2 text-xs text-(--color-teal) font-medium">
                        Lead
                      </span>
                    </td>
                    <td className="pt-4 pr-4 font-['JetBrains_Mono'] text-(--color-white-muted)">
                      {leadTraveler.passportNo || "—"}
                    </td>
                    <td className="pt-4 text-(--color-white-muted)">
                      {leadTraveler.dob ? formatDate(leadTraveler.dob) : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Payment Summary ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <SectionLabel>Payment Summary</SectionLabel>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-white-muted)">Base Amount</span>
              <span className="text-white">{formatPrice(base)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-sm font-['DM_Sans']">
                <span className="text-(--color-white-muted)">
                  Discount{booking.couponCode ? ` (${booking.couponCode})` : ""}
                </span>
                <span className="text-(--color-teal)">
                  −{formatPrice(booking.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-white-muted)">GST (5%)</span>
              <span className="text-white">{formatPrice(gst)}</span>
            </div>
            <div className="h-px bg-(--color-navy-border)" />
            <div className="flex justify-between font-['DM_Sans']">
              <span className="text-white font-medium">Total Paid</span>
              <span className="font-['JetBrains_Mono'] text-(--color-gold) font-bold text-lg">
                {formatPrice(total)}
              </span>
            </div>
            {booking.razorpayPaymentId && (
              <>
                <div className="h-px bg-(--color-navy-border)" />
                <div className="flex justify-between text-sm font-['DM_Sans']">
                  <span className="text-(--color-text-secondary)">
                    Payment Method
                  </span>
                  <span className="flex items-center gap-1.5 text-(--color-white-muted)">
                    <CreditCard size={13} />
                    Razorpay
                  </span>
                </div>
                <div className="flex justify-between text-sm font-['DM_Sans']">
                  <span className="text-(--color-text-secondary)">
                    Transaction ID
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-(--color-white-muted)">
                    {booking.razorpayPaymentId}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Actions Row ── */}
        <div className="flex flex-wrap gap-3">
          <button
            disabled
            title="Available after payment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] cursor-not-allowed opacity-50"
          >
            <Download size={14} />
            Download Voucher
          </button>

          {booking.displayStatus === "upcoming" ||
          booking.displayStatus === "completed" ? (
            <a
              href={`/api/invoices/${booking.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors"
            >
              <Download size={14} />
              Download Invoice
            </a>
          ) : (
            <button
              disabled
              title="Available after payment is confirmed"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] cursor-not-allowed opacity-50"
            >
              <Download size={14} />
              Download Invoice
            </button>
          )}

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors"
          >
            <HelpCircle size={14} />
            Need Help?
          </Link>

          {booking.displayStatus === "upcoming" && (
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-coral)/60 text-(--color-coral) text-sm font-['DM_Sans'] hover:bg-(--color-coral)/10 transition-colors">
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
