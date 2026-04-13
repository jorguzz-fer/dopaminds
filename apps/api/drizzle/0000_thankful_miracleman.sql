CREATE TABLE "ai_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"context" text NOT NULL,
	"messages" "bytea" NOT NULL,
	"outcome" "bytea",
	"encrypted_data_key" "bytea" NOT NULL,
	CONSTRAINT "valid_context" CHECK ("ai_sessions"."context" IN ('urge','checkin','education','crisis'))
);
--> statement-breakpoint
CREATE TABLE "collective_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"insight_type" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"sample_size" integer NOT NULL,
	"confidence" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"mood_score" integer NOT NULL,
	"urge_level" integer NOT NULL,
	"urge_triggers" "bytea",
	"urge_triggers_hmac" text,
	"healthy_activities" "bytea",
	"relapse" boolean DEFAULT false NOT NULL,
	"relapse_duration" integer,
	"reflection" "bytea",
	"encrypted_data_key" "bytea" NOT NULL,
	"phase" integer NOT NULL,
	CONSTRAINT "daily_checkins_user_date" UNIQUE("user_id","date"),
	CONSTRAINT "valid_mood" CHECK ("daily_checkins"."mood_score" BETWEEN 1 AND 5),
	CONSTRAINT "valid_urge" CHECK ("daily_checkins"."urge_level" BETWEEN 1 AND 10)
);
--> statement-breakpoint
CREATE TABLE "education_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"quiz_score" integer,
	CONSTRAINT "education_progress_user_lesson" UNIQUE("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "restoration_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"exercise_minutes" integer DEFAULT 0,
	"sleep_hours" double precision,
	"meditation_minutes" integer DEFAULT 0,
	"sunlight_minutes" integer DEFAULT 0,
	"social_connection" boolean DEFAULT false,
	"cold_exposure" boolean DEFAULT false,
	CONSTRAINT "restoration_log_user_date" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "user_addictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" text NOT NULL,
	"severity_score" integer NOT NULL,
	"baseline_usage" "bytea",
	"current_goal" "bytea",
	"encrypted_data_key" "bytea" NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "valid_category" CHECK ("user_addictions"."category" IN ('social_media','pornography','gaming','shopping')),
	CONSTRAINT "valid_severity" CHECK ("user_addictions"."severity_score" BETWEEN 1 AND 10)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"anonymous" boolean DEFAULT true NOT NULL,
	"onboarding_done" boolean DEFAULT false NOT NULL,
	"current_phase" integer DEFAULT 1 NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"last_check_in" timestamp with time zone,
	"timezone" text
);
--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD CONSTRAINT "ai_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_checkins" ADD CONSTRAINT "daily_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_progress" ADD CONSTRAINT "education_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restoration_log" ADD CONSTRAINT "restoration_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addictions" ADD CONSTRAINT "user_addictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;