export type DealType = "FLASH_SALE" | "EARLY_BIRD" | "LAST_MINUTE" | "SEASONAL";

export interface Deal {
  id: string;
  packageId: string;
  type: DealType;
  discountPct: number;
  expiresAt: Date;
  isActive: boolean;
}
