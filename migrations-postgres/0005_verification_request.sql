CREATE TABLE IF NOT EXISTS "content_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"content_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"target_id" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"data_hash" text NOT NULL,
	"content" text NOT NULL,
	"source_channel" text NOT NULL,
	"report_type" text,
	"impact_area_id" uuid,
	"additional_info" text,
	"publication_date" text,
	"email" text,
	"heard_from" text,
	"source_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"group_id" uuid,
	"rejected" boolean,
	"is_sensitive" boolean,
	"embedding" vector,
	"topic_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"severity" text,
	"status" text NOT NULL,
	"states_executed" text[] DEFAULT '{}'::text[] NOT NULL,
	"identified_data_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"state_retries" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"state_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"state_transitions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"progress" jsonb,
	"state_fingerprints" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"audit_log" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pending_ai_tasks" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "content_group_legacy_object_id_uq" ON "content_group" USING btree ("legacy_object_id") WHERE "content_group"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_group_content_ids_idx" ON "content_group" USING gin ("content_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_group_target_id_idx" ON "content_group" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verification_request_data_hash_uq" ON "verification_request" USING btree ("data_hash") WHERE "verification_request"."is_deleted" = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verification_request_legacy_object_id_uq" ON "verification_request" USING btree ("legacy_object_id") WHERE "verification_request"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_status_idx" ON "verification_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_source_channel_idx" ON "verification_request" USING btree ("source_channel");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_date_idx" ON "verification_request" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_updated_at_idx" ON "verification_request" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_group_id_idx" ON "verification_request" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_impact_area_id_idx" ON "verification_request" USING btree ("impact_area_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_source_ids_idx" ON "verification_request" USING gin ("source_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_topic_ids_idx" ON "verification_request" USING gin ("topic_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_identified_data_ids_idx" ON "verification_request" USING gin ("identified_data_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_request_content_trgm_idx" ON "verification_request" USING gin ("content" gin_trgm_ops);