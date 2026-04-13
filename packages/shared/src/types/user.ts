export interface User {
  id: string;
  createdAt: Date;
  anonymous: boolean;
  onboardingDone: boolean;
  currentPhase: number;
  streakDays: number;
  lastCheckIn: Date | null;
  timezone: string | null;
}

export interface UserAddiction {
  id: string;
  userId: string;
  category: AddictionCategory;
  severityScore: number;
  baselineUsage: Record<string, unknown> | null;
  currentGoal: Record<string, unknown> | null;
  startedAt: Date;
}

export type AddictionCategory = "social_media" | "pornography" | "gaming" | "shopping";
