-- Tribu Database Schema
-- Multi-tenant community management platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. ORGANIZATIONS (Multi-tenancy)
-- ============================================
create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organizations enable row level security;

-- ============================================
-- 2. PROFILES (Users with roles)
-- ============================================
create type user_role as enum ('admin', 'manager', 'leader', 'user');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role default 'user',
  avatar_url text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- ============================================
-- 3. CONTACTS
-- ============================================
create type contact_status as enum ('active', 'inactive', 'archived');

create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text,
  date_of_birth date,
  gender text,
  status contact_status default 'active',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.contacts enable row level security;

-- Contact Tags (many-to-many)
create table if not exists public.contact_tags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now()
);

alter table public.contact_tags enable row level security;

create table if not exists public.contact_tag_assignments (
  contact_id uuid references public.contacts(id) on delete cascade,
  tag_id uuid references public.contact_tags(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (contact_id, tag_id)
);

alter table public.contact_tag_assignments enable row level security;

-- ============================================
-- 4. GROUPS
-- ============================================
create type group_type as enum ('cell', 'ministry', 'team', 'other');
create type meeting_frequency as enum ('weekly', 'bi-weekly', 'monthly', 'custom');

create table if not exists public.groups (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  description text,
  type group_type default 'cell',
  meeting_frequency meeting_frequency default 'weekly',
  meeting_day text,
  meeting_time time,
  location text,
  leader_id uuid references public.profiles(id),
  assistant_leader_id uuid references public.profiles(id),
  capacity integer,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.groups enable row level security;

-- Group Members
create table if not exists public.group_members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  joined_at timestamptz default now(),
  left_at timestamptz,
  is_active boolean default true,
  unique(group_id, contact_id)
);

alter table public.group_members enable row level security;

-- Group Meetings
create type meeting_status as enum ('scheduled', 'completed', 'cancelled');

create table if not exists public.group_meetings (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade not null,
  meeting_date date not null,
  topic text,
  notes text,
  attendance_count integer default 0,
  status meeting_status default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.group_meetings enable row level security;

-- Meeting Attendance
create table if not exists public.meeting_attendance (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid references public.group_meetings(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  attended boolean default true,
  notes text,
  unique(meeting_id, contact_id)
);

alter table public.meeting_attendance enable row level security;

-- ============================================
-- 5. EVENTS & SCHEDULING
-- ============================================
create type event_status as enum ('draft', 'published', 'completed', 'cancelled');
create type recurrence_pattern as enum ('none', 'daily', 'weekly', 'monthly', 'yearly');

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  title text not null,
  description text,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  location text,
  capacity integer,
  recurrence recurrence_pattern default 'none',
  recurrence_end_date date,
  status event_status default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

-- Event Programmes (Agenda items)
create table if not exists public.event_programmes (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  title text not null,
  start_time time not null,
  end_time time not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table public.event_programmes enable row level security;

-- Duty Roster
create table if not exists public.duty_roster (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  role text not null, -- e.g., "Usher", "Sound", "Worship Leader"
  notes text,
  created_at timestamptz default now()
);

alter table public.duty_roster enable row level security;

-- Event Registrations
create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  contact_id uuid references public.contacts(id) on delete cascade not null,
  registered_at timestamptz default now(),
  attended boolean default false,
  unique(event_id, contact_id)
);

alter table public.event_registrations enable row level security;

-- ============================================
-- 6. TASKS & PROJECTS
-- ============================================
create type task_status as enum ('todo', 'in_progress', 'completed', 'cancelled');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  description text,
  start_date date,
  end_date date,
  status task_status default 'todo',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  status task_status default 'todo',
  priority task_priority default 'medium',
  assigned_to uuid references public.profiles(id),
  due_date date,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Helper function to get user's organization
create or replace function public.user_organization_id()
returns uuid
language sql
security definer
stable
as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

-- Organizations
create policy "Users can view their own organization"
  on public.organizations for select
  using (id = public.user_organization_id());

create policy "Admins can update their organization"
  on public.organizations for update
  using (
    id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- Profiles
create policy "Users can view profiles in their organization"
  on public.profiles for select
  using (organization_id = public.user_organization_id());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Admins can manage profiles"
  on public.profiles for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- Contacts
create policy "Users can view contacts in their organization"
  on public.contacts for select
  using (organization_id = public.user_organization_id());

create policy "Leaders can manage contacts"
  on public.contacts for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Contact Tags
create policy "Users can view tags in their organization"
  on public.contact_tags for select
  using (organization_id = public.user_organization_id());

create policy "Leaders can manage tags"
  on public.contact_tags for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Contact Tag Assignments
create policy "Users can view tag assignments"
  on public.contact_tag_assignments for select
  using (
    exists (
      select 1 from public.contacts
      where id = contact_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage tag assignments"
  on public.contact_tag_assignments for all
  using (
    exists (
      select 1 from public.contacts c
      join public.profiles p on p.id = auth.uid()
      where c.id = contact_id 
        and c.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Groups
create policy "Users can view groups in their organization"
  on public.groups for select
  using (organization_id = public.user_organization_id());

create policy "Leaders can manage groups"
  on public.groups for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Group Members
create policy "Users can view group members"
  on public.group_members for select
  using (
    exists (
      select 1 from public.groups
      where id = group_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage group members"
  on public.group_members for all
  using (
    exists (
      select 1 from public.groups g
      join public.profiles p on p.id = auth.uid()
      where g.id = group_id 
        and g.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Group Meetings
create policy "Users can view group meetings"
  on public.group_meetings for select
  using (
    exists (
      select 1 from public.groups
      where id = group_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage group meetings"
  on public.group_meetings for all
  using (
    exists (
      select 1 from public.groups g
      join public.profiles p on p.id = auth.uid()
      where g.id = group_id 
        and g.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Meeting Attendance
create policy "Users can view attendance"
  on public.meeting_attendance for select
  using (
    exists (
      select 1 from public.group_meetings gm
      join public.groups g on g.id = gm.group_id
      where gm.id = meeting_id and g.organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage attendance"
  on public.meeting_attendance for all
  using (
    exists (
      select 1 from public.group_meetings gm
      join public.groups g on g.id = gm.group_id
      join public.profiles p on p.id = auth.uid()
      where gm.id = meeting_id 
        and g.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Events
create policy "Users can view events in their organization"
  on public.events for select
  using (organization_id = public.user_organization_id());

create policy "Leaders can manage events"
  on public.events for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Event Programmes
create policy "Users can view event programmes"
  on public.event_programmes for select
  using (
    exists (
      select 1 from public.events
      where id = event_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage event programmes"
  on public.event_programmes for all
  using (
    exists (
      select 1 from public.events e
      join public.profiles p on p.id = auth.uid()
      where e.id = event_id 
        and e.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Duty Roster
create policy "Users can view duty roster"
  on public.duty_roster for select
  using (
    exists (
      select 1 from public.events
      where id = event_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage duty roster"
  on public.duty_roster for all
  using (
    exists (
      select 1 from public.events e
      join public.profiles p on p.id = auth.uid()
      where e.id = event_id 
        and e.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Event Registrations
create policy "Users can view event registrations"
  on public.event_registrations for select
  using (
    exists (
      select 1 from public.events
      where id = event_id and organization_id = public.user_organization_id()
    )
  );

create policy "Users can register themselves"
  on public.event_registrations for insert
  with check (
    exists (
      select 1 from public.events
      where id = event_id and organization_id = public.user_organization_id()
    )
  );

create policy "Leaders can manage event registrations"
  on public.event_registrations for all
  using (
    exists (
      select 1 from public.events e
      join public.profiles p on p.id = auth.uid()
      where e.id = event_id 
        and e.organization_id = public.user_organization_id()
        and p.role in ('admin', 'manager', 'leader')
    )
  );

-- Projects
create policy "Users can view projects in their organization"
  on public.projects for select
  using (organization_id = public.user_organization_id());

create policy "Leaders can manage projects"
  on public.projects for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- Tasks
create policy "Users can view tasks in their organization"
  on public.tasks for select
  using (organization_id = public.user_organization_id());

create policy "Users can update tasks assigned to them"
  on public.tasks for update
  using (assigned_to = auth.uid());

create policy "Leaders can manage all tasks"
  on public.tasks for all
  using (
    organization_id = public.user_organization_id() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager', 'leader')
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Note: Profile creation will be handled in the application code after signup

-- Update timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.organizations
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.contacts
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.groups
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.group_meetings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.tasks
  for each row execute function public.handle_updated_at();
