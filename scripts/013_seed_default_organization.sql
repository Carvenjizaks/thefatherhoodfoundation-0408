-- Seed a default organization so the public DreamTeam form and dashboard pages work.
-- Uses the same UUID referenced by mockOrgId across dashboard pages.
INSERT INTO organizations (id, name, slug, settings, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Powerhouse Church',
  'powerhouse',
  '{}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
