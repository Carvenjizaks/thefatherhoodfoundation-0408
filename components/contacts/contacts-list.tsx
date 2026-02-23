'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Mail, Phone, MapPin, Edit, Trash2, MoreVertical, Send, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { ComposeEmailDialog, type EmailRecipient } from './compose-email-dialog'

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

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Email compose state
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([])
  const [showCompose, setShowCompose] = useState(false)

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
        contact.contact_tag_assignments.some((a) => a.tag.id === selectedTag)

      const matchesStatus =
        selectedStatus === 'all' ||
        contact.status === selectedStatus

      return matchesSearch && matchesTag && matchesStatus
    })
  }, [contacts, searchQuery, selectedTag, selectedStatus])

  // Contacts with emails (for selection)
  const emailableContacts = useMemo(
    () => filteredContacts.filter((c) => c.email?.trim()),
    [filteredContacts]
  )

  const allSelected = emailableContacts.length > 0 && emailableContacts.every((c) => selectedIds.has(c.id))
  const someSelected = selectedIds.size > 0

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(emailableContacts.map((c) => c.id)))
    }
  }

  const clearSelection = () => setSelectedIds(new Set())

  // Email actions
  const handleEmailSelected = () => {
    const recipients = filteredContacts
      .filter((c) => selectedIds.has(c.id) && c.email?.trim())
      .map((c) => ({ id: c.id, first_name: c.first_name, last_name: c.last_name, email: c.email! }))
    setEmailRecipients(recipients)
    setShowCompose(true)
  }

  const handleEmailSingle = (contact: Contact) => {
    if (!contact.email?.trim()) return
    setEmailRecipients([{ id: contact.id, first_name: contact.first_name, last_name: contact.last_name, email: contact.email }])
    setShowCompose(true)
  }

  const handleRemoveRecipient = (id: string) => {
    setEmailRecipients((prev) => prev.filter((r) => r.id !== id))
    if (emailRecipients.length <= 1) setShowCompose(false)
  }

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
                  <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
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
            <>
              {/* Select-all row */}
              <div className="flex items-center gap-3 px-4 py-2 mb-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all contacts"
                />
                <span>{filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="grid gap-3">
                {filteredContacts.map((contact) => {
                  const hasEmail = !!contact.email?.trim()
                  const isSelected = selectedIds.has(contact.id)

                  return (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border/50 bg-card/50 hover:bg-accent/50'
                      }`}
                    >
                      {/* Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(contact.id)}
                        disabled={!hasEmail}
                        aria-label={`Select ${contact.first_name} ${contact.last_name}`}
                        className="flex-shrink-0"
                      />

                      {/* Avatar */}
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">
                            {contact.first_name} {contact.last_name}
                          </h3>
                          <Badge variant={contact.status === 'active' ? 'default' : 'secondary'} className="capitalize">
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
                        {contact.involvement && Object.keys(contact.involvement).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(contact.involvement)
                              .filter(([, active]) => active)
                              .map(([key]) => {
                                const info = INVOLVEMENT_LABELS[key]
                                if (!info) return null
                                return (
                                  <Badge key={key} variant="outline" className={`text-xs ${info.className}`}>
                                    {info.label}
                                  </Badge>
                                )
                              })}
                          </div>
                        )}
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

                      {/* Actions */}
                      {canManage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {hasEmail && (
                              <>
                                <DropdownMenuItem onClick={() => handleEmailSingle(contact)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
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
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating action bar */}
      {someSelected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-xl">
            <span className="text-sm font-medium text-foreground">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <Button size="sm" onClick={handleEmailSelected}>
              <Mail className="h-4 w-4 mr-2" />
              Email Selected
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              <X className="h-4 w-4 mr-1" />
              Deselect
            </Button>
          </div>
        </div>
      )}

      {/* Compose email dialog */}
      <ComposeEmailDialog
        open={showCompose}
        onOpenChange={(open) => {
          setShowCompose(open)
          if (!open) clearSelection()
        }}
        recipients={emailRecipients}
        onRemoveRecipient={handleRemoveRecipient}
      />

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
