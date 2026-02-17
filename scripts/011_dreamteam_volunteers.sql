-- DreamTeam Volunteers Table
-- Stores volunteer sign-ups for the DreamTeam ministry serving areas

CREATE TABLE IF NOT EXISTS public.dreamteam_volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  
  -- Personal info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Service details
  service_area TEXT NOT NULL, -- e.g. 'Ushering & Hospitality', 'Media & Sound', etc.
  custom_service_area TEXT, -- filled when service_area = 'Other'
  skills TEXT,
  experience TEXT,
  availability TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, inactive
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  welcome_email_sent_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.dreamteam_volunteers ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "dreamteam_volunteers_allow_all" ON public.dreamteam_volunteers
  FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_dreamteam_org ON public.dreamteam_volunteers(organization_id);
CREATE INDEX IF NOT EXISTS idx_dreamteam_service ON public.dreamteam_volunteers(service_area);
CREATE INDEX IF NOT EXISTS idx_dreamteam_status ON public.dreamteam_volunteers(status);
CREATE INDEX IF NOT EXISTS idx_dreamteam_email ON public.dreamteam_volunteers(email);
