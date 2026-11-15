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

// Global (the Mongo schema has no nameSpace). claim_revision_id is null for
// images uploaded outside a claim (badge, organization logo).
export const image = pgTable(
    "image",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        type: text("type").notNull().default("Image"),
        dataHash: text("data_hash").notNull(),
        props: jsonb("props")
            .$type<Record<string, any>>()
            .notNull()
            .default({}),
        content: text("content").notNull(),
        topics: jsonb("topics").$type<any[]>(),
        claimRevisionId: uuid("claim_revision_id"),
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
        uniqueIndex("image_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("image_data_hash_idx").on(t.dataHash),
        index("image_claim_revision_id_idx").on(t.claimRevisionId),
        index("image_topics_idx").using("gin", t.topics),
    ]
);

export type ImageRow = typeof image.$inferSelect;
export type ImageInsert = typeof image.$inferInsert;
