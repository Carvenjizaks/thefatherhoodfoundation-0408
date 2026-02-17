-- Sync existing dreamteam_volunteers into the contacts table
-- and link them via contact_id

-- 1. Insert volunteers as contacts (skip duplicates by email)
INSERT INTO contacts (organization_id, first_name, last_name, email, phone, status, involvement, created_at, updated_at)
SELECT
  v.organization_id,
  v.first_name,
  v.last_name,
  LOWER(TRIM(v.email)),
  TRIM(v.phone),
  'active',
  '{"dreamteam": true}'::jsonb,
  NOW(),
  NOW()
FROM dreamteam_volunteers v
WHERE v.email IS NOT NULL
ON CONFLICT (organization_id, email) DO UPDATE
  SET involvement = COALESCE(contacts.involvement, '{}'::jsonb) || '{"dreamteam": true}'::jsonb,
      updated_at = NOW();

-- 2. Link volunteers to their matching contacts via contact_id
UPDATE dreamteam_volunteers v
SET contact_id = c.id
FROM contacts c
WHERE c.organization_id = v.organization_id
  AND c.email = LOWER(TRIM(v.email))
  AND v.contact_id IS NULL;
