-- Create GOC2026 referrals table
CREATE TABLE IF NOT EXISTS goc26_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_code TEXT NOT NULL,
  friend_name TEXT NOT NULL,
  friend_email TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_goc26_referrals_referrer_code ON goc26_referrals(referrer_code);
CREATE INDEX IF NOT EXISTS idx_goc26_referrals_sent_at ON goc26_referrals(sent_at);

-- Add RLS policies
ALTER TABLE goc26_referrals ENABLE ROW LEVEL SECURITY;

-- Allow inserts from API
CREATE POLICY "Allow inserts" ON goc26_referrals
  FOR INSERT WITH CHECK (true);

-- Allow select for admins
CREATE POLICY "Allow select for admins" ON goc26_referrals
  FOR SELECT USING (auth.role() = 'authenticated');
