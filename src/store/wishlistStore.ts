"use client";

import { create } from "zustand";

interface WishlistStore {
  ids: string[];
  count: number;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: [],
  count: 0,
  toggle: (id) =>
    set((state) => {
      const next =
        state.ids.includes(id) ?
          state.ids.filter((i) => i !== id)
        : [...state.ids, id];
      return { ids: next, count: next.length };
    }),
  has: (id) => get().ids.includes(id),
}));
