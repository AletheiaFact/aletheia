import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
    jsonb,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// content_ids are sentence ids in display order (the Mongo `content` array).
export const paragraph = pgTable(
    "paragraph",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        type: text("type").notNull().default("paragraph"),
        dataHash: text("data_hash").notNull(),
        props: jsonb("props")
            .$type<Record<string, any>>()
            .notNull()
            .default({}),
        contentIds: uuid("content_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        claimRevisionId: uuid("claim_revision_id").notNull(),
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
        uniqueIndex("paragraph_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("paragraph_data_hash_idx").on(t.dataHash),
        index("paragraph_claim_revision_id_idx").on(t.claimRevisionId),
        index("paragraph_content_ids_idx").using("gin", t.contentIds),
    ]
);

export type ParagraphRow = typeof paragraph.$inferSelect;
export type ParagraphInsert = typeof paragraph.$inferInsert;
