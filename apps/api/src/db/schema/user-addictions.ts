import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
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

export const userAddictions = pgTable(
  "user_addictions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    severityScore: integer("severity_score").notNull(),
    baselineUsage: bytea("baseline_usage"),
    currentGoal: bytea("current_goal"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "valid_category",
      sql`${table.category} IN ('social_media','pornography','gaming','shopping')`,
    ),
    check(
      "valid_severity",
      sql`${table.severityScore} BETWEEN 1 AND 10`,
    ),
  ],
);
