-- ============================================
-- PREACHING SCHEDULE MODULE
-- Monthly preaching/teaching schedule with speaker management
-- ============================================

-- Preaching schedules (one per month/series)
CREATE TABLE IF NOT EXISTS public.preaching_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual schedule entries (each Sunday/session)
CREATE TABLE IF NOT EXISTS public.schedule_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.preaching_schedules(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  week_number INTEGER,
  title TEXT NOT NULL,
  topic TEXT,
  event_date DATE NOT NULL,
  start_time TIME DEFAULT '08:00',
  end_time TIME DEFAULT '09:15',
  speaker_id UUID REFERENCES public.contacts(id),
  setup_team TEXT,
  is_break BOOLEAN DEFAULT FALSE,
  break_reason TEXT,
  notes TEXT,
  sequence_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speaker notifications and confirmations
CREATE TABLE IF NOT EXISTS public.speaker_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.schedule_entries(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id),
  notification_type TEXT NOT NULL DEFAULT 'assignment' CHECK (notification_type IN ('assignment', 'reminder', 'change', 'cancellation')),
  email_sent_at TIMESTAMPTZ,
  email_status TEXT DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'delivered', 'failed')),
  response_status TEXT DEFAULT 'awaiting' CHECK (response_status IN ('awaiting', 'accepted', 'declined')),
  response_message TEXT,
  responded_at TIMESTAMPTZ,
  response_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS with allow-all for dev
ALTER TABLE public.preaching_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaker_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "preaching_schedules_allow_all" ON public.preaching_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "schedule_entries_allow_all" ON public.schedule_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "speaker_notifications_allow_all" ON public.speaker_notifications FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schedule_entries_schedule_id ON public.schedule_entries(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_speaker_id ON public.schedule_entries(speaker_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_event_date ON public.schedule_entries(event_date);
CREATE INDEX IF NOT EXISTS idx_speaker_notifications_entry_id ON public.speaker_notifications(entry_id);
CREATE INDEX IF NOT EXISTS idx_speaker_notifications_token ON public.speaker_notifications(response_token);
