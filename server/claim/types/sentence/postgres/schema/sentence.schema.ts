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

export const sentence = pgTable(
    "sentence",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        type: text("type").notNull().default("sentence"),
        dataHash: text("data_hash").notNull(),
        props: jsonb("props")
            .$type<Record<string, any>>()
            .notNull()
            .default({}),
        content: text("content").notNull(),
        topics: jsonb("topics").$type<any[]>(),
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
        uniqueIndex("sentence_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("sentence_data_hash_idx").on(t.dataHash),
        index("sentence_claim_revision_id_idx").on(t.claimRevisionId),
        index("sentence_topics_idx").using("gin", t.topics),
        index("sentence_content_trgm_idx").using(
            "gin",
            sql`${t.content} gin_trgm_ops`
        ),
    ]
);

export type SentenceRow = typeof sentence.$inferSelect;
export type SentenceInsert = typeof sentence.$inferInsert;
