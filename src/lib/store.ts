import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post, Inquiry, Platform, Category, PostStatus, Settings } from "./db";

export type { Post, Inquiry, Platform, Category, PostStatus, Settings };

export const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export const categories: Category[] = ["Weddings", "Corporate", "Concerts", "Lighting", "LED Walls", "Stage Design"];

type State = {
  auth: { email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      auth: null,
      login: (email, password) => {
        if (email && password.length >= 4) {
          set({ auth: { email } });
          return true;
        }
        return false;
      },
      logout: () => set({ auth: null }),
    }),
    { name: "rentmyevent-store" },
  ),
);
