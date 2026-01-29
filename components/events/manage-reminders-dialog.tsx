'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Users
} from 'lucide-react'
import { format } from 'date-fns'

interface ManageRemindersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventDate: string
  eventTitle: string
}

export function ManageRemindersDialog({
  open,
  onOpenChange,
  eventId,
  eventDate,
  eventTitle
}: ManageRemindersDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [sendingBulk, setSendingBulk] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [reminders, setReminders] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  
  const [newReminder, setNewReminder] = useState({
    reminder_number: 1,
    days_before_event: 7,
    custom_message: '',
    include_program: true
  })

  useEffect(() => {
    if (open) {
      fetchReminders()
      fetchParticipants()
    }
  }, [open, eventId])

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('event_reminders')
      .select(`
        *,
        deliveries:event_reminder_deliveries(
          id,
          status,
          contact:contacts(first_name, last_name, email)
        )
      `)
      .eq('event_id', eventId)
      .order('reminder_number')
    
    if (data) {
      setReminders(data)
      console.log('[v0] Loaded reminders:', data.length)
    }
  }

  const fetchParticipants = async () => {
    // Get all contacts assigned to program items for this event
    const { data } = await supabase
      .from('task_assignment_responses')
      .select(`
        contact:contacts(
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        program_item:event_program_items(
          event_id,
          title
        ),
        response_status
      `)
      .eq('program_item.event_id', eventId)
      .in('response_status', ['confirmed', 'pending'])
    
    if (data) {
      // Deduplicate contacts
      const uniqueContacts = Array.from(
        new Map(data.map(item => [item.contact.id, item.contact])).values()
      )
      setParticipants(uniqueContacts)
      console.log('[v0] Loaded participants:', uniqueContacts.length)
    }
  }

  const calculateScheduledDate = (daysBeforeEvent: number) => {
    const eventDateTime = new Date(eventDate)
    const scheduledDate = new Date(eventDateTime)
    scheduledDate.setDate(scheduledDate.getDate() - daysBeforeEvent)
    return scheduledDate.toISOString()
  }

  const addReminder = async () => {
    if (!newReminder.custom_message.trim()) {
      setError('Please enter a reminder message')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const scheduledFor = calculateScheduledDate(newReminder.days_before_event)

      const { error: insertError } = await supabase
        .from('event_reminders')
        .insert({
          event_id: eventId,
          reminder_number: newReminder.reminder_number,
          scheduled_for: scheduledFor,
          custom_message: newReminder.custom_message,
          include_program: newReminder.include_program,
          status: 'scheduled'
        })

      if (insertError) throw insertError

      setSuccess(`Reminder ${newReminder.reminder_number} scheduled successfully!`)
      fetchReminders()
      
      // Reset form
      setNewReminder({
        reminder_number: reminders.length + 2,
        days_before_event: 3,
        custom_message: '',
        include_program: true
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkReminder = async (reminderId: string) => {
    setSendingBulk(true)
    setError(null)

    try {
      // Create delivery records for all participants
      const deliveries = participants.map(contact => ({
        reminder_id: reminderId,
        contact_id: contact.id,
        status: 'sent',
        sent_at: new Date().toISOString()
      }))

      const { error: deliveryError } = await supabase
        .from('event_reminder_deliveries')
        .insert(deliveries)

      if (deliveryError) throw deliveryError

      // Update reminder status
      await supabase
        .from('event_reminders')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', reminderId)

      // Log email notifications (in production, this would trigger actual emails)
      console.log('[v0] Sending bulk reminder to participants:', {
        recipientCount: participants.length,
        participants: participants.map(p => ({
          email: p.email,
          name: `${p.first_name} ${p.last_name}`
        }))
      })

      setSuccess(`Reminder sent to ${participants.length} participants!`)
      fetchReminders()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSendingBulk(false)
    }
  }

  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .delete()
        .eq('id', reminderId)

      if (error) throw error

      fetchReminders()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getDefaultMessage = (number: number) => {
    const messages = {
      1: `Hi! This is a reminder that you are scheduled to serve at "${eventTitle}" on ${format(new Date(eventDate), 'MMMM d, yyyy')}. Please confirm your availability.`,
      2: `Reminder: You have an upcoming commitment at "${eventTitle}" on ${format(new Date(eventDate), 'MMMM d, yyyy')}. Looking forward to serving with you!`,
      3: `Final reminder: "${eventTitle}" is happening tomorrow! Please review your assigned tasks and arrive 15 minutes early. Thank you for serving!`
    }
    return messages[number as keyof typeof messages] || `Reminder for "${eventTitle}"`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Manage Event Reminders
          </DialogTitle>
          <DialogDescription>
            Schedule and send customized reminders to all event participants
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-primary/10 border-primary/20 text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Participant Count */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Total Participants</span>
            </div>
            <Badge variant="secondary" className="text-lg">
              {participants.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Reminders will be sent to all confirmed and pending participants
          </p>
        </div>

        {/* Scheduled Reminders */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled Reminders
          </h3>

          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No reminders scheduled yet. Add your first reminder below.
            </p>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Reminder #{reminder.reminder_number}
                        </Badge>
                        <Badge 
                          variant={
                            reminder.status === 'sent' 
                              ? 'default' 
                              : reminder.status === 'scheduled'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {reminder.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for: {format(new Date(reminder.scheduled_for), 'PPP')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {reminder.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => sendBulkReminder(reminder.id)}
                          disabled={sendingBulk || participants.length === 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded p-3">
                    <p className="text-sm">{reminder.custom_message}</p>
                  </div>

                  {reminder.deliveries && reminder.deliveries.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Sent to {reminder.deliveries.length} participants
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Reminder */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Reminder
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reminder Number</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={newReminder.reminder_number}
                onChange={(e) => setNewReminder({ ...newReminder, reminder_number: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Days Before Event</Label>
              <Input
                type="number"
                min={0}
                max={365}
                value={newReminder.days_before_event}
                onChange={(e) => setNewReminder({ ...newReminder, days_before_event: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Will be sent on: {format(
                  new Date(calculateScheduledDate(newReminder.days_before_event)),
                  'PPP'
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Custom Message</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewReminder({
                  ...newReminder,
                  custom_message: getDefaultMessage(newReminder.reminder_number)
                })}
              >
                Use Template
              </Button>
            </div>
            <Textarea
              value={newReminder.custom_message}
              onChange={(e) => setNewReminder({ ...newReminder, custom_message: e.target.value })}
              placeholder="Enter your reminder message..."
              rows={4}
            />
          </div>

          <Button
            onClick={addReminder}
            disabled={loading || !newReminder.custom_message.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
