"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Package, CreditCard, Download, HelpCircle } from "lucide-react";

import { Badge } from "@/components/shared/Badge";
import { formatPrice, formatDate, calculateGST } from "@/lib/utils";
import { dummyPackages } from "@/lib/dummy/packages";

// ── Types ─────────────────────────────────────────────────────────────────────

type BookingStatus = "upcoming" | "completed" | "cancelled" | "refunded";

interface BookingDetail {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  packageType: string;
  baseAmount: number;
  paymentMethod: string;
  transactionId: string;
  traveler: {
    name: string;
    passport: string;
    dob: string;
    email: string;
    phone: string;
  };
  packageIndex: number;
}

// ── Dummy Data ────────────────────────────────────────────────────────────────

const dummyBookings: BookingDetail[] = [
  {
    id: "bk-001234",
    bookingRef: "BK-001234",
    status: "upcoming",
    departureDate: "2025-09-14",
    returnDate: "2025-09-21",
    adults: 2,
    children: 0,
    packageType: "Luxury",
    baseAmount: 170000,
    paymentMethod: "UPI",
    transactionId: "TXN8821930047",
    traveler: {
      name: "Arjun Sharma",
      passport: "P1234567",
      dob: "1991-04-15",
      email: "arjun.sharma@email.com",
      phone: "+91 98765 43210",
    },
    packageIndex: 0,
  },
  {
    id: "bk-002345",
    bookingRef: "BK-002345",
    status: "completed",
    departureDate: "2025-03-05",
    returnDate: "2025-03-10",
    adults: 2,
    children: 0,
    packageType: "Honeymoon",
    baseAmount: 290000,
    paymentMethod: "Card",
    transactionId: "TXN4409182736",
    traveler: {
      name: "Priya Mehta",
      passport: "Q9876543",
      dob: "1994-11-22",
      email: "priya.mehta@email.com",
      phone: "+91 87654 32109",
    },
    packageIndex: 1,
  },
  {
    id: "bk-003456",
    bookingRef: "BK-003456",
    status: "cancelled",
    departureDate: "2025-07-20",
    returnDate: "2025-07-27",
    adults: 2,
    children: 0,
    packageType: "Romance",
    baseAmount: 310000,
    paymentMethod: "Card",
    transactionId: "TXN7763920154",
    traveler: {
      name: "Rahul Verma",
      passport: "R5432109",
      dob: "1989-07-08",
      email: "rahul.verma@email.com",
      phone: "+91 76543 21098",
    },
    packageIndex: 2,
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

// ── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
      {children}
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const booking = dummyBookings.find((b) => b.id === id);

  if (!booking) notFound();

  const pkg = dummyPackages[booking.packageIndex] ?? dummyPackages[0];
  const { label, variant } = statusConfig[booking.status];
  const { base, gst, total } = calculateGST(booking.baseAmount);

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
                #{booking.bookingRef}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1">
                Travel Dates
              </p>
              <p className="font-['DM_Sans'] text-sm text-(--color-white-muted)">
                {formatDate(booking.departureDate)} → {formatDate(booking.returnDate)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Package Summary ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={
                pkg.images?.[0] ??
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
              }
              alt={pkg.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-(--color-navy-surface) to-transparent" />
          </div>
          <div className="p-6 -mt-8 relative">
            <SectionLabel>Package</SectionLabel>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-white leading-tight mb-1">
              {pkg.title}
            </h2>
            <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              {pkg.durationNights} nights · {booking.packageType}
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
                value: formatDate(booking.returnDate),
              },
              {
                icon: Users,
                label: "Travelers",
                value: `${booking.adults} Adults${booking.children > 0 ? ` · ${booking.children} Children` : ""}`,
              },
              {
                icon: Package,
                label: "Package Type",
                value: booking.packageType,
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
                <p className="text-sm font-['DM_Sans'] text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Traveler Info ── */}
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
                    {booking.traveler.name}
                    <span className="ml-2 text-xs text-(--color-teal) font-medium">
                      Lead
                    </span>
                  </td>
                  <td className="pt-4 pr-4 font-['JetBrains_Mono'] text-(--color-white-muted)">
                    {booking.traveler.passport}
                  </td>
                  <td className="pt-4 text-(--color-white-muted)">
                    {formatDate(booking.traveler.dob)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Payment Summary ── */}
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
          <SectionLabel>Payment Summary</SectionLabel>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-white-muted)">Base Amount</span>
              <span className="text-white">
                {formatPrice(base)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-white-muted)">GST (5%)</span>
              <span className="text-white">
                {formatPrice(gst)}
              </span>
            </div>
            <div className="h-px bg-(--color-navy-border)" />
            <div className="flex justify-between font-['DM_Sans']">
              <span className="text-white font-medium">
                Total Paid
              </span>
              <span className="font-['JetBrains_Mono'] text-(--color-gold) font-bold text-lg">
                {formatPrice(total)}
              </span>
            </div>
            <div className="h-px bg-(--color-navy-border)" />
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-text-secondary)">
                Payment Method
              </span>
              <span className="flex items-center gap-1.5 text-(--color-white-muted)">
                <CreditCard size={13} />
                {booking.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm font-['DM_Sans']">
              <span className="text-(--color-text-secondary)">
                Transaction ID
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-(--color-white-muted)">
                {booking.transactionId}
              </span>
            </div>
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

          <button
            disabled
            title="Available after payment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] cursor-not-allowed opacity-50"
          >
            <Download size={14} />
            Download Invoice
          </button>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors"
          >
            <HelpCircle size={14} />
            Need Help?
          </Link>

          {booking.status === "upcoming" && (
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-coral)/60 text-(--color-coral) text-sm font-['DM_Sans'] hover:bg-(--color-coral)/10 transition-colors">
              Cancel Booking
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
