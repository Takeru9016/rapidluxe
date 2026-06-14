"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, ChevronDown, Copy, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { formatPrice, formatDate } from "@/lib/utils";
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

interface StatusBadgeConfig {
  label: string;
  className: string;
}

const STATUS_BADGE: Record<DbBookingStatus, StatusBadgeConfig> = {
  ENQUIRY: {
    label: "Enquiry",
    className: "bg-white/5 text-(--color-white-muted)",
  },
  QUOTE_SENT: {
    label: "Quote Sent",
    className: "bg-(--color-gold)/20 text-(--color-gold)",
  },
  AWAITING_PAYMENT: {
    label: "Awaiting Payment",
    className: "bg-(--color-coral)/20 text-(--color-coral)",
  },
  PAID: {
    label: "Paid",
    className: "bg-(--color-teal)/20 text-(--color-teal)",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-(--color-teal)/20 text-(--color-teal)",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-white/5 text-(--color-text-secondary) line-through",
  },
};

// ── Quote Dialog ──────────────────────────────────────────────────────────────

function QuoteDialog({
  booking,
  onClose,
  onSuccess,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSend() {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid quoted amount.");
      return;
    }
    setIsPending(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/send-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotedAmount: parsed,
          quoteNotes: notes || undefined,
          paymentDueDate: dueDate ? dueDate.toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to send quote");
      toast.success(`Quote sent to ${booking.user.name ?? booking.user.email}`);
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to send quote.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-(--color-navy-surface) border border-(--color-navy-border) text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Cormorant_Garamond'] text-2xl text-white">
            Send Quote to {booking.user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
              Quoted Amount (INR)
            </label>
            <Input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 295000"
              className="bg-(--color-navy) border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40"
            />
          </div>

          <div>
            <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
              Quote Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes for the traveler…"
              rows={3}
              className="bg-(--color-navy) border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 resize-none"
            />
          </div>

          <div>
            <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
              Payment Due Date
            </label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 bg-(--color-navy) border border-(--color-navy-border) rounded-md px-3 py-2.5 text-sm font-['DM_Sans'] text-(--color-white-muted) hover:border-(--color-gold)/40 transition-colors"
                >
                  <CalendarIcon
                    size={14}
                    className="text-(--color-gold) shrink-0"
                  />
                  <span className={dueDate ? "text-white" : ""}>
                    {dueDate ? formatDate(dueDate) : "Select due date"}
                  </span>
                  <ChevronDown
                    size={14}
                    className="ml-auto text-(--color-text-secondary)"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-(--color-navy-surface) border-(--color-navy-border)"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(d) => {
                    setDueDate(d);
                    setCalOpen(false);
                  }}
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Sending…" : "Send Quote"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Payment Link Dialog ───────────────────────────────────────────────────────

function PaymentLinkDialog({
  booking,
  onClose,
  onSuccess,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSend() {
    setIsPending(true);
    try {
      const res = await fetch(
        `/api/admin/bookings/${booking.id}/send-payment-link`,
        {
          method: "POST",
        },
      );
      if (!res.ok) throw new Error("Failed");
      const json = (await res.json()) as { data: { paymentUrl: string } };
      setPaymentUrl(json.data.paymentUrl);
      toast.success("Payment link sent to customer.");
      onSuccess();
    } catch {
      toast.error("Failed to send payment link.");
    } finally {
      setIsPending(false);
    }
  }

  function handleCopy() {
    if (!paymentUrl) return;
    void navigator.clipboard.writeText(paymentUrl);
    toast.success("Copied!");
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-(--color-navy-surface) border border-(--color-navy-border) text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Cormorant_Garamond'] text-2xl text-white">
            Send Payment Link to {booking.user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              Quoted Amount
            </span>
            <span className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
              {booking.quotedAmount ? formatPrice(booking.quotedAmount) : "—"}
            </span>
          </div>

          <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
            Link valid for 48 hours from the time of sending.
          </p>

          {paymentUrl && (
            <div>
              <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
                Payment Link
              </label>
              <div className="flex items-center gap-2 bg-(--color-navy-border)/50 rounded-lg p-3">
                <span className="font-['JetBrains_Mono'] text-xs text-white flex-1 break-all">
                  {paymentUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 p-1 text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            {paymentUrl ? "Close" : "Cancel"}
          </button>
          {!paymentUrl && (
            <button
              type="button"
              onClick={handleSend}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? "Sending…" : "Send Payment Link"}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabValue>("all");
  const [quoteTarget, setQuoteTarget] = useState<AdminBooking | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<AdminBooking | null>(null);

  const { data, isLoading, isError } = useQuery<BookingsResponse>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/bookings?limit=50");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        console.log("[admin/bookings] API error", res.status, err);
        throw new Error("Failed to fetch bookings");
      }
      const json = (await res.json()) as BookingsResponse;
      console.log("[admin/bookings] API response", json);
      return json;
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
  const filtered =
    tab === "all"
      ? bookings
      : bookings.filter((b) => b.status === TAB_STATUS_MAP[tab]);

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
        <span className="px-2.5 py-0.5 rounded-full bg-(--color-navy-surface) border border-(--color-navy-border) font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          {filtered.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="mb-6"
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

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : isError ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-coral)">
            Failed to load bookings — check console for details.
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
                <th className={thCls}>Quoted Amount</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-navy-border)">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => {
                  const badge = STATUS_BADGE[booking.status];
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-white/2 transition-colors"
                    >
                      {/* Booking ID */}
                      <td className={tdCls}>
                        <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                          {booking.bookingRef ?? "—"}
                        </span>
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

                      {/* Quoted Amount */}
                      <td className={tdCls}>
                        <span className="font-['JetBrains_Mono'] text-sm text-(--color-white-muted)">
                          {booking.quotedAmount
                            ? formatPrice(booking.quotedAmount)
                            : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={tdCls}>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full font-['DM_Sans'] text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
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
                                className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors whitespace-nowrap"
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
                                className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-xs hover:border-(--color-gold)/40 hover:text-white transition-colors whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {(booking.status === "AWAITING_PAYMENT" ||
                            booking.status === "PAID") && (
                            <button
                              type="button"
                              onClick={() => confirmMutation.mutate(booking.id)}
                              className="px-3 py-1.5 rounded-lg border border-(--color-teal)/60 text-(--color-teal) font-['DM_Sans'] text-xs font-semibold hover:bg-(--color-teal)/10 transition-colors whitespace-nowrap"
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
