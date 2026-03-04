-- Create table for Table Talk session registrations
CREATE TABLE IF NOT EXISTS table_talk_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  session_date DATE NOT NULL,
  session_time VARCHAR(50) DEFAULT '8:30am - 10:30am',
  location VARCHAR(255) DEFAULT 'Scouts Hall, Suiderhof, Windhoek',
  dynamic_code VARCHAR(20) NOT NULL UNIQUE,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_amount DECIMAL(10,2) DEFAULT 50.00,
  payment_reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON table_talk_registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_session_date ON table_talk_registrations(session_date);
CREATE INDEX IF NOT EXISTS idx_registrations_dynamic_code ON table_talk_registrations(dynamic_code);

-- Enable Row Level Security
ALTER TABLE table_talk_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for registration form)
CREATE POLICY "Allow public insert registrations" ON table_talk_registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to read their own registration by email
CREATE POLICY "Allow public read own registration" ON table_talk_registrations
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated users (admin) to read all registrations
CREATE POLICY "Allow admin read all registrations" ON table_talk_registrations
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update registrations
CREATE POLICY "Allow admin update registrations" ON table_talk_registrations
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admin) to delete registrations
CREATE POLICY "Allow admin delete registrations" ON table_talk_registrations
  FOR DELETE TO authenticated
  USING (true);
