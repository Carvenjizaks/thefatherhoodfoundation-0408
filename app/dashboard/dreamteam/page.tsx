'use client'

import { useState } from 'react'
import { DreamTeamHeader } from '@/components/dreamteam/dreamteam-header'
import { DreamTeamSignupForm } from '@/components/dreamteam/dreamteam-signup-form'
import { DreamTeamVolunteersList } from '@/components/dreamteam/dreamteam-volunteers-list'

export default function DreamTeamPage() {
  const mockOrgId = 'dev-org-id'
  const [activeTab, setActiveTab] = useState('volunteers')

  return (
    <div className="flex flex-col gap-6">
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
