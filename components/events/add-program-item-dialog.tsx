'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ContactPicker, type ContactOption } from '@/components/shared/contact-picker'
import { Plus, X, Clock, User } from 'lucide-react'

interface AddProgramItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventDate: string
  lastItem?: any
  nextSequence: number
  onSuccess: () => void
}

export function AddProgramItemDialog({
  open,
  onOpenChange,
  eventId,
  eventDate,
  lastItem,
  nextSequence,
  onSuccess
}: AddProgramItemDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string>('')
  const [assignedContacts, setAssignedContacts] = useState<Record<number, ContactOption | null>>({})
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    item_type: 'session',
    start_time: '',
    end_time: '',
    duration_minutes: 0,
    notes: ''
  })

  const [assignments, setAssignments] = useState<{ role_name: string; contact_id: string | null }[]>([])

  useEffect(() => {
    if (open) {
      fetchOrganization()
      
      // Auto-suggest start time based on last item's end time
      if (lastItem?.end_time) {
        setFormData(prev => ({ ...prev, start_time: lastItem.end_time }))
      }
    }
  }, [open, lastItem])

  useEffect(() => {
    // Calculate duration when times change
    if (formData.start_time && formData.end_time) {
      const start = new Date(`${eventDate}T${formData.start_time}`)
      const end = new Date(`${eventDate}T${formData.end_time}`)
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
      
      if (diffMinutes > 0) {
        setFormData(prev => ({ ...prev, duration_minutes: diffMinutes }))
        setError(null)
      } else {
        setError('End time must be after start time')
      }
    }
  }, [formData.start_time, formData.end_time, eventDate])

  const fetchOrganization = async () => {
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single()
    if (org) setOrganizationId(org.id)
  }

  const addAssignment = () => {
    setAssignments([...assignments, { role_name: '', contact_id: null }])
  }

  const removeAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index))
  }

  const updateAssignment = (index: number, field: string, value: string) => {
    const updated = [...assignments]
    updated[index] = { ...updated[index], [field]: value }
    setAssignments(updated)
  }

  const sendAssignmentNotification = async (programItemId: string, contactId: string, roleName: string) => {
    try {
      // Create response tracking record
      const { data: responseData, error: responseError } = await supabase
        .from('task_assignment_responses')
        .insert({
          program_item_id: programItemId,
          contact_id: contactId,
          response_status: 'pending',
          notification_sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (responseError) throw responseError

      // Get contact details from assignedContacts map
      const contact = Object.values(assignedContacts).find(c => c?.id === contactId)
      
      if (contact?.email) {
        console.log('[v0] Sending assignment email to:', contact.email)
        // TODO: Implement actual email sending via API
        // For now, just log the notification
        console.log('[v0] Email notification:', {
          to: contact.email,
          subject: `Task Assignment: ${roleName}`,
          message: `You have been assigned to: ${formData.title}`,
          responseLink: `${window.location.origin}/respond/${responseData.id}`
        })
      }
    } catch (err) {
      console.error('[v0] Failed to send notification:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (formData.duration_minutes <= 0) {
        throw new Error('Please set valid start and end times')
      }

      // Insert program item
      const { data: item, error: itemError } = await supabase
        .from('event_program_items')
        .insert({
          event_id: eventId,
          ...formData,
          sequence_order: nextSequence,
          created_by: null // Auth disabled
        })
        .select()
        .single()

      if (itemError) throw itemError

      // Insert role assignments and send notifications
      if (assignments.length > 0) {
        const validAssignments = assignments.filter(a => a.role_name.trim() && a.contact_id)
        
        if (validAssignments.length > 0) {
          const { error: assignError } = await supabase
            .from('event_program_assignments')
            .insert(
              validAssignments.map(a => ({
                program_item_id: item.id,
                role_name: a.role_name,
                assigned_to: a.contact_id
              }))
            )

          if (assignError) throw assignError

          // Send email notifications to all assigned contacts
          for (const assignment of validAssignments) {
            if (assignment.contact_id) {
              await sendAssignmentNotification(item.id, assignment.contact_id, assignment.role_name)
            }
          }
        }
      }

      onSuccess()
      resetForm()
    } catch (err: any) {
      console.error('[v0] Error creating program item:', err)
      setError(err.message || 'Failed to create program item')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      item_type: 'session',
      start_time: '',
      end_time: '',
      duration_minutes: 0,
      notes: ''
    })
    setAssignments([])
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Program Item</DialogTitle>
          <DialogDescription>
            Create a new activity or session for your event program. Times will be validated to ensure sequential order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Opening Prayer, Worship Session"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this program item"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_type">Type</Label>
              <Select
                value={formData.item_type}
                onValueChange={(value) => setFormData({ ...formData, item_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="worship">Worship</SelectItem>
                  <SelectItem value="prayer">Prayer</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Fields */}
          <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Time Schedule
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="h-10 flex items-center px-3 border rounded-md bg-background">
                  <Badge variant="secondary">
                    {formData.duration_minutes} min
                  </Badge>
                </div>
              </div>
            </div>

            {lastItem && formData.start_time < lastItem.end_time && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  Warning: This item starts before the previous item ({lastItem.title}) ends at {lastItem.end_time}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Role Assignments */}
          <div className="space-y-3 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Role Assignments
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addAssignment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>

            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned yet</p>
            ) : (
              <div className="space-y-2">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Role (e.g., Speaker, Worship Leader)"
                      value={assignment.role_name}
                      onChange={(e) => updateAssignment(index, 'role_name', e.target.value)}
                      className="flex-1"
                    />
                    <ContactPicker
                      organizationId={organizationId}
                      value={assignment.contact_id}
                      onChange={(contactId, contact) => {
                        updateAssignment(index, 'contact_id', contactId || '')
                        setAssignedContacts(prev => ({ ...prev, [index]: contact }))
                      }}
                      placeholder="Select contact..."
                      className="w-[280px]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAssignment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or instructions"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Program Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
