-- Convert role column from TEXT with CHECK to a proper enum type
-- Must drop dependent RLS policies first, then recreate them

-- Drop CHECK constraint from the original migration
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Drop policies that depend on the role column
DROP POLICY IF EXISTS "Admin can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can view all project_versions" ON public.project_versions;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;

-- Create enum type
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Convert column
ALTER TABLE public.users
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.user_role USING role::public.user_role,
  ALTER COLUMN role SET DEFAULT 'user';

-- Recreate RLS policies
CREATE POLICY "Admin can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'::public.user_role)
  );

CREATE POLICY "Admin can view all project_versions" ON public.project_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'::public.user_role)
  );

CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'::public.user_role)
  );
