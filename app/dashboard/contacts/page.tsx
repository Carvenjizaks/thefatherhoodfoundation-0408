import { ContactsList } from '@/components/contacts/contacts-list'
import { ContactsHeader } from '@/components/contacts/contacts-header'

export default function ContactsPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
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
