'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Clock, Users, GripVertical, Trash2, Check, Sparkles, Calendar } from 'lucide-react'
import { EVENT_TEMPLATES, calculateStartTimes, type EventTemplate } from '@/lib/event-templates'

interface SimpleProgramBuilderProps {
  eventId: string
  eventDate: string
  eventTitle: string
  onUpdate: () => void
}

interface ProgramItem {
  id?: string
  title: string
  description: string
  duration_minutes: number
  item_type: string
  start_time: string
  end_time: string
  order_index: number
  assigned_contacts?: string[]
}

export function SimpleProgramBuilder({ eventId, eventDate, eventTitle, onUpdate }: SimpleProgramBuilderProps) {
  const supabase = createClient()
  const [items, setItems] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadProgram()
  }, [eventId])

  const loadProgram = async () => {
    const { data } = await supabase
      .from('event_program_items')
      .select('*')
      .eq('event_id', eventId)
      .order('order_index')
    
    if (data) {
      setItems(data)
    }
  }

  const applyTemplate = (template: EventTemplate) => {
    const times = calculateStartTimes(template.items, startTime)
    const newItems = template.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      duration_minutes: item.duration_minutes,
      item_type: item.item_type,
      start_time: times[index].start_time,
      end_time: times[index].end_time,
      order_index: index,
      assigned_contacts: []
    }))
    
    setItems(newItems)
    setShowTemplates(false)
    console.log('[v0] Applied template:', template.name)
  }

  const saveProgram = async () => {
    setLoading(true)
    try {
      // Delete existing items
      await supabase
        .from('event_program_items')
        .delete()
        .eq('event_id', eventId)

      // Insert new items
      const itemsToInsert = items.map(item => ({
        event_id: eventId,
        title: item.title,
        description: item.description,
        item_type: item.item_type,
        start_time: item.start_time,
        end_time: item.end_time,
        duration_minutes: item.duration_minutes,
        order_index: item.order_index
      }))

      const { error } = await supabase
        .from('event_program_items')
        .insert(itemsToInsert)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onUpdate()
    } catch (err) {
      console.error('[v0] Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    // Update order indices
    newItems.forEach((item, idx) => {
      item.order_index = idx
    })

    setItems(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    // Recalculate times after reorder
    recalculateTimes()
  }

  const recalculateTimes = () => {
    if (items.length === 0) return

    const newItems = [...items]
    let currentTime = newItems[0].start_time

    newItems.forEach((item, index) => {
      if (index > 0) {
        item.start_time = currentTime
      }
      const [hours, minutes] = currentTime.split(':').map(Number)
      const start = new Date(2000, 0, 1, hours, minutes)
      const end = new Date(start.getTime() + item.duration_minutes * 60000)
      item.end_time = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
      currentTime = item.end_time
    })

    setItems(newItems)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    newItems.forEach((item, idx) => {
      item.order_index = idx
    })
    setItems(newItems)
    setTimeout(recalculateTimes, 0)
  }

  const updateDuration = (index: number, minutes: number) => {
    const newItems = [...items]
    newItems[index].duration_minutes = minutes
    setItems(newItems)
    recalculateTimes()
  }

  const getTotalDuration = () => {
    return items.reduce((sum, item) => sum + item.duration_minutes, 0)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-[hsl(225,73%,40%)]/5 to-[hsl(150,40%,72%)]/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">{eventTitle}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{eventDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowTemplates(true)} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Load Template
              </Button>
              <Button onClick={saveProgram} disabled={loading || items.length === 0}>
                <Check className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Program'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {success && (
        <Alert className="bg-primary/10 border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            Program saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Program Items */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Program Schedule</h3>
            <Badge variant="secondary" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              Total: {formatDuration(getTotalDuration())}
            </Badge>
          </div>

          {items.map((item, index) => (
            <Card
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`cursor-move transition-all hover:shadow-md ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.start_time} - {item.end_time}
                          </Badge>
                          <Badge className={`text-xs ${
                            item.item_type === 'session' ? 'bg-primary' :
                            item.item_type === 'setup' ? 'bg-secondary' :
                            item.item_type === 'break' ? 'bg-muted' :
                            'bg-accent'
                          }`}>
                            {item.item_type}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={item.duration_minutes}
                            onChange={(e) => updateDuration(index, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                            min={0}
                          />
                          <span className="text-xs text-muted-foreground">min</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Program Items Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by loading a pre-built template
            </p>
            <Button onClick={() => setShowTemplates(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a ready-to-use program template to get started quickly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Service Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6">
              {EVENT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => applyTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {template.items.length} items
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(template.total_duration)}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
