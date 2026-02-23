'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Mail, Phone, MapPin, Edit, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EditContactDialog } from './edit-contact-dialog'
import { DeleteContactDialog } from './delete-contact-dialog'

interface Contact {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  city?: string
  status: string
  involvement?: Record<string, boolean>
  contact_tag_assignments: Array<{
    tag: {
      id: string
      name: string
      color: string
    }
  }>
}

interface ContactsListProps {
  contacts: Contact[]
  tags: Array<{ id: string; name: string; color: string }>
  role: string
  onRefresh?: () => void
}

const INVOLVEMENT_LABELS: Record<string, { label: string; className: string }> = {
  dreamteam: { label: 'DreamTeam', className: 'bg-[hsl(225,73%,40%)]/10 text-[hsl(225,73%,40%)] border-[hsl(225,73%,40%)]/30' },
  groups: { label: 'Groups', className: 'bg-[hsl(150,40%,55%)]/10 text-[hsl(150,40%,40%)] border-[hsl(150,40%,55%)]/30' },
  events: { label: 'Events', className: 'bg-amber-500/10 text-amber-700 border-amber-500/30' },
  tasks: { label: 'Tasks', className: 'bg-purple-500/10 text-purple-700 border-purple-500/30' },
}

export function ContactsList({ contacts, tags, role, onRefresh }: ContactsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)

  const canManage = ['admin', 'manager', 'leader'].includes(role)

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = 
        contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery)

      const matchesTag = 
        selectedTag === 'all' ||
        contact.contact_tag_assignments.some((assignment) => assignment.tag.id === selectedTag)

      const matchesStatus = 
        selectedStatus === 'all' ||
        contact.status === selectedStatus

      return matchesSearch && matchesTag && matchesStatus
    })
  }, [contacts, searchQuery, selectedTag, selectedStatus])

  return (
    <>
      <Card className="border-border/50 backdrop-blur-sm bg-card/80">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <Badge
                          variant={contact.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {contact.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{contact.city}</span>
                          </div>
                        )}
                      </div>
                      {/* Involvement badges */}
                      {contact.involvement && Object.keys(contact.involvement).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(contact.involvement)
                            .filter(([, active]) => active)
                            .map(([key]) => {
                              const info = INVOLVEMENT_LABELS[key]
                              if (!info) return null
                              return (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className={`text-xs ${info.className}`}
                                >
                                  {info.label}
                                </Badge>
                              )
                            })}
                        </div>
                      )}
                      {/* Tag badges */}
                      {contact.contact_tag_assignments.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.contact_tag_assignments.map((assignment) => (
                            <Badge
                              key={assignment.tag.id}
                              variant="outline"
                              style={{ borderColor: assignment.tag.color }}
                              className="text-xs"
                            >
                              {assignment.tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingContact(contact)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingContact && (
        <EditContactDialog
          contact={editingContact}
          open={!!editingContact}
          onOpenChange={(open) => !open && setEditingContact(null)}
          tags={tags}
          onRefresh={onRefresh}
        />
      )}

      {deletingContact && (
        <DeleteContactDialog
          contact={deletingContact}
          open={!!deletingContact}
          onOpenChange={(open) => !open && setDeletingContact(null)}
          onRefresh={onRefresh}
        />
      )}
    </>
  )
}
