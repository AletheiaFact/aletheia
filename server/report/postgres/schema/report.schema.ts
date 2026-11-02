import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Global (no nameSpace on the Mongo schema). user_id → users (Phase 4), no FK
// per D3. The Mongo `usersId` prop is a single ObjectId despite its name.
export const report = pgTable(
    "report",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        dataHash: text("data_hash").notNull(),
        reportModel: text("report_model").notNull(),
        userId: uuid("user_id"),
        summary: text("summary").notNull(),
        questions: text("questions")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        report: text("report"),
        verification: text("verification"),
        sources: text("sources")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        classification: text("classification").notNull(),
        isDeleted: boolean("is_deleted").notNull().default(false),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        uniqueIndex("report_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("report_data_hash_idx").on(t.dataHash),
        index("report_user_id_idx").on(t.userId),
    ]
);

export type ReportRow = typeof report.$inferSelect;
export type ReportInsert = typeof report.$inferInsert;
