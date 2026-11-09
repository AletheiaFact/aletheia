CREATE TABLE IF NOT EXISTS "badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "badge_legacy_object_id_uq" ON "badge" USING btree ("legacy_object_id") WHERE "badge"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "badge_image_id_idx" ON "badge" USING btree ("image_id");