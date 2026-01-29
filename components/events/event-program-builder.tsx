'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgramItemsList } from './program-items-list'
import { AddProgramItemDialog } from './add-program-item-dialog'
import { SaveTemplateDialog } from './save-template-dialog'
import { LoadTemplateDialog } from './load-template-dialog'
import { ExportProgramDialog } from './export-program-dialog'
import { ManageRemindersDialog } from './manage-reminders-dialog'
import { Calendar, Clock, Users, FileText, Download, Mail, Save, FolderOpen, Bell } from 'lucide-react'

interface EventProgramBuilderProps {
  eventId: string
}

export function EventProgramBuilder({ eventId }: EventProgramBuilderProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<any>(null)
  const [programItems, setProgramItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showLoadTemplate, setShowLoadTemplate] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const [timeConflict, setTimeConflict] = useState<string | null>(null)

  useEffect(() => {
    fetchEventAndProgram()
  }, [eventId])

  const fetchEventAndProgram = async () => {
    try {
      // Fetch event details
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      setEvent(eventData)

      // Fetch program items with assignments
      const { data: items } = await supabase
        .from('event_program_items')
        .select(`
          *,
          assignments:event_program_assignments(
            id,
            role_name,
            assigned_to,
            profile:profiles(id, full_name, email)
          )
        `)
        .eq('event_id', eventId)
        .order('sequence_order', { ascending: true })

      setProgramItems(items || [])
      validateTimeSequence(items || [])
    } catch (error) {
      console.error('[v0] Error fetching event program:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateTimeSequence = (items: any[]) => {
    for (let i = 1; i < items.length; i++) {
      const prevItem = items[i - 1]
      const currentItem = items[i]
      
      if (prevItem.end_time && currentItem.start_time) {
        if (currentItem.start_time < prevItem.end_time) {
          setTimeConflict(`Time conflict detected: "${currentItem.title}" starts before "${prevItem.title}" ends`)
          return
        }
      }
    }
    setTimeConflict(null)
  }

  const handleItemAdded = () => {
    fetchEventAndProgram()
    setShowAddDialog(false)
  }

  const handleTemplateLoaded = () => {
    fetchEventAndProgram()
    setShowLoadTemplate(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading event program...</div>
  }

  if (!event) {
    return <div className="text-center py-12">Event not found</div>
  }

  const totalDuration = programItems.reduce((sum, item) => sum + (item.duration_minutes || 0), 0)
  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                {event.start_time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {event.start_time} {event.end_time && `- ${event.end_time}`}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReminders(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Manage Reminders
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoadTemplate(true)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveTemplate(true)}
                disabled={programItems.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(true)}
                disabled={programItems.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export / Email
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Time Conflict Alert */}
      {timeConflict && (
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription>{timeConflict}</AlertDescription>
        </Alert>
      )}

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programItems.length}</div>
            <p className="text-sm text-muted-foreground">Program Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {hours > 0 && `${hours}h `}{minutes}m
            </div>
            <p className="text-sm text-muted-foreground">Total Duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {programItems.reduce((sum, item) => sum + (item.assignments?.length || 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Program Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Program</CardTitle>
              <CardDescription>
                Build your event schedule with sequential activities and role assignments
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Add Program Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProgramItemsList
            eventId={eventId}
            items={programItems}
            onUpdate={fetchEventAndProgram}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddProgramItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        eventId={eventId}
        eventDate={event.event_date}
        lastItem={programItems[programItems.length - 1]}
        nextSequence={programItems.length + 1}
        onSuccess={handleItemAdded}
      />

      <SaveTemplateDialog
        open={showSaveTemplate}
        onOpenChange={setShowSaveTemplate}
        eventId={eventId}
        programItems={programItems}
      />

      <LoadTemplateDialog
        open={showLoadTemplate}
        onOpenChange={setShowLoadTemplate}
        eventId={eventId}
        onSuccess={handleTemplateLoaded}
      />

      <ExportProgramDialog
        open={showExport}
        onOpenChange={setShowExport}
        event={event}
        programItems={programItems}
      />

      <ManageRemindersDialog
        open={showReminders}
        onOpenChange={setShowReminders}
        eventId={eventId}
        eventDate={event.event_date}
        eventTitle={event.title}
      />
    </div>
  )
}
