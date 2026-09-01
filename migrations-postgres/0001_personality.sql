CREATE TABLE IF NOT EXISTS "personality" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"wikidata" text,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "personality_wikidata_uq" ON "personality" USING btree ("wikidata") WHERE "personality"."wikidata" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "personality_slug_idx" ON "personality" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "personality_name_trgm_idx" ON "personality" USING gin ("name" gin_trgm_ops);