-- Event Program Management System
-- Adds comprehensive program builder with roles, tasks, templates, and export functionality

-- Event Program Templates
create table if not exists public.event_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  description text,
  category text, -- e.g., "Sunday Service", "Conference", "Workshop"
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.event_templates enable row level security;

-- Event Program Items (Tasks/Activities in sequence)
create table if not exists public.event_program_items (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  template_id uuid references public.event_templates(id) on delete cascade,
  title text not null,
  description text,
  role text, -- e.g., "Worship Leader", "Speaker", "Usher"
  assigned_to uuid references public.profiles(id),
  start_time time not null,
  end_time time not null,
  duration_minutes integer generated always as (extract(epoch from (end_time - start_time)) / 60) stored,
  sequence_order integer not null, -- Order in the program
  notes text,
  status text default 'pending', -- pending, in_progress, completed
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Ensure either event_id or template_id is set, but not both
  constraint event_or_template_check check (
    (event_id is not null and template_id is null) or 
    (event_id is null and template_id is not null)
  )
);

alter table public.event_program_items enable row level security;

-- Event Program Exports/Shares
create table if not exists public.event_program_exports (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  exported_by uuid references public.profiles(id),
  export_format text not null, -- 'pdf', 'email', 'csv'
  recipients text[], -- Email addresses if sent via email
  exported_at timestamptz default now()
);

alter table public.event_program_exports enable row level security;

-- Indexes for performance
create index if not exists idx_event_program_items_event on public.event_program_items(event_id);
create index if not exists idx_event_program_items_template on public.event_program_items(template_id);
create index if not exists idx_event_program_items_sequence on public.event_program_items(event_id, sequence_order);
create index if not exists idx_event_templates_org on public.event_templates(organization_id);

-- RLS Policies

-- Event Templates
create policy "Users can view templates in their organization"
  on public.event_templates for select
  using (organization_id = public.user_organization_id());

create policy "Admins and managers can create templates"
  on public.event_templates for insert
  with check (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

create policy "Admins and managers can update templates"
  on public.event_templates for update
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

create policy "Admins and managers can delete templates"
  on public.event_templates for delete
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Event Program Items
create policy "Users can view program items in their organization"
  on public.event_program_items for select
  using (
    (event_id in (select id from public.events where organization_id = public.user_organization_id())) or
    (template_id in (select id from public.event_templates where organization_id = public.user_organization_id()))
  );

create policy "Admins and managers can manage program items"
  on public.event_program_items for all
  using (
    (event_id in (select id from public.events where organization_id = public.user_organization_id()) or
     template_id in (select id from public.event_templates where organization_id = public.user_organization_id())) and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Event Program Exports
create policy "Users can view exports in their organization"
  on public.event_program_exports for select
  using (
    event_id in (select id from public.events where organization_id = public.user_organization_id())
  );

create policy "Admins and managers can create exports"
  on public.event_program_exports for insert
  with check (
    event_id in (select id from public.events where organization_id = public.user_organization_id()) and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Function to validate no time overlaps in event program
create or replace function public.check_event_program_overlap()
returns trigger as $$
begin
  if exists (
    select 1 from public.event_program_items
    where (
      (NEW.event_id is not null and event_id = NEW.event_id) or
      (NEW.template_id is not null and template_id = NEW.template_id)
    )
    and id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and (
      (NEW.start_time >= start_time and NEW.start_time < end_time) or
      (NEW.end_time > start_time and NEW.end_time <= end_time) or
      (NEW.start_time <= start_time and NEW.end_time >= end_time)
    )
  ) then
    raise exception 'Program item overlaps with existing time slot';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger check_program_overlap
  before insert or update on public.event_program_items
  for each row
  execute function public.check_event_program_overlap();
