-- Auto-sync DreamTeam volunteers to contacts on insert/update
-- This trigger ensures every DreamTeam volunteer has a matching contact record

CREATE OR REPLACE FUNCTION sync_volunteer_to_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contact_id uuid;
BEGIN
  -- Check if a contact already exists for this email + org
  SELECT id INTO v_contact_id
  FROM contacts
  WHERE organization_id = NEW.organization_id
    AND lower(email) = lower(TRIM(NEW.email))
  LIMIT 1;

  IF v_contact_id IS NULL THEN
    -- Create new contact
    INSERT INTO contacts (organization_id, first_name, last_name, email, phone, status, involvement, created_at, updated_at)
    VALUES (
      NEW.organization_id,
      NEW.first_name,
      NEW.last_name,
      LOWER(TRIM(NEW.email)),
      TRIM(NEW.phone),
      'active',
      '{"dreamteam": true}'::jsonb,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_contact_id;
  ELSE
    -- Update existing contact with dreamteam involvement flag
    UPDATE contacts
    SET involvement = COALESCE(involvement, '{}'::jsonb) || '{"dreamteam": true}'::jsonb,
        first_name = COALESCE(NULLIF(NEW.first_name, ''), first_name),
        last_name = COALESCE(NULLIF(NEW.last_name, ''), last_name),
        phone = COALESCE(NULLIF(TRIM(NEW.phone), ''), phone),
        updated_at = NOW()
    WHERE id = v_contact_id;
  END IF;

  -- Link volunteer to contact
  NEW.contact_id := v_contact_id;

  RETURN NEW;
END;
$$;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS sync_volunteer_insert ON dreamteam_volunteers;
DROP TRIGGER IF EXISTS sync_volunteer_update ON dreamteam_volunteers;

-- Create triggers for insert and update
CREATE TRIGGER sync_volunteer_insert
  BEFORE INSERT ON dreamteam_volunteers
  FOR EACH ROW
  EXECUTE FUNCTION sync_volunteer_to_contact();

CREATE TRIGGER sync_volunteer_update
  BEFORE UPDATE ON dreamteam_volunteers
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email OR OLD.first_name IS DISTINCT FROM NEW.first_name OR OLD.last_name IS DISTINCT FROM NEW.last_name)
  EXECUTE FUNCTION sync_volunteer_to_contact();
