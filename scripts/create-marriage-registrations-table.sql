-- Create table for MyGreatMarriage 2026 event registrations
CREATE TABLE IF NOT EXISTS marriage_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cellphone TEXT NOT NULL,
  spouse_name TEXT,
  spouse_email TEXT,
  spouse_cellphone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE marriage_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert registrations
CREATE POLICY "Anyone can register" ON marriage_registrations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to view all registrations (for admin)
CREATE POLICY "Authenticated users can view registrations" ON marriage_registrations
  FOR SELECT USING (auth.role() = 'authenticated');
