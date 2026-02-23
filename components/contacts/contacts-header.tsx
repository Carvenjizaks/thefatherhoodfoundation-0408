'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Download, Tags } from 'lucide-react'
import { AddContactDialog } from './add-contact-dialog'
import { ManageTagsDialog } from './manage-tags-dialog'
import { ImportContactsDialog } from './import-contacts-dialog'
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
  onRefresh?: () => void
}

export function ContactsHeader({ organizationId, role, tags, onRefresh }: ContactsHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)

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

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your community contacts and relationships
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowTagsDialog(true)}>
              <Tags className="h-4 w-4 mr-2" />
              Manage Tags
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            {/* Export dropdown with tag/status filtering */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
              Add Contact
            </Button>
          </div>
        )}
      </div>

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
    </>
  )
}
