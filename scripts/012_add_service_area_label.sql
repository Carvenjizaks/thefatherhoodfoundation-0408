-- Add service_area_label column to dreamteam_volunteers
-- This stores the human-readable label for the service area
ALTER TABLE public.dreamteam_volunteers ADD COLUMN IF NOT EXISTS service_area_label TEXT;
