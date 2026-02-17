'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DreamTeamHeader } from '@/components/dreamteam/dreamteam-header'
import { DreamTeamSignupForm } from '@/components/dreamteam/dreamteam-signup-form'
import { DreamTeamVolunteersList } from '@/components/dreamteam/dreamteam-volunteers-list'
import { Loader2 } from 'lucide-react'

export default function DreamTeamPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('volunteers')
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrganization() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: member } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', user.id)
            .single()

          if (member) {
            setOrganizationId(member.organization_id)
          }
        }
      } catch (err) {
        console.error('Error getting org:', err)
      } finally {
        setLoading(false)
      }
    }
    getOrganization()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No organization found. Please complete setup first.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DreamTeamHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'volunteers' && (
        <DreamTeamVolunteersList organizationId={organizationId} />
      )}

      {activeTab === 'signup' && (
        <DreamTeamSignupForm organizationId={organizationId} />
      )}
    </div>
  )
}
