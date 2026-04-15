-- Auto-insert into public.users when a new auth user is created

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, plan, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'free',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users that are missing from public.users
INSERT INTO public.users (id, email, name, plan, role)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  'free',
  'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
