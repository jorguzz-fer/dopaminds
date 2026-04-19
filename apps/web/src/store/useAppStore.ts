import { create } from "zustand";
import { apiFetch } from "../lib/api";
import type { AddictionCategory } from "@dopamind/shared";

export interface UserAddictionProfile {
  id: string;
  category: AddictionCategory;
  severityScore: number;
  baselineUsage: Record<string, unknown> | null;
  currentGoal: Record<string, unknown> | null;
  startedAt: string;
}

export interface UserProfile {
  id: string;
  anonymous: boolean;
  onboardingDone: boolean;
  currentPhase: number;
  streakDays: number;
  lastCheckIn: string | null;
  timezone: string | null;
  addictions: UserAddictionProfile[];
}

interface AppState {
  user: UserProfile | null;
  isLoadingUser: boolean;
  setUser: (user: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoadingUser: true,

  setUser: (user) => set({ user }),

  refreshUser: async () => {
    set({ isLoadingUser: true });
    try {
      const profile = await apiFetch<UserProfile>("/api/me");
      set({ user: profile, isLoadingUser: false });
    } catch {
      set({ user: null, isLoadingUser: false });
    }
  },
}));
