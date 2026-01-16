-- CTF Settings table for storing configuration like leaderboard freeze
CREATE TABLE IF NOT EXISTS ctf_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE ctf_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read CTF settings"
  ON ctf_settings FOR SELECT
  USING (true);

-- Only officers can update settings
CREATE POLICY "Officers can update CTF settings"
  ON ctf_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_officer = true
    )
  );

-- Only officers can insert settings
CREATE POLICY "Officers can insert CTF settings"
  ON ctf_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_officer = true
    )
  );

-- Insert default leaderboard_freeze setting
INSERT INTO ctf_settings (key, value)
VALUES ('leaderboard_freeze', '{"is_frozen": false, "frozen_at": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Function for officers to toggle leaderboard freeze
CREATE OR REPLACE FUNCTION toggle_leaderboard_freeze(should_freeze BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_value JSONB;
BEGIN
  -- Check if the calling user is an officer
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.is_officer = true
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an officer';
  END IF;

  -- Build the new value
  IF should_freeze THEN
    new_value := jsonb_build_object('is_frozen', true, 'frozen_at', NOW());
  ELSE
    new_value := jsonb_build_object('is_frozen', false, 'frozen_at', NULL);
  END IF;

  -- Update or insert the setting
  INSERT INTO ctf_settings (key, value, updated_at, updated_by)
  VALUES ('leaderboard_freeze', new_value, NOW(), auth.uid())
  ON CONFLICT (key) DO UPDATE
  SET value = new_value, updated_at = NOW(), updated_by = auth.uid();

  RETURN new_value;
END;
$$;
