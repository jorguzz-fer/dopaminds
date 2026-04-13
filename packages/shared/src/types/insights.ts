export interface CollectiveInsight {
  id: string;
  category: string;
  insightType: InsightType;
  content: string;
  sampleSize: number;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsightType = "trigger_pattern" | "activity_efficacy" | "phase_risk";
