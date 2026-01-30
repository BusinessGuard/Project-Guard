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
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text,
  stage text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Project versions table
CREATE TABLE public.project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  is_current boolean NOT NULL DEFAULT true,
  
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
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Project versions policies
CREATE POLICY "Users can view versions of own projects" ON public.project_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for own projects" ON public.project_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_is_current ON public.project_versions(is_current);
CREATE INDEX idx_project_versions_overall_score ON public.project_versions(overall_score);

-- Constraint: only one current version per project
CREATE UNIQUE INDEX idx_project_versions_current ON public.project_versions(project_id) 
  WHERE is_current = true;
