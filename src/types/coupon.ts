export type CouponType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
}
