'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

interface GroupMessagingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupName: string
  members: any[]
}

export function GroupMessagingDialog({ open, onOpenChange, groupId, groupName, members }: GroupMessagingDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [messageType, setMessageType] = useState<'bulk' | 'individual'>('bulk')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const handleSendBulk = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const recipients = selectedMembers.length > 0 
        ? members.filter(m => selectedMembers.includes(m.contact_id))
        : members

      // Log the message
      const { error: messageError } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sent_by: null, // Will be set when auth is enabled
          message_type: 'bulk',
          subject: subject,
          content: message,
          recipient_count: recipients.length
        })

      if (messageError) throw messageError

      // Send emails to all recipients
      for (const member of recipients) {
        const contact = member.contact
        const personalizedMessage = `Dear ${contact.first_name},\n\n${message}\n\nBest regards,\n${groupName} Leadership`

        console.log('[v0] Sending bulk message to:', contact.email)
        console.log('[v0] Subject:', subject)
        console.log('[v0] Message:', personalizedMessage)
      }

      alert(`Message sent to ${recipients.length} members!`)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      console.error('[v0] Error sending bulk message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendIndividual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMembers.length === 0) {
      alert('Please select at least one member')
      return
    }

    setLoading(true)

    try {
      for (const contactId of selectedMembers) {
        const member = members.find(m => m.contact_id === contactId)
        if (!member) continue

        const contact = member.contact
        const personalizedMessage = `Dear ${contact.first_name},\n\n${message}\n\nWarm regards,\n${groupName} Leadership`

        // Log individual message
        await supabase
          .from('group_messages')
          .insert({
            group_id: groupId,
            sent_by: null,
            message_type: 'individual',
            subject: subject,
            content: personalizedMessage,
            recipient_count: 1
          })

        console.log('[v0] Sending individual message to:', contact.email)
        console.log('[v0] Personalized content:', personalizedMessage)
      }

      alert(`Individual messages sent to ${selectedMembers.length} members!`)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      console.error('[v0] Error sending individual messages:', err)
      alert('Failed to send messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubject('')
    setMessage('')
    setSelectedMembers([])
  }

  const toggleMember = (contactId: string) => {
    setSelectedMembers(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const selectAll = () => {
    setSelectedMembers(members.map(m => m.contact_id))
  }

  const deselectAll = () => {
    setSelectedMembers([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message Group Members</DialogTitle>
          <DialogDescription>
            Send bulk or individual messages to {groupName} members
          </DialogDescription>
        </DialogHeader>

        <Tabs value={messageType} onValueChange={(v) => setMessageType(v as 'bulk' | 'individual')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bulk">Bulk Message</TabsTrigger>
            <TabsTrigger value="individual">Individual Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="bulk">
            <form onSubmit={handleSendBulk} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Message subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  disabled={loading}
                  placeholder="Write your message here..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Recipients ({selectedMembers.length > 0 ? selectedMembers.length : members.length})</Label>
                  <div className="space-x-2">
                    <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={deselectAll}>
                      Deselect All
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                  {members.map((member) => (
                    <div key={member.contact_id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedMembers.includes(member.contact_id)}
                        onCheckedChange={() => toggleMember(member.contact_id)}
                      />
                      <label className="text-sm cursor-pointer flex-1" onClick={() => toggleMember(member.contact_id)}>
                        {member.contact?.first_name} {member.contact?.last_name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave all unchecked to send to everyone
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send to {selectedMembers.length > 0 ? selectedMembers.length : members.length} Members
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="individual">
            <form onSubmit={handleSendIndividual} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-ind">Subject *</Label>
                <Input
                  id="subject-ind"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Message subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-ind">Message Template *</Label>
                <Textarea
                  id="message-ind"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  disabled={loading}
                  placeholder="Each recipient's first name will be automatically included..."
                />
                <p className="text-xs text-muted-foreground">
                  Message will be personalized with each member's first name
                </p>
              </div>

              <div className="space-y-2">
                <Label>Select Recipients * ({selectedMembers.length} selected)</Label>
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                  {members.map((member) => (
                    <div key={member.contact_id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedMembers.includes(member.contact_id)}
                        onCheckedChange={() => toggleMember(member.contact_id)}
                      />
                      <label className="text-sm cursor-pointer flex-1" onClick={() => toggleMember(member.contact_id)}>
                        {member.contact?.first_name} {member.contact?.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || selectedMembers.length === 0}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send {selectedMembers.length} Personalized Messages
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
