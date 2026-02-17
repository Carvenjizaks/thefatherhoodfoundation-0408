import { EventsList } from '@/components/events/events-list'
import { EventsHeader } from '@/components/events/events-header'

export default function EventsPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
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
