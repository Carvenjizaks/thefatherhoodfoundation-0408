-- Create page_settings table for visibility management
CREATE TABLE IF NOT EXISTS page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  hidden_message TEXT DEFAULT 'This page is temporarily unavailable. Please check back later.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- Policy for service role access
CREATE POLICY "Service role can manage page_settings" ON page_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default pages
INSERT INTO page_settings (page_path, page_name, is_visible) VALUES
  ('/active-parenting', 'Active Parenting', true),
  ('/community-development', 'Community Development', true),
  ('/curriculum', 'Curriculum', true),
  ('/donate', 'Donate', true),
  ('/events', 'Events', true),
  ('/events/my-great-marriage-2026', 'My Great Marriage 2026', true),
  ('/get-involved', 'Get Involved', true),
  ('/mentoring-men', 'Mentoring Men', true),
  ('/my-great-marriage', 'My Great Marriage', true),
  ('/partnership', 'Partnership', true),
  ('/partnership-inquiry', 'Partnership Inquiry', true),
  ('/volunteer-application', 'Volunteer Application', true)
ON CONFLICT (page_path) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_settings_path ON page_settings(page_path);
