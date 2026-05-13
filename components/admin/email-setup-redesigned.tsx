"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Send,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Paperclip,
  Eye,
  X,
  Check,
  AlertCircle,
  Users,
  Tag,
  FolderOpen,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Mail,
  RefreshCw,
  Upload,
} from "lucide-react"

// Types
type Contact = {
  id: string
  first_name: string
  last_name: string
  email: string
  tags: string[] | null
  unsubscribed: boolean
  gender?: string | null
}

type Group = {
  id: string
  name: string
  description?: string
  color: string
  memberCount?: number
}

// Constants
const FONT_FAMILIES = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Courier New, monospace", label: "Courier New" },
]

const FONT_SIZES = [
  { value: "12px", label: "Small (12px)" },
  { value: "14px", label: "Normal (14px)" },
  { value: "16px", label: "Medium (16px)" },
  { value: "18px", label: "Large (18px)" },
  { value: "20px", label: "X-Large (20px)" },
  { value: "24px", label: "XX-Large (24px)" },
]

const FONT_COLORS = [
  { value: "#1a0a0e", label: "Black", bg: "#1a0a0e" },
  { value: "#8B2B3E", label: "Maroon", bg: "#8B2B3E" },
  { value: "#2563eb", label: "Blue", bg: "#2563eb" },
  { value: "#16a34a", label: "Green", bg: "#16a34a" },
  { value: "#dc2626", label: "Red", bg: "#dc2626" },
  { value: "#9333ea", label: "Purple", bg: "#9333ea" },
  { value: "#ea580c", label: "Orange", bg: "#ea580c" },
  { value: "#6b7280", label: "Gray", bg: "#6b7280" },
]

const PERSONALIZATION_TAGS = [
  { value: "{{first_name}}", label: "First Name", desc: "Recipient's first name" },
  { value: "{{last_name}}", label: "Last Name", desc: "Recipient's last name" },
  { value: "{{email}}", label: "Email", desc: "Recipient's email" },
  { value: "{{husband_name}}", label: "Husband", desc: "Husband's name" },
  { value: "{{wife_name}}", label: "Wife", desc: "Wife's name" },
  { value: "{{couple_name}}", label: "Couple", desc: "Both names" },
]

const CORE_TAGS = ["MGM", "FF-NL", "TT4Men", "Event", "Men", "Women"]
const TAG_COLORS: Record<string, string> = {
  MGM: "#8B2B3E", "FF-NL": "#16a34a", TT4Men: "#2563eb",
  Event: "#ea580c", Men: "#1d4ed8", Women: "#db2777",
}

// Props
interface EmailSetupRedesignedProps {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>
  contacts: Contact[]
  onRefreshContacts: () => void
}

