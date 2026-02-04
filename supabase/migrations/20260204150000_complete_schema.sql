-- Complete database schema with all features
-- This migration consolidates all previous migrations into one clean schema

-- Drop all existing tables
DROP TABLE IF EXISTS public.exported_reports CASCADE;
DROP TABLE IF EXISTS public.project_versions CASCADE;
DROP TABLE IF EXISTS public.analyses CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects table
-- user_id can be NULL for anonymous projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text,
  stage text,
  current_version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN projects.current_version IS 'Current/latest version number of the project';

-- Project versions table
CREATE TABLE public.project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  audience_type text NOT NULL CHECK (audience_type IN ('venture', 'bank', 'corporate')),
  
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
  
  consensus_strengths text[],
  consensus_weaknesses text[],
  
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
  
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects or anonymous projects" ON public.projects
  FOR SELECT
  USING (
    -- Own projects: only owner can view
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    -- Anonymous projects: anyone can view
    user_id IS NULL
  );

CREATE POLICY "Users can create projects (authenticated or anonymous)" ON public.projects
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can update their own projects or claim anonymous projects" ON public.projects
  FOR UPDATE
  USING (
    -- Own projects: only owner can update
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    -- Anonymous projects: anyone authenticated can claim
    (user_id IS NULL AND auth.uid() IS NOT NULL)
  )
  WITH CHECK (
    -- After update, project must belong to the user making the update
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Project versions policies
CREATE POLICY "Users can view versions of own or anonymous projects" ON public.project_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND (
        -- Own projects: only owner can view
        (projects.user_id IS NOT NULL AND projects.user_id = auth.uid()) OR
        -- Anonymous projects: anyone can view
        projects.user_id IS NULL
      )
    )
  );

CREATE POLICY "Users can create versions for own or anonymous projects" ON public.project_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND (
        -- Own projects: only owner can create
        (projects.user_id IS NOT NULL AND projects.user_id = auth.uid()) OR
        -- Anonymous projects: anyone can create
        projects.user_id IS NULL
      )
    )
  );

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_overall_score ON public.project_versions(overall_score);
CREATE INDEX idx_project_versions_audience_type ON public.project_versions(audience_type);

-- Unique constraint: one version per project per audience_type
CREATE UNIQUE INDEX idx_project_versions_unique ON public.project_versions(project_id, version_number, audience_type);
