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

// Topic is GLOBAL (its Mongo schema has no nameSpace) — no name_space column.
export const topic = pgTable(
    "topic",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        // Mongo ObjectId of the row this record was migrated from (null for
        // rows born on Postgres) — docs/postgres-migration-foundation.md §2.
        legacyObjectId: text("legacy_object_id"),
        // slugify(name) — the dedup key (unique below).
        slug: text("slug").notNull(),
        name: text("name").notNull(),
        wikidataId: text("wikidata_id"),
        aliases: text("aliases")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        language: text("language").notNull(),
        // Soft-delete triple per §2 conventions. NOTE: the topic Mongo schema
        // does not apply the soft-delete plugin and the module exposes no
        // delete method — these columns exist for uniformity and stay
        // false/null until a delete surface ever lands.
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
        uniqueIndex("topic_slug_uq")
            .on(t.slug)
            .where(sql`${t.isDeleted} = false`),
        uniqueIndex("topic_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        // findByWikidataIds: wikidata_id = ANY($1)
        index("topic_wikidata_id_idx").on(t.wikidataId),
        // searchTopics: filter by language, ORDER BY name
        index("topic_language_name_idx").on(t.language, t.name),
        // searchTopics: name ILIKE '%q%' (trigram)
        index("topic_name_trgm_idx").using("gin", sql`${t.name} gin_trgm_ops`),
        // findByNames: case-insensitive exact match on name
        index("topic_name_lower_idx").on(sql`lower(${t.name})`),
    ]
);

export type TopicRow = typeof topic.$inferSelect;
export type TopicInsert = typeof topic.$inferInsert;
