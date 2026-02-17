'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddGroupDialog } from './add-group-dialog'

interface GroupsHeaderProps {
  organizationId: string
  role: string
}

export function GroupsHeader({ organizationId, role }: GroupsHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  const canManage = ['admin', 'manager', 'leader'].includes(role)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Groups</h2>
          <p className="text-muted-foreground mt-1">
            Manage groups, ministries, and teams
          </p>
        </div>
        
        {canManage && (
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        )}
      </div>

      <AddGroupDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        organizationId={organizationId}
      />
    </>
  )
}
