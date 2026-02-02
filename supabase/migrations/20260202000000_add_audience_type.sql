-- Add audience_type column to project_versions
ALTER TABLE public.project_versions 
ADD COLUMN audience_type text CHECK (audience_type IN ('venture', 'bank', 'corporate'));

-- Set default value for existing rows (if any)
UPDATE public.project_versions 
SET audience_type = 'venture' 
WHERE audience_type IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE public.project_versions 
ALTER COLUMN audience_type SET NOT NULL;

-- Add index for audience_type
CREATE INDEX idx_project_versions_audience_type ON public.project_versions(audience_type);

-- Drop old unique constraint
DROP INDEX IF EXISTS idx_project_versions_current;

-- Create new unique constraint for project_id + audience_type
CREATE UNIQUE INDEX idx_project_versions_current ON public.project_versions(project_id, audience_type) 
WHERE is_current = true;
