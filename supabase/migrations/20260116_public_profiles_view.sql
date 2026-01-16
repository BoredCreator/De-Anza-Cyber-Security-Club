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

-- Allow officers to view all user profiles (for meeting registration management)
-- This policy complements the existing "Users can view own profile" policy
CREATE POLICY "Officers can view all profiles" ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.is_officer = true
  )
);
