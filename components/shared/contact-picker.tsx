'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X, User, ChevronDown } from 'lucide-react'

export interface ContactOption {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  involvement: Record<string, boolean> | null
  avatar_url?: string | null
}

interface ContactPickerProps {
  organizationId: string
  value: string | null
  onChange: (contactId: string | null, contact: ContactOption | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Filter by involvement key, e.g. "dreamteam" */
  involvementFilter?: string
}

export function ContactPicker({
  organizationId,
  value,
  onChange,
  placeholder = 'Select a contact...',
  disabled = false,
  className = '',
  involvementFilter,
}: ContactPickerProps) {
  const supabase = createClient()
  const [contacts, setContacts] = useState<ContactOption[]>([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (organizationId) fetchContacts()
  }, [organizationId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, involvement, avatar_url')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('first_name')

    if (!error && data) {
      setContacts(data as ContactOption[])
    }
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = contacts
    if (involvementFilter) {
      list = list.filter(c => c.involvement && c.involvement[involvementFilter])
    }
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
    )
  }, [contacts, search, involvementFilter])

  const selectedContact = useMemo(
    () => contacts.find(c => c.id === value) || null,
    [contacts, value]
  )

  const involvementBadges = (c: ContactOption) => {
    if (!c.involvement) return null
    const keys = Object.keys(c.involvement).filter(k => c.involvement![k])
    if (keys.length === 0) return null
    return keys.map(k => (
      <Badge key={k} variant="secondary" className="text-[10px] px-1 py-0 capitalize">
        {k}
      </Badge>
    ))
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selected state or trigger */}
      {value && selectedContact ? (
        <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium truncate">
              {selectedContact.first_name} {selectedContact.last_name}
            </span>
            {selectedContact.email && (
              <span className="text-xs text-muted-foreground ml-2 truncate">
                {selectedContact.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {involvementBadges(selectedContact)}
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 shrink-0"
              onClick={() => {
                onChange(null, null)
                setSearch('')
              }}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear selection</span>
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-2 w-full border rounded-md px-3 py-2 bg-background text-sm text-muted-foreground hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 50)
          }}
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left truncate">{placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-md">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading contacts...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No contacts found</p>
            ) : (
              filtered.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    onChange(c.id, c)
                    setIsOpen(false)
                    setSearch('')
                  }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {c.first_name} {c.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {c.email || c.phone || 'No contact info'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {involvementBadges(c)}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
