'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { AddEventDialog } from './add-event-dialog'

interface EventsHeaderProps {
  organizationId: string
  role: string
}

export function EventsHeader({ organizationId, role }: EventsHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  const canManage = ['admin', 'manager', 'leader'].includes(role)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Events</h2>
          <p className="text-muted-foreground mt-1">
            Schedule and manage community events
          </p>
        </div>
        
        {canManage && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </div>

      <AddEventDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        organizationId={organizationId}
      />
    </>
  )
}
