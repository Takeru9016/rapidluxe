"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, CheckCircle2, Info, Minus, Plus } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

import { useBookingStore } from "@/store/bookingStore";
import { dummyPackages } from "@/lib/dummy/packages";
import { formatPrice, formatDate, formatDateRange } from "@/lib/utils";

import type { TravelerDetail } from "@/types/booking";
import type { Package } from "@/types/package";

// ── Constants ─────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Travel Details",
  "Traveler Details",
  "Review & Submit",
  "Request Confirmed",
] as const;

const OCCASIONS = [
  { value: "leisure", label: "Leisure", emoji: "🎉" },
  { value: "honeymoon", label: "Honeymoon", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "🥂" },
  { value: "bachelorette", label: "Bachelorette/Bachelor", emoji: "🎊" },
] as const;

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "None",
] as const;

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const {
    departureDate,
    returnDate,
    dateMode,
    flexibleDuration,
    adults,
    children,
  } = useBookingStore();

  function getSummaryLabel(step: 1 | 2 | 3 | 4): string | null {
    if (step === 1 && current > 1) {
      if (dateMode === "flexible" && flexibleDuration) {
        return `~${flexibleDuration} nights`;
      }
      if (departureDate && returnDate && departureDate !== returnDate) {
        return formatDateRange(departureDate, returnDate);
      }
      if (departureDate) {
        return formatDate(departureDate);
      }
    }
    if (step === 2 && current > 2) {
      return `${adults} Adult${adults !== 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""}`;
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="flex items-start w-full">
        {STEP_LABELS.map((label, i) => {
          const num = (i + 1) as 1 | 2 | 3 | 4;
          const done = num < current;
          const active = num === current;
          const summary = getSummaryLabel(num);
          return (
            <div key={num} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-['DM_Sans'] transition-colors ${
                    done
                      ? "bg-(--color-gold) text-(--color-navy)"
                      : active
                        ? "bg-(--color-gold) text-(--color-navy) font-semibold"
                        : "border-2 border-(--color-navy-border) text-(--color-text-secondary)"
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={2.5} /> : num}
                </div>
                <div className="flex flex-col items-center mt-2 text-center">
                  <span
                    className={`text-xs font-['DM_Sans'] ${
                      active || done
                        ? "text-white"
                        : "text-(--color-text-secondary)"
                    }`}
                  >
                    {label}
                  </span>
                  {summary && (
                    <span className="text-xs font-['DM_Sans'] text-(--color-gold) mt-0.5">
                      {summary}
                    </span>
                  )}
                </div>
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
    </div>
  );
}

// ── Booking Sidebar ───────────────────────────────────────────────────────────

function BookingSidebar({ pkg }: { pkg: Package }) {
  const {
    departureDate,
    adults,
    children,
    infants,
    baseAmount,
    gstAmount,
    discountAmount,
    totalAmount,
  } = useBookingStore();

  const totalTravelers = adults + children + infants;
  const destLabel = pkg.destinationId
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
          {destLabel} · {pkg.durationNights} Nights
        </p>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      <div className="flex flex-col gap-2 text-sm font-['DM_Sans']">
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Departure</span>
          <span className="text-(--color-white-muted)">
            {departureDate ? formatDate(departureDate) : "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Travelers</span>
          <span className="text-(--color-white-muted)">
            {totalTravelers > 0
              ? `${totalTravelers} guest${totalTravelers !== 1 ? "s" : ""}`
              : "—"}
          </span>
        </div>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      <div className="flex flex-col gap-2 text-sm font-['DM_Sans']">
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Base</span>
          <span className="text-(--color-white-muted)">
            {formatPrice(baseAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">GST (5%)</span>
          <span className="text-(--color-white-muted)">
            {formatPrice(gstAmount)}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">Discount</span>
            <span className="text-(--color-coral)">
              −{formatPrice(discountAmount)}
            </span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-1" />
        <div className="flex justify-between items-center">
          <span className="font-['DM_Sans'] font-semibold text-white text-sm">
            Total
          </span>
          <span className="font-['JetBrains_Mono'] text-xl text-(--color-gold)">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Step 1 — Travel Details ───────────────────────────────────────────────────

function Step1({ pkg }: { pkg: Package }) {
  const {
    adults,
    children,
    infants,
    occasion,
    dateMode,
    departureDate,
    returnDate,
    flexibleDuration,
    flexibleMonths,
    baseAmount,
    setTravelers,
    setOccasion,
    setDateMode,
    setExactDates,
    setFlexibleOptions,
    setCoupon,
    setStep,
  } = useBookingStore();

  const [couponInput, setCouponInput] = useState("");
  const [calMonths, setCalMonths] = useState(1);

  useEffect(() => {
    const check = () => setCalMonths(window.innerWidth >= 768 ? 2 : 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleTravelerChange(
    type: "adults" | "children" | "infants",
    delta: number,
  ) {
    const curr = { adults, children, infants };
    const min = type === "adults" ? 1 : 0;
    const next = { ...curr, [type]: Math.max(min, curr[type] + delta) };
    setTravelers(next.adults, next.children, next.infants);
    useBookingStore
      .getState()
      .updateAmounts(pkg.pricePerPerson * (next.adults + next.children));
  }

  function handleApplyCoupon() {
    if (couponInput.trim().toUpperCase() === "WELCOME20") {
      const discount = Math.round(baseAmount * 0.2 * 100) / 100;
      setCoupon("WELCOME20", null, discount);
      toast.success("Coupon applied! 20% discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
  }

  const dateRange: DateRange = {
    from: departureDate ?? undefined,
    to: returnDate ?? undefined,
  };

  const nextMonths = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + i);
    return d;
  });

  const counts = { adults, children, infants };
  const travelerGroups = [
    { key: "adults" as const, label: "Adults", age: "Age 13+", min: 1 },
    { key: "children" as const, label: "Children", age: "Age 2–12", min: 0 },
    { key: "infants" as const, label: "Infants", age: "Under 2", min: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Card 1 — Who's traveling */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <p className="font-['DM_Sans'] font-semibold text-white text-base mb-5">
          Who&apos;s traveling?
        </p>
        <div className="flex flex-wrap gap-8 md:gap-12">
          {travelerGroups.map(({ key, label, age, min }) => {
            const count = counts[key];
            const atMin = count <= min;
            return (
              <div key={key} className="flex flex-col gap-1">
                <span className="font-['DM_Sans'] font-medium text-white text-sm">
                  {label}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleTravelerChange(key, -1)}
                    disabled={atMin}
                    className={`w-9 h-9 rounded-full border border-(--color-navy-border) flex items-center justify-center transition-colors ${
                      atMin
                        ? "opacity-40 cursor-not-allowed text-(--color-white-muted)"
                        : "text-(--color-white-muted) hover:border-(--color-gold) hover:text-(--color-gold)"
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-['DM_Sans'] font-medium text-white text-xl min-w-8 text-center">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTravelerChange(key, 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      count > 0
                        ? "bg-(--color-gold) text-(--color-navy) hover:opacity-90"
                        : "border border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold)/10"
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                  {age}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 2 — Occasion */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <p className="font-['DM_Sans'] font-semibold text-white text-base mb-1">
          What&apos;s the occasion?
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {OCCASIONS.map((occ) => {
            const selected = occasion === occ.value;
            return (
              <button
                key={occ.value}
                type="button"
                onClick={() => setOccasion(occ.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-['DM_Sans'] transition-colors ${
                  selected
                    ? "border-(--color-gold) text-(--color-gold) bg-(--color-gold)/10"
                    : "border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/50 hover:text-white"
                }`}
              >
                <span>{occ.emoji}</span>
                <span>{occ.label}</span>
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 3 — Date */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <p className="font-['DM_Sans'] font-semibold text-white text-base mb-1">
          When do you want to travel?
        </p>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setDateMode("exact")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-['DM_Sans'] transition-colors ${
              dateMode === "exact"
                ? "bg-(--color-gold) text-(--color-navy) font-medium"
                : "border border-(--color-navy-border) text-(--color-white-muted)"
            }`}
          >
            📅 Exact Dates
          </button>
          <button
            type="button"
            onClick={() => setDateMode("flexible")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-['DM_Sans'] transition-colors ${
              dateMode === "flexible"
                ? "bg-(--color-gold) text-(--color-navy) font-medium"
                : "border border-(--color-navy-border) text-(--color-white-muted)"
            }`}
          >
            🕐 I&apos;m Flexible
          </button>
        </div>

        {dateMode === "exact" && (
          <div className="mt-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from) {
                  setExactDates(range.from, range.to ?? range.from);
                }
              }}
              disabled={(d) => d < new Date()}
              numberOfMonths={calMonths}
              className="rounded-xl border border-(--color-navy-border) bg-(--color-navy)"
            />
          </div>
        )}

        {dateMode === "flexible" && (
          <div className="mt-4 space-y-6">
            <div>
              <p className="font-['DM_Sans'] font-medium text-white text-sm mt-4 mb-3">
                How long do you want to stay?
              </p>
              <div className="flex gap-3">
                {([7, 14, 21] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFlexibleOptions(d, flexibleMonths)}
                    className={`px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-colors ${
                      flexibleDuration === d
                        ? "bg-(--color-gold) text-(--color-navy) font-medium"
                        : "border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/50"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-['DM_Sans'] font-medium text-white text-sm mt-6 mb-3">
                When do you want to go?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {nextMonths.map((month) => {
                  const key = `${month.getFullYear()}-${month.getMonth()}`;
                  const selected = flexibleMonths.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? flexibleMonths.filter((m) => m !== key)
                          : [...flexibleMonths, key];
                        setFlexibleOptions(flexibleDuration, next);
                      }}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border text-center cursor-pointer transition-colors ${
                        selected
                          ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                          : "border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/40"
                      }`}
                    >
                      <span className="font-['DM_Sans'] text-sm">
                        {month.toLocaleString("en-IN", { month: "short" })}
                      </span>
                      <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
                        {month.getFullYear()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
          placeholder="Promo code"
          className="flex-1 bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['JetBrains_Mono'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold) transition-colors"
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          className="px-4 py-2.5 rounded-lg border border-(--color-gold)/60 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/10 transition-colors whitespace-nowrap"
        >
          Apply
        </button>
      </div>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="w-full py-3 rounded-xl bg-(--color-coral) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity mt-6"
      >
        Continue →
      </button>
    </div>
  );
}

// ── Step 2 — Traveler Details ─────────────────────────────────────────────────

interface Step2FormValues {
  leadName: string;
  leadDob: string;
  leadPassport: string;
  leadEmail: string;
  leadPhone: string;
  panCard?: string;
  specialRequests?: string;
  additional: { name: string; dob: string; passportNo: string }[];
}

function Step2() {
  const {
    adults,
    children,
    totalAmount,
    dietaryRequirements,
    setStep,
    setTravelerDetails,
    setSpecialRequests,
    setDietaryRequirements,
    setPanCard,
  } = useBookingStore();

  const totalExtra = Math.max(0, adults + children - 1);
  const showPAN = totalAmount > 200000;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormValues>({
    defaultValues: {
      additional: Array.from({ length: totalExtra }, () => ({
        name: "",
        dob: "",
        passportNo: "",
      })),
    },
  });

  function toggleDietary(option: string) {
    if (option === "None") {
      setDietaryRequirements(["None"]);
    } else {
      const without = dietaryRequirements.filter((d) => d !== "None");
      const next = without.includes(option)
        ? without.filter((d) => d !== option)
        : [...without, option];
      setDietaryRequirements(next);
    }
  }

  function onSubmit(data: Step2FormValues) {
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
        isLead: false,
      })),
    ];
    setTravelerDetails(details);
    setSpecialRequests(data.specialRequests ?? "");
    if (data.panCard) setPanCard(data.panCard);
    setStep(3);
  }

  const inputClass =
    "w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold) transition-colors";
  const labelClass =
    "block text-xs font-['DM_Sans'] font-medium uppercase tracking-wide text-(--color-white-muted) mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Lead traveler */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5">
        <p className="font-['DM_Sans'] font-semibold text-white text-base">
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
              <p className="text-xs text-(--color-coral) mt-1">
                {errors.leadName.message}
              </p>
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
              <p className="text-xs text-(--color-coral) mt-1">
                {errors.leadDob.message}
              </p>
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
              <p className="text-xs text-(--color-coral) mt-1">
                {errors.leadPassport.message}
              </p>
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
              <p className="text-xs text-(--color-coral) mt-1">
                {errors.leadEmail.message}
              </p>
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
              <p className="text-xs text-(--color-coral) mt-1">
                {errors.leadPhone.message}
              </p>
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
            <p className="font-['DM_Sans'] font-semibold text-white text-base">
              Traveler {idx + 2}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  {...register(`additional.${idx}.name`, {
                    required: "Required",
                  })}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  {...register(`additional.${idx}.dob`, {
                    required: "Required",
                  })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Passport Number</label>
                <input
                  {...register(`additional.${idx}.passportNo`, {
                    required: "Required",
                  })}
                  className={`${inputClass} font-['JetBrains_Mono']`}
                  placeholder="A1234567"
                />
              </div>
            </div>
          </div>
        ))}

      {/* PAN Card — conditional */}
      {showPAN && (
        <div className="bg-(--color-gold)/5 border border-(--color-gold)/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-(--color-gold)" />
            <p className="font-['DM_Sans'] font-medium text-(--color-gold) text-sm">
              PAN Card Number
            </p>
            <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary) ml-1">
              Required for bookings above ₹2,00,000
            </span>
          </div>
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
            <p className="text-xs text-(--color-coral) mt-1">
              {errors.panCard.message}
            </p>
          )}
        </div>
      )}

      {/* Dietary Requirements */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <p className="font-['DM_Sans'] font-medium text-white text-sm mb-3">
          Any dietary requirements?
        </p>
        <div className="flex flex-wrap gap-3">
          {DIETARY_OPTIONS.map((option) => {
            const selected = dietaryRequirements.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleDietary(option)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-['DM_Sans'] transition-colors ${
                  selected
                    ? "border-(--color-gold) text-(--color-gold) bg-(--color-gold)/10"
                    : "border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/50 hover:text-white"
                }`}
              >
                {option}
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <p className="font-['DM_Sans'] font-medium text-white text-sm mb-3">
          Anything else we should know?
        </p>
        <textarea
          {...register("specialRequests")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Share any specific requirements, accessibility needs, or preferences..."
        />
      </div>

      <div className="flex gap-3 mt-6">
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

// ── Step 3 — Review & Submit ──────────────────────────────────────────────────

function Step3({ pkg, packageId }: { pkg: Package; packageId: string }) {
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
  } = useBookingStore();

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const store = useBookingStore.getState();
    if (!store.departureDate) {
      toast.error("Please select a departure date.");
      store.setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          departureDate: store.departureDate.toISOString(),
          adults: store.adults,
          children: store.children,
          infants: store.infants,
          occasion: store.occasion ?? undefined,
          dietaryRequirements: store.dietaryRequirements,
          specialRequests: store.specialRequests || undefined,
          couponCode: store.couponCode ?? undefined,
        }),
      });
      const json = (await res.json()) as {
        data?: { bookingId: string; bookingRef: string };
        error?: string;
      };
      if (!res.ok || !json.data) {
        throw new Error(json.error ?? "Request failed");
      }
      store.setBookingResult(json.data.bookingId, json.data.bookingRef);
      store.setStep(4);
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Package summary */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 flex gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={pkg.images[0]}
            alt={pkg.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
            {pkg.title}
          </p>
          <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            {departureDate ? formatDate(departureDate) : "Date TBD"} ·{" "}
            {adults + children + infants} guest
            {adults + children + infants !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-3 mt-4">
        <p className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
          Price Breakdown
        </p>
        <div className="flex justify-between text-sm">
          <span className="font-['DM_Sans'] text-(--color-text-secondary)">
            Base
          </span>
          <span className="font-['JetBrains_Mono'] text-white">
            {formatPrice(baseAmount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-['DM_Sans'] text-(--color-text-secondary)">
            GST (5%)
          </span>
          <span className="font-['JetBrains_Mono'] text-(--color-text-secondary)">
            {formatPrice(gstAmount)}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Discount
            </span>
            <span className="font-['DM_Sans'] text-(--color-coral)">
              −{formatPrice(discountAmount)}
            </span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-2" />
        <div className="flex justify-between items-center">
          <span className="font-['DM_Sans'] font-semibold text-white">
            Estimated Total
          </span>
          <span className="font-['JetBrains_Mono'] text-2xl font-bold text-(--color-gold)">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Important notice */}
      <div className="mt-4 bg-(--color-gold)/5 border-l-4 border-(--color-gold) rounded-r-xl p-4">
        <p className="font-['DM_Sans'] text-sm text-(--color-white-muted)">
          <Info
            size={16}
            className="text-(--color-gold) inline mr-2 align-text-bottom"
          />
          Our team will review your request and contact you within 2 hours via
          WhatsApp to confirm availability and finalize your quote.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors mt-2"
      >
        ← Back
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-12 rounded-xl bg-(--color-coral) text-white font-['DM_Sans'] font-semibold text-sm hover:opacity-90 transition-opacity mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit Booking Request"}
      </button>
    </div>
  );
}

// ── Step 4 — Request Confirmed ────────────────────────────────────────────────

function Step4() {
  const { bookingRef } = useBookingStore();
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className={pulse ? "animate-pulse" : ""}>
        <CheckCircle2 size={64} className="text-(--color-teal) mb-6" />
      </div>

      <h1 className="font-['Cormorant_Garamond'] text-4xl text-white mt-6">
        Request Received!
      </h1>
      <p className="font-['JetBrains_Mono'] text-2xl text-(--color-gold) mt-2">
        {bookingRef ?? "RL-XXXXXX"}
      </p>
      <p className="font-['DM_Sans'] text-(--color-white-muted) mt-3 max-w-md">
        We&apos;ll WhatsApp you within 2 hours to confirm your trip.
      </p>

      {/* Status timeline */}
      <div className="mt-10 max-w-lg mx-auto w-full flex items-center overflow-x-auto">
        <span className="font-['DM_Sans'] text-sm text-(--color-teal) whitespace-nowrap">
          Enquiry Received ✓
        </span>
        <div className="h-px bg-(--color-navy-border) flex-1 mx-3 shrink-0 min-w-4" />
        <span className="font-['DM_Sans'] text-sm text-(--color-gold) animate-pulse whitespace-nowrap">
          Quote Being Prepared
        </span>
        <div className="h-px bg-(--color-navy-border) flex-1 mx-3 shrink-0 min-w-4" />
        <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary) whitespace-nowrap">
          Payment Link Sent
        </span>
        <div className="h-px bg-(--color-navy-border) flex-1 mx-3 shrink-0 min-w-4" />
        <span className="font-['DM_Sans'] text-sm text-(--color-text-secondary) whitespace-nowrap">
          Trip Confirmed
        </span>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/bookings"
          className="px-6 py-3 rounded-xl border border-(--color-gold) text-(--color-gold) font-['DM_Sans'] text-sm hover:bg-(--color-gold)/10 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/packages"
          className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
        >
          Browse More Packages
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
  const pkg = dummyPackages.find((p) => p.id === packageId) ?? dummyPackages[0];

  const { currentStep, updateAmounts, adults } = useBookingStore();

  useEffect(() => {
    updateAmounts(pkg.pricePerPerson * adults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg.id]);

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <StepIndicator current={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            {currentStep === 1 && <Step1 pkg={pkg} />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 pkg={pkg} packageId={packageId} />}
            {currentStep === 4 && <Step4 />}
          </div>

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
