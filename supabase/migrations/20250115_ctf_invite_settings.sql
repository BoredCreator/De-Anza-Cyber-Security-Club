-- Add invite link settings to ctf_teams table
ALTER TABLE ctf_teams
ADD COLUMN IF NOT EXISTS invite_expires_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invite_max_uses INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invite_uses_count INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN ctf_teams.invite_expires_at IS 'When the invite link expires (null = never)';
COMMENT ON COLUMN ctf_teams.invite_max_uses IS 'Maximum number of times the invite link can be used (null = unlimited)';
COMMENT ON COLUMN ctf_teams.invite_uses_count IS 'Number of times the current invite link has been used';
