-- Fix infinite recursion in admin RLS policies.
-- The "Admin can view all users" policy was querying public.users
-- inside a policy ON public.users — causing infinite recursion.
-- Solution: use a SECURITY DEFINER function that bypasses RLS.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'::public.user_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate all three policies using the helper function
DROP POLICY IF EXISTS "Admin can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can view all project_versions" ON public.project_versions;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;

CREATE POLICY "Admin can view all projects" ON public.projects
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can view all project_versions" ON public.project_versions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (public.is_admin());
