import { useQuery } from "@tanstack/react-query";

import type { DealType } from "@/types/deal";
import type { Destination } from "@/types/destination";
import type { Package } from "@/types/package";

export interface ApiDeal {
  id: string;
  packageId: string;
  type: DealType;
  discountPct: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  package: Omit<Package, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    destination: Omit<Destination, "createdAt"> & { createdAt: string };
  };
}

export function useDeals() {
  return useQuery<{ data: ApiDeal[] }>({
    queryKey: ["deals"],
    queryFn: async () => {
      const res = await fetch("/api/deals");
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json() as Promise<{ data: ApiDeal[] }>;
    },
  });
}
