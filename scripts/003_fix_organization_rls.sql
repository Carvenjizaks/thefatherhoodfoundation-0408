-- Fix RLS policies to allow organization creation during signup

-- Drop existing restrictive policies
drop policy if exists "Users can view their own organization" on public.organizations;
drop policy if exists "Admins can update their organization" on public.organizations;

-- Add new policies that allow creation and proper access
create policy "Anyone can create an organization"
  on public.organizations for insert
  with check (true);

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

-- Fix profiles policies to allow self-insertion during signup
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Admins can manage other profiles"
  on public.profiles for all
  using (
    organization_id = public.user_organization_id() and
    id != auth.uid() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );
