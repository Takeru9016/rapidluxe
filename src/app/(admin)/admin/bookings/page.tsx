"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, ChevronDown, Copy } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { formatPrice, formatDate } from "@/lib/utils";
import {
  dummyAdminBookings,
  type AdminBooking,
  type BookingEnquiryStatus,
} from "@/lib/dummy/bookings";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue =
  | "all"
  | "enquiry"
  | "quote_sent"
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "cancelled";

// ── Config ─────────────────────────────────────────────────────────────────────

const TAB_STATUS_MAP: Record<Exclude<TabValue, "all">, BookingEnquiryStatus> = {
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

const STATUS_BADGE: Record<BookingEnquiryStatus, StatusBadgeConfig> = {
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
  onSent,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSent: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);

  function handleSend() {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid quoted amount.");
      return;
    }
    console.log({ bookingId: booking.id, quotedAmount: parsed, notes, dueDate });
    onSent(parsed);
    toast.success("Quote sent");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
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
                  <CalendarIcon size={14} className="text-(--color-gold) shrink-0" />
                  <span className={dueDate ? "text-white" : ""}>
                    {dueDate ? formatDate(dueDate) : "Select due date"}
                  </span>
                  <ChevronDown size={14} className="ml-auto text-(--color-text-secondary)" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-(--color-navy-surface) border-(--color-navy-border)"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(d) => { setDueDate(d); setCalOpen(false); }}
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
            className="px-4 py-2 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Send Quote
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
  onSent,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSent: () => void;
}) {
  const link = `https://rapidluxe.com/pay/rl_${booking.bookingRef}`;

  function handleCopy() {
    navigator.clipboard.writeText(link);
    toast.success("Copied!");
  }

  function handleSend() {
    console.log({ bookingId: booking.id, link });
    onSent();
    toast.success("Payment link sent");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
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

          <div>
            <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
              Payment Link
            </label>
            <div className="flex items-center gap-2 bg-(--color-navy-border)/50 rounded-lg p-3">
              <span className="font-['JetBrains_Mono'] text-xs text-white flex-1 break-all">
                {link}
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
            className="px-4 py-2 rounded-lg bg-(--color-coral) text-white font-['DM_Sans'] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Send via WhatsApp
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([...dummyAdminBookings]);
  const [tab, setTab] = useState<TabValue>("all");
  const [quoteTarget, setQuoteTarget] = useState<AdminBooking | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<AdminBooking | null>(null);

  function updateBooking(id: string, patch: Partial<AdminBooking>) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

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
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="mb-6">
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
                  <tr key={booking.id} className="hover:bg-white/2 transition-colors">
                    {/* Booking ID */}
                    <td className={tdCls}>
                      <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                        {booking.bookingRef}
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
                        {booking.package.name}
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
                        {booking.adults}A{booking.children > 0 ? ` ${booking.children}C` : ""}
                      </span>
                    </td>

                    {/* Quoted Amount */}
                    <td className={tdCls}>
                      <span className="font-['JetBrains_Mono'] text-sm text-(--color-white-muted)">
                        {booking.quotedAmount ? formatPrice(booking.quotedAmount) : "—"}
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
                                if (window.confirm(`Cancel booking ${booking.bookingRef}?`)) {
                                  updateBooking(booking.id, { status: "CANCELLED" });
                                  toast.success("Booking cancelled.");
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
                                if (window.confirm(`Cancel booking ${booking.bookingRef}?`)) {
                                  updateBooking(booking.id, { status: "CANCELLED" });
                                  toast.success("Booking cancelled.");
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
                            onClick={() => {
                              updateBooking(booking.id, { status: "CONFIRMED" });
                              toast.success("Booking confirmed!");
                            }}
                            className="px-3 py-1.5 rounded-lg border border-(--color-teal)/60 text-(--color-teal) font-['DM_Sans'] text-xs font-semibold hover:bg-(--color-teal)/10 transition-colors whitespace-nowrap"
                          >
                            Mark Confirmed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {quoteTarget && (
        <QuoteDialog
          booking={quoteTarget}
          onClose={() => setQuoteTarget(null)}
          onSent={(amount) => {
            updateBooking(quoteTarget.id, {
              status: "QUOTE_SENT",
              quotedAmount: amount,
            });
            setQuoteTarget(null);
          }}
        />
      )}

      {paymentTarget && (
        <PaymentLinkDialog
          booking={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSent={() => {
            updateBooking(paymentTarget.id, { status: "AWAITING_PAYMENT" });
            setPaymentTarget(null);
          }}
        />
      )}
    </div>
  );
}
