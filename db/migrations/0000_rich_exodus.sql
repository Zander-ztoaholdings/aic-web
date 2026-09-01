CREATE TYPE "public"."audit_scheduled_status_enum" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."audit_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FLAGGED', 'VERIFIED');--> statement-breakpoint
CREATE TYPE "public"."correction_status_enum" AS ENUM('SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."incident_status_enum" AS ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."tier_enum" AS ENUM('TIER_1', 'TIER_2', 'TIER_3');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'AUDITOR', 'COMPLIANCE_OFFICER', 'VIEWER');--> statement-breakpoint
CREATE TABLE "ai_systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"name" varchar(255) NOT NULL,
	"version" varchar(50) DEFAULT '1.0.0',
	"purpose" text,
	"division" integer DEFAULT 5,
	"risk_tier" integer DEFAULT 1,
	"lifecycle_stage" varchar(50) DEFAULT 'DEVELOPMENT',
	"status" varchar(20) DEFAULT 'DRAFT',
	"is_sandbox" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "aims_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"stage" varchar(50) DEFAULT 'ADVISORY',
	"status" varchar(50) DEFAULT 'IN_PROGRESS',
	"notes" text,
	"readiness_score" integer DEFAULT 0,
	"assigned_auditor_id" uuid,
	"impartiality_disclosure_signed" boolean DEFAULT false,
	"impartiality_signed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alpha_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"use_case" text,
	"status" varchar(50) DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"name" varchar(255) NOT NULL,
	"key_prefix" varchar(16) NOT NULL,
	"key_hash" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"title" varchar(255) NOT NULL,
	"slot_type" varchar(50) NOT NULL,
	"file_url" text NOT NULL,
	"file_size" varchar(50),
	"file_checksum" varchar(64),
	"version" integer DEFAULT 1,
	"status" varchar(50) DEFAULT 'UPLOADED',
	"ai_triage_notes" text,
	"ocr_extracted_data" jsonb DEFAULT '{}'::jsonb,
	"risk_score" integer DEFAULT 0,
	"required_capability" varchar(100) DEFAULT 'view_audit_vault',
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"type" varchar(50) NOT NULL,
	"actor_id" uuid,
	"current_hash" varchar(64) NOT NULL,
	"previous_hash" varchar(64),
	"timestamp" timestamp with time zone DEFAULT now(),
	"signature" text
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"system_name" varchar(255),
	"event_type" varchar(255),
	"details" jsonb NOT NULL,
	"status" "audit_status_enum" DEFAULT 'PENDING',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"resource_usage" jsonb DEFAULT '{"compute_ms":0,"memory_mb":0,"carbon_estimate_g":0}'::jsonb,
	"integrity_hash" varchar(64),
	"previous_hash" varchar(64),
	"sequence_number" integer,
	"signature" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50),
	"status" varchar(50) DEFAULT 'PENDING',
	"evidence_url" text,
	"findings" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid,
	"auditor_id" uuid,
	"signature" text NOT NULL,
	"public_key" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"category" varchar(100),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "capabilities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "compliance_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"month_year" varchar(20) NOT NULL,
	"integrity_score" integer NOT NULL,
	"audit_status" varchar(50) DEFAULT 'COMPLIANT',
	"findings_count" integer DEFAULT 0,
	"report_url" text,
	"is_finalized" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conflict_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"auditor_id" uuid,
	"declaration" text,
	"has_prior_advisory_relationship" boolean DEFAULT false,
	"last_advisory_date" timestamp with time zone,
	"is_cleared" boolean DEFAULT false,
	"justification" text,
	"status" varchar(20) DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "correction_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"decision_id" uuid,
	"citizen_email" varchar(255) NOT NULL,
	"reason" text NOT NULL,
	"supporting_evidence_url" text,
	"status" "correction_status_enum" DEFAULT 'SUBMITTED',
	"resolution_details" text,
	"human_reviewer_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cpd_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"hours" integer NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"category" varchar(50),
	"evidence_url" text,
	"status" varchar(20) DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "decision_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"system_name" varchar(255) NOT NULL,
	"input_params" jsonb NOT NULL,
	"outcome" jsonb NOT NULL,
	"explanation" text,
	"integrity_hash" varchar(64) NOT NULL,
	"is_human_override" boolean DEFAULT false,
	"override_reason" text,
	"overridden_by" uuid,
	"sync_status" varchar(20) DEFAULT 'SYNCED',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid,
	"user_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cert_level_id" uuid NOT NULL,
	"question" text,
	"question_encrypted" text,
	"options" jsonb,
	"options_encrypted" text,
	"correct_option_index" integer,
	"correct_answer_encrypted" text,
	"explanation" text,
	"explanation_encrypted" text,
	"category" varchar(100),
	"difficulty" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" varchar(100) NOT NULL,
	"location" varchar(255) NOT NULL,
	"seats" varchar(100),
	"cert_code" varchar(10) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_standards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region" varchar(255) NOT NULL,
	"framework" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"level" varchar(50) NOT NULL,
	"year" varchar(4) NOT NULL,
	"alignment" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "governance_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"system_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"content" jsonb NOT NULL,
	"sequence" integer NOT NULL,
	"impact" varchar(20) DEFAULT 'LOW',
	"impact_magnitude" integer DEFAULT 0,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hitl_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"target_type" varchar(50),
	"target_id" uuid,
	"previous_value" jsonb,
	"new_value" jsonb,
	"override_reason" text NOT NULL,
	"integrity_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"citizen_email" varchar(255) NOT NULL,
	"system_name" varchar(255),
	"description" text NOT NULL,
	"status" "incident_status_enum" DEFAULT 'OPEN',
	"resolution_details" text,
	"human_reviewer_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invite_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"role" "user_role_enum" DEFAULT 'VIEWER',
	"org_id" uuid,
	"max_uses" integer DEFAULT 1,
	"uses" integer DEFAULT 0,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "issued_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"cert_number" varchar(100) NOT NULL,
	"standard" varchar(100) DEFAULT 'ISO/IEC 42001:2023',
	"issue_date" timestamp with time zone DEFAULT now(),
	"expiry_date" timestamp with time zone NOT NULL,
	"pdf_url" text,
	"verification_code" varchar(50),
	"status" varchar(20) DEFAULT 'ACTIVE',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "issued_certifications_cert_number_unique" UNIQUE("cert_number"),
	CONSTRAINT "issued_certifications_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"source" varchar(50) DEFAULT 'WEB',
	"score" integer,
	"status" varchar(50) DEFAULT 'NEW',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"ip_address" varchar(45),
	"success" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"name" varchar(255) NOT NULL,
	"version" varchar(50) DEFAULT '1.0.0',
	"type" varchar(100),
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE',
	"subscribed_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"title" varchar(255),
	"message" text,
	"type" varchar(50),
	"status" varchar(50) DEFAULT 'UNREAD',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100),
	"logo_url" text,
	"tier" "tier_enum" DEFAULT 'TIER_3',
	"integrity_score" integer DEFAULT 0,
	"is_alpha" boolean DEFAULT false,
	"accreditation_status" varchar(50) DEFAULT 'PENDING',
	"iso_42001_readiness_score" integer DEFAULT 0,
	"certification_status" varchar(50) DEFAULT 'DRAFT',
	"stripe_customer_id" varchar(255),
	"billing_status" varchar(50) DEFAULT 'TRIAL',
	"plan_id" varchar(50),
	"contact_email" varchar(255),
	"address" text,
	"primary_ai_officer" varchar(255),
	"public_directory_visible" boolean DEFAULT false,
	"on_prem_proxy_enabled" boolean DEFAULT false,
	"renewal_date" timestamp with time zone,
	"labor_hours_invested" integer DEFAULT 0,
	"api_key" varchar(255),
	"auditor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token" varchar(255) NOT NULL,
	"used" boolean DEFAULT false,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "permission_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"target_user_id" uuid,
	"target_role_id" uuid,
	"action" varchar(50) NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "personnel_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" varchar(255) NOT NULL,
	"code" varchar(10) NOT NULL,
	"description" text NOT NULL,
	"requirements" jsonb NOT NULL,
	"duration" varchar(100),
	"exam_fee" varchar(50),
	"color" varchar(50),
	"badge" varchar(100),
	"popular" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"category" varchar(50) DEFAULT 'General',
	"status" varchar(50) DEFAULT 'DRAFT',
	"author_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "practitioner_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"cert_level_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE',
	"issue_date" timestamp with time zone DEFAULT now(),
	"expiry_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "public_index_rankings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"industry" varchar(100),
	"ticker" varchar(20),
	"maturity_score" integer DEFAULT 0,
	"board_oversight_score" integer DEFAULT 0,
	"rights_compliance_score" integer DEFAULT 0,
	"transparency_score" integer DEFAULT 0,
	"risk_management_score" integer DEFAULT 0,
	"trend" varchar(10) DEFAULT 'stable',
	"is_client" boolean DEFAULT false,
	"linked_org_id" uuid,
	"last_assessed_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"size" varchar(50),
	"category" varchar(100) NOT NULL,
	"description" text,
	"download_url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "revoked_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jti" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "revoked_tokens_jti_unique" UNIQUE("jti")
);
--> statement-breakpoint
CREATE TABLE "role_capabilities" (
	"role_id" uuid,
	"capability_id" uuid
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"is_custom" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scheduled_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"auditor_id" uuid,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "audit_scheduled_status_enum" DEFAULT 'SCHEDULED',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(255) NOT NULL,
	"actor_id" uuid,
	"details" jsonb NOT NULL,
	"previous_hash" varchar(64),
	"integrity_hash" varchar(64) NOT NULL,
	"sequence_number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_capabilities" (
	"user_id" uuid,
	"capability_id" uuid,
	"is_granted" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role_id" uuid,
	"role" "user_role_enum" DEFAULT 'VIEWER',
	"org_id" uuid,
	"is_active" boolean DEFAULT true,
	"email_verified" boolean DEFAULT false,
	"is_super_admin" boolean DEFAULT false,
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"mfa_enabled" boolean DEFAULT false,
	"totp_secret" text,
	"backup_codes" jsonb DEFAULT '[]'::jsonb,
	"failed_login_attempts" integer DEFAULT 0,
	"lockout_until" timestamp with time zone,
	"two_factor_secret" text,
	"two_factor_enabled" boolean DEFAULT false,
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_systems" ADD CONSTRAINT "ai_systems_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aims_assessments" ADD CONSTRAINT "aims_assessments_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aims_assessments" ADD CONSTRAINT "aims_assessments_assigned_auditor_id_users_id_fk" FOREIGN KEY ("assigned_auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_documents" ADD CONSTRAINT "audit_documents_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_documents" ADD CONSTRAINT "audit_documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_ledger" ADD CONSTRAINT "audit_ledger_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_ledger" ADD CONSTRAINT "audit_ledger_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_requirements" ADD CONSTRAINT "audit_requirements_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_signatures" ADD CONSTRAINT "audit_signatures_report_id_compliance_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."compliance_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_signatures" ADD CONSTRAINT "audit_signatures_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_reports" ADD CONSTRAINT "compliance_reports_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_checks" ADD CONSTRAINT "conflict_checks_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_checks" ADD CONSTRAINT "conflict_checks_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correction_requests" ADD CONSTRAINT "correction_requests_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correction_requests" ADD CONSTRAINT "correction_requests_decision_id_decision_records_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."decision_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correction_requests" ADD CONSTRAINT "correction_requests_human_reviewer_id_users_id_fk" FOREIGN KEY ("human_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cpd_logs" ADD CONSTRAINT "cpd_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_records" ADD CONSTRAINT "decision_records_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_records" ADD CONSTRAINT "decision_records_overridden_by_users_id_fk" FOREIGN KEY ("overridden_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_comments" ADD CONSTRAINT "document_comments_document_id_audit_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."audit_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_comments" ADD CONSTRAINT "document_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "governance_blocks" ADD CONSTRAINT "governance_blocks_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "governance_blocks" ADD CONSTRAINT "governance_blocks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hitl_logs" ADD CONSTRAINT "hitl_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_human_reviewer_id_users_id_fk" FOREIGN KEY ("human_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issued_certifications" ADD CONSTRAINT "issued_certifications_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_audit_logs" ADD CONSTRAINT "permission_audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_audit_logs" ADD CONSTRAINT "permission_audit_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_audit_logs" ADD CONSTRAINT "permission_audit_logs_target_role_id_roles_id_fk" FOREIGN KEY ("target_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_certifications" ADD CONSTRAINT "practitioner_certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_index_rankings" ADD CONSTRAINT "public_index_rankings_linked_org_id_organizations_id_fk" FOREIGN KEY ("linked_org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_capabilities" ADD CONSTRAINT "role_capabilities_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_capabilities" ADD CONSTRAINT "role_capabilities_capability_id_capabilities_id_fk" FOREIGN KEY ("capability_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_audits" ADD CONSTRAINT "scheduled_audits_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_audits" ADD CONSTRAINT "scheduled_audits_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_ledger" ADD CONSTRAINT "system_ledger_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_capabilities" ADD CONSTRAINT "user_capabilities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_capabilities" ADD CONSTRAINT "user_capabilities_capability_id_capabilities_id_fk" FOREIGN KEY ("capability_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_org_created_at_idx" ON "audit_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_org_event_type_idx" ON "audit_logs" USING btree ("org_id","event_type");--> statement-breakpoint
CREATE INDEX "login_attempts_email_idx" ON "login_attempts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "role_cap_pk" ON "role_capabilities" USING btree ("role_id","capability_id");--> statement-breakpoint
CREATE INDEX "user_cap_pk" ON "user_capabilities" USING btree ("user_id","capability_id");--> statement-breakpoint
CREATE INDEX "users_org_id_idx" ON "users" USING btree ("org_id");