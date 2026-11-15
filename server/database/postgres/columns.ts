import { boolean, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Columns every ported table carries (foundation doc §2): the Mongo identity
 * for backfill and parity, the soft-delete pair and the timestamps. Functions,
 * so each table gets its own column builders.
 */
export const legacyObjectIdColumn = () => ({
    legacyObjectId: text("legacy_object_id"),
});

export const softDeleteColumns = () => ({
    isDeleted: boolean("is_deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const timestampColumns = () => ({
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

/** `<table>_legacy_object_id_uq`, partial on non-null values. */
export const legacyObjectIdIndex = (table: string, column: AnyPgColumn) =>
    uniqueIndex(`${table}_legacy_object_id_uq`)
        .on(column)
        .where(sql`${column} IS NOT NULL`);
