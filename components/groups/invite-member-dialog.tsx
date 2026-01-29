'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupName: string
  onSuccess: () => void
}

export function InviteMemberDialog({ open, onOpenChange, groupId, groupName, onSuccess }: InviteMemberDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContact, setSelectedContact] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')

  useEffect(() => {
    if (open) {
      fetchAvailableContacts()
      setPersonalMessage(`You're invited to join ${groupName}! We'd love to have you as part of our community.`)
    }
  }, [open, groupName])

  const fetchAvailableContacts = async () => {
    const mockOrgId = '00000000-0000-0000-0000-000000000000'
    
    // Get contacts not already in group
    const { data: existingMembers } = await supabase
      .from('group_members')
      .select('contact_id')
      .eq('group_id', groupId)
      .eq('status', 'active')

    const existingIds = existingMembers?.map(m => m.contact_id) || []

    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email')
      .eq('organization_id', mockOrgId)
      .eq('is_active', true)
      .not('id', 'in', `(${existingIds.join(',') || 'none'})`)
      .order('first_name')

    if (data) {
      setContacts(data)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContact) return

    setLoading(true)

    try {
      const contact = contacts.find(c => c.id === selectedContact)

      // Create invitation
      const { error: inviteError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: groupId,
          contact_id: selectedContact,
          invited_by: null, // Will be set when auth is enabled
          status: 'pending',
          personal_message: personalMessage
        })

      if (inviteError) throw inviteError

      // Send email invitation
      console.log('[v0] Sending invitation email to:', contact.email)
      console.log('[v0] Email content:', {
        to: contact.email,
        subject: `You're invited to join ${groupName}`,
        message: `Hi ${contact.first_name},\n\n${personalMessage}\n\nClick the link below to accept the invitation.\n\nBest regards,\nYour Group Leader`
      })

      onOpenChange(false)
      onSuccess()
      setSelectedContact('')
      setPersonalMessage('')
    } catch (err) {
      console.error('[v0] Error sending invitation:', err)
      alert('Failed to send invitation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleInvite}>
          <DialogHeader>
            <DialogTitle>Invite Member to {groupName}</DialogTitle>
            <DialogDescription>
              Send a personalized invitation to join your group
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Select Contact *</Label>
              <Select
                value={selectedContact}
                onValueChange={setSelectedContact}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name} ({contact.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message</Label>
              <Textarea
                id="message"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                rows={4}
                disabled={loading}
                placeholder="Add a warm, personal invitation message..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedContact}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
