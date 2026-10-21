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

// Badge is global (no nameSpace in the Mongo schema). image_id references the
// image table (Phase 2); no FK per D3.
export const badge = pgTable(
    "badge",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        name: text("name").notNull(),
        description: text("description").notNull(),
        imageId: uuid("image_id").notNull(),
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
        uniqueIndex("badge_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("badge_image_id_idx").on(t.imageId),
    ]
);

export type BadgeRow = typeof badge.$inferSelect;
export type BadgeInsert = typeof badge.$inferInsert;
