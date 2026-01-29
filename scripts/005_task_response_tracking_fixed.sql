-- Task Assignment Response Tracking System (Fixed)
-- Tracks confirmations, unavailability, participation history, and star ratings

-- Add contact assignment support to event_program_items
alter table public.event_program_items 
  add column if not exists assigned_contact_id uuid references public.contacts(id) on delete set null,
  add column if not exists response_status text default 'pending' check (response_status in ('pending', 'confirmed', 'unavailable', 'no_response')),
  add column if not exists notification_sent_at timestamptz,
  add column if not exists responded_at timestamptz,
  add column if not exists response_notes text;

-- Create assignment response history table
create table if not exists public.assignment_responses (
  id uuid primary key default gen_random_uuid(),
  program_item_id uuid references public.event_program_items(id) on delete cascade not null,
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
  reliability_score numeric(5,2) default 0.00, -- Star rating out of 5.00
  average_response_time interval, -- Time to respond to assignments
  
  -- Timestamps
  last_assignment_date timestamptz,
  last_confirmed_date timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create notification log table
create table if not exists public.assignment_notifications (
  id uuid primary key default gen_random_uuid(),
  program_item_id uuid references public.event_program_items(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  notification_type text not null check (notification_type in ('initial', 'reminder', 'confirmation', 'cancellation')),
  delivery_method text not null check (delivery_method in ('email', 'sms')),
  delivery_status text default 'sent' check (delivery_status in ('sent', 'delivered', 'failed', 'bounced')),
  sent_at timestamptz default now(),
  delivered_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

-- Create indexes for performance
create index if not exists idx_participation_stats_contact on public.contact_participation_stats(contact_id);
create index if not exists idx_participation_stats_org on public.contact_participation_stats(organization_id);
create index if not exists idx_assignment_responses_contact on public.assignment_responses(contact_id);
create index if not exists idx_assignment_responses_program_item on public.assignment_responses(program_item_id);
create index if not exists idx_notifications_program_item on public.assignment_notifications(program_item_id);
create index if not exists idx_program_items_contact on public.event_program_items(assigned_contact_id);

-- Function to calculate reliability score (star rating)
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
  
  -- Confirmation rate contributes 0-3 stars based on % confirmed
  v_confirmation_rate := (p_confirmed::numeric / p_total::numeric) * 3;
  
  -- Response rate contributes 0-2 stars based on % that responded (vs no response)
  v_response_rate := ((p_total - p_no_response)::numeric / p_total::numeric) * 2;
  
  -- Total score out of 5 stars
  v_score := v_confirmation_rate + v_response_rate;
  
  return round(v_score, 2);
end;
$$ language plpgsql;

-- Function to update participation stats for a contact
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
  
  -- Calculate statistics from event_program_items
  select 
    count(*),
    count(*) filter (where response_status = 'confirmed'),
    count(*) filter (where response_status = 'unavailable'),
    count(*) filter (where response_status = 'no_response'),
    count(*) filter (where response_status = 'confirmed' and 
                     exists (select 1 from public.events e 
                            where e.id = event_program_items.event_id
                            and e.event_date < current_date)),
    max(event_program_items.created_at),
    max(event_program_items.responded_at) filter (where response_status = 'confirmed')
  into v_total, v_confirmed, v_unavailable, v_no_response, v_completed, 
       v_last_assignment, v_last_confirmed
  from public.event_program_items
  where assigned_contact_id = p_contact_id;
  
  -- Calculate average response time
  select avg(responded_at - notification_sent_at)
  into v_avg_response
  from public.event_program_items
  where assigned_contact_id = p_contact_id
    and responded_at is not null
    and notification_sent_at is not null;
  
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
  -- Only process if assigned_contact_id exists
  if new.assigned_contact_id is not null then
    -- Update timestamp when status changes
    if new.response_status != coalesce(old.response_status, 'pending') then
      new.responded_at := now();
    end if;
    
    -- Update stats for the contact
    perform update_participation_stats(new.assigned_contact_id);
    
    -- Log the response if it changed to confirmed or unavailable
    if new.response_status in ('confirmed', 'unavailable') and 
       (old.response_status is null or old.response_status = 'pending' or old.response_status != new.response_status) then
      insert into public.assignment_responses (
        program_item_id, contact_id, response_status, responded_at, response_notes
      ) values (
        new.id, new.assigned_contact_id, new.response_status, new.responded_at, new.response_notes
      );
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_assignment_response_update on public.event_program_items;

create trigger on_assignment_response_update
  before update of response_status on public.event_program_items
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
