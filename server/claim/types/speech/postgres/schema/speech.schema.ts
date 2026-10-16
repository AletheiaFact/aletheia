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

// content_ids are paragraph ids in display order (the Mongo `content` array).
export const speech = pgTable(
    "speech",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        type: text("type").notNull().default("speech"),
        contentIds: uuid("content_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        personalityId: uuid("personality_id"),
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
        uniqueIndex("speech_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("speech_claim_revision_id_idx").on(t.claimRevisionId),
        index("speech_personality_id_idx").on(t.personalityId),
        index("speech_content_ids_idx").using("gin", t.contentIds),
    ]
);

export type SpeechRow = typeof speech.$inferSelect;
export type SpeechInsert = typeof speech.$inferInsert;
