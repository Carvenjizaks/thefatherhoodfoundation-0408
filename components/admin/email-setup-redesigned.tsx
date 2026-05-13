"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Mail, Send, Users, Tag, Layers, Search, Plus, Trash2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, FileText, User, CheckCircle, XCircle, Loader2,
  X, Eye, Upload, ChevronDown, Sparkles, Type, Palette, 
  IndentIncrease, IndentDecrease, List, ListOrdered, Minus, Image,
  ExternalLink, Paperclip, CloudUpload, FolderOpen
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────────
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
  contact_group_members?: { count: number }[]
}

type RecipientSelection = {
  type: "all" | "tag" | "group" | "individuals"
  value?: string
  label: string
  count: number
  ids?: string[]
}

// ── Constants ──────────────────────────────────────────────────────────────────
const FONT_FAMILIES = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "system-ui, sans-serif", label: "System Default" },
]

const FONT_SIZES = [
  { value: "11px", label: "11" },
  { value: "12px", label: "12" },
  { value: "14px", label: "14" },
  { value: "16px", label: "16" },
  { value: "18px", label: "18" },
  { value: "20px", label: "20" },
  { value: "24px", label: "24" },
  { value: "28px", label: "28" },
]

const FONT_COLORS = [
  { value: "#1a1a1a", label: "Black", bg: "#1a1a1a" },
  { value: "#374151", label: "Gray", bg: "#374151" },
  { value: "#8B2B3E", label: "Maroon", bg: "#8B2B3E" },
  { value: "#1d4ed8", label: "Blue", bg: "#1d4ed8" },
  { value: "#059669", label: "Green", bg: "#059669" },
  { value: "#dc2626", label: "Red", bg: "#dc2626" },
  { value: "#7c3aed", label: "Purple", bg: "#7c3aed" },
  { value: "#ea580c", label: "Orange", bg: "#ea580c" },
]

const PERSONALIZATION_TAGS = [
  { token: "{{first_name}}", label: "First Name", description: "Recipient's first name" },
  { token: "{{last_name}}", label: "Last Name", description: "Recipient's last name" },
  { token: "{{email}}", label: "Email", description: "Recipient's email address" },
  { token: "{{husband_name}}", label: "Husband", description: "Husband's first name" },
  { token: "{{wife_name}}", label: "Wife", description: "Wife's first name" },
  { token: "{{couple_name}}", label: "Couple", description: "Both names combined" },
]

