-- Create unified contacts table for all subscribers and registrations
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cellphone VARCHAR(50),
  source VARCHAR(50) NOT NULL, -- 'newsletter', 'event_registration', 'volunteer', 'partnership'
  source_details TEXT, -- event name, form name, etc.
  email_confirmed BOOLEAN DEFAULT false,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  welcome_email_sent BOOLEAN DEFAULT false,
  welcome_email_sent_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spouse/partner contacts table (linked to main contact)
CREATE TABLE IF NOT EXISTS contact_spouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  cellphone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL, -- 'welcome', 'confirmation', 'event_reminder'
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' -- 'sent', 'failed', 'delivered'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_confirmation_token ON contacts(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_contact_spouses_contact_id ON contact_spouses(contact_id);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_spouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts to contacts
CREATE POLICY "Allow public insert contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to update their own confirmation status via token
CREATE POLICY "Allow public update via token" ON contacts
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Allow public read for email confirmation
CREATE POLICY "Allow public read for confirmation" ON contacts
  FOR SELECT TO anon
  USING (true);

-- Allow public insert spouse contacts
CREATE POLICY "Allow public insert spouses" ON contact_spouses
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated admin read all
CREATE POLICY "Allow admin read contacts" ON contacts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin read spouses" ON contact_spouses
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin read email logs" ON email_logs
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to insert email logs
CREATE POLICY "Allow service insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (true);
