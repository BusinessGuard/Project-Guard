-- Add openai_analysis_log table if not exists
CREATE TABLE IF NOT EXISTS public.openai_analysis_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES public.project_versions(id) ON DELETE CASCADE,
  user_prompt text NOT NULL,
  system_prompt text,
  openai_response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS for openai_analysis_log (it's just for logging)
ALTER TABLE public.openai_analysis_log DISABLE ROW LEVEL SECURITY;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_openai_analysis_log_version_id ON public.openai_analysis_log(project_version_id);