const CORE_TAGS = ["MGM", "FF-NL", "TT4Men", "Event", "Men", "Women"]
const TAG_COLORS: Record<string, string> = {
  MGM: "#8B2B3E", "FF-NL": "#059669", TT4Men: "#1d4ed8",
  Event: "#ea580c", Men: "#1d4ed8", Women: "#ec4899",
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface EmailSetupRedesignedProps {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>
  contacts: Contact[]
  onRefreshContacts: () => void
}

export function EmailSetupRedesigned({ adminFetch, contacts, onRefreshContacts }: EmailSetupRedesignedProps) {
  // ── Step State ──
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  
  // ── Recipients State ──
  const [recipientSelection, setRecipientSelection] = useState<RecipientSelection | null>(null)
  const [selectedIndividuals, setSelectedIndividuals] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)

  // ── Email Content State ──
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  
  // ── Formatting State ──
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [fontColor, setFontColor] = useState("#1a1a1a")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")

  // ── Dialogs ──
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showAttachDialog, setShowAttachDialog] = useState(false)
  const [attachName, setAttachName] = useState("")
  const [attachUrl, setAttachUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // ── Send State ──
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Data Fetching ──
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true)
    try {
      const res = await adminFetch("/api/admin/groups")
      const data = await res.json()
      setGroups(data.groups || [])
    } catch { /* silent */ } finally { setLoadingGroups(false) }
  }, [adminFetch])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  // ── Computed Values ──
  const activeContacts = contacts.filter(c => !c.unsubscribed)
  const allTags = Array.from(new Set([...CORE_TAGS, ...contacts.flatMap(c => c.tags || [])]))
  const tagCount = (tag: string) => activeContacts.filter(c => Array.isArray(c.tags) && c.tags.includes(tag)).length

  const filteredContacts = activeContacts.filter(c => {
    const q = searchTerm.toLowerCase()
    return (
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  const getRecipientCount = () => {
    if (!recipientSelection) return 0
    if (recipientSelection.type === "individuals") return selectedIndividuals.size
    return recipientSelection.count
  }

  // ── Selection Handlers ──
  const selectAll = () => {
    setRecipientSelection({
      type: "all",
      label: "All Contacts",
      count: activeContacts.length
    })
    setSelectedIndividuals(new Set())
    setCurrentStep(2)
  }

  const selectTag = (tag: string) => {
    const count = tagCount(tag)
    setRecipientSelection({
      type: "tag",
      value: tag,
      label: `Tag: ${tag}`,
      count
    })
    setSelectedIndividuals(new Set())
    setCurrentStep(2)
  }

  const selectGroup = (group: Group) => {
    const count = group.contact_group_members?.[0]?.count || 0
    setRecipientSelection({
      type: "group",
      value: group.id,
      label: `Group: ${group.name}`,
      count
    })
    setSelectedIndividuals(new Set())
    setCurrentStep(2)
  }

  const toggleIndividual = (id: string) => {
    const newSet = new Set(selectedIndividuals)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIndividuals(newSet)
    if (newSet.size > 0) {
      setRecipientSelection({
        type: "individuals",
        label: `${newSet.size} Selected`,
        count: newSet.size,
        ids: Array.from(newSet)
      })
    } else {
      setRecipientSelection(null)
    }
  }

  const confirmIndividuals = () => {
    if (selectedIndividuals.size > 0) {
      setCurrentStep(2)
    }
  }

  // ── Editor Helpers ──
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
    insertHtmlAtCursor(`<a href="${url}" style="color:#1d4ed8;text-decoration:underline;" target="_blank">${linkText}</a>`)
    setLinkText(""); setLinkUrl(""); setShowLinkDialog(false)
  }

  const insertAttachment = () => {
    if (!attachName.trim() || !attachUrl.trim()) return
    const url = attachUrl.startsWith("http") ? attachUrl : `https://${attachUrl}`
    insertHtmlAtCursor(`<a href="${url}" style="color:#8B2B3E;text-decoration:underline;display:inline-flex;align-items:center;gap:4px;" target="_blank"><span style="font-size:14px;">📎</span> ${attachName}</a>`)
    setAttachName(""); setAttachUrl(""); setShowAttachDialog(false)
  }

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setEmailBody(editorRef.current.innerHTML)
    }
  }

  // ── Send Email ──
  const handleSend = async () => {
    if (!subject.trim() || !emailBody.trim() || !recipientSelection) return

    setIsSending(true)
    setSendResult(null)

    try {
      let recipients: { id: string; email: string; firstName: string; lastName: string }[] = []

      if (recipientSelection.type === "all") {
        recipients = activeContacts.map(c => ({
          id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name
        }))
      } else if (recipientSelection.type === "tag") {
        recipients = activeContacts
          .filter(c => Array.isArray(c.tags) && c.tags.includes(recipientSelection.value!))
          .map(c => ({ id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name }))
      } else if (recipientSelection.type === "individuals") {
        recipients = activeContacts
          .filter(c => selectedIndividuals.has(c.id))
          .map(c => ({ id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name }))
      }

      if (recipients.length === 0) {
        setSendResult({ message: "No recipients found.", type: "error" })
        return
      }

      const res = await adminFetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject,
          body: emailBody,
          fontFamily, fontSize, fontColor, isBold, isItalic, isUnderline, textAlign,
          campaignName: subject,
          sendToType: recipientSelection.type,
          sendToValue: recipientSelection.value,
        }),
      })

      const data = await res.json()
      setSendResult({ message: data.message || data.error, type: res.ok ? "success" : "error" })

      if (res.ok) {
        setTimeout(() => {
          resetAll()
        }, 3000)
      }
    } catch {
      setSendResult({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setIsSending(false)
    }
  }

  const resetAll = () => {
    setCurrentStep(1)
    setRecipientSelection(null)
    setSelectedIndividuals(new Set())
    setSearchTerm("")
    setSubject("")
    setEmailBody("")
    if (editorRef.current) editorRef.current.innerHTML = ""
    setFontFamily("Arial, sans-serif")
    setFontSize("14px")
    setFontColor("#1a1a1a")
    setIsBold(false)
    setIsItalic(false)
    setIsUnderline(false)
    setTextAlign("left")
    setSendResult(null)
  }

  // Auto-dismiss result
  useEffect(() => {
    if (sendResult) {
      const t = setTimeout(() => setSendResult(null), 5000)
      return () => clearTimeout(t)
    }
  }, [sendResult])

  // ── Render ──
  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-background via-background to-muted/20">
        {/* Toast Notification */}
        {sendResult && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-medium border-2 transition-all animate-in fade-in slide-in-from-top-4 ${
            sendResult.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            {sendResult.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>{sendResult.message}</span>
            <button onClick={() => setSendResult(null)} className="ml-2 opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Email Campaign</h1>
                  <p className="text-sm text-muted-foreground">Create and send emails to your contacts</p>
                </div>
              </div>
              
              {/* Step Progress */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <button
                      onClick={() => {
                        if (step === 1) setCurrentStep(1)
                        else if (step === 2 && recipientSelection) setCurrentStep(2)
                        else if (step === 3 && recipientSelection && subject.trim()) setCurrentStep(3)
                      }}
                      disabled={
                        (step === 2 && !recipientSelection) ||
                        (step === 3 && (!recipientSelection || !subject.trim()))
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        currentStep === step
                          ? "bg-primary text-primary-foreground shadow-md"
                          : currentStep > step
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-muted text-muted-foreground"
                      } ${(step === 2 && !recipientSelection) || (step === 3 && (!recipientSelection || !subject.trim())) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= step ? "bg-primary-foreground/20" : "bg-muted-foreground/20"
                      }`}>{step}</span>
                      <span className="hidden sm:inline">
                        {step === 1 ? "Recipients" : step === 2 ? "Compose" : "Preview"}
                      </span>
                    </button>
                    {step < 3 && <div className={`w-8 h-0.5 mx-1 rounded ${currentStep > step ? "bg-primary" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 1: SELECT RECIPIENTS */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-foreground mb-2">Who would you like to email?</h2>
                <p className="text-muted-foreground">Choose recipients from your contacts, tags, groups, or select individuals</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={selectAll}
                  className="group relative p-6 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">All Contacts</h3>
                  <p className="text-sm text-muted-foreground">Send to everyone</p>
                  <Badge variant="secondary" className="absolute top-4 right-4">{activeContacts.length}</Badge>
                </button>

                <div className="p-6 rounded-2xl border-2 border-border bg-card">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">By Tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 6).map(tag => {
                      const count = tagCount(tag)
                      const color = TAG_COLORS[tag] || "#6b7280"
                      return (
                        <button
                          key={tag}
                          onClick={() => selectTag(tag)}
                          disabled={count === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderColor: color, color: color }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          {tag} <span className="opacity-60">({count})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-card">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">By Group</h3>
                  {loadingGroups ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : groups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No groups created yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {groups.slice(0, 4).map(group => {
                        const count = group.contact_group_members?.[0]?.count || 0
                        return (
                          <button
                            key={group.id}
                            onClick={() => selectGroup(group)}
                            disabled={count === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ borderColor: group.color, color: group.color }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                            {group.name} <span className="opacity-60">({count})</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Selection */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Select Individuals</h3>
                      <p className="text-sm text-muted-foreground">Pick specific contacts to email</p>
                    </div>
                  </div>
                  {selectedIndividuals.size > 0 && (
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className="bg-primary">{selectedIndividuals.size} selected</Badge>
                      <Button onClick={confirmIndividuals} size="sm" className="bg-primary hover:bg-primary/90">
                        Continue with Selected
                      </Button>
                    </div>
                  )}
                </div>

                <div className="relative mb-4">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-10 h-11 bg-background"
                  />
                </div>

                <ScrollArea className="h-[280px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredContacts.slice(0, 60).map(contact => {
                      const isSelected = selectedIndividuals.has(contact.id)
                      return (
                        <button
                          key={contact.id}
                          onClick={() => toggleIndividual(contact.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-primary/10 border-2 border-primary"
                              : "bg-muted/30 border-2 border-transparent hover:bg-muted/50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            {contact.first_name?.[0]}{contact.last_name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {contact.first_name} {contact.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                          </div>
                          {isSelected && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                  {filteredContacts.length > 60 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Showing 60 of {filteredContacts.length} contacts. Use search to find more.
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 2: COMPOSE EMAIL */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Recipient Summary */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Sending to: <span className="text-primary">{recipientSelection?.label}</span></p>
                    <p className="text-xs text-muted-foreground">{getRecipientCount()} recipient{getRecipientCount() !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-muted-foreground">
                  Change Recipients
                </Button>
              </div>

              {/* Subject Line */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  Subject Line <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Enter a compelling subject line..."
                  className="h-12 text-base bg-background border-2 focus:border-primary"
                />
              </div>

              {/* Email Editor */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Email Content <span className="text-destructive">*</span>
                </Label>
                
                <div className="border-2 border-border rounded-2xl overflow-hidden bg-card focus-within:border-primary transition-colors">
                  {/* Toolbar Row 1: Font Controls */}
                  <div className="flex flex-wrap items-center gap-1 p-3 bg-muted/30 border-b border-border">
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="w-[140px] h-9 text-sm bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map(f => (
                          <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="w-[70px] h-9 text-sm bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Select value={fontColor} onValueChange={setFontColor}>
                      <SelectTrigger className="w-[110px] h-9 text-sm bg-background">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border" style={{ backgroundColor: fontColor }} />
                          <span>{FONT_COLORS.find(c => c.value === fontColor)?.label}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_COLORS.map(c => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded border" style={{ backgroundColor: c.bg }} />
                              {c.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Text Style Buttons */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isBold ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setIsBold(!isBold); applyFormatting("bold") }}
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isItalic ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setIsItalic(!isItalic); applyFormatting("italic") }}
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isUnderline ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setIsUnderline(!isUnderline); applyFormatting("underline") }}
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Alignment */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={textAlign === "left" ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setTextAlign("left"); applyFormatting("justifyLeft") }}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={textAlign === "center" ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setTextAlign("center"); applyFormatting("justifyCenter") }}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={textAlign === "right" ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => { setTextAlign("right"); applyFormatting("justifyRight") }}
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Lists and Indent */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => applyFormatting("insertUnorderedList")}>
                          <List className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => applyFormatting("insertOrderedList")}>
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => applyFormatting("indent")}>
                          <IndentIncrease className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Increase Indent</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => applyFormatting("outdent")}>
                          <IndentDecrease className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Decrease Indent</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Toolbar Row 2: Insert & Personalization */}
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/20 border-b border-border">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowLinkDialog(true)}>
                      <LinkIcon className="w-3.5 h-3.5" /> Insert Link
                    </Button>

                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowAttachDialog(true)}>
                      <Paperclip className="w-3.5 h-3.5" /> Attach File
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Personalize:
                    </span>

                    {PERSONALIZATION_TAGS.map(tag => (
                      <Tooltip key={tag.token}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                            onClick={() => insertAtCursor(tag.token)}
                          >
                            {tag.label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{tag.description}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  {/* Editor Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={e => setEmailBody((e.currentTarget as HTMLDivElement).innerHTML)}
                    data-placeholder="Start writing your email here...

Use the toolbar above to format your text, insert links, attach files, or add personalization tags like {{first_name}} to make your emails more personal.

Tip: You can use bullet points and indentation to organize key points clearly."
                    className="min-h-[350px] p-5 bg-background outline-none overflow-y-auto prose prose-sm max-w-none"
                    style={{
                      fontFamily, fontSize, color: fontColor,
                      textAlign,
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  An unsubscribe link will be automatically added to the footer
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="gap-2">
                  Back to Recipients
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!subject.trim() || !emailBody.trim()} className="gap-2">
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!subject.trim() || !emailBody.trim()}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Continue to Preview
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 3: PREVIEW & SEND */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-foreground mb-2">Review Your Email</h2>
                <p className="text-muted-foreground">Double-check everything before sending to {getRecipientCount()} recipient{getRecipientCount() !== 1 ? "s" : ""}</p>
              </div>

              {/* Preview Card */}
              <div className="max-w-3xl mx-auto">
                <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                  {/* Email Header Preview */}
                  <div className="bg-muted/30 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">From: Fatherhood Foundation</p>
                        <p className="text-xs text-muted-foreground">To: {recipientSelection?.label} ({getRecipientCount()})</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg px-4 py-3">
                      <p className="text-sm text-muted-foreground">Subject:</p>
                      <p className="font-semibold text-foreground">{subject}</p>
                    </div>
                  </div>

                  {/* Email Body Preview */}
                  <div className="p-6 bg-background min-h-[300px]">
                    <div
                      className="prose prose-sm max-w-none"
                      style={{ fontFamily, fontSize, color: fontColor, textAlign }}
                      dangerouslySetInnerHTML={{ __html: emailBody }}
                    />
                  </div>

                  {/* Footer Preview */}
                  <div className="bg-muted/20 px-6 py-4 border-t border-border text-center text-xs text-muted-foreground">
                    <p>Fatherhood Foundation | Cape Town, South Africa</p>
                    <p className="mt-1">
                      <a href="#" className="text-primary hover:underline">Unsubscribe</a> from these emails
                    </p>
                  </div>
                </div>
              </div>

              {/* Send Summary */}
              <div className="max-w-3xl mx-auto bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Ready to Send
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Recipients</p>
                    <p className="font-semibold text-foreground">{getRecipientCount()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sending To</p>
                    <p className="font-semibold text-foreground truncate">{recipientSelection?.label}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-semibold text-foreground truncate">{subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Content</p>
                    <p className="font-semibold text-foreground">{emailBody.replace(/<[^>]*>/g, '').slice(0, 30)}...</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between max-w-3xl mx-auto pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="gap-2">
                  Back to Edit
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={resetAll}>
                    Discard
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={isSending}
                    className="bg-primary hover:bg-primary/90 gap-2 min-w-[140px]"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DIALOGS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* Insert Link Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Insert Link
              </DialogTitle>
              <DialogDescription>Add a clickable link to your email</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link Text</Label>
                <Input
                  value={linkText}
                  onChange={e => setLinkText(e.target.value)}
                  placeholder="e.g., Click here to learn more"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="e.g., https://example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
              <Button onClick={insertLink} disabled={!linkText.trim() || !linkUrl.trim()}>Insert Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Attach File Dialog */}
        <Dialog open={showAttachDialog} onOpenChange={setShowAttachDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-primary" />
                Attach File
              </DialogTitle>
              <DialogDescription>Add a file link to your email (Google Drive, Dropbox, or any URL)</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open("https://drive.google.com", "_blank")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <CloudUpload className="w-8 h-8 text-blue-500" />
                  <span className="text-sm font-medium">Google Drive</span>
                </button>
                <button
                  onClick={() => window.open("https://www.dropbox.com", "_blank")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium">Dropbox</span>
                </button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input
                  value={attachName}
                  onChange={e => setAttachName(e.target.value)}
                  placeholder="e.g., Event Schedule.pdf"
                />
              </div>
              <div className="space-y-2">
                <Label>File URL (from cloud storage)</Label>
                <Input
                  value={attachUrl}
                  onChange={e => setAttachUrl(e.target.value)}
                  placeholder="Paste the sharing link here"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAttachDialog(false)}>Cancel</Button>
              <Button onClick={insertAttachment} disabled={!attachName.trim() || !attachUrl.trim()}>Attach File</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Email Preview
              </DialogTitle>
            </DialogHeader>
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b">
                <p className="text-sm"><span className="text-muted-foreground">Subject:</span> <strong>{subject}</strong></p>
              </div>
              <div
                className="p-4 bg-background min-h-[200px] prose prose-sm max-w-none"
                style={{ fontFamily, fontSize, color: fontColor, textAlign }}
                dangerouslySetInnerHTML={{ __html: emailBody }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
