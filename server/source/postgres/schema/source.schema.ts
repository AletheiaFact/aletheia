import {
    pgTable,
    uuid,
    text,
    jsonb,
    boolean,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const source = pgTable(
    "source",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        // Mongo ObjectId of the row this record was migrated from (null for
        // rows born on Postgres) — see docs/postgres-migration-foundation.md
        // §2 (schema conventions).
        legacyObjectId: text("legacy_object_id"),
        href: text("href").notNull(),
        // Free-form review metadata (classification, summary, date, ...).
        // Mongo stores it as an untyped object; jsonb keeps parity.
        props: jsonb("props"),
        // Polymorphic references to Claim / ClaimReview rows (Mongo dynamic
        // ref). Array because one source can back several targets. Reference
        // COLUMNS land now, FK constraints are deferred to Phase 10 (D3) —
        // and target tables aren't ported yet anyway.
        targetIds: uuid("target_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        // Reference to the creating user (users port in Phase 4; D3 applies).
        userId: uuid("user_id"),
        // md5(href) — the dedup key (unique below).
        dataHash: text("data_hash").notNull(),
        nameSpace: text("name_space").notNull().default("main"),
        // Soft-delete triple per §2 conventions. NOTE: the source Mongo
        // schema does not apply the soft-delete plugin and the module exposes
        // no delete method — these columns exist for convention/uniformity
        // and stay false/null until a delete surface ever lands.
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
        uniqueIndex("source_data_hash_uq")
            .on(t.dataHash)
            .where(sql`${t.isDeleted} = false`),
        uniqueIndex("source_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("source_href_idx").on(t.href),
        index("source_user_id_idx").on(t.userId),
        // Containment lookups: getByTargetId uses target_ids @> ARRAY[$1].
        index("source_target_ids_idx").using("gin", t.targetIds),
        // listAll/count filter by name_space and order by insertion time.
        index("source_name_space_created_at_idx").on(t.nameSpace, t.createdAt),
    ]
);

export type SourceRow = typeof source.$inferSelect;
export type SourceInsert = typeof source.$inferInsert;
