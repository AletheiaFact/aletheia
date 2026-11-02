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

// (content_model, content_id) is the polymorphic reference the Mongo `content`
// virtual resolves: speech / unattributed / image / debate. No FKs per D3.
export const claimRevision = pgTable(
    "claim_revision",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        title: text("title").notNull(),
        slug: text("slug").notNull(),
        contentId: uuid("content_id").notNull(),
        contentModel: text("content_model").notNull(),
        date: timestamp("date", { withTimezone: true }).notNull(),
        claimId: uuid("claim_id").notNull(),
        personalityIds: uuid("personality_ids")
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
        uniqueIndex("claim_revision_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("claim_revision_claim_id_idx").on(t.claimId),
        index("claim_revision_content_id_idx").on(t.contentId),
        index("claim_revision_personality_ids_idx").using(
            "gin",
            t.personalityIds
        ),
        index("claim_revision_title_trgm_idx").using(
            "gin",
            sql`${t.title} gin_trgm_ops`
        ),
    ]
);

export type ClaimRevisionRow = typeof claimRevision.$inferSelect;
export type ClaimRevisionInsert = typeof claimRevision.$inferInsert;
