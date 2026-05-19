"use client";

import { create } from "zustand";

interface UIStore {
  mobileMenuOpen: boolean;
  activeModal: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  activeModal: null,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
