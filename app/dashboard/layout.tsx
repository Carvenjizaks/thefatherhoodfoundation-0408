import React from "react"
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile from DB if user is logged in
  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, email, role, organization:organizations(name, slug)')
    .eq('id', user.id)
    .single() : { data: null }

  const resolvedProfile = {
    full_name: profile?.full_name ?? user?.email ?? 'Admin',
    email: profile?.email ?? user?.email ?? '',
    role: profile?.role ?? 'admin',
    organization: Array.isArray(profile?.organization)
      ? profile.organization[0]
      : profile?.organization ?? { name: 'Powerhouse', slug: '' },
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar profile={resolvedProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader profile={resolvedProfile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
