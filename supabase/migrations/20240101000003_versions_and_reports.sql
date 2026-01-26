-- Project versions table
CREATE TABLE IF NOT EXISTS public.project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number text NOT NULL,
  snapshot jsonb NOT NULL,
  changes_description text,
  changed_fields jsonb,
  overall_score double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Exported reports table
CREATE TABLE IF NOT EXISTS public.exported_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  analysis_id uuid NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  format text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  file_url text,
  file_size integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

-- Enable RLS
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exported_reports ENABLE ROW LEVEL SECURITY;

-- Project versions policies
CREATE POLICY "Users can view versions of own projects" ON public.project_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Exported reports policies
CREATE POLICY "Users can view reports of own projects" ON public.exported_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = exported_reports.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_exported_reports_project_id ON public.exported_reports(project_id);
CREATE INDEX idx_exported_reports_analysis_id ON public.exported_reports(analysis_id);
