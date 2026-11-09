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

// Named content_group because `group` is a reserved word. content_ids are
// verification_request ids, target_id is a claim id (Phase 2); no FKs per D3.
export const contentGroup = pgTable(
    "content_group",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        contentIds: uuid("content_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        targetId: uuid("target_id"),
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
        uniqueIndex("content_group_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("content_group_content_ids_idx").using("gin", t.contentIds),
        index("content_group_target_id_idx").on(t.targetId),
    ]
);

export type ContentGroupRow = typeof contentGroup.$inferSelect;
export type ContentGroupInsert = typeof contentGroup.$inferInsert;
