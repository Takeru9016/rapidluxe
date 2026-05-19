"use client";

import { create } from "zustand";
import type { BookingStep, TravelerDetail } from "@/types/booking";
import type { Coupon } from "@/types/coupon";

interface BookingStore {
  currentStep: BookingStep;
  packageId: string | null;
  departureDate: Date | null;
  adults: number;
  children: number;
  infants: number;
  travelerDetails: TravelerDetail[];
  specialRequests: string;
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode: string | null;
  appliedCoupon: Coupon | null;
  bookingId: string | null;
  bookingRef: string | null;

  setStep: (step: BookingStep) => void;
  setPackage: (packageId: string, baseAmount: number) => void;
  setDates: (departureDate: Date) => void;
  setTravelers: (adults: number, children: number, infants: number) => void;
  setTravelerDetails: (details: TravelerDetail[]) => void;
  setSpecialRequests: (requests: string) => void;
  setCoupon: (
    code: string | null,
    coupon: Coupon | null,
    discountAmount: number,
  ) => void;
  setBookingResult: (bookingId: string, bookingRef: string) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  currentStep: 1 as BookingStep,
  packageId: null,
  departureDate: null,
  adults: 2,
  children: 0,
  infants: 0,
  travelerDetails: [],
  specialRequests: "",
  baseAmount: 0,
  gstAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  couponCode: null,
  appliedCoupon: null,
  bookingId: null,
  bookingRef: null,
};

function computeTotals(base: number, discount: number) {
  const gst = Math.round(base * 0.05 * 100) / 100;
  const total = Math.round((base + gst - discount) * 100) / 100;
  return { gstAmount: gst, totalAmount: total };
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  ...DEFAULT_STATE,

  setStep: (step) => set({ currentStep: step }),

  setPackage: (packageId, baseAmount) =>
    set({
      packageId,
      baseAmount,
      ...computeTotals(baseAmount, get().discountAmount),
    }),

  setDates: (departureDate) => set({ departureDate }),

  setTravelers: (adults, children, infants) =>
    set({ adults, children, infants }),

  setTravelerDetails: (details) => set({ travelerDetails: details }),

  setSpecialRequests: (requests) => set({ specialRequests: requests }),

  setCoupon: (code, coupon, discountAmount) => {
    const { baseAmount } = get();
    set({
      couponCode: code,
      appliedCoupon: coupon,
      discountAmount,
      ...computeTotals(baseAmount, discountAmount),
    });
  },

  setBookingResult: (bookingId, bookingRef) => set({ bookingId, bookingRef }),

  reset: () => set(DEFAULT_STATE),
}));
