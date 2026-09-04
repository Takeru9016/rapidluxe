"use client";

import { CalendarIcon, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { formatDate, formatPrice } from "@/lib/utils";

// Shared by the admin bookings list and the admin booking detail page — both
// surfaces call the same /api/admin/bookings/[id]/send-quote and
// send-payment-link endpoints through this one implementation rather than
// each maintaining their own copy of the dialog/mutation logic.

interface DialogBooking {
  id: string;
  bookingRef: string | null;
  user: { name: string | null; email: string };
  chargedTotal: number;
}

export function QuoteDialog({
  booking,
  onClose,
  onSuccess,
}: {
  booking: DialogBooking;
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
            <label
              htmlFor="quote-amount"
              className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
            >
              Quoted Amount (INR)
            </label>
            <Input
              id="quote-amount"
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 295000"
              className="bg-(--color-navy) border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40"
            />
          </div>

          <div>
            <label
              htmlFor="quote-notes"
              className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
            >
              Quote Notes
            </label>
            <Textarea
              id="quote-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes for the traveler…"
              rows={3}
              className="bg-(--color-navy) border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 resize-none"
            />
          </div>

          <div>
            <span className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
              Payment Due Date
            </span>
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

export function PaymentLinkDialog({
  booking,
  onClose,
  onSuccess,
}: {
  booking: DialogBooking;
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
              Amount to charge (GST incl.)
            </span>
            <span className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
              {formatPrice(booking.chargedTotal)}
            </span>
          </div>

          <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
            Link valid for 48 hours from the time of sending.
          </p>

          {paymentUrl && (
            <div>
              <label
                htmlFor="payment-link-output"
                className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
              >
                Payment Link
              </label>
              <div className="flex items-center gap-2 bg-(--color-navy-border)/50 rounded-lg p-3">
                <span
                  id="payment-link-output"
                  className="font-['JetBrains_Mono'] text-xs text-white flex-1 break-all"
                >
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
