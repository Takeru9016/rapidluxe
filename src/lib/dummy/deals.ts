import type { Deal } from "@/types/deal";

export const dummyDeals: Deal[] = [
  {
    id: "deal-flash-bali",
    packageId: "pkg-bali",
    type: "FLASH_SALE",
    discountPct: 20,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: "deal-flash-dubai",
    packageId: "pkg-dubai",
    type: "FLASH_SALE",
    discountPct: 15,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: "deal-early-maldives",
    packageId: "pkg-maldives",
    type: "EARLY_BIRD",
    discountPct: 25,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: "deal-last-kerala",
    packageId: "pkg-kerala",
    type: "LAST_MINUTE",
    discountPct: 30,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];
