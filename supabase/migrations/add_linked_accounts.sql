-- Migration: Add linked_accounts column to users table
-- Run this if you already have an existing database

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS linked_accounts JSONB DEFAULT '[]'::jsonb;

-- Example structure of linked_accounts:
-- [
--   {
--     "provider": "github",
--     "provider_account_id": "12345",
--     "provider_email": "user@example.com",
--     "provider_username": "username",
--     "provider_avatar_url": "https://...",
--     "linked_at": "2024-01-01T00:00:00Z"
--   }
-- ]
