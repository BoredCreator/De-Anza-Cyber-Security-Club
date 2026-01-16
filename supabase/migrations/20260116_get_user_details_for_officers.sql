-- Function for officers to get detailed user info
CREATE OR REPLACE FUNCTION get_user_details_for_officers(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  email TEXT,
  photo_url TEXT,
  student_id TEXT,
  is_officer BOOLEAN,
  created_at TIMESTAMPTZ
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

  -- Return the user details
  RETURN QUERY
  SELECT u.id, u.display_name, u.email, u.photo_url, u.student_id, u.is_officer, u.created_at
  FROM users u
  WHERE u.id = target_user_id;
END;
$$;
