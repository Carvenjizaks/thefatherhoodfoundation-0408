-- 1. Add unique constraint: one email per organization (prevents duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS contacts_org_email_unique
  ON contacts (organization_id, LOWER(email));

-- 2. Add unique constraint: one phone per organization (NULL phones are allowed)
CREATE UNIQUE INDEX IF NOT EXISTS contacts_org_phone_unique
  ON contacts (organization_id, phone)
  WHERE phone IS NOT NULL AND phone != '';

-- 3. Add involvement JSONB column to track where a contact is active
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS involvement jsonb DEFAULT '{}';

-- 4. Add assigned_contact_id to tasks for assigning tasks to contacts
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS assigned_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL;

-- 5. Allow anon role to insert into contacts (for public signup -> contact upsert)
CREATE POLICY "anon_insert_contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 6. Allow anon role to update contacts (for upsert involvement merge)
CREATE POLICY "anon_update_contacts"
  ON contacts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
