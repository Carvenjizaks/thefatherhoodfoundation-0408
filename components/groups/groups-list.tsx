'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UsersRound, MapPin, Calendar, User, MoreVertical, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditGroupDialog } from './edit-group-dialog'
import { DeleteGroupDialog } from './delete-group-dialog'

interface Group {
  id: string
  name: string
  description: string
  type: string
  meeting_frequency: string
  meeting_day: string
  meeting_time: string
  location: string
  capacity: number
  is_active: boolean
  leader: { full_name: string } | null
  assistant_leader: { full_name: string } | null
  group_members: { count: number }[]
}

interface GroupsListProps {
  groups: Group[]
  role: string
}

export function GroupsList({ groups, role }: GroupsListProps) {
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)

  const canManage = ['admin', 'manager', 'leader'].includes(role)

  return (
    <>
      {groups.length === 0 ? (
        <Card className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              No groups available.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.id} className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/dashboard/groups/${group.id}`} className="flex-1 space-y-3 cursor-pointer">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 hover:text-primary transition-colors">
                        {group.name}
                        {!group.is_active && (
                          <Badge variant="secondary" className="ml-2">
                            Inactive
                          </Badge>
                        )}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                      )}
                    </div>
                  </Link>
                  <Badge variant="outline" className="capitalize">
                    {group.type}
                  </Badge>
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingGroup(group)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/groups/${group.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingGroup(group)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {group.leader && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{group.leader.full_name}</span>
                    </div>
                  )}
                  {group.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{group.location}</span>
                    </div>
                  )}
                  {group.meeting_day && group.meeting_time && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">
                        {group.meeting_day}s at {group.meeting_time}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <UsersRound className="h-4 w-4" />
                    <span>
                      {group.group_members[0].count} member{group.group_members[0].count !== 1 ? 's' : ''}
                      {group.capacity && ` / ${group.capacity} capacity`}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/groups/${group.id}`}>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
        />
      )}

      {deletingGroup && (
        <DeleteGroupDialog
          group={deletingGroup}
          open={!!deletingGroup}
          onOpenChange={(open) => !open && setDeletingGroup(null)}
        />
      )}
    </>
  )
}
