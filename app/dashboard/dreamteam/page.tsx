'use client'

import { useState } from 'react'
import { DreamTeamHeader } from '@/components/dreamteam/dreamteam-header'
import { DreamTeamSignupForm } from '@/components/dreamteam/dreamteam-signup-form'
import { DreamTeamVolunteersList } from '@/components/dreamteam/dreamteam-volunteers-list'

export default function DreamTeamPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
  const [activeTab, setActiveTab] = useState('volunteers')

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative w-full h-36 md:h-48 rounded-xl overflow-hidden">
        <img
          src="/images/dreamteam-banner.jpg"
          alt="Powerhouse Community volunteers wearing #WeCare t-shirts"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="inline-block rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-widest uppercase text-primary border border-border/50">
            #WeCare
          </span>
        </div>
      </div>

      <DreamTeamHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'volunteers' && (
        <DreamTeamVolunteersList organizationId={mockOrgId} />
      )}

      {activeTab === 'signup' && (
        <DreamTeamSignupForm organizationId={mockOrgId} />
      )}
    </div>
  )
}
