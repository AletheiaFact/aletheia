CREATE TABLE IF NOT EXISTS "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_object_id" text,
	"href" text NOT NULL,
	"props" jsonb,
	"target_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"user_id" uuid,
	"data_hash" text NOT NULL,
	"name_space" text DEFAULT 'main' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "source_data_hash_uq" ON "source" USING btree ("data_hash") WHERE "source"."is_deleted" = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "source_legacy_object_id_uq" ON "source" USING btree ("legacy_object_id") WHERE "source"."legacy_object_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_href_idx" ON "source" USING btree ("href");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_user_id_idx" ON "source" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_target_ids_idx" ON "source" USING gin ("target_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_name_space_created_at_idx" ON "source" USING btree ("name_space","created_at");