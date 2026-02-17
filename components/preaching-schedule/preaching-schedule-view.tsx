'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  GripVertical,
  Mail,
  Check,
  X,
  Clock,
  User,
  CalendarDays,
  Send,
  Pencil,
  Trash2,
  AlertCircle,
  Search,
} from 'lucide-react'

interface Speaker {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar_url?: string
}

interface ScheduleEntry {
  id: string
  schedule_id: string
  service_date: string
  service_type: string
  speaker_id: string | null
  topic: string | null
  scripture_reference: string | null
  notes: string | null
  confirmation_status: 'pending' | 'confirmed' | 'declined'
  speaker?: Speaker
}

interface Schedule {
  id: string
  month: number
  year: number
  title: string
  organization_id: string
}

const SERVICE_TYPES = [
  { value: 'morning', label: 'Morning Service' },
  { value: 'evening', label: 'Evening Service' },
  { value: 'midweek', label: 'Midweek Service' },
  { value: 'youth', label: 'Youth Service' },
  { value: 'special', label: 'Special Service' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function PreachingScheduleView() {
  const supabase = createClient()
  const router = useRouter()

  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [organizationId, setOrganizationId] = useState('')
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [showEditEntry, setShowEditEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null)
  const [entryForm, setEntryForm] = useState({
    service_date: '',
    service_type: 'morning',
    speaker_id: '',
    topic: '',
    scripture_reference: '',
    notes: '',
  })

  // Speaker search state
  const [speakerSearch, setSpeakerSearch] = useState('')
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false)

  const filteredSpeakers = speakers.filter((s) => {
    if (!speakerSearch.trim()) return true
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase()
    return fullName.includes(speakerSearch.toLowerCase())
  })

  const selectedSpeakerName = (speakerId: string) => {
    const s = speakers.find((sp) => sp.id === speakerId)
    return s ? `${s.first_name} ${s.last_name}` : ''
  }

  // Drag state
  const [draggedEntry, setDraggedEntry] = useState<ScheduleEntry | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (organizationId) {
      loadSchedule()
    }
  }, [currentMonth, currentYear, organizationId])

  const init = async () => {
    const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
    if (org) {
      setOrganizationId(org.id)
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, email, avatar_url')
        .eq('organization_id', org.id)
        .eq('status', 'active')
        .order('first_name')
      if (contacts) setSpeakers(contacts)
    }
    setLoading(false)
  }

  const loadSchedule = async () => {
    // Find or create schedule for this month
    let { data: existingSchedule } = await supabase
      .from('preaching_schedules')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('month', currentMonth + 1)
      .eq('year', currentYear)
      .single()

    if (!existingSchedule) {
      const { data: newSchedule } = await supabase
        .from('preaching_schedules')
        .insert({
          organization_id: organizationId,
          month: currentMonth + 1,
          year: currentYear,
          title: `${MONTHS[currentMonth]} ${currentYear} Preaching Schedule`,
          status: 'draft',
        })
        .select()
        .single()
      existingSchedule = newSchedule
    }

    if (existingSchedule) {
      setSchedule(existingSchedule)
      const { data: scheduleEntries } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('schedule_id', existingSchedule.id)
        .order('service_date', { ascending: true })

      if (scheduleEntries) {
        // Attach speaker info
        const enriched = scheduleEntries.map((entry: any) => {
          const speaker = speakers.find((s) => s.id === entry.speaker_id)
          return { ...entry, speaker }
        })
        setEntries(enriched)
      }
    }
  }

  // Get all Sundays in the current month
  const getSundays = useCallback(() => {
    const sundays: Date[] = []
    const date = new Date(currentYear, currentMonth, 1)
    while (date.getMonth() === currentMonth) {
      if (date.getDay() === 0) {
        sundays.push(new Date(date))
      }
      date.setDate(date.getDate() + 1)
    }
    return sundays
  }, [currentMonth, currentYear])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const getEntriesForDate = (dateStr: string) => {
    return entries.filter((e) => e.service_date === dateStr)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'declined': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-amber-500/10 text-amber-700 border-amber-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="h-3.5 w-3.5" />
      case 'declined': return <X className="h-3.5 w-3.5" />
      default: return <Clock className="h-3.5 w-3.5" />
    }
  }

  // Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // CRUD Operations
  const handleAddEntry = async () => {
    if (!schedule || !entryForm.service_date || !entryForm.speaker_id) return

    const { data, error } = await supabase
      .from('schedule_entries')
      .insert({
        schedule_id: schedule.id,
        service_date: entryForm.service_date,
        service_type: entryForm.service_type,
        speaker_id: entryForm.speaker_id,
        topic: entryForm.topic || null,
        scripture_reference: entryForm.scripture_reference || null,
        notes: entryForm.notes || null,
        confirmation_status: 'pending',
      })
      .select()
      .single()

    if (!error && data) {
      // Send notification email
      await sendNotification(data.id, entryForm.speaker_id, entryForm.service_date, entryForm.service_type)
      setShowAddEntry(false)
      resetForm()
      loadSchedule()
    }
  }

  const handleEditEntry = async () => {
    if (!editingEntry) return

    const speakerChanged = editingEntry.speaker_id !== entryForm.speaker_id

    const { error } = await supabase
      .from('schedule_entries')
      .update({
        service_date: entryForm.service_date,
        service_type: entryForm.service_type,
        speaker_id: entryForm.speaker_id,
        topic: entryForm.topic || null,
        scripture_reference: entryForm.scripture_reference || null,
        notes: entryForm.notes || null,
        confirmation_status: speakerChanged ? 'pending' : editingEntry.confirmation_status,
      })
      .eq('id', editingEntry.id)

    if (!error) {
      if (speakerChanged) {
        await sendNotification(editingEntry.id, entryForm.speaker_id, entryForm.service_date, entryForm.service_type)
      }
      setShowEditEntry(false)
      setEditingEntry(null)
      resetForm()
      loadSchedule()
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    const { error } = await supabase.from('schedule_entries').delete().eq('id', entryId)
    if (!error) loadSchedule()
  }

  const sendNotification = async (entryId: string, speakerId: string, date: string, serviceType: string) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    if (!speaker?.email) return

    // Store notification in DB
    await supabase.from('speaker_notifications').insert({
      entry_id: entryId,
      speaker_id: speakerId,
      notification_type: 'schedule_assignment',
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    // Send email via API route
    try {
      await fetch('/api/send-schedule-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerName: `${speaker.first_name} ${speaker.last_name}`,
          speakerEmail: speaker.email,
          date: formatDisplayDate(date),
          serviceType: SERVICE_TYPES.find(s => s.value === serviceType)?.label || serviceType,
          entryId,
        }),
      })
    } catch (err) {
      // Notification stored in DB even if email fails
    }
  }

  const resendNotification = async (entry: ScheduleEntry) => {
    if (entry.speaker_id) {
      await sendNotification(entry.id, entry.speaker_id, entry.service_date, entry.service_type)
    }
  }

  // Drag and Drop
  const handleDragStart = (entry: ScheduleEntry) => {
    setDraggedEntry(entry)
  }

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault()
    setDragOverDate(dateStr)
  }

  const handleDragLeave = () => {
    setDragOverDate(null)
  }

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    e.preventDefault()
    setDragOverDate(null)

    if (!draggedEntry || draggedEntry.service_date === targetDate) {
      setDraggedEntry(null)
      return
    }

    // Update entry date
    const speakerChanged = false
    const { error } = await supabase
      .from('schedule_entries')
      .update({
        service_date: targetDate,
        confirmation_status: 'pending', // Re-confirm after reschedule
      })
      .eq('id', draggedEntry.id)

    if (!error) {
      // Notify speaker of reschedule
      if (draggedEntry.speaker_id) {
        await sendNotification(draggedEntry.id, draggedEntry.speaker_id, targetDate, draggedEntry.service_type)
      }
      loadSchedule()
    }
    setDraggedEntry(null)
  }

  const openAddDialog = (dateStr: string) => {
    resetForm()
    setSpeakerSearch('')
    setShowSpeakerDropdown(false)
    setEntryForm((prev) => ({ ...prev, service_date: dateStr }))
    setShowAddEntry(true)
  }

  const openEditDialog = (entry: ScheduleEntry) => {
    setEditingEntry(entry)
    const speaker = speakers.find((s) => s.id === entry.speaker_id)
    setSpeakerSearch(speaker ? `${speaker.first_name} ${speaker.last_name}` : '')
    setShowSpeakerDropdown(false)
    setEntryForm({
      service_date: entry.service_date,
      service_type: entry.service_type,
      speaker_id: entry.speaker_id || '',
      topic: entry.topic || '',
      scripture_reference: entry.scripture_reference || '',
      notes: entry.notes || '',
    })
    setShowEditEntry(true)
  }

  const resetForm = () => {
    setEntryForm({
      service_date: '',
      service_type: 'morning',
      speaker_id: '',
      topic: '',
      scripture_reference: '',
      notes: '',
    })
  }

  const sundays = getSundays()

  const stats = {
    total: entries.length,
    confirmed: entries.filter((e) => e.confirmation_status === 'confirmed').length,
    pending: entries.filter((e) => e.confirmation_status === 'pending').length,
    declined: entries.filter((e) => e.confirmation_status === 'declined').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Preaching Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage speakers for each Sunday service
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border min-w-[200px] justify-center">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              {MONTHS[currentMonth]} {currentYear}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.declined}</p>
                <p className="text-xs text-muted-foreground">Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid - Sundays */}
      <div className="flex flex-col gap-4">
        {sundays.map((sunday) => {
          const dateStr = formatDate(sunday)
          const dayEntries = getEntriesForDate(dateStr)
          const isDragOver = dragOverDate === dateStr

          return (
            <Card
              key={dateStr}
              className={`border-border/50 transition-all duration-200 ${
                isDragOver ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-primary/10 shrink-0">
                      <span className="text-xs font-medium text-primary uppercase">
                        {sunday.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary leading-none">
                        {sunday.getDate()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {sunday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {dayEntries.length} service{dayEntries.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAddDialog(dateStr)}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Speaker
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {dayEntries.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No speakers scheduled</p>
                    <p className="text-xs mt-1">Click "Add Speaker" or drag a speaker here</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={() => handleDragStart(entry)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-grab active:cursor-grabbing group"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />

                        {/* Speaker Avatar */}
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {entry.speaker
                              ? `${entry.speaker.first_name[0]}${entry.speaker.last_name[0]}`
                              : '?'}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-foreground truncate">
                              {entry.speaker
                                ? `${entry.speaker.first_name} ${entry.speaker.last_name}`
                                : 'Unassigned'}
                            </p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {SERVICE_TYPES.find((s) => s.value === entry.service_type)?.label || entry.service_type}
                            </Badge>
                          </div>
                          {entry.topic && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {entry.topic}
                              {entry.scripture_reference && ` - ${entry.scripture_reference}`}
                            </p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs gap-1 ${getStatusColor(entry.confirmation_status)}`}
                        >
                          {getStatusIcon(entry.confirmation_status)}
                          {entry.confirmation_status}
                        </Badge>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {entry.confirmation_status === 'pending' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              title="Resend notification"
                              onClick={() => resendNotification(entry)}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            title="Edit"
                            onClick={() => openEditDialog(entry)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Remove"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {sundays.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No Sundays found for this month</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Speaker</DialogTitle>
            <DialogDescription>
              Assign a speaker for {entryForm.service_date ? formatDisplayDate(entryForm.service_date) : 'this Sunday'}.
              They will receive an email notification to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Speaker *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={speakerSearch}
                    onChange={(e) => {
                      setSpeakerSearch(e.target.value)
                      setShowSpeakerDropdown(true)
                      if (!e.target.value) {
                        setEntryForm({ ...entryForm, speaker_id: '' })
                      }
                    }}
                    onFocus={() => setShowSpeakerDropdown(true)}
                    placeholder="Search contacts by name..."
                    className="pl-9"
                  />
                </div>
                {showSpeakerDropdown && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg max-h-48 overflow-y-auto">
                    {filteredSpeakers.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        No contacts found
                      </div>
                    ) : (
                      filteredSpeakers.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setEntryForm({ ...entryForm, speaker_id: s.id })
                            setSpeakerSearch(`${s.first_name} ${s.last_name}`)
                            setShowSpeakerDropdown(false)
                          }}
                          className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors ${
                            entryForm.speaker_id === s.id ? 'bg-primary/5 text-primary' : 'text-foreground'
                          }`}
                        >
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {s.first_name[0]}{s.last_name[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{s.first_name} {s.last_name}</p>
                            {s.email && (
                              <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                            )}
                          </div>
                          {entryForm.speaker_id === s.id && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {entryForm.speaker_id && (
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{selectedSpeakerName(entryForm.speaker_id)}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Service Type</Label>
              <Select
                value={entryForm.service_type}
                onValueChange={(v) => setEntryForm({ ...entryForm, service_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Topic / Sermon Title</Label>
              <Input
                value={entryForm.topic}
                onChange={(e) => setEntryForm({ ...entryForm, topic: e.target.value })}
                placeholder="e.g. Walking by Faith"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Scripture Reference</Label>
              <Input
                value={entryForm.scripture_reference}
                onChange={(e) => setEntryForm({ ...entryForm, scripture_reference: e.target.value })}
                placeholder="e.g. Hebrews 11:1-6"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notes</Label>
              <Textarea
                value={entryForm.notes}
                onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                placeholder="Any additional notes or instructions..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEntry(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEntry}
              disabled={!entryForm.speaker_id}
            >
              <Mail className="h-4 w-4 mr-2" />
              Schedule & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={showEditEntry} onOpenChange={setShowEditEntry}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule Entry</DialogTitle>
            <DialogDescription>
              Update speaker assignment. If the speaker changes, a new notification will be sent.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={entryForm.service_date}
                onChange={(e) => setEntryForm({ ...entryForm, service_date: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Speaker *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={speakerSearch}
                    onChange={(e) => {
                      setSpeakerSearch(e.target.value)
                      setShowSpeakerDropdown(true)
                      if (!e.target.value) {
                        setEntryForm({ ...entryForm, speaker_id: '' })
                      }
                    }}
                    onFocus={() => setShowSpeakerDropdown(true)}
                    placeholder="Search contacts by name..."
                    className="pl-9"
                  />
                </div>
                {showSpeakerDropdown && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg max-h-48 overflow-y-auto">
                    {filteredSpeakers.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        No contacts found
                      </div>
                    ) : (
                      filteredSpeakers.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setEntryForm({ ...entryForm, speaker_id: s.id })
                            setSpeakerSearch(`${s.first_name} ${s.last_name}`)
                            setShowSpeakerDropdown(false)
                          }}
                          className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors ${
                            entryForm.speaker_id === s.id ? 'bg-primary/5 text-primary' : 'text-foreground'
                          }`}
                        >
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {s.first_name[0]}{s.last_name[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{s.first_name} {s.last_name}</p>
                            {s.email && (
                              <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                            )}
                          </div>
                          {entryForm.speaker_id === s.id && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {entryForm.speaker_id && (
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{selectedSpeakerName(entryForm.speaker_id)}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Service Type</Label>
              <Select
                value={entryForm.service_type}
                onValueChange={(v) => setEntryForm({ ...entryForm, service_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Topic / Sermon Title</Label>
              <Input
                value={entryForm.topic}
                onChange={(e) => setEntryForm({ ...entryForm, topic: e.target.value })}
                placeholder="e.g. Walking by Faith"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Scripture Reference</Label>
              <Input
                value={entryForm.scripture_reference}
                onChange={(e) => setEntryForm({ ...entryForm, scripture_reference: e.target.value })}
                placeholder="e.g. Hebrews 11:1-6"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notes</Label>
              <Textarea
                value={entryForm.notes}
                onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditEntry(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEntry} disabled={!entryForm.speaker_id}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
