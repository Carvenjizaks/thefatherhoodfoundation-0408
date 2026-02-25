import React from "react"
import { redirect } from 'next/navigation'
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

  if (!user) {
    redirect('/login')
  }

  // Fetch profile from DB
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, organization:organizations(name, slug)')
    .eq('id', user.id)
    .single()

  const resolvedProfile = {
    full_name: profile?.full_name ?? user.email ?? 'User',
    email: profile?.email ?? user.email ?? '',
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
