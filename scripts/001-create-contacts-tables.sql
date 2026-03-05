-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cellphone TEXT,
  source TEXT NOT NULL CHECK (source IN ('newsletter', 'event_registration', 'volunteer', 'partnership')),
  source_details TEXT,
  email_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  confirmed_at TIMESTAMPTZ,
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  welcome_email_sent_at TIMESTAMPTZ,
  confirmation_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create index on confirmation_token for email confirmation
CREATE INDEX IF NOT EXISTS idx_contacts_confirmation_token ON contacts(confirmation_token);

-- Create contact_spouses table
CREATE TABLE IF NOT EXISTS contact_spouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  email TEXT,
  cellphone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on contact_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_spouses_contact_id ON contact_spouses(contact_id);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on contact_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_contact_id ON email_logs(contact_id);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_spouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access for server-side operations)
CREATE POLICY "Service role can manage contacts" ON contacts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage contact_spouses" ON contact_spouses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage email_logs" ON email_logs
  FOR ALL USING (true) WITH CHECK (true);
