"use client";

import { create } from "zustand";

interface SearchFilters {
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: number[];
  tags?: string[];
  type?: string;
}

interface SearchStore {
  query: string;
  filters: SearchFilters;
  sort: string;
  setQuery: (q: string) => void;
  setFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  resetFilters: () => void;
  setSort: (sort: string) => void;
}

const DEFAULT_FILTERS: SearchFilters = {};

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  filters: DEFAULT_FILTERS,
  sort: "popular",
  setQuery: (q) => set({ query: q }),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS, query: "" }),
  setSort: (sort) => set({ sort }),
}));
