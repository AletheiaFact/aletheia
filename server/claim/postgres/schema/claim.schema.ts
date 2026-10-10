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

// Tenant-scoped (Mongo schema has nameSpace). Reference columns land without
// FKs per D3: personality_ids → personality, latest_revision_id →
// claim_revision, group_id → content_group.
export const claim = pgTable(
    "claim",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        slug: text("slug").notNull(),
        personalityIds: uuid("personality_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        latestRevisionId: uuid("latest_revision_id").notNull(),
        isHidden: boolean("is_hidden").notNull().default(false),
        nameSpace: text("name_space").notNull().default("main"),
        groupId: uuid("group_id"),
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
        uniqueIndex("claim_name_space_slug_uq")
            .on(t.nameSpace, t.slug)
            .where(sql`${t.isDeleted} = false`),
        uniqueIndex("claim_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("claim_personality_ids_idx").using("gin", t.personalityIds),
        index("claim_latest_revision_id_idx").on(t.latestRevisionId),
        index("claim_group_id_idx").on(t.groupId),
        index("claim_name_space_is_hidden_created_at_idx").on(
            t.nameSpace,
            t.isHidden,
            t.createdAt
        ),
    ]
);

export type ClaimRow = typeof claim.$inferSelect;
export type ClaimInsert = typeof claim.$inferInsert;
