-- Add current_version field to projects table
ALTER TABLE projects ADD COLUMN current_version INTEGER DEFAULT 1 NOT NULL;

-- Add comment
COMMENT ON COLUMN projects.current_version IS 'Current/latest version number of the project';

-- Update existing projects to have current_version = max version_number
UPDATE projects p
SET current_version = (
  SELECT COALESCE(MAX(pv.version_number), 1)
  FROM project_versions pv
  WHERE pv.project_id = p.id
);
