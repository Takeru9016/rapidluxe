import { useQuery } from "@tanstack/react-query";

export interface PackageFilterDestination {
  id: string;
  name: string;
  country: string;
  slug: string;
}

export interface PackageFiltersResponse {
  destinations: PackageFilterDestination[];
  priceRange: { min: number; max: number };
  durations: number[];
  tags: string[];
}

export function usePackageFilters() {
  return useQuery<PackageFiltersResponse>({
    queryKey: ["package-filters"],
    queryFn: async () => {
      const res = await fetch("/api/packages/filters");
      if (!res.ok) throw new Error("Failed to fetch package filters");
      return res.json() as Promise<PackageFiltersResponse>;
    },
  });
}
