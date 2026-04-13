export interface DailyCheckin {
  id: string;
  userId: string;
  date: string;
  moodScore: number;
  urgeLevel: number;
  urgeTriggers: string[] | null;
  healthyActivities: string[] | null;
  relapse: boolean;
  relapseDuration: number | null;
  reflection: string | null;
  phase: number;
}

export interface RestorationLog {
  id: string;
  userId: string;
  date: string;
  exerciseMinutes: number;
  sleepHours: number | null;
  meditationMinutes: number;
  sunlightMinutes: number;
  socialConnection: boolean;
  coldExposure: boolean;
}

export type UrgeTrigger =
  | "boredom"
  | "stress"
  | "loneliness"
  | "social"
  | "nighttime"
  | "morning"
  | "weekend"
  | "work"
  | "anxiety"
  | "sadness";
