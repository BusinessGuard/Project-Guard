-- Analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Scores
  overall_score double precision,
  investment_readiness text,
  value_proposition_score double precision,
  customer_segments_score double precision,
  channels_score double precision,
  revenue_score double precision,
  costs_score double precision,
  key_resources_score double precision,
  key_activities_score double precision,
  key_partners_score double precision,
  team_score double precision,
  
  -- Analysis results
  expert_insights jsonb NOT NULL,
  consensus_findings jsonb NOT NULL,
  growth_plan jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  financial_forecast jsonb NOT NULL,
  
  -- Metadata
  ai_model text NOT NULL DEFAULT 'gpt-4-turbo',
  tokens_used integer,
  processing_time integer,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Analyses policies
CREATE POLICY "Users can view analyses of own projects" ON public.analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analyses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analyses for own projects" ON public.analyses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analyses.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_analyses_project_id ON public.analyses(project_id);
CREATE INDEX idx_analyses_status ON public.analyses(status);
