import {
  pgTable,
  uuid,
  text,
  integer,
  doublePrecision,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";

const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(1536)";
  },
});

export const collectiveInsights = pgTable("collective_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  insightType: text("insight_type").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding"),
  sampleSize: integer("sample_size").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
