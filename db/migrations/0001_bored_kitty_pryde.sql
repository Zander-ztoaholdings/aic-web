DROP INDEX "role_cap_pk";--> statement-breakpoint
DROP INDEX "user_cap_pk";--> statement-breakpoint
ALTER TABLE "role_capabilities" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role_capabilities" ALTER COLUMN "capability_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_capabilities" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_capabilities" ALTER COLUMN "capability_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role_capabilities" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_capabilities" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "role_cap_unique" ON "role_capabilities" USING btree ("role_id","capability_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_cap_unique" ON "user_capabilities" USING btree ("user_id","capability_id");