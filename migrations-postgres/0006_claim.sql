CREATE TABLE IF NOT EXISTS "claim" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"slug" text NOT NULL,
	"personality_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"latest_revision_id" uuid NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"name_space" text DEFAULT 'main' NOT NULL,
	"group_id" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "claim_revision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content_id" uuid NOT NULL,
	"content_model" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"claim_id" uuid NOT NULL,
	"personality_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sentence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"type" text DEFAULT 'sentence' NOT NULL,
	"data_hash" text NOT NULL,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content" text NOT NULL,
	"topics" jsonb,
	"claim_revision_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paragraph" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"type" text DEFAULT 'paragraph' NOT NULL,
	"data_hash" text NOT NULL,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"claim_revision_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speech" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"type" text DEFAULT 'speech' NOT NULL,
	"content_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"personality_id" uuid,
	"claim_revision_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "unattributed" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"type" text DEFAULT 'unattributed' NOT NULL,
	"content_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"data_hash" text NOT NULL,
	"report_model" text NOT NULL,
	"user_id" uuid,
	"summary" text NOT NULL,
	"questions" text[] DEFAULT '{}'::text[] NOT NULL,
	"report" text,
	"verification" text,
	"sources" text[] DEFAULT '{}'::text[] NOT NULL,
	"classification" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "claim_name_space_slug_uq" ON "claim" USING btree ("name_space","slug") WHERE "claim"."is_deleted" = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "claim_legacy_object_id_uq" ON "claim" USING btree ("legacy_object_id") WHERE "claim"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_personality_ids_idx" ON "claim" USING gin ("personality_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_latest_revision_id_idx" ON "claim" USING btree ("latest_revision_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_group_id_idx" ON "claim" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_name_space_is_hidden_created_at_idx" ON "claim" USING btree ("name_space","is_hidden","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "claim_revision_legacy_object_id_uq" ON "claim_revision" USING btree ("legacy_object_id") WHERE "claim_revision"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_revision_claim_id_idx" ON "claim_revision" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_revision_content_id_idx" ON "claim_revision" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_revision_personality_ids_idx" ON "claim_revision" USING gin ("personality_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "claim_revision_title_trgm_idx" ON "claim_revision" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sentence_legacy_object_id_uq" ON "sentence" USING btree ("legacy_object_id") WHERE "sentence"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sentence_data_hash_idx" ON "sentence" USING btree ("data_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sentence_claim_revision_id_idx" ON "sentence" USING btree ("claim_revision_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sentence_topics_idx" ON "sentence" USING gin ("topics");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sentence_content_trgm_idx" ON "sentence" USING gin ("content" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "paragraph_legacy_object_id_uq" ON "paragraph" USING btree ("legacy_object_id") WHERE "paragraph"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "paragraph_data_hash_idx" ON "paragraph" USING btree ("data_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "paragraph_claim_revision_id_idx" ON "paragraph" USING btree ("claim_revision_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "paragraph_content_ids_idx" ON "paragraph" USING gin ("content_ids");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "speech_legacy_object_id_uq" ON "speech" USING btree ("legacy_object_id") WHERE "speech"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "speech_claim_revision_id_idx" ON "speech" USING btree ("claim_revision_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "speech_personality_id_idx" ON "speech" USING btree ("personality_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "speech_content_ids_idx" ON "speech" USING gin ("content_ids");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unattributed_legacy_object_id_uq" ON "unattributed" USING btree ("legacy_object_id") WHERE "unattributed"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unattributed_content_ids_idx" ON "unattributed" USING gin ("content_ids");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "report_legacy_object_id_uq" ON "report" USING btree ("legacy_object_id") WHERE "report"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_data_hash_idx" ON "report" USING btree ("data_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_user_id_idx" ON "report" USING btree ("user_id");