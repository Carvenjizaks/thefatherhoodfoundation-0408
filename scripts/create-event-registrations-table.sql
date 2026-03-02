-- Create events table to manage all events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  location TEXT,
  banner_image TEXT,
  registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create general event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cellphone TEXT NOT NULL,
  spouse_name TEXT,
  spouse_email TEXT,
  spouse_cellphone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default events
INSERT INTO events (slug, title, description, start_date, end_date, location, banner_image, registration_open)
VALUES 
  ('my-great-marriage-2026', 'MyGreatMarriage Conference 2026', 'A conference designed to strengthen marriages and build lasting partnerships.', '2026-05-01', '2026-05-01', 'To be Announced', '/images/banners/mygreatmarriage-banner.jpg', true),
  ('my-great-marriage-followup-2026', 'MyGreatMarriage Follow-Up 2026', 'Follow-up session for the MyGreatMarriage Conference.', '2026-09-02', '2026-09-02', 'To be Announced', '/images/banners/mygreatmarriage-banner.jpg', false),
  ('goc-2026', 'Gathering of Champions 2026 (GOC26)', 'Annual men''s event bringing together champions from across the region.', '2026-07-17', '2026-07-19', 'To be Announced', '/images/banners/goc26-banner.jpg', true)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events
CREATE POLICY "Allow public read access to events" ON events
  FOR SELECT USING (true);

-- Allow public insert access to registrations
CREATE POLICY "Allow public insert access to registrations" ON event_registrations
  FOR INSERT WITH CHECK (true);
