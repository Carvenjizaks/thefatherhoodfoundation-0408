-- Temporarily disable RLS for development mode
-- This fixes the infinite recursion error when auth is disabled

-- Drop existing problematic policies
drop policy if exists "Users can view events in their organization" on public.events;
drop policy if exists "Admins can insert events" on public.events;
drop policy if exists "Admins can update events in their organization" on public.events;
drop policy if exists "Admins can delete events in their organization" on public.events;

-- Create simpler policies that don't require profile lookups
create policy "Allow all authenticated access to events for dev"
  on public.events for all
  using (true)
  with check (true);

-- Also fix profiles table policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;

create policy "Allow all access to profiles for dev"
  on public.profiles for all
  using (true)
  with check (true);

-- Fix other tables with similar issues
drop policy if exists "Users can view contacts in their organization" on public.contacts;
drop policy if exists "Users can insert contacts in their organization" on public.contacts;
drop policy if exists "Users can update contacts in their organization" on public.contacts;
drop policy if exists "Users can delete contacts in their organization" on public.contacts;

create policy "Allow all access to contacts for dev"
  on public.contacts for all
  using (true)
  with check (true);

drop policy if exists "Users can view groups in their organization" on public.groups;
drop policy if exists "Users can insert groups in their organization" on public.groups;
drop policy if exists "Users can update groups in their organization" on public.groups;
drop policy if exists "Users can delete groups in their organization" on public.groups;

create policy "Allow all access to groups for dev"
  on public.groups for all
  using (true)
  with check (true);

drop policy if exists "Users can view tasks in their organization" on public.tasks;
drop policy if exists "Users can insert tasks in their organization" on public.tasks;
drop policy if exists "Users can update tasks in their organization" on public.tasks;
drop policy if exists "Users can delete tasks in their organization" on public.tasks;

create policy "Allow all access to tasks for dev"
  on public.tasks for all
  using (true)
  with check (true);
