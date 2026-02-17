import React from "react"
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using mock profile for development
  
  const mockProfile = {
    full_name: 'Development User',
    email: 'dev@powerhouse.local',
    role: 'admin',
    organization: {
      name: 'Development Org',
      slug: 'dev-org'
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar profile={mockProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader profile={mockProfile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
