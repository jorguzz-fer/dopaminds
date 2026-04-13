import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const educationProgress = pgTable(
  "education_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
    quizScore: integer("quiz_score"),
  },
  (table) => [
    unique("education_progress_user_lesson").on(table.userId, table.lessonId),
  ],
);
