ALTER TABLE "sentence" ADD COLUMN "is_draft" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "speech" ADD COLUMN "is_draft" boolean DEFAULT false NOT NULL;