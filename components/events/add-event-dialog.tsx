'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
}

export function AddEventDialog({ open, onOpenChange, organizationId }: AddEventDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [customEventType, setCustomEventType] = useState('')
  const [showCustomType, setShowCustomType] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [taskAssignments, setTaskAssignments] = useState<Array<{ role: string; contact_id: string }>>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'service',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_attendees: '',
    status: 'draft',
    is_recurring: false,
    recurrence_pattern: 'weekly',
    recurrence_end_date: '',
    expected_attendance: '',
    notes: '',
  })

  // Fetch contacts when dialog opens
  useState(() => {
    if (open) {
      fetchContacts()
    }
  })

  const fetchContacts = async () => {
    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('first_name')
    
    if (data) {
      setContacts(data)
    }
  }

  const addTaskAssignment = () => {
    setTaskAssignments([...taskAssignments, { role: '', contact_id: '' }])
  }

  const removeTaskAssignment = (index: number) => {
    setTaskAssignments(taskAssignments.filter((_, i) => i !== index))
  }

  const updateTaskAssignment = (index: number, field: string, value: string) => {
    const updated = [...taskAssignments]
    updated[index] = { ...updated[index], [field]: value }
    setTaskAssignments(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Auth disabled for development
      const { error } = await supabase
        .from('events')
        .insert({
          ...formData,
          organization_id: organizationId,
          created_by: null, // Will be set when auth is re-enabled
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
        })

      if (error) throw error

      // Get the created event ID to redirect to program builder
      const { data: newEvent } = await supabase
        .from('events')
        .select('id')
        .eq('title', formData.title)
        .eq('event_date', formData.event_date)
        .single()

      onOpenChange(false)
      setFormData({
        title: '',
        description: '',
        event_type: 'service',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        max_attendees: '',
        status: 'draft',
        is_recurring: false,
        recurrence_pattern: 'weekly',
        recurrence_end_date: '',
        expected_attendance: '',
        notes: '',
      })
      setShowCustomType(false)
      setCustomEventType('')
      setTaskAssignments([])

      // Redirect to event detail page to build program
      if (newEvent?.id) {
        router.push(`/dashboard/events/${newEvent.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error('[v0] Error creating event:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Schedule a new community event</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
                placeholder="Sunday Service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type *</Label>
              {!showCustomType ? (
                <div className="flex gap-2">
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setShowCustomType(true)
                      } else {
                        setFormData({ ...formData, event_type: value })
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="prayer">Prayer Meeting</SelectItem>
                      <SelectItem value="bible_study">Bible Study</SelectItem>
                      <SelectItem value="youth">Youth Event</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="social">Social Event</SelectItem>
                      <SelectItem value="custom">+ Add Custom Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                    placeholder="Enter custom event type"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (customEventType.trim()) {
                        setFormData({ ...formData, event_type: customEventType.trim() })
                        setShowCustomType(false)
                        setCustomEventType('')
                      }
                    }}
                    disabled={loading || !customEventType.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomType(false)
                      setCustomEventType('')
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              disabled={loading}
              placeholder="Event details and information"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
                placeholder="Main Sanctuary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees (Optional)</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                disabled={loading}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_attendance">Expected Attendance</Label>
            <Input
              id="expected_attendance"
              type="number"
              value={formData.expected_attendance}
              onChange={(e) => setFormData({ ...formData, expected_attendance: e.target.value })}
              disabled={loading}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Assign Tasks to Contacts</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={addTaskAssignment}
                disabled={loading}
              >
                + Add Task
              </Button>
            </div>
            
            {taskAssignments.length > 0 && (
              <div className="space-y-2">
                {taskAssignments.map((assignment, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Task/Role (e.g., Worship Leader)"
                      value={assignment.role}
                      onChange={(e) => updateTaskAssignment(index, 'role', e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Select
                      value={assignment.contact_id}
                      onValueChange={(value) => updateTaskAssignment(index, 'contact_id', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeTaskAssignment(index)}
                      disabled={loading}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Add initial task assignments. You can add more detailed program items after creating the event.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              disabled={loading}
              className="rounded"
            />
            <Label htmlFor="is_recurring" className="cursor-pointer">
              Recurring Event
            </Label>
          </div>

          {formData.is_recurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrence_pattern">Recurrence Pattern</Label>
                <Select
                  value={formData.recurrence_pattern}
                  onValueChange={(value) => setFormData({ ...formData, recurrence_pattern: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence_end_date">End Date</Label>
                <Input
                  id="recurrence_end_date"
                  type="date"
                  value={formData.recurrence_end_date}
                  onChange={(e) => setFormData({ ...formData, recurrence_end_date: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              disabled={loading}
              placeholder="Additional notes for planning team"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