export function EmailSetupRedesigned({ adminFetch, contacts, onRefreshContacts }: EmailSetupRedesignedProps) {
  // Selection mode: "all" | "individuals" | "tag" | "group"
  const [selectionMode, setSelectionMode] = useState<"all" | "individuals" | "tag" | "group">("all")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [selectedIndividuals, setSelectedIndividuals] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  // Groups
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)

  // Email content
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  // Formatting
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [fontColor, setFontColor] = useState("#1a0a0e")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")

  // Dialogs
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showDocDialog, setShowDocDialog] = useState(false)
  const [docName, setDocName] = useState("")
  const [docUrl, setDocUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // Send state
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch groups on mount
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true)
    try {
      const res = await adminFetch("/api/admin/groups")
      if (res.ok) {
        const data = await res.json()
        setGroups(data.groups?.map((g: any) => ({
          ...g,
          memberCount: g.contact_group_members?.[0]?.count || 0
        })) || [])
      }
    } catch (e) {
      console.error("Failed to fetch groups:", e)
    } finally {
      setLoadingGroups(false)
    }
  }, [adminFetch])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  // Auto-dismiss result
  useEffect(() => {
    if (sendResult) {
      const t = setTimeout(() => setSendResult(null), 5000)
      return () => clearTimeout(t)
    }
  }, [sendResult])

  // Active (non-unsubscribed) contacts
  const activeContacts = contacts.filter(c => !c.unsubscribed)

  // Get all unique tags
  const allTags = Array.from(new Set([
    ...CORE_TAGS,
    ...contacts.flatMap(c => c.tags || []).filter(Boolean)
  ]))

  // Count contacts per tag
  const tagCount = (tag: string) => activeContacts.filter(c => c.tags?.includes(tag)).length

  // Filter contacts by search
  const filteredContacts = activeContacts.filter(c => {
    const q = searchTerm.toLowerCase()
    return (
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  // Calculate recipient count based on selection
  const getRecipientCount = (): number => {
    switch (selectionMode) {
      case "all":
        return activeContacts.length
      case "individuals":
        return selectedIndividuals.size
      case "tag":
        return selectedTag ? tagCount(selectedTag) : 0
      case "group":
        return groups.find(g => g.id === selectedGroup)?.memberCount || 0
      default:
        return 0
    }
  }

  // Get recipients for sending
  const getRecipients = () => {
    let recipients: { id: string; email: string; firstName: string; lastName: string }[] = []

    switch (selectionMode) {
      case "all":
        recipients = activeContacts.map(c => ({
          id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name
        }))
        break
      case "individuals":
        recipients = activeContacts
          .filter(c => selectedIndividuals.has(c.id))
          .map(c => ({
            id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name
          }))
        break
      case "tag":
        if (selectedTag) {
          recipients = activeContacts
            .filter(c => c.tags?.includes(selectedTag))
            .map(c => ({
              id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name
            }))
        }
        break
      case "group":
        // For groups, we'll need to fetch group members or handle this server-side
        break
    }
    return recipients
  }

  // Toggle individual selection
  const toggleIndividual = (id: string) => {
    const newSet = new Set(selectedIndividuals)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIndividuals(newSet)
  }

  // Select/deselect all filtered contacts
  const selectAllFiltered = () => {
    const newSet = new Set(selectedIndividuals)
    filteredContacts.forEach(c => newSet.add(c.id))
    setSelectedIndividuals(newSet)
  }

  const deselectAll = () => {
    setSelectedIndividuals(new Set())
  }

  // Editor helpers
  const insertAtCursor = (text: string) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      const textNode = document.createTextNode(text)
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      el.innerHTML += text
    }
    setEmailBody(el.innerHTML)
  }

  const insertHtmlAtCursor = (html: string) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      const frag = document.createRange().createContextualFragment(html)
      const lastNode = frag.lastChild
      range.insertNode(frag)
      if (lastNode) {
        const afterRange = document.createRange()
        afterRange.setStartAfter(lastNode)
        afterRange.collapse(true)
        sel.removeAllRanges()
        sel.addRange(afterRange)
      }
    } else {
      el.innerHTML += html
    }
    setEmailBody(el.innerHTML)
  }

  const insertLink = () => {
    if (!linkText.trim() || !linkUrl.trim()) return
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    insertHtmlAtCursor(`<a href="${url}" style="color:#2563eb;text-decoration:underline;" target="_blank">${linkText}</a>`)
    setLinkText("")
    setLinkUrl("")
    setShowLinkDialog(false)
  }

  const insertDocument = () => {
    if (!docName.trim() || !docUrl.trim()) return
    const url = docUrl.startsWith("http") ? docUrl : `https://${docUrl}`
    insertHtmlAtCursor(`<a href="${url}" style="color:#8B2B3E;text-decoration:underline;" target="_blank">📎 ${docName}</a>`)
    setDocName("")
    setDocUrl("")
    setShowDocDialog(false)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For now, just show the filename - real implementation would upload to storage
      insertHtmlAtCursor(`<span style="color:#8B2B3E;"><strong>📎 Attached: ${file.name}</strong></span>`)
    }
    e.target.value = ""
  }

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setEmailBody(editorRef.current.innerHTML)
    }
  }

  // Send email
  const handleSend = async () => {
    // Validation
    if (!subject.trim()) {
      setSendResult({ message: "Please enter an email subject.", type: "error" })
      return
    }
    if (!emailBody.trim()) {
      setSendResult({ message: "Please write your email message.", type: "error" })
      return
    }

    const recipientCount = getRecipientCount()
    if (recipientCount === 0) {
      setSendResult({ message: "No recipients selected. Please select recipients first.", type: "error" })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      const recipients = getRecipients()

      const res = await adminFetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject,
          body: emailBody,
          fontFamily,
          fontSize,
          fontColor,
          isBold,
          isItalic,
          isUnderline,
          textAlign,
          campaignName: subject,
          sendToType: selectionMode,
          sendToValue: selectionMode === "tag" ? selectedTag : selectionMode === "group" ? selectedGroup : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSendResult({ message: data.message || `Email sent to ${recipientCount} recipients!`, type: "success" })
        // Reset form after success
        setTimeout(() => {
          setSubject("")
          setEmailBody("")
          if (editorRef.current) editorRef.current.innerHTML = ""
          setSelectedIndividuals(new Set())
          setSelectionMode("all")
        }, 2000)
      } else {
        setSendResult({ message: data.error || "Failed to send email.", type: "error" })
      }
    } catch (e) {
      setSendResult({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setIsSending(false)
    }
  }

  const recipientCount = getRecipientCount()
  const hasValidSelection = recipientCount > 0
  const canSend = hasValidSelection && subject.trim() && emailBody.trim()

  return (
    <div className="flex flex-col gap-6">
      {/* Toast notification */}
      {sendResult && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-sm font-medium ${
          sendResult.type === "success"
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-red-100 text-red-800 border border-red-300"
        }`}>
          {sendResult.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{sendResult.message}</span>
          <button onClick={() => setSendResult(null)} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a0a0e] flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#8B2B3E]" />
            Email Campaign
          </h2>
          <p className="text-sm text-[#8B6B5A] mt-1">Select recipients, compose your message, and send</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefreshContacts} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Contacts
        </Button>
      </div>

      {/* Main content - two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Recipients */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8B2B3E]" />
              Select Recipients
            </CardTitle>
            <CardDescription>
              Choose who receives this email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selection mode buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { mode: "all" as const, icon: Users, label: "All Contacts", count: activeContacts.length },
                { mode: "individuals" as const, icon: User, label: "Select People", count: selectedIndividuals.size },
                { mode: "tag" as const, icon: Tag, label: "By Tag", count: selectedTag ? tagCount(selectedTag) : 0 },
                { mode: "group" as const, icon: FolderOpen, label: "By Group", count: groups.find(g => g.id === selectedGroup)?.memberCount || 0 },
              ].map(({ mode, icon: Icon, label, count }) => (
                <button
                  key={mode}
                  onClick={() => setSelectionMode(mode)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    selectionMode === mode
                      ? "border-[#8B2B3E] bg-[#8B2B3E]/5 text-[#8B2B3E]"
                      : "border-[#e8d8c8] hover:border-[#8B2B3E]/50 text-[#6b4c52]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                  {(selectionMode === mode || mode === "all") && (
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  )}
                </button>
              ))}
            </div>

            <Separator />

            {/* Conditional content based on selection mode */}
            {selectionMode === "all" && (
              <div className="p-4 bg-[#fdf8f3] rounded-lg border border-[#e8d8c8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#8B2B3E]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1a0a0e]">All Active Contacts</p>
                    <p className="text-sm text-[#8B6B5A]">{activeContacts.length} recipients</p>
                  </div>
                </div>
              </div>
            )}

            {selectionMode === "individuals" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6B5A]" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-[#e8d8c8]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllFiltered} className="text-xs">
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAll} className="text-xs">
                    Clear
                  </Button>
                </div>
                <ScrollArea className="h-[250px] border rounded-lg">
                  <div className="p-2 space-y-1">
                    {filteredContacts.length === 0 ? (
                      <p className="text-sm text-center text-[#8B6B5A] py-4">No contacts found</p>
                    ) : (
                      filteredContacts.map((contact) => (
                        <label
                          key={contact.id}
                          className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[#fdf8f3] ${
                            selectedIndividuals.has(contact.id) ? "bg-[#8B2B3E]/5" : ""
                          }`}
                        >
                          <Checkbox
                            checked={selectedIndividuals.has(contact.id)}
                            onCheckedChange={() => toggleIndividual(contact.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1a0a0e] truncate">
                              {contact.first_name} {contact.last_name}
                            </p>
                            <p className="text-xs text-[#8B6B5A] truncate">{contact.email}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <p className="text-xs text-[#8B6B5A]">
                  <strong>{selectedIndividuals.size}</strong> selected
                </p>
              </div>
            )}

            {selectionMode === "tag" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#1a0a0e]">Select a tag:</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const count = tagCount(tag)
                    const color = TAG_COLORS[tag] || "#6b7280"
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedTag === tag
                            ? "ring-2 ring-offset-2"
                            : "hover:opacity-80"
                        }`}
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                          borderColor: color,
                          ...(selectedTag === tag ? { ringColor: color } : {})
                        }}
                      >
                        {tag} ({count})
                      </button>
                    )
                  })}
                </div>
                {selectedTag && (
                  <div className="p-3 bg-[#fdf8f3] rounded-lg border border-[#e8d8c8]">
                    <p className="text-sm">
                      <strong>{tagCount(selectedTag)}</strong> contacts with tag <Badge>{selectedTag}</Badge>
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectionMode === "group" && (
              <div className="space-y-3">
                {loadingGroups ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-[#8B2B3E]" />
                  </div>
                ) : groups.length === 0 ? (
                  <p className="text-sm text-center text-[#8B6B5A] py-4">No groups created yet</p>
                ) : (
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setSelectedGroup(group.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                          selectedGroup === group.id
                            ? "border-[#8B2B3E] bg-[#8B2B3E]/5"
                            : "border-[#e8d8c8] hover:border-[#8B2B3E]/50"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1a0a0e]">{group.name}</p>
                          {group.description && (
                            <p className="text-xs text-[#8B6B5A]">{group.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary">{group.memberCount}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected count summary */}
            <div className={`p-3 rounded-lg border ${hasValidSelection ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              {hasValidSelection ? (
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <strong>{recipientCount}</strong> recipient{recipientCount !== 1 ? "s" : ""} selected
                </p>
              ) : (
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No recipients selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right column - Compose */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-[#8B2B3E]" />
              Compose Email
            </CardTitle>
            <CardDescription>
              Write your message with formatting and personalization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">
                Subject *
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="border-[#e8d8c8] text-[#1a0a0e]"
              />
            </div>

            {/* Editor with toolbar */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">
                Message *
              </label>
              <div className="border-2 border-[#e8d8c8] rounded-lg overflow-hidden focus-within:border-[#8B2B3E]">
                {/* Toolbar Row 1 - Font settings */}
                <div className="bg-[#fdf8f3] border-b border-[#e8d8c8] p-2 flex flex-wrap items-center gap-2">
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="w-[130px] h-8 bg-white border-[#e8d8c8] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-[110px] h-8 bg-white border-[#e8d8c8] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={fontColor} onValueChange={setFontColor}>
                    <SelectTrigger className="w-[100px] h-8 bg-white border-[#e8d8c8]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: fontColor }} />
                        <span className="text-xs">{FONT_COLORS.find(c => c.value === fontColor)?.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.value }} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Separator orientation="vertical" className="h-6" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => { setIsBold(!isBold); applyFormatting("bold") }}
                        className={`p-1.5 rounded transition-colors ${isBold ? "bg-[#8B2B3E] text-white" : "hover:bg-white text-[#6b4c52]"}`}
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Bold</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => { setIsItalic(!isItalic); applyFormatting("italic") }}
                        className={`p-1.5 rounded transition-colors ${isItalic ? "bg-[#8B2B3E] text-white" : "hover:bg-white text-[#6b4c52]"}`}
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Italic</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => { setIsUnderline(!isUnderline); applyFormatting("underline") }}
                        className={`p-1.5 rounded transition-colors ${isUnderline ? "bg-[#8B2B3E] text-white" : "hover:bg-white text-[#6b4c52]"}`}
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Underline</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6" />

                  {[
                    { align: "left" as const, icon: AlignLeft },
                    { align: "center" as const, icon: AlignCenter },
                    { align: "right" as const, icon: AlignRight },
                  ].map(({ align, icon: Icon }) => (
                    <Tooltip key={align}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => { setTextAlign(align); applyFormatting(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`) }}
                          className={`p-1.5 rounded transition-colors ${textAlign === align ? "bg-[#8B2B3E] text-white" : "hover:bg-white text-[#6b4c52]"}`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Align {align}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Toolbar Row 2 - Insert actions */}
                <div className="bg-[#fdf8f3] border-b border-[#e8d8c8] p-2 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLinkDialog(true)}
                    className="h-8 text-xs border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5"
                  >
                    <LinkIcon className="w-3.5 h-3.5 mr-1" />
                    Insert Link
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocDialog(true)}
                    className="h-8 text-xs border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5"
                  >
                    <Paperclip className="w-3.5 h-3.5 mr-1" />
                    Attach Document
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileSelect}
                    className="h-8 text-xs border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    Upload File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <Separator orientation="vertical" className="h-6" />

                  <span className="text-xs text-[#8B6B5A] flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Personalize:
                  </span>
                  {PERSONALIZATION_TAGS.map((tag) => (
                    <Tooltip key={tag.value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertAtCursor(tag.value)}
                          className="px-2 py-1 text-xs bg-white border border-[#2563eb] text-[#2563eb] rounded hover:bg-[#2563eb]/5"
                        >
                          {tag.label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{tag.desc}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Content editable area */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setEmailBody((e.target as HTMLDivElement).innerHTML)}
                  className="min-h-[200px] max-h-[350px] overflow-y-auto p-4 focus:outline-none"
                  style={{
                    fontFamily,
                    fontSize,
                    color: fontColor,
                    textAlign,
                  }}
                  data-placeholder="Write your email message here..."
                />
              </div>
              <p className="text-xs text-[#8B6B5A] mt-1">
                Tip: Click toolbar buttons to format, or use personalization tags to customize for each recipient.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e8d8c8]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!subject.trim() || !emailBody.trim()}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>

              <Button
                onClick={handleSend}
                disabled={!canSend || isSending}
                className="gap-2 bg-[#8B2B3E] hover:bg-[#6d2231] text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send to {recipientCount} Recipient{recipientCount !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insert Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#8B2B3E]" />
              Insert Link
            </DialogTitle>
            <DialogDescription>
              Add a clickable link to your email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1a0a0e] block mb-1">Link Text *</label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g., Click here to learn more"
                className="border-[#e8d8c8]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1a0a0e] block mb-1">URL *</label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="border-[#e8d8c8]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
            <Button
              onClick={insertLink}
              disabled={!linkText.trim() || !linkUrl.trim()}
              className="bg-[#8B2B3E] hover:bg-[#6d2231] text-white"
            >
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Document Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-[#8B2B3E]" />
              Attach Document
            </DialogTitle>
            <DialogDescription>
              Link to a document (Google Drive, Dropbox, etc.)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1a0a0e] block mb-1">Document Name *</label>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g., Event Schedule PDF"
                className="border-[#e8d8c8]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1a0a0e] block mb-1">Document URL *</label>
              <Input
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="border-[#e8d8c8]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocDialog(false)}>Cancel</Button>
            <Button
              onClick={insertDocument}
              disabled={!docName.trim() || !docUrl.trim()}
              className="bg-[#8B2B3E] hover:bg-[#6d2231] text-white"
            >
              Attach Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#8B2B3E]" />
              Email Preview
            </DialogTitle>
            <DialogDescription>
              This is how your email will appear to recipients
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-[#fdf8f3] rounded-lg border border-[#e8d8c8]">
              <p className="text-xs text-[#8B6B5A] mb-1">Subject:</p>
              <p className="font-semibold text-[#1a0a0e]">{subject}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-[#e8d8c8] min-h-[200px]">
              <div
                style={{
                  fontFamily,
                  fontSize,
                  color: fontColor,
                  textAlign,
                }}
                dangerouslySetInnerHTML={{ __html: emailBody }}
              />
            </div>
            <div className="p-3 bg-[#fdf8f3] rounded-lg border border-[#e8d8c8]">
              <p className="text-sm text-[#8B6B5A]">
                Sending to <strong>{recipientCount}</strong> recipient{recipientCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button
              onClick={() => { setShowPreview(false); handleSend() }}
              disabled={!canSend || isSending}
              className="bg-[#8B2B3E] hover:bg-[#6d2231] text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for placeholder */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #8B6B5A;
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
