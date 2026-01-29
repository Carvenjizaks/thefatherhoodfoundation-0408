'use client'

import React from "react"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { EventProgramBuilder } from '@/components/events/event-program-builder'
import { SimpleProgramBuilder } from '@/components/events/simple-program-builder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, ListTree } from 'lucide-react'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const [refreshKey, setRefreshKey] = useState(0)

  console.log('[v0] Event detail page loaded for event:', eventId)

  // Mock event data - in production, fetch from database
  const mockEvent = {
    id: eventId,
    title: 'Sunday Service',
    event_date: '2025-12-14'
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Simple Builder
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <ListTree className="h-4 w-4" />
            Advanced Builder
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="mt-6">
          <SimpleProgramBuilder
            key={refreshKey}
            eventId={eventId}
            eventDate={mockEvent.event_date}
            eventTitle={mockEvent.title}
            onUpdate={() => setRefreshKey(prev => prev + 1)}
          />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <EventProgramBuilder eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
