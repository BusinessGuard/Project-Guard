-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.openai_analysis_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL,
  user_prompt text NOT NULL,
  openai_response jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  system_prompt text,
  CONSTRAINT openai_analysis_log_pkey PRIMARY KEY (id),
  CONSTRAINT openai_analysis_log_project_version_id_fkey FOREIGN KEY (project_version_id) REFERENCES public.project_versions(id)
);
CREATE TABLE public.project_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  version_number integer NOT NULL,
  canvas_data jsonb NOT NULL,
  overall_score double precision,
  readiness_status text,
  score_value_proposition double precision,
  score_customer_segments double precision,
  score_channels double precision,
  score_revenue double precision,
  score_costs double precision,
  score_key_resources double precision,
  score_key_activities double precision,
  score_key_partners double precision,
  score_team double precision,
  benchmark_percentile integer,
  benchmark_better_than integer,
  consensus_strengths ARRAY,
  consensus_weaknesses ARRAY,
  experts jsonb,
  recommendations jsonb,
  growth_phases jsonb,
  fin_ltv double precision,
  fin_cac double precision,
  fin_ltv_cac_ratio double precision,
  fin_payback_period double precision,
  fin_gross_margin double precision,
  fin_churn_rate double precision,
  fin_break_even_month integer,
  fin_break_even_customers integer,
  fin_break_even_mrr double precision,
  fin_monthly_projections jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  audience_type text NOT NULL CHECK (audience_type = ANY (ARRAY['venture'::text, 'bank'::text, 'corporate'::text])),
  CONSTRAINT project_versions_pkey PRIMARY KEY (id),
  CONSTRAINT project_versions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  industry text,
  stage text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  current_version integer NOT NULL DEFAULT 1,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  plan text NOT NULL DEFAULT 'free'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);