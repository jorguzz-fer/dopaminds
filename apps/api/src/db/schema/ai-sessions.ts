import {
  pgTable,
  uuid,
  text,
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

export const aiSessions = pgTable(
  "ai_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    context: text("context").notNull(),
    messages: bytea("messages").notNull(),
    outcome: bytea("outcome"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
  },
  (table) => [
    check(
      "valid_context",
      sql`${table.context} IN ('urge','checkin','education','crisis')`,
    ),
  ],
);
