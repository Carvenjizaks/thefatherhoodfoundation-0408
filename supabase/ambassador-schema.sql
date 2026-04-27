-- Supabase Database Schema for Ambassador Program
-- Run this in your Supabase SQL Editor

-- Ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  event_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  target_couples INTEGER DEFAULT 5,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations table (tracks couples who registered via ambassadors)
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  referral_code TEXT NOT NULL,
  event_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  ticket_type TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (for managing multiple events)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  venue TEXT,
  target_ambassadors INTEGER DEFAULT 20,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert MGM26 event
INSERT INTO events (code, name, description, start_date, end_date, venue, target_ambassadors)
VALUES (
  'MGM26',
  'MyGreatMarriage Conference 2026',
  'A transformative conference for couples to strengthen their marriage',
  '2026-05-07',
  '2026-05-09',
  'WHS Main Hall, Windhoek',
  20
)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ambassadors_referral_code ON ambassadors(referral_code);
CREATE INDEX IF NOT EXISTS idx_ambassadors_event_code ON ambassadors(event_code);
CREATE INDEX IF NOT EXISTS idx_registrations_referral_code ON event_registrations(referral_code);
CREATE INDEX IF NOT EXISTS idx_registrations_event_code ON event_registrations(event_code);

-- Enable Row Level Security (RLS)
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow all access to authenticated users" ON ambassadors
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all access to authenticated users" ON event_registrations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all access to authenticated users" ON events
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ambassadors
DROP TRIGGER IF EXISTS update_ambassadors_updated_at ON ambassadors;
CREATE TRIGGER update_ambassadors_updated_at
  BEFORE UPDATE ON ambassadors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
