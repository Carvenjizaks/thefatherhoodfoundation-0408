'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EditProgramItemDialog } from './edit-program-item-dialog'
import { DeleteProgramItemDialog } from './delete-program-item-dialog'
import { Clock, User, GripVertical, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface ProgramItemsListProps {
  eventId: string
  items: any[]
  onUpdate: () => void
}

export function ProgramItemsList({ eventId, items, onUpdate }: ProgramItemsListProps) {
  const supabase = createClient()
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  const moveItem = async (item: any, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(i => i.id === item.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (targetIndex < 0 || targetIndex >= items.length) return

    const currentItem = items[currentIndex]
    const targetItem = items[targetIndex]

    // Swap sequence orders
    await supabase
      .from('event_program_items')
      .update({ sequence_order: targetItem.sequence_order })
      .eq('id', currentItem.id)

    await supabase
      .from('event_program_items')
      .update({ sequence_order: currentItem.sequence_order })
      .eq('id', targetItem.id)

    onUpdate()
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>No program items yet</p>
        <p className="text-sm">Click "Add Program Item" to start building your event schedule</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            {/* Reorder Buttons */}
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveItem(item, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveItem(item, 'down')}
                disabled={index === items.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Sequence Number */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{item.sequence_order}</span>
              </div>
            </div>

            {/* Item Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingItem(item)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Time and Duration */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {item.start_time} - {item.end_time}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {item.duration_minutes} min
                  </Badge>
                </div>
                {item.item_type && (
                  <Badge variant="outline">{item.item_type}</Badge>
                )}
              </div>

              {/* Role Assignments */}
              {item.assignments && item.assignments.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Assigned Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {item.assignments.map((assignment: any) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5"
                      >
                        <Badge variant="secondary" className="text-xs">
                          {assignment.role_name}
                        </Badge>
                        {assignment.profile && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {assignment.profile.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{assignment.profile.full_name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  <strong>Notes:</strong> {item.notes}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Edit Dialog */}
      {editingItem && (
        <EditProgramItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onSuccess={() => {
            setEditingItem(null)
            onUpdate()
          }}
        />
      )}

      {/* Delete Dialog */}
      {deletingItem && (
        <DeleteProgramItemDialog
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          item={deletingItem}
          onSuccess={() => {
            setDeletingItem(null)
            onUpdate()
          }}
        />
      )}
    </div>
  )
}
