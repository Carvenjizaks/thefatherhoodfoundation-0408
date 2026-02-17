-- Allow anonymous/public SELECT on organizations table
-- This is needed for the public /join/dreamteam form to look up org branding (name)
-- RLS row-level: allow all rows for SELECT by anon role
-- The API route already limits the columns returned to only name/slug

CREATE POLICY "public_read_org_by_slug"
  ON organizations
  FOR SELECT
  TO anon
  USING (true);
