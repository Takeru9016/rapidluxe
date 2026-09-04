import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateGST(amount: number): {
  base: number;
  gst: number;
  total: number;
} {
  const gst = Math.round(amount * 0.05 * 100) / 100;
  const total = Math.round(amount * 1.05 * 100) / 100;
  return { base: amount, gst, total };
}

// The authoritative "what will/did this booking actually charge" figure.
// totalAmount is fixed at enquiry time and never updated afterward; once an
// admin sends a quote, quotedAmount (GST-inclusive via calculateGST) is what
// /api/payments/create-order actually bills — so it must take priority over
// totalAmount wherever a booking's charged amount is displayed.
export function chargedTotal(b: {
  totalAmount: number;
  quotedAmount: number | null;
}): number {
  return b.quotedAmount != null
    ? calculateGST(b.quotedAmount).total
    : b.totalAmount;
}

export interface PackagePricing {
  pricePerPerson: number;
  childPrice?: number | null;
  infantPrice?: number | null;
  toursPrice?: number | null;
}

export interface BookingPriceBreakdown {
  adultTotal: number;
  childTotal: number;
  infantTotal: number;
  toursTotal: number;
  baseAmount: number;
}

export function calculateBookingBaseAmount(
  pkg: PackagePricing,
  adults: number,
  children: number,
  infants: number,
): BookingPriceBreakdown {
  const adultTotal = pkg.pricePerPerson * adults;
  const childTotal = (pkg.childPrice ?? 0) * children;
  const infantTotal = (pkg.infantPrice ?? 0) * infants;
  const toursTotal = (pkg.toursPrice ?? 0) * (adults + children);
  return {
    adultTotal,
    childTotal,
    infantTotal,
    toursTotal,
    baseAmount: adultTotal + childTotal + infantTotal + toursTotal,
  };
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
}

// Matches what generateSlug() actually produces (including the multi-hyphen
// runs it leaves behind, e.g. "switzerland--south-of-france" from a
// stripped "&") — lowercase alphanumeric segments joined by one or more
// hyphens, no leading/trailing hyphen, no other characters.
export const SLUG_PATTERN = /^[a-z0-9]+(-+[a-z0-9]+)*$/;

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  start: Date | string,
  end: Date | string,
): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    const startDay = s.toLocaleDateString("en-IN", { day: "numeric" });
    const endFull = e.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${startDay}–${endFull}`;
  }

  const startFull = s.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const endFull = e.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startFull}–${endFull}`;
}

export function calculateDiscount(
  originalPrice: number,
  currentPrice: number,
): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function getDaysUntil(date: Date | string): number {
  return Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

export function truncate(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength).trimEnd() + "...";
  }
  return text;
}

export function requiresPAN(totalAmount: number): boolean {
  return totalAmount > 200000;
}
