'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Trash2, User, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditTaskDialog } from './edit-task-dialog'
import { DeleteTaskDialog } from './delete-task-dialog'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
  assigned_to_profile: { full_name: string } | null
  project: { name: string } | null
}

interface TasksBoardProps {
  tasks: Task[]
  projects: any[]
  role: string
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'border-l-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-l-yellow-500' },
  { id: 'completed', title: 'Completed', color: 'border-l-green-500' },
]

const priorityColors = {
  low: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  medium: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  urgent: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export function TasksBoard({ tasks, projects, role }: TasksBoardProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const canManage = ['admin', 'manager', 'leader'].includes(role)

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          
          return (
            <Card key={column.id} className="border-border/50 backdrop-blur-sm bg-card/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks
                  </p>
                ) : (
                  columnTasks.map((task) => {
                    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
                    
                    return (
                      <Card
                        key={task.id}
                        className={cn(
                          'border-l-4 hover:shadow-md transition-shadow',
                          column.color
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2">
                              {task.title}
                            </h4>
                            {canManage && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeletingTask(task)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge className={priorityColors[task.priority]} variant="outline">
                              {task.priority}
                            </Badge>
                            {task.project && (
                              <Badge variant="outline" className="text-xs">
                                {task.project.name}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs text-muted-foreground">
                            {task.assigned_to_profile && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                <span>{task.assigned_to_profile.full_name}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className={cn(
                                'flex items-center gap-1.5',
                                isOverdue && 'text-destructive font-medium'
                              )}>
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(task.due_date).toLocaleDateString()}
                                  {isOverdue && ' (Overdue)'}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          projects={projects}
        />
      )}

      {deletingTask && (
        <DeleteTaskDialog
          task={deletingTask}
          open={!!deletingTask}
          onOpenChange={(open) => !open && setDeletingTask(null)}
        />
      )}
    </>
  )
}
