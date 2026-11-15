CREATE TABLE IF NOT EXISTS "image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"type" text DEFAULT 'Image' NOT NULL,
	"data_hash" text NOT NULL,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content" text NOT NULL,
	"topics" jsonb,
	"claim_revision_id" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "image_legacy_object_id_uq" ON "image" USING btree ("legacy_object_id") WHERE "image"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "image_data_hash_idx" ON "image" USING btree ("data_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "image_claim_revision_id_idx" ON "image" USING btree ("claim_revision_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "image_topics_idx" ON "image" USING gin ("topics");