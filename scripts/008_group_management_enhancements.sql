-- Group Management Enhancements
-- Adds join requests, invitations, messaging, and attendance tracking

-- Add profile picture to contacts
alter table public.contacts 
  add column if not exists profile_picture_url text;

-- Group Join Requests
create table if not exists public.group_join_requests (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  message text,
  requested_at timestamptz default now(),
  responded_at timestamptz,
  responded_by uuid references public.profiles(id),
  response_message text,
  created_at timestamptz default now(),
  unique(group_id, contact_id)
);

alter table public.group_join_requests enable row level security;

-- Group Invitations
create table if not exists public.group_invitations (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  invited_by uuid references public.profiles(id) not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  invitation_message text,
  invited_at timestamptz default now(),
  responded_at timestamptz,
  created_at timestamptz default now(),
  unique(group_id, contact_id)
);

alter table public.group_invitations enable row level security;

-- Group Messages (for bulk and individual messaging)
create table if not exists public.group_messages (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade not null,
  sent_by uuid references public.profiles(id) not null,
  subject text not null,
  message_body text not null,
  is_bulk boolean default false,
  sent_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.group_messages enable row level security;

-- Group Message Recipients
create table if not exists public.group_message_recipients (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.group_messages(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  delivered_at timestamptz default now(),
  opened_at timestamptz,
  unique(message_id, contact_id)
);

alter table public.group_message_recipients enable row level security;

-- Group Statistics View
create or replace view public.group_statistics as
select 
  g.id as group_id,
  g.name as group_name,
  count(distinct gm.id) as total_members,
  count(distinct case when gm.is_active then gm.id end) as active_members,
  count(distinct gmeet.id) as total_meetings,
  count(distinct case when gmeet.status = 'completed' then gmeet.id end) as completed_meetings,
  avg(gmeet.attendance_count) as avg_attendance,
  max(gmeet.meeting_date) as last_meeting_date
from public.groups g
left join public.group_members gm on g.id = gm.group_id
left join public.group_meetings gmeet on g.id = gmeet.group_id
group by g.id, g.name;

-- Member Attendance Statistics View
create or replace view public.member_attendance_stats as
select 
  gm.group_id,
  gm.contact_id,
  c.first_name,
  c.last_name,
  c.email,
  count(distinct gmeet.id) as total_meetings_scheduled,
  count(distinct case when ma.attended then ma.meeting_id end) as meetings_attended,
  round(
    (count(distinct case when ma.attended then ma.meeting_id end)::numeric / 
    nullif(count(distinct gmeet.id), 0)) * 100, 
    2
  ) as attendance_rate,
  max(gmeet.meeting_date) as last_attended_date
from public.group_members gm
join public.contacts c on gm.contact_id = c.id
left join public.group_meetings gmeet on gm.group_id = gmeet.group_id
left join public.meeting_attendance ma on gmeet.id = ma.meeting_id and gm.contact_id = ma.contact_id
where gm.is_active = true
group by gm.group_id, gm.contact_id, c.first_name, c.last_name, c.email;

-- RLS Policies (allow all for development)
create policy "Allow all on group_join_requests" on public.group_join_requests for all using (true) with check (true);
create policy "Allow all on group_invitations" on public.group_invitations for all using (true) with check (true);
create policy "Allow all on group_messages" on public.group_messages for all using (true) with check (true);
create policy "Allow all on group_message_recipients" on public.group_message_recipients for all using (true) with check (true);

-- Indexes for performance
create index if not exists idx_group_join_requests_group on public.group_join_requests(group_id, status);
create index if not exists idx_group_invitations_contact on public.group_invitations(contact_id, status);
create index if not exists idx_group_messages_group on public.group_messages(group_id, sent_at);
create index if not exists idx_meeting_attendance_meeting on public.meeting_attendance(meeting_id, contact_id);
