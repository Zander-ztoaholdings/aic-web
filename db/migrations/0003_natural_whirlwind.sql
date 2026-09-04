CREATE TYPE "public"."assessment_status_enum" AS ENUM('DRAFT', 'EVIDENCE', 'REVIEW', 'COMPLETE', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "public"."division_enum" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TABLE "assessment_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"code" varchar(10) NOT NULL,
	"right" varchar(2) NOT NULL,
	"expected_tier" varchar(1) NOT NULL,
	"provided_tier" varchar(1),
	"not_testable" boolean DEFAULT false,
	"evidence_doc_id" uuid,
	"auditor_note" text,
	"finding" text,
	"assessed_by" uuid,
	"assessed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"division" "division_enum" NOT NULL,
	"status" "assessment_status_enum" DEFAULT 'DRAFT' NOT NULL,
	"standard_version" varchar(20) NOT NULL,
	"gates_passed" jsonb DEFAULT '[]'::jsonb,
	"overall_score" integer,
	"per_right_scores" jsonb,
	"result_status" varchar(60),
	"limited_by" text,
	"lead_auditor_id" uuid,
	"opened_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "division" varchar(1);--> statement-breakpoint
ALTER TABLE "assessment_requirements" ADD CONSTRAINT "assessment_requirements_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_requirements" ADD CONSTRAINT "assessment_requirements_evidence_doc_id_audit_documents_id_fk" FOREIGN KEY ("evidence_doc_id") REFERENCES "public"."audit_documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_requirements" ADD CONSTRAINT "assessment_requirements_assessed_by_users_id_fk" FOREIGN KEY ("assessed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_lead_auditor_id_users_id_fk" FOREIGN KEY ("lead_auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_requirement_unique" ON "assessment_requirements" USING btree ("assessment_id","code");--> statement-breakpoint
CREATE INDEX "assessment_requirements_assessment_idx" ON "assessment_requirements" USING btree ("assessment_id");--> statement-breakpoint
CREATE INDEX "assessments_org_idx" ON "assessments" USING btree ("org_id");