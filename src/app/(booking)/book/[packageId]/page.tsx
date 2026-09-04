"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  Cake,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Gem,
  Info,
  Lightbulb,
  Minus,
  Plus,
  Sparkles,
  UserCheck,
  Wine,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { useDeals } from "@/hooks/api/useDeals";
import { usePackage } from "@/hooks/api/usePackages";
import {
  calculateBookingBaseAmount,
  formatDate,
  formatDateRange,
  formatPrice,
} from "@/lib/utils";
import { useBookingStore } from "@/store/bookingStore";

import type { TravelerDetail } from "@/types/booking";
import type { Coupon } from "@/types/coupon";
import type { Package } from "@/types/package";

type BookingPackage = Package & {
  destination: { name: string } | null;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Travel Details",
  "Traveler Details",
  "Review & Submit",
  "Request Confirmed",
] as const;

const OCCASIONS = [
  { value: "leisure", label: "Leisure", icon: Sparkles },
  { value: "honeymoon", label: "Honeymoon", icon: Gem },
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "anniversary", label: "Anniversary", icon: Wine },
  { value: "bachelorette", label: "Bachelorette/Bachelor", icon: Sparkles },
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
                  className="flex-1 h-px mt-4.5 mx-2"
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

function BookingSidebar({ pkg }: { pkg: BookingPackage }) {
  const {
    departureDate,
    adults,
    children,
    infants,
    baseAmount,
    gstAmount,
    dealDiscountAmount,
    couponDiscountAmount,
    totalAmount,
  } = useBookingStore();

  const totalTravelers = adults + children + infants;
  const destLabel = pkg.destination?.name ?? null;

  const { adultTotal, childTotal, infantTotal, toursTotal } =
    calculateBookingBaseAmount(pkg, adults, children, infants);

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
          {destLabel ? `${destLabel} · ` : ""}
          {pkg.durationNights} Nights
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
          <span className="text-(--color-text-secondary)">
            Adults ({adults} × {formatPrice(pkg.pricePerPerson)})
          </span>
          <span className="text-(--color-white-muted)">
            {formatPrice(adultTotal)}
          </span>
        </div>
        {children > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">
              Children ({children} × {formatPrice(pkg.childPrice ?? 0)})
            </span>
            <span className="text-(--color-white-muted)">
              {formatPrice(childTotal)}
            </span>
          </div>
        )}
        {infants > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">
              Infants ({infants} × {formatPrice(pkg.infantPrice ?? 0)})
            </span>
            <span className="text-(--color-white-muted)">
              {formatPrice(infantTotal)}
            </span>
          </div>
        )}
        {pkg.toursPrice != null && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">
              Tours &amp; Transfers
            </span>
            <span className="text-(--color-white-muted)">
              {formatPrice(toursTotal)}
            </span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-1" />
        <div className="flex justify-between">
          <span className="text-(--color-text-secondary)">Subtotal</span>
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
        {dealDiscountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">
              Deal discount
            </span>
            <span className="text-(--color-coral)">
              −{formatPrice(dealDiscountAmount)}
            </span>
          </div>
        )}
        {couponDiscountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-(--color-text-secondary)">
              Coupon discount
            </span>
            <span className="text-(--color-coral)">
              −{formatPrice(couponDiscountAmount)}
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

function Step1({ pkg }: { pkg: BookingPackage }) {
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
    dealDiscountAmount,
    appliedCoupon,
    setTravelers,
    setOccasion,
    setDateMode,
    setExactDates,
    setFlexibleOptions,
    setCoupon,
    setStep,
  } = useBookingStore();

  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
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
    const { baseAmount: nextBase } = calculateBookingBaseAmount(
      pkg,
      next.adults,
      next.children,
      next.infants,
    );
    useBookingStore.getState().updateAmounts(nextBase);
  }

  function applyFlexibleSelection(
    duration: 7 | 14 | 21 | null,
    months: string[],
  ) {
    setFlexibleOptions(duration, months);
    if (!duration || months.length === 0) return;
    const [year, monthIndex] = months
      .map((key) => key.split("-").map(Number) as [number, number])
      .sort(([y1, m1], [y2, m2]) => y1 - y2 || m1 - m2)[0];
    const departure = new Date(year, monthIndex, 1);
    const returnDate = new Date(departure);
    returnDate.setDate(returnDate.getDate() + duration);
    setExactDates(departure, returnDate);
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) return;

    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          baseAmount,
          applicableAmount: baseAmount - dealDiscountAmount,
        }),
      });
      const json = (await res.json()) as {
        data?: { coupon: Coupon; discountAmount: number };
        error?: string;
      };
      if (!res.ok || !json.data) {
        toast.error(json.error ?? "Invalid coupon code.");
        return;
      }
      setCoupon(json.data.coupon.code, json.data.coupon);
      toast.success(
        `Coupon applied! ${formatPrice(json.data.discountAmount)} off.`,
      );
    } catch {
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
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
        <h2 className="font-['DM_Sans'] font-semibold text-white text-base mb-5">
          Who&apos;s traveling?
        </h2>
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
                    className={`w-9 h-9 rounded-full border border-(--color-navy-border) flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 focus-visible:border-(--color-gold) ${
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 focus-visible:border-(--color-gold) ${
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
        <h2 className="font-['DM_Sans'] font-semibold text-white text-base mb-1">
          What&apos;s the occasion?
        </h2>
        <div className="flex flex-wrap gap-3 mt-3">
          {OCCASIONS.map((occ) => {
            const selected = occasion === occ.value;
            const OccIcon = occ.icon;
            return (
              <button
                key={occ.value}
                type="button"
                onClick={() => setOccasion(occ.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
                  selected
                    ? "border-(--color-gold) text-(--color-gold) bg-(--color-gold)/10"
                    : "border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/50 hover:text-white"
                }`}
              >
                <OccIcon size={14} />
                <span>{occ.label}</span>
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 3 — Date */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <h2 className="font-['DM_Sans'] font-semibold text-white text-base mb-1">
          When do you want to travel?
        </h2>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setDateMode("exact")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
              dateMode === "exact"
                ? "bg-(--color-gold) text-(--color-navy) font-medium"
                : "border border-(--color-navy-border) text-(--color-white-muted)"
            }`}
          >
            <CalendarDays size={14} />
            Exact Dates
          </button>
          <button
            type="button"
            onClick={() => setDateMode("flexible")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
              dateMode === "flexible"
                ? "bg-(--color-gold) text-(--color-navy) font-medium"
                : "border border-(--color-navy-border) text-(--color-white-muted)"
            }`}
          >
            <Clock size={14} />
            I&apos;m Flexible
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
                    onClick={() => applyFlexibleSelection(d, flexibleMonths)}
                    className={`px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
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
                        applyFlexibleSelection(flexibleDuration, next);
                      }}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
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
        <Button
          type="button"
          variant="outline-gold"
          onClick={handleApplyCoupon}
          disabled={isApplyingCoupon}
          className="px-4 h-auto py-2.5 font-sans whitespace-nowrap"
        >
          {isApplyingCoupon ? "Applying…" : "Apply"}
        </Button>
      </div>

      {appliedCoupon && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-['DM_Sans'] text-(--color-teal)">
          <Check size={14} />
          {appliedCoupon.code} applied
        </p>
      )}

      <Button
        type="button"
        variant="coral"
        onClick={() => setStep(2)}
        className="w-full h-12 rounded-xl font-sans font-semibold mt-6"
      >
        Continue →
      </Button>
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

interface ProfileData {
  name: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
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
    setValue,
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

  // ── Profile autofill ──────────────────────────────────────────────────────
  const { isLoaded, isSignedIn } = useUser();
  const [autofillDismissed, setAutofillDismissed] = useState(false);

  const { data: profileResp } = useQuery<{ data: ProfileData }>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json() as Promise<{ data: ProfileData }>;
    },
    enabled: isLoaded && !!isSignedIn,
  });
  const profile = profileResp?.data;

  const showAutofill =
    !autofillDismissed && !!profile?.name && !!profile?.phone;
  const showProfilePrompt =
    !!isSignedIn && !!profile && (!profile.name || !profile.phone);

  function handleAutofill() {
    if (!profile) return;
    setValue("leadName", profile.name ?? "");
    setValue("leadPhone", profile.phone ?? "");
    setValue("leadEmail", profile.email ?? "");
    setValue("leadDob", profile.dateOfBirth?.slice(0, 10) ?? "");
    setValue("leadPassport", profile.passportNumber ?? "");
    setAutofillDismissed(true);
  }

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
      {/* Autofill banner */}
      {showAutofill && (
        <div className="relative bg-(--color-gold)/10 border border-(--color-gold)/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <UserCheck className="text-(--color-gold) w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-['DM_Sans'] font-medium text-white">
              Pre-fill with your saved details?
            </p>
            <p className="font-['DM_Sans'] text-sm text-(--color-white-muted) mt-0.5">
              We found your profile information. Fill in Traveller 1
              automatically.
            </p>
            <div className="flex gap-3 mt-3">
              <Button
                type="button"
                variant="outline-gold"
                size="sm"
                onClick={handleAutofill}
                className="h-8 px-3 font-sans"
              >
                Yes, pre-fill
              </Button>
              <button
                type="button"
                onClick={() => setAutofillDismissed(true)}
                className="h-8 px-3 rounded-lg text-(--color-white-muted) text-sm font-['DM_Sans'] hover:text-white transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutofillDismissed(true)}
            aria-label="Dismiss"
            className="absolute top-3 right-3 text-(--color-text-secondary) hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Lead traveler */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5">
        <h2 className="font-['DM_Sans'] font-semibold text-white text-base">
          Lead Traveler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="leadName">
              Full Name
            </label>
            <input
              id="leadName"
              {...register("leadName", { required: "Required" })}
              className={inputClass}
              placeholder="As on passport"
              aria-invalid={errors.leadName ? "true" : undefined}
              aria-describedby={errors.leadName ? "leadName-error" : undefined}
            />
            {errors.leadName && (
              <p
                id="leadName-error"
                className="text-xs text-(--color-coral) mt-1"
              >
                {errors.leadName.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="leadDob">
              Date of Birth
            </label>
            <input
              id="leadDob"
              type="date"
              {...register("leadDob", { required: "Required" })}
              className={inputClass}
              aria-invalid={errors.leadDob ? "true" : undefined}
              aria-describedby={errors.leadDob ? "leadDob-error" : undefined}
            />
            {errors.leadDob && (
              <p
                id="leadDob-error"
                className="text-xs text-(--color-coral) mt-1"
              >
                {errors.leadDob.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="leadPassport">
              Passport Number
            </label>
            <input
              id="leadPassport"
              {...register("leadPassport", { required: "Required" })}
              className={`${inputClass} font-['JetBrains_Mono']`}
              placeholder="A1234567"
              aria-invalid={errors.leadPassport ? "true" : undefined}
              aria-describedby={
                errors.leadPassport ? "leadPassport-error" : undefined
              }
            />
            {errors.leadPassport && (
              <p
                id="leadPassport-error"
                className="text-xs text-(--color-coral) mt-1"
              >
                {errors.leadPassport.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="leadEmail">
              Email
            </label>
            <input
              id="leadEmail"
              type="email"
              {...register("leadEmail", { required: "Required" })}
              className={inputClass}
              placeholder="you@email.com"
              aria-invalid={errors.leadEmail ? "true" : undefined}
              aria-describedby={
                errors.leadEmail ? "leadEmail-error" : undefined
              }
            />
            {errors.leadEmail && (
              <p
                id="leadEmail-error"
                className="text-xs text-(--color-coral) mt-1"
              >
                {errors.leadEmail.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="leadPhone">
              Phone Number
            </label>
            <input
              id="leadPhone"
              {...register("leadPhone", { required: "Required" })}
              className={inputClass}
              placeholder="+91 98765 43210"
              aria-invalid={errors.leadPhone ? "true" : undefined}
              aria-describedby={
                errors.leadPhone ? "leadPhone-error" : undefined
              }
            />
            {errors.leadPhone && (
              <p
                id="leadPhone-error"
                className="text-xs text-(--color-coral) mt-1"
              >
                {errors.leadPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional travelers */}
      {totalExtra > 0 &&
        Array.from({ length: totalExtra }).map((_, idx) => {
          const nameError = errors.additional?.[idx]?.name;
          const dobError = errors.additional?.[idx]?.dob;
          const passportError = errors.additional?.[idx]?.passportNo;
          return (
            <div
              key={idx}
              className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 space-y-5"
            >
              <h2 className="font-['DM_Sans'] font-semibold text-white text-base">
                Traveler {idx + 2}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={labelClass}
                    htmlFor={`additional.${idx}.name`}
                  >
                    Full Name
                  </label>
                  <input
                    id={`additional.${idx}.name`}
                    {...register(`additional.${idx}.name`, {
                      required: "Required",
                    })}
                    className={inputClass}
                    placeholder="Full name"
                    aria-invalid={nameError ? "true" : undefined}
                    aria-describedby={
                      nameError ? `additional.${idx}.name-error` : undefined
                    }
                  />
                  {nameError && (
                    <p
                      id={`additional.${idx}.name-error`}
                      className="text-xs text-(--color-coral) mt-1"
                    >
                      {nameError.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={labelClass}
                    htmlFor={`additional.${idx}.dob`}
                  >
                    Date of Birth
                  </label>
                  <input
                    id={`additional.${idx}.dob`}
                    type="date"
                    {...register(`additional.${idx}.dob`, {
                      required: "Required",
                    })}
                    className={inputClass}
                    aria-invalid={dobError ? "true" : undefined}
                    aria-describedby={
                      dobError ? `additional.${idx}.dob-error` : undefined
                    }
                  />
                  {dobError && (
                    <p
                      id={`additional.${idx}.dob-error`}
                      className="text-xs text-(--color-coral) mt-1"
                    >
                      {dobError.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={labelClass}
                    htmlFor={`additional.${idx}.passportNo`}
                  >
                    Passport Number
                  </label>
                  <input
                    id={`additional.${idx}.passportNo`}
                    {...register(`additional.${idx}.passportNo`, {
                      required: "Required",
                    })}
                    className={`${inputClass} font-['JetBrains_Mono']`}
                    placeholder="A1234567"
                    aria-invalid={passportError ? "true" : undefined}
                    aria-describedby={
                      passportError
                        ? `additional.${idx}.passportNo-error`
                        : undefined
                    }
                  />
                  {passportError && (
                    <p
                      id={`additional.${idx}.passportNo-error`}
                      className="text-xs text-(--color-coral) mt-1"
                    >
                      {passportError.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {/* PAN Card — conditional */}
      {showPAN && (
        <div className="bg-(--color-gold)/5 border border-(--color-gold)/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-(--color-gold)" />
            <label
              className="font-['DM_Sans'] font-medium text-(--color-gold) text-sm"
              htmlFor="panCard"
            >
              PAN Card Number
            </label>
            <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary) ml-1">
              Required for bookings above ₹2,00,000
            </span>
          </div>
          <input
            id="panCard"
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
            aria-invalid={errors.panCard ? "true" : undefined}
            aria-describedby={errors.panCard ? "panCard-error" : undefined}
          />
          {errors.panCard && (
            <p id="panCard-error" className="text-xs text-(--color-coral) mt-1">
              {errors.panCard.message}
            </p>
          )}
        </div>
      )}

      {/* Dietary Requirements */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
        <h2 className="font-['DM_Sans'] font-medium text-white text-sm mb-3">
          Any dietary requirements?
        </h2>
        <div className="flex flex-wrap gap-3">
          {DIETARY_OPTIONS.map((option) => {
            const selected = dietaryRequirements.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleDietary(option)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50 ${
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
        <h2 className="font-['DM_Sans'] font-medium text-white text-sm mb-3">
          Anything else we should know?
        </h2>
        <textarea
          {...register("specialRequests")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Share any specific requirements, accessibility needs, or preferences..."
        />
      </div>

      {showProfilePrompt && (
        <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1 flex items-start gap-1.5">
          <Lightbulb
            size={14}
            className="text-(--color-gold) shrink-0 mt-0.5"
          />
          <span>
            Save your details to your profile for faster booking —{" "}
            <Link
              href="/profile?tab=personal"
              className="text-(--color-gold) hover:underline"
            >
              update profile
            </Link>
          </span>
        </p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50"
        >
          ← Back
        </button>
        <Button
          type="submit"
          variant="coral"
          className="flex-1 h-12 rounded-xl font-sans font-semibold"
        >
          Continue →
        </Button>
      </div>
    </form>
  );
}

// ── Step 3 — Review & Submit ──────────────────────────────────────────────────

function Step3({ pkg }: { pkg: BookingPackage }) {
  const {
    departureDate,
    adults,
    children,
    infants,
    baseAmount,
    gstAmount,
    dealDiscountAmount,
    couponDiscountAmount,
    totalAmount,
    setStep,
  } = useBookingStore();

  const [submitting, setSubmitting] = useState(false);

  const { adultTotal, childTotal, infantTotal, toursTotal } =
    calculateBookingBaseAmount(pkg, adults, children, infants);

  async function handleSubmit() {
    const store = useBookingStore.getState();
    if (!store.departureDate) {
      toast.error("Please select a departure date.");
      store.setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      // Stable per submission attempt — generated once, reused verbatim by
      // any retry of this same click/attempt so the server can dedupe.
      const idempotencyKey = store.ensureIdempotencyKey();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          departureDate: store.departureDate.toISOString(),
          adults: store.adults,
          children: store.children,
          infants: store.infants,
          occasion: store.occasion ?? undefined,
          dietaryRequirements: store.dietaryRequirements,
          specialRequests: store.specialRequests || undefined,
          couponCode: store.couponCode ?? undefined,
          dealId: store.dealId ?? undefined,
          travelers: store.travelerDetails,
          panCard: store.panCard ?? undefined,
          idempotencyKey,
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
    } catch (err) {
      // Surfaces the server's actual reason (e.g. a Deal that expired or no
      // longer applies) instead of a generic message — the user needs to
      // know why, not just that it failed.
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit request. Please try again.",
      );
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
        <h2 className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest text-(--color-gold) mb-4">
          Price Breakdown
        </h2>
        <div className="flex justify-between text-sm">
          <span className="font-['DM_Sans'] text-(--color-text-secondary)">
            Adults ({adults} × {formatPrice(pkg.pricePerPerson)})
          </span>
          <span className="font-['JetBrains_Mono'] text-white">
            {formatPrice(adultTotal)}
          </span>
        </div>
        {children > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Children ({children} × {formatPrice(pkg.childPrice ?? 0)})
            </span>
            <span className="font-['JetBrains_Mono'] text-white">
              {formatPrice(childTotal)}
            </span>
          </div>
        )}
        {infants > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Infants ({infants} × {formatPrice(pkg.infantPrice ?? 0)})
            </span>
            <span className="font-['JetBrains_Mono'] text-white">
              {formatPrice(infantTotal)}
            </span>
          </div>
        )}
        {pkg.toursPrice != null && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Tours &amp; Transfers
            </span>
            <span className="font-['JetBrains_Mono'] text-white">
              {formatPrice(toursTotal)}
            </span>
          </div>
        )}
        <Separator className="bg-(--color-navy-border) my-2" />
        <div className="flex justify-between text-sm">
          <span className="font-['DM_Sans'] text-(--color-text-secondary)">
            Subtotal
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
        {dealDiscountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Deal discount
            </span>
            <span className="font-['DM_Sans'] text-(--color-coral)">
              −{formatPrice(dealDiscountAmount)}
            </span>
          </div>
        )}
        {couponDiscountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-['DM_Sans'] text-(--color-text-secondary)">
              Coupon discount
            </span>
            <span className="font-['DM_Sans'] text-(--color-coral)">
              −{formatPrice(couponDiscountAmount)}
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
          Our team will review your request and reach out via WhatsApp to
          confirm availability and finalize your quote.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="px-6 py-3 rounded-xl border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors mt-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--color-gold)/50"
      >
        ← Back
      </button>

      <Button
        type="button"
        variant="coral"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-12 rounded-xl font-sans font-semibold mt-6"
      >
        {submitting ? "Submitting…" : "Submit Booking Request"}
      </Button>
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
        We&apos;ll WhatsApp you to confirm your trip.
      </p>

      {/* Status timeline */}
      <div className="mt-10 max-w-lg mx-auto w-full flex items-center overflow-x-auto">
        <span className="font-['DM_Sans'] text-sm text-(--color-teal) whitespace-nowrap inline-flex items-center gap-1.5">
          Enquiry Received
          <Check size={14} />
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
        <Button
          variant="outline-gold"
          className="h-auto px-6 py-3 rounded-xl font-sans"
          asChild
        >
          <Link href="/bookings">View My Bookings</Link>
        </Button>
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
  const { packageId: slug } = use(params);
  const { data: pkgData, isLoading, isError } = usePackage(slug);
  const searchParams = useSearchParams();
  const { data: dealsData } = useDeals();

  const { currentStep } = useBookingStore();

  const pkg: BookingPackage | undefined = pkgData?.data
    ? ({
        ...pkgData.data,
        createdAt: new Date(pkgData.data.createdAt),
        updatedAt: new Date(pkgData.data.updatedAt),
      } as BookingPackage)
    : undefined;

  const prevPkgIdRef = useRef<string | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: must only re-run when the package identity changes, not on every re-render's new pkg object
  useEffect(() => {
    if (!pkg) return;
    if (prevPkgIdRef.current !== undefined && prevPkgIdRef.current !== pkg.id) {
      // A different Journey was opened via client-side navigation — the
      // wizard's zustand store is a module-level singleton and would
      // otherwise leak the previous Journey's step/travelers/bookingRef.
      useBookingStore.getState().reset();
    }
    prevPkgIdRef.current = pkg.id;

    const state = useBookingStore.getState();
    const { baseAmount } = calculateBookingBaseAmount(
      pkg,
      state.adults,
      state.children,
      state.infants,
    );
    state.updateAmounts(baseAmount);
  }, [pkg?.id]);

  // Resolve a ?deal=<id> query param (carried over from the package page)
  // against the deal list — /api/deals already excludes deals for packages
  // that have an existing discount, so any match here is display-eligible.
  // The server independently re-verifies the deal at submission time; this
  // is only what drives the wizard's displayed numbers.
  useEffect(() => {
    if (!pkg) return;
    const dealId = searchParams.get("deal");
    if (!dealId) return;
    const deal = (dealsData?.data ?? []).find(
      (d) => d.id === dealId && d.packageId === pkg.id,
    );
    if (deal) {
      useBookingStore
        .getState()
        .setDeal({ id: deal.id, discountPct: deal.discountPct });
    }
  }, [pkg, searchParams, dealsData]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-navy) pt-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 text-center text-(--color-text-secondary)">
          Loading package details…
        </div>
      </main>
    );
  }

  if (isError || !pkg) {
    return (
      <main className="min-h-screen bg-(--color-navy) pt-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 text-center text-(--color-text-secondary)">
          Package not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {currentStep !== 4 && (
          <h1 className="sr-only">{STEP_LABELS[currentStep - 1]}</h1>
        )}
        <StepIndicator current={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            {currentStep === 1 && <Step1 pkg={pkg} />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 pkg={pkg} />}
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
