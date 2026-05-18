-- Migration: Add referral tracking columns to event_registrations and goc26_referrals tables
-- Run this migration in Supabase SQL Editor

-- Add referral tracking columns to event_registrations table
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS referral_email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS referral_token TEXT,
ADD COLUMN IF NOT EXISTS referral_email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS referrals_sent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_referral_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS referred_by_email TEXT,
ADD COLUMN IF NOT EXISTS referred_by_name TEXT;

-- Create index on referral_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_event_registrations_referral_token 
ON event_registrations(referral_token) 
WHERE referral_token IS NOT NULL;

-- Update goc26_referrals table to track conversions better
ALTER TABLE goc26_referrals
ADD COLUMN IF NOT EXISTS referrer_id UUID REFERENCES event_registrations(id),
ADD COLUMN IF NOT EXISTS referrer_email TEXT,
ADD COLUMN IF NOT EXISTS personal_note TEXT,
ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS converted_registration_id UUID REFERENCES event_registrations(id);

-- Create index for finding referrals by email (to check if someone registered from referral)
CREATE INDEX IF NOT EXISTS idx_goc26_referrals_friend_email 
ON goc26_referrals(friend_email);

-- Create index for finding all referrals by a specific referrer
CREATE INDEX IF NOT EXISTS idx_goc26_referrals_referrer_id 
ON goc26_referrals(referrer_id) 
WHERE referrer_id IS NOT NULL;

-- Function to automatically mark referrals as converted when someone registers
CREATE OR REPLACE FUNCTION check_referral_conversion()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new registration email matches any pending referral
    UPDATE goc26_referrals
    SET 
        converted = TRUE,
        converted_at = NOW(),
        converted_registration_id = NEW.id,
        status = 'converted'
    WHERE 
        friend_email = NEW.email 
        AND event_id = 'goc26'
        AND converted = FALSE;
    
    -- Also update the new registration to note who referred them
    IF EXISTS (
        SELECT 1 FROM goc26_referrals 
        WHERE friend_email = NEW.email 
        AND event_id = 'goc26'
    ) THEN
        UPDATE event_registrations
        SET 
            referred_by_email = (
                SELECT referrer_email FROM goc26_referrals 
                WHERE friend_email = NEW.email AND event_id = 'goc26' 
                LIMIT 1
            ),
            referred_by_name = (
                SELECT referrer_name FROM goc26_referrals 
                WHERE friend_email = NEW.email AND event_id = 'goc26' 
                LIMIT 1
            )
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for referral conversions on new registrations
DROP TRIGGER IF EXISTS trigger_check_referral_conversion ON event_registrations;
CREATE TRIGGER trigger_check_referral_conversion
AFTER INSERT ON event_registrations
FOR EACH ROW
WHEN (NEW.event_id = 'goc26')
EXECUTE FUNCTION check_referral_conversion();

-- Add event_id column to goc26_referrals if not exists (for the trigger)
ALTER TABLE goc26_referrals
ADD COLUMN IF NOT EXISTS event_id TEXT DEFAULT 'goc26';

COMMENT ON COLUMN event_registrations.referral_email_sent IS 'Whether the day-after referral invitation email has been sent';
COMMENT ON COLUMN event_registrations.referral_token IS 'Unique token for private referral link';
COMMENT ON COLUMN event_registrations.referrals_sent IS 'Number of referral invitations sent by this registrant';
COMMENT ON COLUMN event_registrations.referred_by_email IS 'Email of the person who referred this registrant';
COMMENT ON COLUMN goc26_referrals.converted IS 'Whether the referred person has registered';
COMMENT ON COLUMN goc26_referrals.converted_registration_id IS 'ID of the registration created from this referral';
