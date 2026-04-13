export interface EducationProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: Date;
  quizScore: number | null;
}

export interface AiSession {
  id: string;
  userId: string;
  startedAt: Date;
  context: AiSessionContext;
  messages: AiMessage[];
  outcome: string | null;
}

export type AiSessionContext = "urge" | "checkin" | "education" | "crisis";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
