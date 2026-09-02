CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization" varchar(255),
	"role" varchar(255),
	"country" varchar(120),
	"enquiry_type" varchar(120),
	"message" text,
	"source" varchar(50) DEFAULT 'website',
	"ip_hash" varchar(64),
	"user_agent" text,
	"notified_at" timestamp with time zone,
	"handled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_submissions_created_idx" ON "contact_submissions" USING btree ("created_at");