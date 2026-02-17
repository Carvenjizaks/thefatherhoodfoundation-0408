'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContactsList } from '@/components/contacts/contacts-list'
import { ContactsHeader } from '@/components/contacts/contacts-header'
import { Loader2 } from 'lucide-react'

export default function ContactsPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
  const mockRole = 'admin'
  const supabase = createClient()

  const [contacts, setContacts] = useState<unknown[]>([])
  const [tags, setTags] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContacts = useCallback(async () => {
    try {
      // Fetch contacts with tag assignments
      const { data: contactsData } = await supabase
        .from('contacts')
        .select(`
          id, first_name, last_name, email, phone, city, status, involvement,
          contact_tag_assignments ( tag:contact_tags ( id, name, color ) )
        `)
        .eq('organization_id', mockOrgId)
        .order('created_at', { ascending: false })

      // Fetch tags for filters
      const { data: tagsData } = await supabase
        .from('contact_tags')
        .select('id, name, color')
        .eq('organization_id', mockOrgId)
        .order('name')

      setContacts(contactsData || [])
      setTags(tagsData || [])
    } catch (err) {
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, mockOrgId])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ContactsHeader
        organizationId={mockOrgId}
        role={mockRole}
      />
      <ContactsList
        contacts={contacts as never[]}
        tags={tags}
        role={mockRole}
        onRefresh={fetchContacts}
      />
    </div>
  )
}
