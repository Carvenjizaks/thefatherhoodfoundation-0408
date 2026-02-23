'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContactsList } from '@/components/contacts/contacts-list'
import { ContactsHeader } from '@/components/contacts/contacts-header'
import { Loader2 } from 'lucide-react'

export default function ContactsPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
  const mockRole = 'admin'
  const [contacts, setContacts] = useState<unknown[]>([])
  const [tags, setTags] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContacts = useCallback(async () => {
    const supabase = createClient()
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, email, phone, city, status, involvement')
        .eq('organization_id', mockOrgId)
        .order('created_at', { ascending: false })

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError)
      }

      // Fetch tags
      const { data: tagsData } = await supabase
        .from('contact_tags')
        .select('id, name, color')
        .eq('organization_id', mockOrgId)
        .order('name')

      // Fetch tag assignments separately to avoid join issues
      const { data: assignmentsData } = await supabase
        .from('contact_tag_assignments')
        .select('contact_id, tag_id')

      // Merge tag assignments into contacts
      const tagMap = new Map((tagsData || []).map((t: { id: string; name: string; color: string }) => [t.id, t]))
      const contactsWithTags = (contactsData || []).map((contact: { id: string }) => {
        const contactAssignments = (assignmentsData || [])
          .filter((a: { contact_id: string }) => a.contact_id === contact.id)
          .map((a: { tag_id: string }) => ({ tag: tagMap.get(a.tag_id) }))
          .filter((a: { tag: unknown }) => a.tag)
        return { ...contact, contact_tag_assignments: contactAssignments }
      })

      setContacts(contactsWithTags)
      setTags(tagsData || [])
    } catch (err) {
      console.error('[v0] Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }, [mockOrgId])

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
        tags={tags}
        contacts={contacts as never[]}
        onRefresh={fetchContacts}
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
