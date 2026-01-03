-- Add registration fields to meetings table
ALTER TABLE public.meetings
ADD COLUMN registration_type TEXT NOT NULL DEFAULT 'open' CHECK (registration_type IN ('open', 'invite_only', 'closed')),
ADD COLUMN registration_capacity INTEGER,
ADD COLUMN invite_code TEXT,
ADD COLUMN invite_form_url TEXT;

-- Create registrations table
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('registered', 'waitlist', 'invited', 'attended', 'cancelled')),
    invite_code_used TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

-- Create index for faster queries
CREATE INDEX idx_registrations_meeting_id ON public.registrations(meeting_id);
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX idx_registrations_status ON public.registrations(status);

-- Row-Level Security Policies for registrations table

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own registrations, officers can view all
CREATE POLICY "Users can view own registrations"
ON public.registrations FOR SELECT
USING (
    auth.uid() = user_id
    OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND is_officer = true
    )
);

-- INSERT: Users can insert their own registrations
CREATE POLICY "Users can insert own registrations"
ON public.registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own registrations (to cancel), officers can update all
CREATE POLICY "Users can update own registrations"
ON public.registrations FOR UPDATE
USING (
    auth.uid() = user_id
    OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND is_officer = true
    )
);

-- DELETE: Users can delete their own registrations, officers can delete all
CREATE POLICY "Users can delete own registrations"
ON public.registrations FOR DELETE
USING (
    auth.uid() = user_id
    OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND is_officer = true
    )
);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION update_registrations_updated_at();

-- Function to update registration status to 'attended' when attendance is marked
CREATE OR REPLACE FUNCTION mark_registration_attended()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.registrations
    SET status = 'attended', updated_at = NOW()
    WHERE meeting_id = NEW.meeting_id
    AND user_id = NEW.user_id
    AND status IN ('registered', 'waitlist', 'invited');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically mark registration as attended when attendance is recorded
CREATE TRIGGER attendance_marks_registration_attended
AFTER INSERT ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION mark_registration_attended();
