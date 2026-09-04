"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

import {
  PaymentLinkDialog,
  QuoteDialog,
} from "@/components/admin/BookingActionDialogs";
import { BOOKING_STATUS_CONFIG } from "@/lib/booking-status";
import { formatDate, formatPrice } from "@/lib/utils";
import type { AdminBookingDetail } from "@/types/booking";

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 md:p-8">
      <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold) mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1">
        {label}
      </dt>
      <dd className="font-['DM_Sans'] text-sm text-white">{value ?? "—"}</dd>
    </div>
  );
}

const VARIANT_CLASS: Record<"gold" | "teal" | "coral" | "ghost", string> = {
  gold: "bg-(--color-gold)/20 text-(--color-gold)",
  teal: "bg-(--color-teal)/20 text-(--color-teal)",
  coral: "bg-(--color-coral)/20 text-(--color-coral)",
  ghost: "bg-white/5 text-(--color-white-muted)",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [showQuote, setShowQuote] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: AdminBookingDetail;
  }>({
    queryKey: ["admin-booking", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/bookings/${id}`);
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (!res.ok) throw new Error("Failed to load booking");
      return (await res.json()) as { data: AdminBookingDetail };
    },
    retry: (failureCount, err) =>
      err.message !== "NOT_FOUND" && failureCount < 2,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-booking", id] });
    void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  };

  const confirmMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Booking confirmed.");
      invalidate();
    },
    onError: () => toast.error("Failed to confirm booking."),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Booking cancelled.");
      invalidate();
    },
    onError: () => toast.error("Failed to cancel booking."),
  });

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-6">
        <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </div>
      </div>
    );
  }

  if (isError && error.message === "NOT_FOUND") {
    // Distinguish "genuinely not found" from a transient fetch failure so a
    // real 404 doesn't get a misleading "Retry" button, and a transient
    // failure doesn't get a misleading "this booking doesn't exist" page.
    notFound();
  }

  const booking = data?.data;
  if (!booking) {
    return (
      <div className="px-4 md:px-8 py-6">
        <div className="py-12 text-center">
          <p className="font-['DM_Sans'] text-sm text-(--color-coral) mb-3">
            Failed to load this booking.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const meta = BOOKING_STATUS_CONFIG[booking.status];

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
            {booking.bookingRef ?? booking.id.slice(0, 8)}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full font-['DM_Sans'] text-xs font-medium ${VARIANT_CLASS[meta.variant]}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {booking.status === "ENQUIRY" && (
            <>
              <button
                type="button"
                onClick={() => setShowQuote(true)}
                className="px-4 py-2 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Send Quote
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Cancel booking ${booking.bookingRef}?`)) {
                    cancelMutation.mutate();
                  }
                }}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}

          {booking.status === "QUOTE_SENT" && (
            <>
              <button
                type="button"
                onClick={() => setShowPaymentLink(true)}
                className="px-4 py-2 rounded-lg border border-(--color-gold)/60 text-(--color-gold) font-['DM_Sans'] text-sm font-semibold hover:bg-(--color-gold)/10 transition-colors"
              >
                Send Payment Link
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Cancel booking ${booking.bookingRef}?`)) {
                    cancelMutation.mutate();
                  }
                }}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}

          {booking.status === "PAID" && (
            <button
              type="button"
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="px-4 py-2 rounded-lg border border-(--color-teal)/60 text-(--color-teal) font-['DM_Sans'] text-sm font-semibold hover:bg-(--color-teal)/10 transition-colors disabled:opacity-50"
            >
              Mark Confirmed
            </button>
          )}

          {(booking.status === "PAID" || booking.status === "CONFIRMED") && (
            <a
              href={`/api/invoices/${booking.id}`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-(--color-gold)/60 text-(--color-gold) font-['DM_Sans'] text-sm font-semibold hover:bg-(--color-gold)/10 transition-colors"
            >
              <Download size={14} />
              Invoice
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <SectionCard title="Customer">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Name" value={booking.user.name} />
            <Field label="Email" value={booking.user.email} />
            <Field label="Phone" value={booking.user.phone} />
          </dl>
        </SectionCard>

        <SectionCard title="Journey">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Package" value={booking.package.title} />
            <Field label="Destination" value={booking.package.destination} />
            <Field
              label="Departure"
              value={formatDate(booking.departureDate)}
            />
            <Field
              label="Return"
              value={booking.returnDate ? formatDate(booking.returnDate) : "—"}
            />
          </dl>
        </SectionCard>

        <SectionCard title="Travelers">
          <p className="font-['DM_Sans'] text-sm text-(--color-white-muted) mb-4">
            {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
            {booking.children > 0
              ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}`
              : ""}
            {booking.infants > 0
              ? `, ${booking.infants} infant${booking.infants !== 1 ? "s" : ""}`
              : ""}
          </p>
          {booking.travelers.length > 0 ? (
            <ul className="space-y-2">
              {booking.travelers.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between gap-3 bg-(--color-navy-border)/30 rounded-lg px-3 py-2"
                >
                  <span className="font-['DM_Sans'] text-sm text-white">
                    {t.name}
                    {t.isLead && (
                      <span className="ml-2 font-['DM_Sans'] text-xs text-(--color-gold)">
                        Lead
                      </span>
                    )}
                  </span>
                  <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                    {t.hasDocument ? "ID on file" : "No ID on file"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              No traveler details saved yet.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Requirements">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Occasion" value={booking.occasion} />
            <Field
              label="Dietary requirements"
              value={
                booking.dietaryRequirements.length > 0
                  ? booking.dietaryRequirements.join(", ")
                  : "—"
              }
            />
            <Field label="Special requests" value={booking.specialRequests} />
            <Field label="Quote notes" value={booking.quoteNotes} />
            <Field
              label="Payment due date"
              value={
                booking.paymentDueDate
                  ? formatDate(booking.paymentDueDate)
                  : "—"
              }
            />
            <Field
              label="PAN on file"
              value={booking.hasPanOnFile ? "Yes" : "No"}
            />
          </dl>
        </SectionCard>

        <SectionCard title="Pricing">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Base amount"
              value={formatPrice(booking.baseAmount)}
            />
            <Field
              label="Quoted amount"
              value={
                booking.quotedAmount
                  ? formatPrice(booking.quotedAmount)
                  : "Not yet quoted"
              }
            />
            <Field
              label="Discount"
              value={
                booking.discountAmount > 0
                  ? formatPrice(booking.discountAmount)
                  : "—"
              }
            />
            <Field label="GST" value={formatPrice(booking.gstAmount)} />
          </dl>
          <div className="mt-4 pt-4 border-t border-(--color-navy-border) flex items-center justify-between">
            <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              {booking.quotedAmount
                ? "Final amount (GST incl.)"
                : "Enquiry estimate (GST incl.)"}
            </span>
            <span className="font-['JetBrains_Mono'] text-lg text-(--color-gold)">
              {formatPrice(booking.chargedTotal)}
            </span>
          </div>
        </SectionCard>
      </div>

      {showQuote && (
        <QuoteDialog
          booking={booking}
          onClose={() => setShowQuote(false)}
          onSuccess={invalidate}
        />
      )}

      {showPaymentLink && (
        <PaymentLinkDialog
          booking={booking}
          onClose={() => setShowPaymentLink(false)}
          onSuccess={invalidate}
        />
      )}
    </div>
  );
}
