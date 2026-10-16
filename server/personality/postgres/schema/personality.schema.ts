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

export const personality = pgTable(
    "personality",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        // Mongo ObjectId of the row this record was migrated from (null for
        // rows born on Postgres). Gives the parity differ, the backfill
        // driver, and rollback a bidirectional Mongo↔PG identity — see
        // docs/postgres-migration-foundation.md §2 (schema conventions).
        legacyObjectId: text("legacy_object_id"),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description").notNull(),
        wikidata: text("wikidata"),
        isHidden: boolean("is_hidden").notNull().default(false),
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
        uniqueIndex("personality_wikidata_uq")
            .on(t.wikidata)
            .where(sql`${t.wikidata} IS NOT NULL AND ${t.isDeleted} = false`),
        uniqueIndex("personality_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("personality_slug_idx").on(t.slug),
        index("personality_name_trgm_idx").using(
            "gin",
            sql`${t.name} gin_trgm_ops`
        ),
    ]
);

export type PersonalityRow = typeof personality.$inferSelect;
export type PersonalityInsert = typeof personality.$inferInsert;
