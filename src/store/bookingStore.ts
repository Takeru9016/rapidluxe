"use client";

import { create } from "zustand";
import { calculateGST } from "@/lib/utils";
import type { TravelerDetail } from "@/types/booking";
import type { Coupon } from "@/types/coupon";

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
  // Step 2
  travelerDetails: TravelerDetail[];
  dietaryRequirements: string[];
  panCard: string | null;
  specialRequests: string;
  // Amounts
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
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
  setCoupon: (
    code: string | null,
    coupon: Coupon | null,
    discount: number,
  ) => void;
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
  travelerDetails: [] as TravelerDetail[],
  dietaryRequirements: [] as string[],
  panCard: null,
  specialRequests: "",
  baseAmount: 0,
  gstAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  bookingId: null,
  bookingRef: null,
  idempotencyKey: null,
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  ...DEFAULT_STATE,

  setStep: (step) => set({ currentStep: step }),

  setTravelers: (adults, children, infants) =>
    set({ adults, children, infants: Math.min(infants, adults) }),

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

  setCoupon: (code, coupon, discount) => {
    const { baseAmount } = get();
    const { gst, total } = calculateGST(baseAmount - discount);
    set({
      couponCode: code,
      appliedCoupon: coupon,
      discountAmount: discount,
      gstAmount: gst,
      totalAmount: total,
    });
  },

  updateAmounts: (base) => {
    const { discountAmount } = get();
    const { gst, total } = calculateGST(base - discountAmount);
    set({ baseAmount: base, gstAmount: gst, totalAmount: total });
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
