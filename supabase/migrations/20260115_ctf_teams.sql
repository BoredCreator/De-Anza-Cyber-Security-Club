-- CTF Teams table
CREATE TABLE IF NOT EXISTS ctf_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  invite_code VARCHAR(12) UNIQUE NOT NULL,
  captain_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTF Team Members table
CREATE TABLE IF NOT EXISTS ctf_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES ctf_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id),
  UNIQUE(user_id) -- A user can only be in one team
);

-- CTF Submissions table (tracks all attempts, correct and incorrect)
CREATE TABLE IF NOT EXISTS ctf_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES ctf_teams(id) ON DELETE CASCADE,
  challenge_id VARCHAR(50) NOT NULL,
  submitted_flag TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ctf_team_members_team_id ON ctf_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_ctf_team_members_user_id ON ctf_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_ctf_submissions_team_id ON ctf_submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_ctf_submissions_challenge_id ON ctf_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_ctf_submissions_is_correct ON ctf_submissions(is_correct);

-- Prevent duplicate correct submissions for the same challenge
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_correct_submission
ON ctf_submissions(team_id, challenge_id)
WHERE is_correct = TRUE;

-- Enable Row Level Security
ALTER TABLE ctf_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for ctf_teams
CREATE POLICY "Teams are viewable by everyone" ON ctf_teams
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON ctf_teams
  FOR INSERT WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Captains can update their teams" ON ctf_teams
  FOR UPDATE USING (auth.uid() = captain_id);

CREATE POLICY "Captains can delete their teams" ON ctf_teams
  FOR DELETE USING (auth.uid() = captain_id);

-- Policies for ctf_team_members
CREATE POLICY "Team members are viewable by everyone" ON ctf_team_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join teams" ON ctf_team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams" ON ctf_team_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for ctf_submissions
CREATE POLICY "Submissions are viewable by everyone" ON ctf_submissions
  FOR SELECT USING (true);

CREATE POLICY "Team members can submit flags" ON ctf_submissions
  FOR INSERT WITH CHECK (
    auth.uid() = submitted_by AND
    EXISTS (
      SELECT 1 FROM ctf_team_members
      WHERE team_id = ctf_submissions.team_id
      AND user_id = auth.uid()
    )
  );

-- Function to check team size before adding members
CREATE OR REPLACE FUNCTION check_team_size()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM ctf_team_members WHERE team_id = NEW.team_id) >= 4 THEN
    RAISE EXCEPTION 'Team is already at maximum capacity (4 members)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce team size limit
DROP TRIGGER IF EXISTS enforce_team_size ON ctf_team_members;
CREATE TRIGGER enforce_team_size
  BEFORE INSERT ON ctf_team_members
  FOR EACH ROW
  EXECUTE FUNCTION check_team_size();

-- Function to generate random invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
