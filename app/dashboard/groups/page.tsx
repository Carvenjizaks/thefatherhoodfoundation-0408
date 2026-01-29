import { GroupsList } from '@/components/groups/groups-list'
import { GroupsHeader } from '@/components/groups/groups-header'

export default function GroupsPage() {
  // Auth disabled for development - using mock data
  console.log('[v0] Groups page loaded without authentication')
  
  const mockOrgId = 'dev-org-id'
  const mockRole = 'admin'

  return (
    <div className="space-y-6">
      <GroupsHeader 
        organizationId={mockOrgId} 
        role={mockRole}
      />
      <GroupsList 
        groups={[]} 
        role={mockRole}
      />
    </div>
  )
}
