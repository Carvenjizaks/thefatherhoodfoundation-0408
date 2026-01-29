import { ContactsList } from '@/components/contacts/contacts-list'
import { ContactsHeader } from '@/components/contacts/contacts-header'

export default function ContactsPage() {
  // Auth disabled for development - using mock data
  console.log('[v0] Contacts page loaded without authentication')
  
  const mockOrgId = 'dev-org-id'
  const mockRole = 'admin'

  return (
    <div className="space-y-6">
      <ContactsHeader 
        organizationId={mockOrgId} 
        role={mockRole}
      />
      <ContactsList 
        contacts={[]} 
        tags={[]}
        role={mockRole}
      />
    </div>
  )
}
