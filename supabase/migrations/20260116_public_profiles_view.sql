-- Create a public_profiles view that exposes only safe user columns
-- This allows the CTF leaderboard and meeting registration pages to display
-- user info without exposing sensitive data like email or student_id

-- The view bypasses RLS on the users table since it's created by the superuser
-- and only exposes non-sensitive columns
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  display_name,
  photo_url
FROM public.users;

-- Grant access to the view for all roles (including anonymous users)
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add a comment explaining the purpose
COMMENT ON VIEW public.public_profiles IS 'Public-facing user profile data for leaderboards and registration displays';

-- Create a secure function for officers to get user profiles (including email)
-- This bypasses RLS using SECURITY DEFINER to avoid infinite recursion
-- Note: We can't use a simple RLS policy because checking is_officer would query
-- the users table, triggering the same policy and causing infinite recursion
CREATE OR REPLACE FUNCTION get_user_profiles_for_officers(user_ids UUID[])
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  photo_url TEXT,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is an officer
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.is_officer = true
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an officer';
  END IF;

  -- Return the user profiles
  RETURN QUERY
  SELECT u.id, u.display_name, u.photo_url, u.email
  FROM users u
  WHERE u.id = ANY(user_ids);
END;
$$;
