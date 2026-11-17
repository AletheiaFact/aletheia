import { pgTable, uuid, text, jsonb, index } from "drizzle-orm/pg-core";
import {
    legacyObjectIdColumn,
    legacyObjectIdIndex,
    softDeleteColumns,
    timestampColumns,
} from "../../../../../database/postgres/columns";

// Global (the Mongo schema has no nameSpace). claim_revision_id is null for
// images uploaded outside a claim (badge, organization logo).
export const image = pgTable(
    "image",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        ...legacyObjectIdColumn(),
        type: text("type").notNull().default("Image"),
        dataHash: text("data_hash").notNull(),
        props: jsonb("props")
            .$type<Record<string, any>>()
            .notNull()
            .default({}),
        content: text("content").notNull(),
        topics: jsonb("topics").$type<any[]>(),
        claimRevisionId: uuid("claim_revision_id"),
        ...softDeleteColumns(),
        ...timestampColumns(),
    },
    (t) => [
        legacyObjectIdIndex("image", t.legacyObjectId),
        index("image_data_hash_idx").on(t.dataHash),
        index("image_claim_revision_id_idx").on(t.claimRevisionId),
        index("image_topics_idx").using("gin", t.topics),
    ]
);

export type ImageRow = typeof image.$inferSelect;
export type ImageInsert = typeof image.$inferInsert;
