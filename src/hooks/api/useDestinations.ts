import { useQuery } from "@tanstack/react-query";

import type {
  Continent,
  Destination,
  MonthlyWeather,
} from "@/types/destination";

export interface ApiDestination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  imageUrl: string | null;
  description: string | null;
  bestMonths: string[];
  _count: { packages: number };
}

export type ApiDestinationDetail = Omit<Destination, "createdAt"> & {
  createdAt: string;
};

export function useDestinations(continent?: Continent) {
  return useQuery<{ data: ApiDestination[] }>({
    queryKey: ["destinations", continent ?? null],
    queryFn: async () => {
      const qs = continent ? `?continent=${continent}` : "";
      const res = await fetch(`/api/destinations${qs}`);
      if (!res.ok) throw new Error("Failed to fetch destinations");
      return res.json() as Promise<{ data: ApiDestination[] }>;
    },
  });
}

export function useDestination(slug: string) {
  return useQuery<{ data: ApiDestinationDetail }>({
    queryKey: ["destination", slug],
    queryFn: async () => {
      const res = await fetch(`/api/destinations/${slug}`);
      if (!res.ok) throw new Error("Destination not found");
      return res.json() as Promise<{ data: ApiDestinationDetail }>;
    },
    enabled: !!slug,
  });
}

export function useDestinationWeather(slug: string) {
  return useQuery<{ data: MonthlyWeather[] }>({
    queryKey: ["destination-weather", slug],
    queryFn: async () => {
      const res = await fetch(`/api/destinations/${slug}/weather`);
      if (!res.ok) return { data: [] };
      return res.json() as Promise<{ data: MonthlyWeather[] }>;
    },
    enabled: !!slug,
  });
}

export interface LiveActivity {
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  currency: string;
}

export function useDestinationActivities(slug: string) {
  return useQuery<{ data: LiveActivity[] }>({
    queryKey: ["destination-activities", slug],
    queryFn: async () => {
      const res = await fetch(`/api/destinations/${slug}/activities`);
      if (!res.ok) return { data: [] };
      return res.json() as Promise<{ data: LiveActivity[] }>;
    },
    enabled: !!slug,
  });
}
