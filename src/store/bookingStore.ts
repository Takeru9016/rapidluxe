"use client";

import { create } from "zustand";
import { calculateBookingFinancials } from "@/lib/utils";
import type { TravelerDetail } from "@/types/booking";
import type { Coupon } from "@/types/coupon";

interface AppliedDeal {
  id: string;
  discountPct: number;
}

interface BookingStore {
  currentStep: 1 | 2 | 3 | 4;
  packageId: string | null;
  // Step 1
  adults: number;
  children: number;
  infants: number;
  occasion: string | null;
  dateMode: "exact" | "flexible";
  departureDate: Date | null;
  returnDate: Date | null;
  flexibleDuration: 7 | 14 | 21 | null;
  flexibleMonths: string[];
  couponCode: string | null;
  appliedCoupon: Coupon | null;
  dealId: string | null;
  appliedDeal: AppliedDeal | null;
  // Step 2
  travelerDetails: TravelerDetail[];
  dietaryRequirements: string[];
  panCard: string | null;
  specialRequests: string;
  // Amounts
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  dealDiscountAmount: number;
  couponDiscountAmount: number;
  totalAmount: number;
  // Result
  bookingId: string | null;
  bookingRef: string | null;
  // Idempotency — one stable key per Step 3 submission attempt
  idempotencyKey: string | null;
  // Actions
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setTravelers: (adults: number, children: number, infants: number) => void;
  setOccasion: (occasion: string) => void;
  setDateMode: (mode: "exact" | "flexible") => void;
  setExactDates: (departure: Date, returnDate: Date) => void;
  setFlexibleOptions: (duration: 7 | 14 | 21 | null, months: string[]) => void;
  setTravelerDetails: (details: TravelerDetail[]) => void;
  setDietaryRequirements: (requirements: string[]) => void;
  setPanCard: (pan: string) => void;
  setSpecialRequests: (requests: string) => void;
  setDeal: (deal: AppliedDeal | null) => void;
  setCoupon: (code: string | null, coupon: Coupon | null) => void;
  updateAmounts: (base: number) => void;
  setBookingResult: (bookingId: string, bookingRef: string) => void;
  /** Returns the current attempt's idempotency key, generating and storing
   *  one on first call so retries of the same submission reuse it. */
  ensureIdempotencyKey: () => string;
  reset: () => void;
}

const DEFAULT_STATE = {
  currentStep: 1 as 1 | 2 | 3 | 4,
  packageId: null,
  adults: 2,
  children: 0,
  infants: 0,
  occasion: null,
  dateMode: "exact" as "exact" | "flexible",
  departureDate: null,
  returnDate: null,
  flexibleDuration: null as 7 | 14 | 21 | null,
  flexibleMonths: [] as string[],
  couponCode: null,
  appliedCoupon: null,
  dealId: null,
  appliedDeal: null as AppliedDeal | null,
  travelerDetails: [] as TravelerDetail[],
  dietaryRequirements: [] as string[],
  panCard: null,
  specialRequests: "",
  baseAmount: 0,
  gstAmount: 0,
  discountAmount: 0,
  dealDiscountAmount: 0,
  couponDiscountAmount: 0,
  totalAmount: 0,
  bookingId: null,
  bookingRef: null,
  idempotencyKey: null,
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  ...DEFAULT_STATE,

  setStep: (step) => set({ currentStep: step }),

  setTravelers: (adults, children, infants) => {
    // Traveler count changing invalidates any applied coupon's amount (it
    // was validated as a rupee figure against the old subtotal) — clear it
    // rather than showing a now-wrong number; the Deal recomputes exactly
    // since it's a percentage of whatever the new subtotal is.
    set({
      adults,
      children,
      infants: Math.min(infants, adults),
      couponCode: null,
      appliedCoupon: null,
      couponDiscountAmount: 0,
    });
  },

  setOccasion: (occasion) => set({ occasion }),

  setDateMode: (mode) => set({ dateMode: mode }),

  setExactDates: (departure, returnDate) =>
    set({ departureDate: departure, returnDate }),

  setFlexibleOptions: (duration, months) =>
    set({ flexibleDuration: duration, flexibleMonths: months }),

  setTravelerDetails: (details) => set({ travelerDetails: details }),

  setDietaryRequirements: (requirements) =>
    set({ dietaryRequirements: requirements }),

  setPanCard: (pan) => set({ panCard: pan }),

  setSpecialRequests: (requests) => set({ specialRequests: requests }),

  setDeal: (deal) => {
    const { baseAmount, appliedCoupon } = get();
    const financials = calculateBookingFinancials(
      baseAmount,
      deal?.discountPct ?? 0,
      appliedCoupon
        ? {
            discountType: appliedCoupon.discountType,
            discountValue: appliedCoupon.discountValue,
          }
        : null,
    );
    set({
      dealId: deal?.id ?? null,
      appliedDeal: deal,
      dealDiscountAmount: financials.dealDiscountAmount,
      couponDiscountAmount: financials.couponDiscountAmount,
      discountAmount:
        financials.dealDiscountAmount + financials.couponDiscountAmount,
      gstAmount: financials.gstAmount,
      totalAmount: financials.totalAmount,
    });
  },

  setCoupon: (code, coupon) => {
    const { baseAmount, appliedDeal } = get();
    const financials = calculateBookingFinancials(
      baseAmount,
      appliedDeal?.discountPct ?? 0,
      coupon
        ? {
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
          }
        : null,
    );
    set({
      couponCode: code,
      appliedCoupon: coupon,
      dealDiscountAmount: financials.dealDiscountAmount,
      couponDiscountAmount: financials.couponDiscountAmount,
      discountAmount:
        financials.dealDiscountAmount + financials.couponDiscountAmount,
      gstAmount: financials.gstAmount,
      totalAmount: financials.totalAmount,
    });
  },

  updateAmounts: (base) => {
    const { appliedDeal, appliedCoupon } = get();
    const financials = calculateBookingFinancials(
      base,
      appliedDeal?.discountPct ?? 0,
      appliedCoupon
        ? {
            discountType: appliedCoupon.discountType,
            discountValue: appliedCoupon.discountValue,
          }
        : null,
    );
    set({
      baseAmount: base,
      dealDiscountAmount: financials.dealDiscountAmount,
      couponDiscountAmount: financials.couponDiscountAmount,
      discountAmount:
        financials.dealDiscountAmount + financials.couponDiscountAmount,
      gstAmount: financials.gstAmount,
      totalAmount: financials.totalAmount,
    });
  },

  setBookingResult: (bookingId, bookingRef) => {
    // The attempt this key represented is now complete — clear it so any
    // future submission (a different enquiry) gets its own fresh key.
    set({ bookingId, bookingRef, idempotencyKey: null });
  },

  ensureIdempotencyKey: () => {
    const existing = get().idempotencyKey;
    if (existing) return existing;
    const key = crypto.randomUUID();
    set({ idempotencyKey: key });
    return key;
  },

  reset: () => set(DEFAULT_STATE),
}));
