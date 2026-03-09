-- Create event_registrations table for all events (MGM, GOC, etc.)
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spouse_name TEXT,
  spouse_email TEXT,
  spouse_phone TEXT,
  session_date TEXT NOT NULL,
  dynamic_code TEXT NOT NULL UNIQUE,
  payment_status TEXT DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_dynamic_code ON event_registrations(dynamic_code);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage all registrations
CREATE POLICY "Service role can manage all registrations" ON event_registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to view their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email OR auth.jwt() ->> 'email' = spouse_email);
