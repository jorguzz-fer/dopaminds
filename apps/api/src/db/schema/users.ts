import {
  pgTable,
  uuid,
  timestamp,
  boolean,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  anonymous: boolean("anonymous").notNull().default(true),
  onboardingDone: boolean("onboarding_done").notNull().default(false),
  currentPhase: integer("current_phase").notNull().default(1),
  streakDays: integer("streak_days").notNull().default(0),
  lastCheckIn: timestamp("last_check_in", { withTimezone: true }),
  timezone: text("timezone"),
});
