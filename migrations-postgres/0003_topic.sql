CREATE TABLE IF NOT EXISTS "topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"wikidata_id" text,
	"aliases" text[] DEFAULT '{}'::text[] NOT NULL,
	"language" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topic_slug_uq" ON "topic" USING btree ("slug") WHERE "topic"."is_deleted" = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topic_legacy_object_id_uq" ON "topic" USING btree ("legacy_object_id") WHERE "topic"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_wikidata_id_idx" ON "topic" USING btree ("wikidata_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_language_name_idx" ON "topic" USING btree ("language","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_name_trgm_idx" ON "topic" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_name_lower_idx" ON "topic" USING btree (lower("name"));