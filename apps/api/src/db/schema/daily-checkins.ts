import {
  pgTable,
  uuid,
  date,
  integer,
  boolean,
  text,
  unique,
  customType,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    moodScore: integer("mood_score").notNull(),
    urgeLevel: integer("urge_level").notNull(),
    urgeTriggers: bytea("urge_triggers"),
    urgeTriggersHmac: text("urge_triggers_hmac"),
    healthyActivities: bytea("healthy_activities"),
    relapse: boolean("relapse").notNull().default(false),
    relapseDuration: integer("relapse_duration"),
    reflection: bytea("reflection"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
    phase: integer("phase").notNull(),
  },
  (table) => [
    unique("daily_checkins_user_date").on(table.userId, table.date),
    check("valid_mood", sql`${table.moodScore} BETWEEN 1 AND 5`),
    check("valid_urge", sql`${table.urgeLevel} BETWEEN 1 AND 10`),
  ],
);
