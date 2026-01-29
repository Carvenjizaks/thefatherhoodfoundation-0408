-- Event Reminder System
-- Allows bulk reminders to be sent to all event participants at scheduled intervals

-- Event Reminder Templates
create table if not exists public.event_reminder_schedules (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  
  -- Reminder configuration
  reminder_number integer not null check (reminder_number between 1 and 3),
  days_before_event integer not null check (days_before_event > 0),
  send_time time not null default '09:00:00',
  
  -- Message customization
  subject text not null,
  message text not null,
  
  -- Status tracking
  scheduled_send_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'failed', 'cancelled')),
  sent_at timestamptz,
  recipient_count integer default 0,
  failed_count integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references public.profiles(id) on delete set null,
  
  unique(event_id, reminder_number)
);

alter table public.event_reminder_schedules enable row level security;

create policy "Users can view reminders for their organization events"
  on public.event_reminder_schedules for select
  using (organization_id = public.user_organization_id());

create policy "Admins can manage reminders"
  on public.event_reminder_schedules for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- Individual Reminder Deliveries (tracks each recipient)
create table if not exists public.reminder_deliveries (
  id uuid primary key default uuid_generate_v4(),
  reminder_schedule_id uuid references public.event_reminder_schedules(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  
  -- Delivery status
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'bounced')),
  sent_at timestamptz,
  error_message text,
  
  -- Engagement tracking
  opened_at timestamptz,
  clicked_at timestamptz,
  
  created_at timestamptz default now(),
  
  unique(reminder_schedule_id, contact_id)
);

alter table public.reminder_deliveries enable row level security;

create policy "Users can view deliveries for their organization"
  on public.reminder_deliveries for select
  using (
    exists (
      select 1 from public.event_reminder_schedules ers
      where ers.id = reminder_schedule_id
      and ers.organization_id = public.user_organization_id()
    )
  );

-- Function to calculate scheduled send time
create or replace function public.calculate_reminder_send_time(
  p_event_date date,
  p_days_before integer,
  p_send_time time
)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_send_datetime timestamptz;
begin
  v_send_datetime := (p_event_date - p_days_before * interval '1 day') + p_send_time;
  return v_send_datetime;
end;
$$;

-- Function to get all participants for an event
create or replace function public.get_event_participants(p_event_id uuid)
returns table (
  contact_id uuid,
  contact_name text,
  contact_email text,
  role_name text,
  response_status text
)
language plpgsql
stable
as $$
begin
  return query
  select 
    c.id as contact_id,
    c.first_name || ' ' || c.last_name as contact_name,
    c.email as contact_email,
    epa.role_name,
    coalesce(tar.response_status, 'pending') as response_status
  from public.event_program_items epi
  join public.event_program_assignments epa on epa.program_item_id = epi.id
  join public.contacts c on c.id = epa.assigned_to
  left join public.task_assignment_responses tar on tar.program_item_id = epi.id and tar.contact_id = c.id
  where epi.event_id = p_event_id
    and c.is_active = true
    and c.email is not null
  group by c.id, c.first_name, c.last_name, c.email, epa.role_name, tar.response_status
  order by c.first_name, c.last_name;
end;
$$;

-- Create indexes for performance
create index if not exists idx_reminder_schedules_event on public.event_reminder_schedules(event_id);
create index if not exists idx_reminder_schedules_status on public.event_reminder_schedules(status);
create index if not exists idx_reminder_schedules_send_time on public.event_reminder_schedules(scheduled_send_at) where status = 'scheduled';
create index if not exists idx_reminder_deliveries_schedule on public.reminder_deliveries(reminder_schedule_id);
create index if not exists idx_reminder_deliveries_contact on public.reminder_deliveries(contact_id);
create index if not exists idx_reminder_deliveries_status on public.reminder_deliveries(status);

-- Update timestamp trigger
create or replace function public.update_reminder_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_event_reminder_schedules_timestamp
  before update on public.event_reminder_schedules
  for each row
  execute function public.update_reminder_timestamp();
