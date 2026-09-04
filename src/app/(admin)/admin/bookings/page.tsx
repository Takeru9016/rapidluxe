"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  PaymentLinkDialog,
  QuoteDialog,
} from "@/components/admin/BookingActionDialogs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BOOKING_STATUS_CONFIG } from "@/lib/booking-status";
import { formatDate, formatPrice } from "@/lib/utils";
import type { AdminBooking, DbBookingStatus } from "@/types/booking";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue =
  | "all"
  | "enquiry"
  | "quote_sent"
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "cancelled";

interface BookingsResponse {
  data: AdminBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Config ────────────────────────────────────────────────────────────────────

const TAB_STATUS_MAP: Record<Exclude<TabValue, "all">, DbBookingStatus> = {
  enquiry: "ENQUIRY",
  quote_sent: "QUOTE_SENT",
  awaiting_payment: "AWAITING_PAYMENT",
  paid: "PAID",
  confirmed: "CONFIRMED",
  cancelled: "CANCELLED",
};

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "enquiry", label: "Enquiries" },
  { value: "quote_sent", label: "Quote Sent" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

// Single authoritative status presentation — mirrors BOOKING_STATUS_CONFIG
// (used by the customer-facing pages and the admin dashboard) instead of a
// separately-maintained local map with drifted labels/colors.
const VARIANT_CLASS: Record<"gold" | "teal" | "coral" | "ghost", string> = {
  gold: "bg-(--color-gold)/20 text-(--color-gold)",
  teal: "bg-(--color-teal)/20 text-(--color-teal)",
  coral: "bg-(--color-coral)/20 text-(--color-coral)",
  ghost: "bg-white/5 text-(--color-white-muted)",
};
// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabValue>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [quoteTarget, setQuoteTarget] = useState<AdminBooking | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<AdminBooking | null>(null);

  // Debounce the search box so every keystroke doesn't fire a request; reset
  // to page 1 whenever the debounced value actually changes.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<BookingsResponse>({
      queryKey: ["admin-bookings", tab, search, dateFrom, dateTo, page],
      queryFn: async () => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        if (tab !== "all") params.set("status", TAB_STATUS_MAP[tab]);
        if (search) params.set("search", search);
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
        const res = await fetch(`/api/admin/bookings?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return (await res.json()) as BookingsResponse;
      },
    });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Booking confirmed.");
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => toast.error("Failed to confirm booking."),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Booking cancelled.");
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => toast.error("Failed to cancel booking."),
  });

  const bookings = data?.data ?? [];
  const pagination = data?.pagination;

  const thCls =
    "px-4 py-3 text-left font-['DM_Sans'] text-xs font-medium uppercase tracking-wide text-(--color-text-secondary) whitespace-nowrap";
  const tdCls = "px-4 py-3 align-middle";

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Bookings
        </h1>
        {pagination && (
          <span className="px-2.5 py-0.5 rounded-full bg-(--color-navy-surface) border border-(--color-navy-border) font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            {pagination.total}
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as TabValue);
          setPage(1);
        }}
        className="mb-4"
      >
        <TabsList className="bg-(--color-navy-surface) border border-(--color-navy-border) h-auto p-1 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="font-['DM_Sans'] text-sm text-(--color-text-secondary) rounded-md px-3 py-1.5 data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) data-[state=active]:shadow-none"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + Date Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <label htmlFor="booking-search" className="sr-only">
            Search by reference, customer name, or email
          </label>
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
          />
          <input
            id="booking-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reference, name, or email…"
            className="w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg pl-9 pr-3 py-2 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="date-from"
            className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
          >
            Departing from
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2 text-sm font-['DM_Sans'] text-white focus:outline-none focus:border-(--color-gold)/60 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="date-to"
            className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
          >
            Departing to
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2 text-sm font-['DM_Sans'] text-white focus:outline-none focus:border-(--color-gold)/60 transition-colors"
          />
        </div>

        {(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Clear dates
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <p className="font-['DM_Sans'] text-sm text-(--color-coral) mb-3">
              Failed to load bookings.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-(--color-navy-border)">
                <th className={thCls}>Booking ID</th>
                <th className={thCls}>User</th>
                <th className={thCls}>Package</th>
                <th className={thCls}>Date</th>
                <th className={thCls}>Travelers</th>
                <th className={thCls}>Amount (GST incl.)</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-navy-border)">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)"
                  >
                    {search || dateFrom || dateTo || tab !== "all"
                      ? "No bookings match your search/filter."
                      : "No bookings yet."}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const meta = BOOKING_STATUS_CONFIG[booking.status];
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-white/2 transition-colors"
                    >
                      {/* Booking ID */}
                      <td className={tdCls}>
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-['JetBrains_Mono'] text-xs text-(--color-gold) hover:underline"
                        >
                          {booking.bookingRef ?? booking.id.slice(0, 8)}
                        </Link>
                      </td>

                      {/* User */}
                      <td className={tdCls}>
                        <p className="font-['DM_Sans'] text-sm text-white font-medium">
                          {booking.user.name}
                        </p>
                        <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                          {booking.user.email}
                        </p>
                      </td>

                      {/* Package */}
                      <td className={tdCls}>
                        <span className="font-['DM_Sans'] text-sm text-(--color-white-muted) max-w-[180px] block truncate">
                          {booking.package.title}
                        </span>
                      </td>

                      {/* Date */}
                      <td className={tdCls}>
                        <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) whitespace-nowrap">
                          {formatDate(booking.departureDate)}
                        </span>
                      </td>

                      {/* Travelers */}
                      <td className={tdCls}>
                        <span className="font-['DM_Sans'] text-sm text-(--color-white-muted)">
                          {booking.adults}A
                          {booking.children > 0 ? ` ${booking.children}C` : ""}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className={tdCls}>
                        <span className="font-['JetBrains_Mono'] text-sm text-(--color-white-muted)">
                          {formatPrice(booking.chargedTotal)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={tdCls}>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full font-['DM_Sans'] text-xs font-medium ${VARIANT_CLASS[meta.variant]}`}
                        >
                          {meta.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={tdCls}>
                        <div className="flex items-center gap-2 flex-wrap">
                          {booking.status === "ENQUIRY" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setQuoteTarget(booking)}
                                className="px-3 py-1.5 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                              >
                                Send Quote
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Cancel booking ${booking.bookingRef}?`,
                                    )
                                  ) {
                                    cancelMutation.mutate(booking.id);
                                  }
                                }}
                                disabled={cancelMutation.isPending}
                                className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking.status === "QUOTE_SENT" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setPaymentTarget(booking)}
                                className="px-3 py-1.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) font-['DM_Sans'] text-xs font-semibold hover:bg-(--color-gold)/10 transition-colors whitespace-nowrap"
                              >
                                Send Payment Link
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Cancel booking ${booking.bookingRef}?`,
                                    )
                                  ) {
                                    cancelMutation.mutate(booking.id);
                                  }
                                }}
                                disabled={cancelMutation.isPending}
                                className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking.status === "PAID" && (
                            <button
                              type="button"
                              onClick={() => confirmMutation.mutate(booking.id)}
                              disabled={confirmMutation.isPending}
                              className="px-3 py-1.5 rounded-lg border border-(--color-teal)/60 text-(--color-teal) font-['DM_Sans'] text-xs font-semibold hover:bg-(--color-teal)/10 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              Mark Confirmed
                            </button>
                          )}

                          {(booking.status === "PAID" ||
                            booking.status === "CONFIRMED") && (
                            <a
                              href={`/api/invoices/${booking.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) font-['DM_Sans'] text-xs font-semibold hover:bg-(--color-gold)/10 transition-colors whitespace-nowrap"
                            >
                              <Download size={12} />
                              Invoice
                            </a>
                          )}

                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors whitespace-nowrap"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          <span>
            Page {pagination.page} of {pagination.totalPages} —{" "}
            {pagination.total} booking{pagination.total !== 1 ? "s" : ""}
            {isFetching ? " · refreshing…" : ""}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) disabled:opacity-40 hover:border-(--color-gold)/40 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) disabled:opacity-40 hover:border-(--color-gold)/40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {quoteTarget && (
        <QuoteDialog
          booking={quoteTarget}
          onClose={() => setQuoteTarget(null)}
          onSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: ["admin-bookings"],
            });
            setQuoteTarget(null);
          }}
        />
      )}

      {paymentTarget && (
        <PaymentLinkDialog
          booking={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: ["admin-bookings"],
            });
          }}
        />
      )}
    </div>
  );
}
