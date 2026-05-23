"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Check,
  CheckCircle,
  CalendarIcon,
  ChevronDown,
  Download,
  Info,
  Minus,
  Plus,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/shared/Badge";

import { useBookingStore } from "@/store/bookingStore";

import { dummyPackages } from "@/lib/dummy/packages";
import { formatPrice, formatDate } from "@/lib/utils";

import type { BookingStep, TravelerDetail } from "@/types/booking";
import type { Package } from "@/types/package";

// ── Constants ─────────────────────────────────────────────────────────────────

const STEP_LABELS = ["Review", "Travelers", "Pay", "Confirm"] as const;

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", description: "PhonePe, GPay, Paytm" },
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay" },
  { id: "emi", label: "EMI", description: "No-cost EMI on select cards" },
  { id: "netbanking", label: "Net Banking", description: "All major banks" },
];

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: BookingStep }) {
  return (
    <div className="flex items-start w-full mb-10">
      {STEP_LABELS.map((label, i) => {
        const num = (i + 1) as BookingStep;
        const done = num < current;
        const active = num === current;
        return (
          <div key={num} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-['DM_Sans'] font-semibold transition-colors ${done || active
                    ? "bg-(--color-gold) text-(--color-navy)"
                    : "border-2 border-(--color-navy-border) text-(--color-text-secondary)"
                  }`}
              >
                {done ? <Check size={16} strokeWidth={2.5} /> : num}
              </div>
              <span
                className={`text-xs font-['DM_Sans'] whitespace-nowrap ${active
                    ? "text-(--color-gold)"
                    : done
                      ? "text-(--color-white-muted)"
                      : "text-(--color-text-secondary)"
                  }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className="flex-1 h-px mt-[18px] mx-2"
                style={{
                  background: done
                    ? "var(--color-gold)"
                    : "var(--color-navy-border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Booking Sidebar ───────────────────────────────────────────────────────────

function BookingSidebar({ pkg }: { pkg: Package }) {
  const { departureDate, adults, children, infants, baseAmount, gstAmount, discountAmount, totalAmount, couponCode } =
    useBookingStore();

  const totalTravelers = adults + children + infants;
  const destinationLabel = pkg.destinationId
    .replace(/^dest-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(", ");

  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={pkg.images[0]}
          alt={pkg.title}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>

      <div>
        <h3 className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
          {pkg.title}
        </h3>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) mt-1">
          {destinationLabel} · {pkg.durationNights} Nights
        </p>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      <div className="flex flex-col gap-2 text-sm font-['DM_Sans']">
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Departure</span>
          <span className="text-(--color-white-muted)">
            {departureDate ? formatDate(departureDate) : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Travelers</span>
          <span className="text-(--color-white-muted)">
            {totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers !== 1 ? "s" : ""}` : "—"}
          </span>
        </div>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      <div className="flex flex-col gap-2 text-sm font-['DM_Sans']">
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Base Amount</span>
          <span className="text-(--color-white-muted)">{formatPrice(baseAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">GST (5%)</span>
          <span className="text-(--color-white-muted)">{formatPrice(gstAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">Discount</span>
            <span className="text-(--color-coral)">−{formatPrice(discountAmount)}</span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-1" />
        <div className="flex justify-between items-center">
          <span className="font-['DM_Sans'] font-semibold text-white text-sm">Total</span>
          <span className="font-['JetBrains_Mono'] text-xl text-(--color-gold)">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {couponCode && (
        <Badge variant="teal" size="sm">
          {couponCode} applied
        </Badge>
      )}
    </div>
  );
}

// ── Step 1 — Review Your Trip ─────────────────────────────────────────────────

function Step1({ pkg }: { pkg: Package }) {
  const {
    adults,
    children,
    infants,
    departureDate,
    setDates,
    setTravelers,
    setCoupon,
    setStep,
    baseAmount,
  } = useBookingStore();

  const [calOpen, setCalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  function handleApplyCoupon() {
    if (couponInput.trim().toUpperCase() === "WELCOME20") {
      const discount = Math.round(baseAmount * 0.2 * 100) / 100;
      setCoupon("WELCOME20", null, discount);
      toast.success("Coupon applied! 20% discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
  }

  function handleTravelerChange(type: "adults" | "children" | "infants", delta: number) {
    const next = {
      adults,
      children,
      infants,
      [type]: Math.max(type === "adults" ? 1 : 0, (type === "adults" ? adults : type === "children" ? children : infants) + delta),
    };
    setTravelers(next.adults, next.children, next.infants);
    useBookingStore.getState().updateAmounts(
      pkg.pricePerPerson * (next.adults + next.children),
    );
  }

  const travelers = [
    { key: "adults" as const, label: "Adults", sub: "Age 12+" },
    { key: "children" as const, label: "Children", sub: "Age 2–11" },
    { key: "infants" as const, label: "Infants", sub: "Under 2" },
  ];
  const counts = { adults, children, infants };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-white mb-1">
          Review Your Trip
        </h2>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Confirm your dates and traveler count before continuing.
        </p>
      </div>

      {/* Package summary */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image src={pkg.images[0]} alt={pkg.title} fill className="object-cover" sizes="80px" />
        </div>
        <div>
          <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">{pkg.title}</p>
          <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) mt-1">
            {pkg.durationNights} Nights · from {formatPrice(pkg.pricePerPerson)} per person
          </p>
        </div>
      </div>

      {/* Date picker */}
      <div>
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-white-muted) mb-2">
          Departure Date
        </p>
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2 bg-(--color-navy-border)/50 border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm text-(--color-white-muted) hover:border-(--color-gold)/40 transition-colors">
              <CalendarIcon size={14} className="text-(--color-gold) shrink-0" />
              <span className={departureDate ? "text-white" : ""}>
                {departureDate ? formatDate(departureDate) : "Select a date"}
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
              selected={departureDate ?? undefined}
              onSelect={(d) => {
                if (d) { setDates(d); setCalOpen(false); }
              }}
              disabled={(d) => d < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Travelers */}
      <div>
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-white-muted) mb-3">
          Travelers
        </p>
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) divide-y divide-(--color-navy-border)">
          {travelers.map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-['DM_Sans'] text-white">{label}</p>
                <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">{sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTravelerChange(key, -1)}
                  className="w-8 h-8 rounded-full border border-(--color-navy-border) flex items-center justify-center text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold) transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-5 text-center font-['JetBrains_Mono'] text-white text-sm">
                  {counts[key]}
                </span>
                <button
                  onClick={() => handleTravelerChange(key, 1)}
                  className="w-8 h-8 rounded-full border border-(--color-navy-border) flex items-center justify-center text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold) transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <div>
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-white-muted) mb-2">
          Coupon Code
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="Enter code (try WELCOME20)"
            className="flex-1 bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['JetBrains_Mono'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold) transition-colors"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/10 transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full py-3 rounded-xl bg-(--color-coral) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Continue →
      </button>
    </div>
  );
}

// ── Traveler form types ────────────────────────────────────────────────────────

interface TravelerFormValues {
  leadName: string;
  leadDob: string;
  leadPassport: string;
  leadEmail: string;
  leadPhone: string;
  panCard?: string;
  specialRequests?: string;
  additional: { name: string; dob: string; passportNo: string }[];
}

// ── Step 2 — Traveler Details ─────────────────────────────────────────────────

function Step2() {
  const {
    adults,
    children,
    totalAmount,
    setStep,
    setTravelerDetails,
    setSpecialRequests,
  } = useBookingStore();

  const totalExtra = adults + children - 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelerFormValues>({
    defaultValues: {
      additional: Array.from({ length: Math.max(0, totalExtra) }, () => ({
        name: "",
        dob: "",
        passportNo: "",
      })),
    },
  });

  const showPAN = totalAmount > 200000;

  const inputClass =
    "w-full bg-[var(--color-navy-surface)] border border-[var(--color-navy-border)] rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors";
  const labelClass =
    "block text-xs font-['DM_Sans'] font-medium uppercase tracking-wide text-[var(--color-white-muted)] mb-1.5";

  function onSubmit(data: TravelerFormValues) {
    const details: TravelerDetail[] = [
      {
        name: data.leadName,
        dob: data.leadDob,
        passportNo: data.leadPassport,
        email: data.leadEmail,
        phone: data.leadPhone,
        isLead: true,
      },
      ...(data.additional ?? []).map((t) => ({
        name: t.name,
        dob: t.dob,
        passportNo: t.passportNo,
        email: "",
        phone: "",
        isLead: false,
      })),
    ];
    setTravelerDetails(details);
    setSpecialRequests(data.specialRequests ?? "");
    setStep(3);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-white mb-1">
          Traveler Details
        </h2>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Enter details exactly as they appear on passports.
        </p>
      </div>

      {/* Lead traveler */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5">
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold)">
          Lead Traveler
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              {...register("leadName", { required: "Required" })}
              className={inputClass}
              placeholder="As on passport"
            />
            {errors.leadName && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.leadName.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              {...register("leadDob", { required: "Required" })}
              className={inputClass}
            />
            {errors.leadDob && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.leadDob.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Passport Number</label>
            <input
              {...register("leadPassport", { required: "Required" })}
              className={`${inputClass} font-['JetBrains_Mono']`}
              placeholder="A1234567"
            />
            {errors.leadPassport && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.leadPassport.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("leadEmail", { required: "Required" })}
              className={inputClass}
              placeholder="you@email.com"
            />
            {errors.leadEmail && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.leadEmail.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Phone Number</label>
            <input
              {...register("leadPhone", { required: "Required" })}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
            {errors.leadPhone && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.leadPhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional travelers */}
      {totalExtra > 0 &&
        Array.from({ length: totalExtra }).map((_, idx) => (
          <div
            key={idx}
            className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5"
          >
            <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold)">
              Traveler {idx + 2}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  {...register(`additional.${idx}.name`, { required: "Required" })}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  {...register(`additional.${idx}.dob`, { required: "Required" })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Passport Number</label>
                <input
                  {...register(`additional.${idx}.passportNo`, { required: "Required" })}
                  className={`${inputClass} font-['JetBrains_Mono']`}
                  placeholder="A1234567"
                />
              </div>
            </div>
          </div>
        ))}

      {/* PAN card — conditional */}
      {showPAN && (
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-gold)/30 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-(--color-gold)" />
            <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold)">
              PAN Card Required
            </p>
          </div>
          <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
            RBI requires PAN card for bookings above ₹2,00,000.
          </p>
          <div>
            <label className={labelClass}>PAN Card Number</label>
            <input
              {...register("panCard", {
                required: "PAN card is required for this booking",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format (e.g. AAAAA9999A)",
                },
              })}
              className={`${inputClass} font-['JetBrains_Mono'] uppercase`}
              placeholder="AAAAA9999A"
              maxLength={10}
            />
            {errors.panCard && (
              <p className="text-xs text-(--color-coral) mt-1">{errors.panCard.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Special requests */}
      <div>
        <label className={labelClass}>Special Requests (optional)</label>
        <textarea
          {...register("specialRequests")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Dietary requirements, room preferences, accessibility needs…"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-(--color-coral) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Continue →
        </button>
      </div>
    </form>
  );
}

// ── Step 3 — Review & Pay ─────────────────────────────────────────────────────

function Step3({ pkg }: { pkg: Package }) {
  const {
    departureDate,
    adults,
    children,
    infants,
    baseAmount,
    gstAmount,
    discountAmount,
    totalAmount,
    setStep,
    setBookingResult,
  } = useBookingStore();

  const [paymentMethod, setPaymentMethod] = useState("upi");

  function handlePay() {
    const id = "BK-" + Date.now();
    const ref = "#BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setBookingResult(id, ref);
    setStep(4);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-white mb-1">
          Review & Pay
        </h2>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Confirm your booking details and choose a payment method.
        </p>
      </div>

      {/* Trip summary */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image src={pkg.images[0]} alt={pkg.title} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">{pkg.title}</p>
          <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            {departureDate ? formatDate(departureDate) : "Date TBD"} ·{" "}
            {adults + children + infants} guest{adults + children + infants !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-3">
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
          Price Breakdown
        </p>
        <div className="flex justify-between text-sm font-['DM_Sans']">
          <span className="text-(--color-text-secondary)">Base Amount</span>
          <span className="text-(--color-white-muted)">{formatPrice(baseAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-['DM_Sans']">
          <span className="text-(--color-text-secondary)">GST (5%)</span>
          <span className="text-(--color-white-muted)">{formatPrice(gstAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm font-['DM_Sans']">
            <span className="text-(--color-text-secondary)">Discount</span>
            <span className="text-(--color-coral)">−{formatPrice(discountAmount)}</span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-2" />
        <div className="flex justify-between items-center">
          <span className="font-['DM_Sans'] font-semibold text-white">Total</span>
          <span className="font-['JetBrains_Mono'] text-2xl font-bold text-(--color-gold)">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-white-muted) mb-3">
          Payment Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`flex flex-col gap-0.5 p-4 rounded-xl border text-left transition-colors ${paymentMethod === method.id
                  ? "border-(--color-gold) bg-(--color-gold)/5"
                  : "border-(--color-navy-border) bg-(--color-navy-surface) hover:border-(--color-gold)/40"
                }`}
            >
              <span className="font-['DM_Sans'] text-sm font-medium text-white">
                {method.label}
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                {method.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
        By proceeding, you agree to our cancellation policy and Terms of Service.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handlePay}
          className="flex-1 py-3 rounded-xl bg-(--color-coral) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Pay {formatPrice(totalAmount)} →
        </button>
      </div>
    </div>
  );
}

// ── Step 4 — Booking Confirmed ────────────────────────────────────────────────

function Step4() {
  const { bookingRef } = useBookingStore();

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-6">
      <div className="animate-pulse">
        <CheckCircle size={64} className="text-(--color-teal)" />
      </div>

      <div className="space-y-2">
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white">
          Booking Confirmed!
        </h1>
        <p className="font-['JetBrains_Mono'] text-xl text-(--color-gold)">
          {bookingRef ?? "#BK-XXXXXX"}
        </p>
        <p className="font-['DM_Sans'] text-sm text-(--color-white-muted) max-w-sm mx-auto">
          A confirmation email has been sent to your email address.
        </p>
      </div>

      <Separator className="bg-(--color-navy-border) w-full" />

      <div className="flex flex-wrap justify-center gap-3">
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] cursor-not-allowed opacity-50"
        >
          <Download size={14} />
          Download Voucher
        </button>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-gold) text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) text-sm font-['DM_Sans'] hover:border-(--color-gold)/40 hover:text-white transition-colors"
        >
          Plan Another Trip
        </Link>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = use(params);
  const pkg =
    dummyPackages.find((p) => p.id === packageId) ?? dummyPackages[0];

  const { currentStep, setPackage, adults } = useBookingStore();

  useEffect(() => {
    setPackage(pkg.id, pkg.pricePerPerson * adults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg.id]);

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <StepIndicator current={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Step content */}
          <div className="flex-1 min-w-0">
            {currentStep === 1 && <Step1 pkg={pkg} />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 pkg={pkg} />}
            {currentStep === 4 && <Step4 />}
          </div>

          {/* Sidebar — hidden on step 4 */}
          {currentStep !== 4 && (
            <div className="w-full lg:w-80 lg:sticky lg:top-28">
              <BookingSidebar pkg={pkg} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
