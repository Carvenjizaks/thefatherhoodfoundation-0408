-- ============================================
-- COMPREHENSIVE GROUPS MODULE
-- Community organization with discovery, chat, resources, and events
-- ============================================

-- Drop existing views that might conflict
DROP VIEW IF EXISTS public.group_statistics CASCADE;
DROP VIEW IF EXISTS public.group_member_stats CASCADE;

-- Group Types (categorization for discovery)
CREATE TABLE IF NOT EXISTS public.group_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- Group Tags (for flexible categorization)
CREATE TABLE IF NOT EXISTS public.group_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- Campuses/Locations
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Groups Table
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS group_type_id UUID REFERENCES public.group_types(id);
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES public.campuses(id);
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS stage_of_life TEXT; -- 'kids', 'teens', 'young_adults', 'adults', 'seniors', 'all'
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS gender_focus TEXT; -- 'men', 'women', 'mixed'
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS meeting_address TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS meeting_city TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members INTEGER;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS description_long TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS childcare_available BOOLEAN DEFAULT false;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS leader_profile_picture TEXT;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS leader_bio TEXT;

-- Group Tag Mappings
CREATE TABLE IF NOT EXISTS public.group_tag_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.group_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, tag_id)
);

-- Group Resources (documents, links, media)
CREATE TABLE IF NOT EXISTS public.group_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'document', 'link', 'video', 'audio', 'other'
  url TEXT,
  file_path TEXT,
  uploaded_by UUID REFERENCES public.contacts(id),
  is_visible_to_members BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Chat Messages
CREATE TABLE IF NOT EXISTS public.group_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'prayer_request', 'announcement', 'event'
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.group_chat_messages(id), -- for replies
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_chat_messages_group ON public.group_chat_messages(group_id, created_at DESC);

-- Group Events (different from organization-wide events)
CREATE TABLE IF NOT EXISTS public.group_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  max_attendees INTEGER,
  rsvp_required BOOLEAN DEFAULT false,
  rsvp_deadline TIMESTAMPTZ,
  created_by UUID REFERENCES public.contacts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Event RSVPs
CREATE TABLE IF NOT EXISTS public.group_event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.group_events(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL, -- 'going', 'maybe', 'not_going'
  guests_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, contact_id)
);

-- Group Join Requests (already exists but ensure structure)
ALTER TABLE public.group_join_requests ADD COLUMN IF NOT EXISTS request_message TEXT;
ALTER TABLE public.group_join_requests ADD COLUMN IF NOT EXISTS response_message TEXT;

-- Group Statistics View
CREATE OR REPLACE VIEW public.group_statistics AS
SELECT 
  g.id as group_id,
  g.name,
  g.is_open,
  g.stage_of_life,
  COUNT(DISTINCT gm.id) FILTER (WHERE gm.is_active = true) as total_members,
  COUNT(DISTINCT gmeet.id) as total_meetings,
  COALESCE(AVG(gmeet.attendance_count), 0) as avg_attendance,
  COUNT(DISTINCT gcm.id) as total_messages,
  COUNT(DISTINCT gr.id) as total_resources,
  COUNT(DISTINCT ge.id) as total_events,
  MAX(gcm.created_at) as last_activity_at
FROM public.groups g
LEFT JOIN public.group_members gm ON g.id = gm.group_id
LEFT JOIN public.group_meetings gmeet ON g.id = gmeet.group_id
LEFT JOIN public.group_chat_messages gcm ON g.id = gcm.group_id
LEFT JOIN public.group_resources gr ON g.id = gr.group_id
LEFT JOIN public.group_events ge ON g.id = ge.group_id
GROUP BY g.id, g.name, g.is_open, g.stage_of_life;

-- Enable RLS on new tables
ALTER TABLE public.group_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_tag_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_event_rsvps ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies for development
CREATE POLICY "group_types_allow_all" ON public.group_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_tags_allow_all" ON public.group_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "campuses_allow_all" ON public.campuses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_tag_mappings_allow_all" ON public.group_tag_mappings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_resources_allow_all" ON public.group_resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_chat_messages_allow_all" ON public.group_chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_events_allow_all" ON public.group_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "group_event_rsvps_allow_all" ON public.group_event_rsvps FOR ALL USING (true) WITH CHECK (true);

-- Insert default group types (only if organizations exist)
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT id INTO default_org_id FROM public.organizations LIMIT 1;
  
  IF default_org_id IS NOT NULL THEN
    INSERT INTO public.group_types (organization_id, name, description, icon) VALUES
    (default_org_id, 'LifeGroup', 'Small groups for fellowship and spiritual growth', '👥'),
    (default_org_id, 'Ministry', 'Service-focused groups', '🙏'),
    (default_org_id, 'Bible Study', 'Groups focused on studying Scripture', '📖'),
    (default_org_id, 'Prayer Group', 'Groups dedicated to prayer', '🕊️'),
    (default_org_id, 'Youth Group', 'Groups for young people', '🎯'),
    (default_org_id, 'Interest Group', 'Groups based on hobbies and interests', '⭐')
    ON CONFLICT (organization_id, name) DO NOTHING;

    INSERT INTO public.group_tags (organization_id, name, color) VALUES
    (default_org_id, 'Family Friendly', '#10b981'),
    (default_org_id, 'Newcomers Welcome', '#3b82f6'),
    (default_org_id, 'Spanish Speaking', '#f59e0b'),
    (default_org_id, 'Online', '#8b5cf6'),
    (default_org_id, 'Daytime', '#eab308'),
    (default_org_id, 'Evening', '#6366f1'),
    (default_org_id, 'Weekend', '#ec4899')
    ON CONFLICT (organization_id, name) DO NOTHING;
  END IF;
END $$;
