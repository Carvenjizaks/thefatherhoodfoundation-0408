'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, FolderPlus } from 'lucide-react'
import { AddTaskDialog } from './add-task-dialog'
import { AddProjectDialog } from './add-project-dialog'

interface TasksHeaderProps {
  organizationId: string
  role: string
}

export function TasksHeader({ organizationId, role }: TasksHeaderProps) {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false)
  
  const canManage = ['admin', 'manager', 'leader'].includes(role)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tasks & Projects</h2>
          <p className="text-muted-foreground mt-1">
            Track and manage your team's work
          </p>
        </div>
        
        {canManage && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowAddProjectDialog(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <Button 
              onClick={() => setShowAddTaskDialog(true)}
              className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        )}
      </div>

      <AddTaskDialog 
        open={showAddTaskDialog} 
        onOpenChange={setShowAddTaskDialog}
        organizationId={organizationId}
      />

      <AddProjectDialog 
        open={showAddProjectDialog} 
        onOpenChange={setShowAddProjectDialog}
        organizationId={organizationId}
      />
    </>
  )
}
