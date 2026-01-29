-- Task Assignment Response Tracking System
-- Tracks confirmations, unavailability, participation history, and ratings

-- Add columns to program_item_assignments for response tracking
alter table public.program_item_assignments
add column if not exists notification_sent_at timestamptz,
add column if not exists response_status text check (response_status in ('pending', 'confirmed', 'unavailable', 'no_response')),
add column if not exists responded_at timestamptz,
add column if not exists response_notes text;

-- Set default status for existing assignments
update public.program_item_assignments
set response_status = 'pending'
where response_status is null;

-- Create assignment response history table
create table if not exists public.assignment_responses (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.program_item_assignments(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  response_status text not null check (response_status in ('confirmed', 'unavailable')),
  response_method text check (response_method in ('email', 'sms', 'phone', 'in_person')),
  response_notes text,
  responded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create contact participation statistics table
create table if not exists public.contact_participation_stats (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete cascade not null unique,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  
  -- Participation counts
  total_assignments integer default 0,
  confirmed_assignments integer default 0,
  unavailable_responses integer default 0,
  no_response_count integer default 0,
  completed_assignments integer default 0,
  
  -- Calculated metrics
  confirmation_rate numeric(5,2) default 0.00, -- Percentage
  reliability_score numeric(5,2) default 0.00, -- Out of 5.00
  average_response_time interval, -- Time to respond to assignments
  
  -- Timestamps
  last_assignment_date timestamptz,
  last_confirmed_date timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_participation_stats_contact 
  on public.contact_participation_stats(contact_id);
create index if not exists idx_participation_stats_org 
  on public.contact_participation_stats(organization_id);
create index if not exists idx_assignment_responses_contact 
  on public.assignment_responses(contact_id);
create index if not exists idx_assignment_responses_assignment 
  on public.assignment_responses(assignment_id);

-- Create notification log table
create table if not exists public.assignment_notifications (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.program_item_assignments(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  notification_type text not null check (notification_type in ('initial', 'reminder', 'confirmation', 'cancellation')),
  delivery_method text not null check (delivery_method in ('email', 'sms')),
  delivery_status text check (delivery_status in ('sent', 'delivered', 'failed', 'bounced')),
  sent_at timestamptz default now(),
  delivered_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_assignment 
  on public.assignment_notifications(assignment_id);

-- Function to calculate reliability score
create or replace function public.calculate_reliability_score(
  p_confirmed integer,
  p_total integer,
  p_no_response integer
) returns numeric as $$
declare
  v_confirmation_rate numeric;
  v_response_rate numeric;
  v_score numeric;
begin
  if p_total = 0 then
    return 0;
  end if;
  
  -- Confirmation rate (0-3 stars based on % confirmed)
  v_confirmation_rate := (p_confirmed::numeric / p_total::numeric) * 3;
  
  -- Response rate (0-2 stars based on % responded)
  v_response_rate := ((p_total - p_no_response)::numeric / p_total::numeric) * 2;
  
  -- Total score out of 5
  v_score := v_confirmation_rate + v_response_rate;
  
  return round(v_score, 2);
end;
$$ language plpgsql;

-- Function to update participation stats
create or replace function public.update_participation_stats(p_contact_id uuid)
returns void as $$
declare
  v_org_id uuid;
  v_total integer;
  v_confirmed integer;
  v_unavailable integer;
  v_no_response integer;
  v_completed integer;
  v_conf_rate numeric;
  v_score numeric;
  v_avg_response interval;
  v_last_assignment timestamptz;
  v_last_confirmed timestamptz;
begin
  -- Get organization ID
  select organization_id into v_org_id
  from public.contacts
  where id = p_contact_id;
  
  -- Calculate statistics
  select 
    count(*),
    count(*) filter (where response_status = 'confirmed'),
    count(*) filter (where response_status = 'unavailable'),
    count(*) filter (where response_status = 'no_response'),
    count(*) filter (where response_status = 'confirmed' and 
                     exists (select 1 from public.events e 
                            join public.event_program_items epi on e.id = epi.event_id
                            where epi.id = program_item_assignments.program_item_id
                            and e.event_date < current_date)),
    max(program_item_assignments.created_at),
    max(program_item_assignments.responded_at) filter (where response_status = 'confirmed')
  into v_total, v_confirmed, v_unavailable, v_no_response, v_completed, 
       v_last_assignment, v_last_confirmed
  from public.program_item_assignments
  where contact_id = p_contact_id;
  
  -- Calculate average response time
  select avg(responded_at - created_at)
  into v_avg_response
  from public.program_item_assignments
  where contact_id = p_contact_id
    and responded_at is not null;
  
  -- Calculate rates
  v_conf_rate := case when v_total > 0 
                 then round((v_confirmed::numeric / v_total::numeric) * 100, 2)
                 else 0 end;
  
  v_score := calculate_reliability_score(v_confirmed, v_total, v_no_response);
  
  -- Insert or update stats
  insert into public.contact_participation_stats (
    contact_id, organization_id, total_assignments, confirmed_assignments,
    unavailable_responses, no_response_count, completed_assignments,
    confirmation_rate, reliability_score, average_response_time,
    last_assignment_date, last_confirmed_date, updated_at
  ) values (
    p_contact_id, v_org_id, v_total, v_confirmed, v_unavailable, 
    v_no_response, v_completed, v_conf_rate, v_score, v_avg_response,
    v_last_assignment, v_last_confirmed, now()
  )
  on conflict (contact_id) do update set
    total_assignments = excluded.total_assignments,
    confirmed_assignments = excluded.confirmed_assignments,
    unavailable_responses = excluded.unavailable_responses,
    no_response_count = excluded.no_response_count,
    completed_assignments = excluded.completed_assignments,
    confirmation_rate = excluded.confirmation_rate,
    reliability_score = excluded.reliability_score,
    average_response_time = excluded.average_response_time,
    last_assignment_date = excluded.last_assignment_date,
    last_confirmed_date = excluded.last_confirmed_date,
    updated_at = now();
end;
$$ language plpgsql;

-- Trigger to update stats when assignment response changes
create or replace function public.handle_assignment_response_update()
returns trigger as $$
begin
  -- Update stats for the contact
  perform update_participation_stats(new.contact_id);
  
  -- Log the response
  if new.response_status in ('confirmed', 'unavailable') and 
     (old.response_status is null or old.response_status = 'pending') then
    insert into public.assignment_responses (
      assignment_id, contact_id, response_status, responded_at, response_notes
    ) values (
      new.id, new.contact_id, new.response_status, new.responded_at, new.response_notes
    );
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_assignment_response_update on public.program_item_assignments;

create trigger on_assignment_response_update
  after update of response_status on public.program_item_assignments
  for each row
  execute function public.handle_assignment_response_update();

-- Enable RLS
alter table public.assignment_responses enable row level security;
alter table public.contact_participation_stats enable row level security;
alter table public.assignment_notifications enable row level security;

-- RLS Policies
create policy "Users can view assignment responses in their org"
  on public.assignment_responses for select
  using (
    exists (
      select 1 from public.contacts
      where contacts.id = assignment_responses.contact_id
      and contacts.organization_id = public.user_organization_id()
    )
  );

create policy "Users can view participation stats in their org"
  on public.contact_participation_stats for select
  using (organization_id = public.user_organization_id());

create policy "Users can view notifications in their org"
  on public.assignment_notifications for select
  using (
    exists (
      select 1 from public.contacts
      where contacts.id = assignment_notifications.contact_id
      and contacts.organization_id = public.user_organization_id()
    )
  );

create policy "System can insert assignment responses"
  on public.assignment_responses for insert
  with check (
    exists (
      select 1 from public.contacts
      where contacts.id = assignment_responses.contact_id
      and contacts.organization_id = public.user_organization_id()
    )
  );

create policy "System can manage participation stats"
  on public.contact_participation_stats for all
  using (organization_id = public.user_organization_id());

create policy "System can insert notifications"
  on public.assignment_notifications for insert
  with check (
    exists (
      select 1 from public.contacts
      where contacts.id = assignment_notifications.contact_id
      and contacts.organization_id = public.user_organization_id()
    )
  );
