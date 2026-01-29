'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, MoreVertical, Edit, Trash2, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditEventDialog } from './edit-event-dialog'
import { DeleteEventDialog } from './delete-event-dialog'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  capacity: number
  status: string
  event_registrations: { count: number }[]
  created_by_profile: { full_name: string } | null
}

interface EventsListProps {
  events: Event[]
  role: string
}

export function EventsList({ events, role }: EventsListProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)

  const canManage = ['admin', 'manager', 'leader'].includes(role)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'completed': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'cancelled': return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default: return ''
    }
  }

  return (
    <>
      {events.length === 0 ? (
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming events. Create your first event to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => {
            const registrationCount = event.event_registrations?.[0]?.count || 0
            const eventDate = new Date(event.event_date)
            
            return (
              <Card key={event.id} className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {/* Date Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-medium uppercase">
                            {format(eventDate, 'MMM')}
                          </span>
                          <span className="text-2xl font-bold">
                            {format(eventDate, 'd')}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground mb-1">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {event.start_time} - {event.end_time}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {registrationCount} registered
                              {event.capacity && ` / ${event.capacity} capacity`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/dashboard/events/${event.id}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Manage Program
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingEvent(event)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
        />
      )}

      {deletingEvent && (
        <DeleteEventDialog
          event={deletingEvent}
          open={!!deletingEvent}
          onOpenChange={(open) => !open && setDeletingEvent(null)}
        />
      )}
    </>
  )
}
