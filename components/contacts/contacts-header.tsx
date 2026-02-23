'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Download, Tags, Mail } from 'lucide-react'
import { AddContactDialog } from './add-contact-dialog'
import { ManageTagsDialog } from './manage-tags-dialog'
import { ImportContactsDialog } from './import-contacts-dialog'
import { ComposeEmailDialog, type EmailRecipient } from './compose-email-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ContactsHeaderProps {
  organizationId: string
  role: string
  tags: Array<{ id: string; name: string; color: string }>
  contacts: Array<{
    id: string
    first_name: string
    last_name: string
    email?: string
    contact_tag_assignments: Array<{ tag: { id: string } }>
  }>
  onRefresh?: () => void
}

export function ContactsHeader({ organizationId, role, tags, contacts, onRefresh }: ContactsHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [emailGroupLabel, setEmailGroupLabel] = useState<string | undefined>()

  const canManage = ['admin', 'manager', 'leader'].includes(role)

  const handleExport = async (tagId?: string, status?: string) => {
    const params = new URLSearchParams({ organizationId })
    if (tagId) params.set('tagId', tagId)
    if (status) params.set('status', status)

    const response = await fetch(`/api/contacts/export?${params.toString()}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleEmailGroup = (tagId: string, tagName: string) => {
    const recipients = contacts
      .filter(
        (c) =>
          c.email?.trim() &&
          c.contact_tag_assignments.some((a) => a.tag.id === tagId)
      )
      .map((c) => ({ id: c.id, first_name: c.first_name, last_name: c.last_name, email: c.email! }))

    if (recipients.length === 0) return
    setEmailRecipients(recipients)
    setEmailGroupLabel(tagName)
    setShowCompose(true)
  }

  const handleEmailAll = () => {
    const recipients = contacts
      .filter((c) => c.email?.trim())
      .map((c) => ({ id: c.id, first_name: c.first_name, last_name: c.last_name, email: c.email! }))

    if (recipients.length === 0) return
    setEmailRecipients(recipients)
    setEmailGroupLabel('All Contacts')
    setShowCompose(true)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your community contacts and relationships
          </p>
        </div>

        {canManage && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setShowTagsDialog(true)}>
              <Tags className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Manage Tags</span>
              <span className="sm:hidden">Tags</span>
            </Button>

            {/* Email Group dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Email Group</span>
                  <span className="sm:hidden">Email</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleEmailAll}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email All Contacts
                </DropdownMenuItem>
                {tags.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs text-muted-foreground font-semibold" disabled>
                      By Tag / Group
                    </DropdownMenuItem>
                    {tags.map((tag) => {
                      const count = contacts.filter(
                        (c) => c.email?.trim() && c.contact_tag_assignments.some((a) => a.tag.id === tag.id)
                      ).length
                      return (
                        <DropdownMenuItem
                          key={tag.id}
                          onClick={() => handleEmailGroup(tag.id, tag.name)}
                          disabled={count === 0}
                        >
                          <div className="h-2.5 w-2.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: tag.color }} />
                          {tag.name}
                          <span className="ml-auto text-xs text-muted-foreground">{count}</span>
                        </DropdownMenuItem>
                      )
                    })}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleExport()}>
                  Export All Contacts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground font-semibold" disabled>
                  By Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(undefined, 'active')}>
                  Active Contacts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(undefined, 'inactive')}>
                  Inactive Contacts
                </DropdownMenuItem>
                {tags.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs text-muted-foreground font-semibold" disabled>
                      By Tag / Group
                    </DropdownMenuItem>
                    {tags.map((tag) => (
                      <DropdownMenuItem key={tag.id} onClick={() => handleExport(tag.id)}>
                        <div className="h-2.5 w-2.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Contact</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddContactDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        organizationId={organizationId}
        tags={tags}
        onRefresh={onRefresh}
      />
      <ManageTagsDialog
        open={showTagsDialog}
        onOpenChange={setShowTagsDialog}
        organizationId={organizationId}
        onRefresh={onRefresh}
      />
      <ImportContactsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        organizationId={organizationId}
        onRefresh={onRefresh}
      />
      <ComposeEmailDialog
        open={showCompose}
        onOpenChange={setShowCompose}
        recipients={emailRecipients}
        onRemoveRecipient={(id) => setEmailRecipients((prev) => prev.filter((r) => r.id !== id))}
        groupLabel={emailGroupLabel}
      />
    </>
  )
}
