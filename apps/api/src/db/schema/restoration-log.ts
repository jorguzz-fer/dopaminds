import {
  pgTable,
  uuid,
  date,
  integer,
  boolean,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const restorationLog = pgTable(
  "restoration_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    exerciseMinutes: integer("exercise_minutes").default(0),
    sleepHours: doublePrecision("sleep_hours"),
    meditationMinutes: integer("meditation_minutes").default(0),
    sunlightMinutes: integer("sunlight_minutes").default(0),
    socialConnection: boolean("social_connection").default(false),
    coldExposure: boolean("cold_exposure").default(false),
  },
  (table) => [
    unique("restoration_log_user_date").on(table.userId, table.date),
  ],
);
