import type { Coupon } from "@/types/coupon";

export const dummyCoupons: Coupon[] = [
  {
    id: "coupon-welcome20",
    code: "WELCOME20",
    discountType: "PERCENT",
    discountValue: 20,
    minAmount: 50000,
    maxUses: 500,
    usedCount: 87,
    expiresAt: "2025-12-31",
    isActive: true,
  },
  {
    id: "coupon-honeymoon15",
    code: "HONEYMOON15",
    discountType: "PERCENT",
    discountValue: 15,
    minAmount: 100000,
    maxUses: 200,
    usedCount: 43,
    expiresAt: "2025-12-31",
    isActive: true,
  },
  {
    id: "coupon-flat5000",
    code: "FLAT5000",
    discountType: "FIXED",
    discountValue: 5000,
    minAmount: 75000,
    maxUses: 1000,
    usedCount: 212,
    expiresAt: "2025-09-30",
    isActive: true,
  },
];
