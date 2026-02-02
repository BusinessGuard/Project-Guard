-- Remove is_current field and unique constraint from project_versions table
-- Drop the unique constraint first
DROP INDEX IF EXISTS idx_project_versions_current;

-- Drop the column
ALTER TABLE project_versions DROP COLUMN IF EXISTS is_current;
