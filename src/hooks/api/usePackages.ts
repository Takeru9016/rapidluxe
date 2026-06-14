import { useQuery } from "@tanstack/react-query";

import type { Package } from "@/types/package";

export interface ApiPackage extends Omit<Package, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
  destination?: {
    name: string;
    slug: string;
    country?: string;
    continent?: string;
  } | null;
}

export interface ApiPackageDetail extends ApiPackage {
  destination: {
    name: string;
    slug: string;
    country: string;
    continent: string;
    lat?: number | null;
    lng?: number | null;
  } | null;
  _count: { reviews: number };
}

interface PackagesResponse {
  data: ApiPackage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PackagesQuery {
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: number;
  tags?: string[];
  sort?:
    | "price_asc"
    | "price_desc"
    | "duration_asc"
    | "duration_desc"
    | "featured";
  page?: number;
  limit?: number;
}

function buildUrl(filters: PackagesQuery): string {
  const params = new URLSearchParams();
  if (filters.destination) params.set("destination", filters.destination);
  if (filters.priceMin !== undefined)
    params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== undefined)
    params.set("priceMax", String(filters.priceMax));
  if (filters.duration !== undefined)
    params.set("duration", String(filters.duration));
  filters.tags?.forEach((t) => params.append("tags", t));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return `/api/packages${qs ? `?${qs}` : ""}`;
}

export function usePackages(filters: PackagesQuery = {}) {
  return useQuery<PackagesResponse>({
    queryKey: ["packages", filters],
    queryFn: async () => {
      const res = await fetch(buildUrl(filters));
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json() as Promise<PackagesResponse>;
    },
  });
}

export function usePackage(slug: string) {
  return useQuery<{ data: ApiPackageDetail }>({
    queryKey: ["package", slug],
    queryFn: async () => {
      const res = await fetch(`/api/packages/${slug}`);
      if (!res.ok) throw new Error("Package not found");
      return res.json() as Promise<{ data: ApiPackageDetail }>;
    },
    enabled: !!slug,
  });
}

export interface LiveHotel {
  name: string;
  stars: number;
  rating: number;
  price: number;
  imageUrl: string;
  location: string;
}

export function usePackageHotels(slug: string) {
  return useQuery<{ data: LiveHotel[] }>({
    queryKey: ["package-hotels", slug],
    queryFn: async () => {
      const res = await fetch(`/api/packages/${slug}/hotels`);
      if (!res.ok) return { data: [] };
      return res.json() as Promise<{ data: LiveHotel[] }>;
    },
    enabled: !!slug,
  });
}
