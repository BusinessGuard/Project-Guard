-- Add admin role support

-- Add role column to users table
ALTER TABLE public.users
  ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- RLS: admin can view ALL projects
CREATE POLICY "Admin can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS: admin can view ALL project_versions
CREATE POLICY "Admin can view all project_versions" ON public.project_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS: admin can view ALL users
CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
