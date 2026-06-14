import { useQuery } from "@tanstack/react-query";
import type { CurrencyRates } from "@/app/api/currency/route";

export type { CurrencyRates };

export function useCurrencyRates() {
  return useQuery<{ data: CurrencyRates }>({
    queryKey: ["currency-rates"],
    queryFn: async () => {
      const res = await fetch("/api/currency");
      if (!res.ok)
        return { data: { USD: 0.012, GBP: 0.0094, AED: 0.044, EUR: 0.011 } };
      return res.json() as Promise<{ data: CurrencyRates }>;
    },
    staleTime: 86400 * 1000,
  });
}
