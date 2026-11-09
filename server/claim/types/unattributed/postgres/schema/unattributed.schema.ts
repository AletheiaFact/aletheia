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

// content_ids are paragraph ids in display order. The Mongo schema carries no
// claim_revision_id for this type (the parser never sets one).
export const unattributed = pgTable(
    "unattributed",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        type: text("type").notNull().default("unattributed"),
        contentIds: uuid("content_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
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
        uniqueIndex("unattributed_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("unattributed_content_ids_idx").using("gin", t.contentIds),
    ]
);

export type UnattributedRow = typeof unattributed.$inferSelect;
export type UnattributedInsert = typeof unattributed.$inferInsert;
