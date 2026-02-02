-- Add CASCADE delete to project_versions foreign key
-- First, drop the existing foreign key constraint
ALTER TABLE project_versions 
DROP CONSTRAINT IF EXISTS project_versions_project_id_fkey;

-- Re-add the foreign key with CASCADE delete
ALTER TABLE project_versions 
ADD CONSTRAINT project_versions_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES projects(id) 
ON DELETE CASCADE;

-- Also add CASCADE to openai_analysis_log if it exists
ALTER TABLE openai_analysis_log 
DROP CONSTRAINT IF EXISTS openai_analysis_log_project_version_id_fkey;

ALTER TABLE openai_analysis_log 
ADD CONSTRAINT openai_analysis_log_project_version_id_fkey 
FOREIGN KEY (project_version_id) 
REFERENCES project_versions(id) 
ON DELETE CASCADE;
