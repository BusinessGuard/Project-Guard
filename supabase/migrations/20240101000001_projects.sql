-- Drop existing projects table and recreate
DROP TABLE IF EXISTS public.projects CASCADE;

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  stage text,
  
  -- Value Proposition
  value_prop_problem text,
  value_prop_solution text,
  value_prop_uniqueness text,
  value_prop_measurable text,
  value_prop_advantages jsonb,
  
  -- Customer Segments
  customer_primary_segment text,
  customer_tam text,
  customer_sam text,
  customer_som text,
  customer_geography text,
  customer_wtp text,
  customer_avg_check double precision,
  
  -- Channels
  channels_acquisition jsonb,
  channels_sales text,
  channels_cac double precision,
  channels_cac_description text,
  channels_marketing text,
  channels_funnel text,
  
  -- Revenue
  revenue_projected_12m double precision,
  revenue_streams jsonb,
  revenue_pricing text,
  
  -- Costs
  cost_breakdown text,
  cost_gross_margin double precision,
  arpu double precision,
  customer_lifetime double precision,
  contribution_margin double precision,
  cost_runway integer,
  
  -- Funding
  funding_raised double precision,
  funding_sought double precision,
  funding_sources jsonb,
  use_of_funds jsonb,
  
  -- Team
  team_founders text,
  team_key_hires text,
  team_specialists text,
  team_gaps text,
  
  -- Resources
  resources_physical text,
  resources_intellectual text,
  resources_needed text,
  resources_dependencies text,
  
  -- Activities
  activities_production text,
  activities_innovation text,
  activities_platform text,
  activities_marketing text,
  activities_operations text,
  
  -- Partners
  partners_strategic jsonb,
  
  -- Competition
  competitors text,
  competition_why_choose text,
  competition_defensibility text,
  
  -- Risks & Growth
  risks text,
  traction text,
  growth_plan text,
  growth_new_markets text,
  growth_payback_period text,
  growth_targets_12m text,
  growth_targets_24m text,
  growth_targets_36m text,
  
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
