-- Add check-in verification columns to table_talk_registrations
ALTER TABLE table_talk_registrations 
ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checked_in_by TEXT,
ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_verification_attempt TIMESTAMP WITH TIME ZONE;

-- Create index for faster check-in lookups
CREATE INDEX IF NOT EXISTS idx_registrations_checked_in ON table_talk_registrations(checked_in);

-- Create a verification log table for audit trail
CREATE TABLE IF NOT EXISTS registration_verification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES table_talk_registrations(id) ON DELETE CASCADE,
  dynamic_code VARCHAR(20) NOT NULL,
  verification_status VARCHAR(20) NOT NULL, -- 'success', 'invalid_code', 'already_checked_in', 'wrong_event'
  verified_by TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for verification logs
CREATE INDEX IF NOT EXISTS idx_verification_logs_registration ON registration_verification_logs(registration_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_code ON registration_verification_logs(dynamic_code);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created ON registration_verification_logs(created_at);

-- Enable RLS on verification logs
ALTER TABLE registration_verification_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to verification logs
CREATE POLICY "Service role can manage verification_logs" ON registration_verification_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admin) to read verification logs
CREATE POLICY "Allow admin read verification_logs" ON registration_verification_logs
  FOR SELECT TO authenticated
  USING (true);
