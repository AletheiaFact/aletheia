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
import { vector } from "../../../database/postgres/vector.type";

// Global (the Mongo schema has no nameSpace). Reference columns land without
// FKs per D3: impact_area_id/topic_ids → topic, identified_data_ids →
// personality, source_ids → source, group_id → content_group.
export const verificationRequest = pgTable(
    "verification_request",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        legacyObjectId: text("legacy_object_id"),
        dataHash: text("data_hash").notNull(),
        content: text("content").notNull(),
        sourceChannel: text("source_channel").notNull(),
        reportType: text("report_type"),
        impactAreaId: uuid("impact_area_id"),
        additionalInfo: text("additional_info"),
        publicationDate: text("publication_date"),
        email: text("email"),
        heardFrom: text("heard_from"),
        sourceIds: uuid("source_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
        groupId: uuid("group_id"),
        rejected: boolean("rejected"),
        isSensitive: boolean("is_sensitive"),
        embedding: vector("embedding"),
        topicIds: uuid("topic_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        severity: text("severity"),
        status: text("status").notNull(),
        statesExecuted: text("states_executed")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        identifiedDataIds: uuid("identified_data_ids")
            .array()
            .notNull()
            .default(sql`'{}'::uuid[]`),
        stateRetries: jsonb("state_retries")
            .$type<Record<string, number>>()
            .notNull()
            .default({}),
        stateErrors: jsonb("state_errors")
            .$type<Array<{ state: string; error: string; timestamp: string }>>()
            .notNull()
            .default([]),
        stateTransitions: jsonb("state_transitions")
            .$type<
                Array<{
                    from: string;
                    to: string;
                    timestamp: string;
                    duration: number;
                }>
            >()
            .notNull()
            .default([]),
        progress: jsonb("progress").$type<Record<string, any>>(),
        stateFingerprints: jsonb("state_fingerprints")
            .$type<Record<string, string>>()
            .notNull()
            .default({}),
        auditLog: jsonb("audit_log")
            .$type<Array<Record<string, any>>>()
            .notNull()
            .default([]),
        pendingAiTasks: jsonb("pending_ai_tasks")
            .$type<Record<string, string>>()
            .notNull()
            .default({}),
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
        uniqueIndex("verification_request_data_hash_uq")
            .on(t.dataHash)
            .where(sql`${t.isDeleted} = false`),
        uniqueIndex("verification_request_legacy_object_id_uq")
            .on(t.legacyObjectId)
            .where(sql`${t.legacyObjectId} IS NOT NULL`),
        index("verification_request_status_idx").on(t.status),
        index("verification_request_source_channel_idx").on(t.sourceChannel),
        index("verification_request_date_idx").on(t.date),
        index("verification_request_updated_at_idx").on(t.updatedAt),
        index("verification_request_group_id_idx").on(t.groupId),
        index("verification_request_impact_area_id_idx").on(t.impactAreaId),
        index("verification_request_source_ids_idx").using("gin", t.sourceIds),
        index("verification_request_topic_ids_idx").using("gin", t.topicIds),
        index("verification_request_identified_data_ids_idx").using(
            "gin",
            t.identifiedDataIds
        ),
        index("verification_request_content_trgm_idx").using(
            "gin",
            sql`${t.content} gin_trgm_ops`
        ),
    ]
);

export type VerificationRequestRow = typeof verificationRequest.$inferSelect;
export type VerificationRequestInsert = typeof verificationRequest.$inferInsert;
