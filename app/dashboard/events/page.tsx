import { EventsList } from '@/components/events/events-list'
import { EventsHeader } from '@/components/events/events-header'

export default function EventsPage() {
  // Auth disabled for development - using mock data
  console.log('[v0] Events page loaded without authentication')
  
  const mockOrgId = 'dev-org-id'
  const mockRole = 'admin'

  return (
    <div className="space-y-6">
      <EventsHeader 
        organizationId={mockOrgId} 
        role={mockRole}
      />
      <EventsList 
        events={[]} 
        role={mockRole}
      />
    </div>
  )
}
