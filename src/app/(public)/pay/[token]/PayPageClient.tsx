"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatDate, formatPrice } from "@/lib/utils";

import type { PaymentPageData } from "@/types/booking";
import type { RazorpayCheckoutResponse } from "@/types/razorpay";

type PageState =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "already_paid"; bookingRef: string | null }
  | { kind: "expired" }
  | { kind: "ready"; data: PaymentPageData; bookingId: string | null }
  | { kind: "success"; bookingRef: string | null };

function ErrorShell({
  icon,
  title,
  message,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-6">
      {icon}
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white mt-6">
        {title}
      </h1>
      <p className="font-['DM_Sans'] text-(--color-white-muted) mt-3 max-w-md">
        {message}
      </p>
      {children}
    </div>
  );
}

export function PayPageClient({ token }: { token: string }) {
  const [state, setState] = useState<PageState>({ kind: "loading" });
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/pay/${token}`);
        const json = (await res.json()) as {
          data?: PaymentPageData;
          error?: string;
          bookingRef?: string;
        };
        if (cancelled) return;
        if (res.ok && json.data) {
          setState({ kind: "ready", data: json.data, bookingId: null });
        } else if (json.error === "already_paid") {
          setState({
            kind: "already_paid",
            bookingRef: json.bookingRef ?? null,
          });
        } else if (json.error === "link_expired") {
          setState({ kind: "expired" });
        } else {
          setState({ kind: "invalid" });
        }
      } catch {
        if (!cancelled) setState({ kind: "invalid" });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handlePay() {
    if (state.kind !== "ready") return;
    const { data } = state;
    setPaying(true);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = (await res.json()) as {
        data?: {
          orderId: string;
          amount: number;
          currency: string;
          bookingId: string;
          key: string;
        };
        error?: string;
      };
      if (!res.ok || !json.data) {
        throw new Error(json.error ?? "Order creation failed");
      }
      const order = json.data;

      if (typeof window.Razorpay !== "function") {
        toast.error("Payment gateway failed to load. Please refresh.");
        return;
      }

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "RapidLuxe",
        description: data.packageName,
        prefill: {
          name: data.userName ?? undefined,
          email: data.userEmail ?? undefined,
        },
        theme: { color: "#F9A826" },
        handler: async (response: RazorpayCheckoutResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                bookingId: order.bookingId,
              }),
            });
            const verifyJson = (await verifyRes.json()) as {
              data?: { bookingRef: string | null };
              error?: string;
            };
            if (!verifyRes.ok || !verifyJson.data) {
              throw new Error(verifyJson.error ?? "Verification failed");
            }
            setState({
              kind: "success",
              bookingRef: verifyJson.data.bookingRef,
            });
          } catch {
            toast.error(
              "Payment verification failed. Contact us if you were charged.",
            );
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch {
      toast.error("Could not start payment. Please try again.");
      setPaying(false);
    }
  }

  const expiresWithin24h =
    state.kind === "ready" &&
    state.data.expiresAt !== null &&
    new Date(state.data.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-(--color-navy)">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Logo */}
        <p className="font-['Cormorant_Garamond'] text-3xl text-center text-white mb-10">
          Rapid<span className="text-(--color-gold)">Luxe</span>
        </p>

        {state.kind === "loading" && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-(--color-gold) border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {state.kind === "invalid" && (
          <ErrorShell
            icon={<AlertTriangle size={48} className="text-(--color-coral)" />}
            title="Invalid Payment Link"
            message="This payment link is invalid. Contact us."
          />
        )}

        {state.kind === "already_paid" && (
          <ErrorShell
            icon={<CheckCircle2 size={48} className="text-(--color-teal)" />}
            title="Already Paid"
            message={`This booking has already been paid.${state.bookingRef ? ` Ref: ${state.bookingRef}` : ""}`}
          >
            <Button
              variant="outline-gold"
              className="mt-6 h-auto px-6 py-3 font-['DM_Sans'] text-sm"
              asChild
            >
              <Link href="/bookings">View your booking →</Link>
            </Button>
          </ErrorShell>
        )}

        {state.kind === "expired" && (
          <ErrorShell
            icon={<Clock size={48} className="text-(--color-coral)" />}
            title="Link Expired"
            message="This payment link has expired. Contact us to request a new one."
          >
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "+919137456611").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 px-6 py-3 rounded-xl bg-(--color-teal) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Message us on WhatsApp
            </a>
          </ErrorShell>
        )}

        {state.kind === "success" && (
          <div className="flex flex-col items-center text-center py-20 px-6">
            <CheckCircle2 size={64} className="text-(--color-teal)" />
            <h1 className="font-['Cormorant_Garamond'] text-4xl text-white mt-6">
              Payment Successful
            </h1>
            {state.bookingRef && (
              <p className="font-['JetBrains_Mono'] text-2xl text-(--color-gold) mt-2">
                {state.bookingRef}
              </p>
            )}
            <p className="font-['DM_Sans'] text-(--color-white-muted) mt-3 max-w-md">
              Your payment is confirmed. Our team will finalize your trip and be
              in touch shortly.
            </p>
            <Button
              variant="coral"
              className="mt-8 h-auto px-6 py-3 font-['DM_Sans'] font-semibold text-sm"
              asChild
            >
              <Link href="/bookings">View My Bookings</Link>
            </Button>
          </div>
        )}

        {state.kind === "ready" && (
          <div className="space-y-4">
            {/* Package summary */}
            <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
              {state.data.packageImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={state.data.packageImage}
                    alt={state.data.packageName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center gap-1 min-w-0">
                <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
                  {state.data.packageName}
                </p>
                <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                  {state.data.destination ? `${state.data.destination} · ` : ""}
                  {formatDate(new Date(state.data.departureDate))} ·{" "}
                  {state.data.adults + state.data.children} guest
                  {state.data.adults + state.data.children !== 1 ? "s" : ""}
                </p>
                {state.data.bookingRef && (
                  <p className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                    {state.data.bookingRef}
                  </p>
                )}
              </div>
            </div>

            {/* Quote notes */}
            {state.data.quoteNotes && (
              <div className="bg-(--color-gold)/5 border-l-2 border-(--color-gold) p-4 text-sm font-['DM_Sans'] text-(--color-white-muted)">
                {state.data.quoteNotes}
              </div>
            )}

            {/* Payment breakdown */}
            <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-3">
              <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
                Payment Breakdown
              </p>
              <div className="flex justify-between text-sm">
                <span className="font-['DM_Sans'] text-(--color-text-secondary)">
                  Quoted Amount
                </span>
                <span className="font-['JetBrains_Mono'] text-white">
                  {formatPrice(state.data.quotedAmount ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-['DM_Sans'] text-(--color-text-secondary)">
                  GST (5%)
                </span>
                <span className="font-['JetBrains_Mono'] text-(--color-text-secondary)">
                  {formatPrice(state.data.gstAmount)}
                </span>
              </div>
              <Separator className="bg-(--color-navy-border) my-2" />
              <div className="flex justify-between items-center">
                <span className="font-['DM_Sans'] font-semibold text-white">
                  Total Due
                </span>
                <span className="font-['JetBrains_Mono'] text-2xl text-(--color-gold) font-bold">
                  {formatPrice(state.data.totalAmount)}
                </span>
              </div>
            </div>

            {/* Expiry notice */}
            {expiresWithin24h && state.data.expiresAt && (
              <p className="font-['DM_Sans'] text-sm text-(--color-coral) text-center">
                Payment link expires{" "}
                {formatDate(new Date(state.data.expiresAt))}
              </p>
            )}

            <Button
              type="button"
              variant="coral"
              onClick={handlePay}
              disabled={paying}
              className="w-full h-12 font-['DM_Sans'] font-semibold text-base"
            >
              {paying
                ? "Opening payment…"
                : `Pay ${formatPrice(state.data.totalAmount)}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
