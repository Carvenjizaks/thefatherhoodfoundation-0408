"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Mail, Send, Users, Tag, Layers, History, Search, Plus, Trash2, Edit2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, FileText, User, CheckCircle, XCircle, Loader2,
  ChevronRight, RefreshCw, X,
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

type Campaign = {
  id: string
  name: string
  subject: string
  status: string
  total_recipients: number
  sent_count: number
  sent_at?: string
  created_at: string
}

type SidebarView = "contacts" | "tags" | "groups" | "history"
type ComposeTarget = { type: "all" | "tag" | "group" | "individual"; value?: string; label?: string }

// ── Constants ──────────────────────────────────────────────────────────────────
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
  { value: "12px", label: "Small (12)" },
  { value: "14px", label: "Normal (14)" },
  { value: "16px", label: "Medium (16)" },
  { value: "18px", label: "Large (18)" },
  { value: "20px", label: "X-Large (20)" },
  { value: "24px", label: "XX-Large (24)" },
]
const FONT_COLORS = [
  { value: "#1a0a0e", label: "Black" },
  { value: "#8B2B3E", label: "Maroon" },
  { value: "#2563eb", label: "Blue" },
  { value: "#16a34a", label: "Green" },
  { value: "#dc2626", label: "Red" },
  { value: "#9333ea", label: "Purple" },
  { value: "#ea580c", label: "Orange" },
  { value: "#6b7280", label: "Gray" },
]
const GROUP_COLORS = ["#8B2B3E", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#d97706", "#6b7280"]
const CORE_TAGS = ["MGM", "FF-NL", "TT4Men", "Event", "Men", "Women"]

const TAG_COLORS: Record<string, string> = {
  MGM: "#8B2B3E", "FF-NL": "#16a34a", TT4Men: "#2563eb",
  Event: "#ea580c", Men: "#1d4ed8", Women: "#db2777",
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface CommunicationsHubProps {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>
  contacts: Contact[]
  onRefreshContacts: () => void
}

export function CommunicationsHub({ adminFetch, contacts, onRefreshContacts }: CommunicationsHubProps) {
  // Sidebar
  const [sidebarView, setSidebarView] = useState<SidebarView>("contacts")
  const [searchTerm, setSearchTerm] = useState("")

  // Groups
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")
  const [newGroupColor, setNewGroupColor] = useState("#8B2B3E")
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  // Add to group
  const [addToGroupId, setAddToGroupId] = useState<string | null>(null)
  const [addToGroupContacts, setAddToGroupContacts] = useState<Set<string>>(new Set())

  // Campaigns history
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)

  // Compose
  const [composeTarget, setComposeTarget] = useState<ComposeTarget | null>(null)
  const [campaignName, setCampaignName] = useState("")
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Font toolbar
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [fontColor, setFontColor] = useState("#1a0a0e")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")

  // Link / doc dialogs
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showDocDialog, setShowDocDialog] = useState(false)
  const [docName, setDocName] = useState("")
  const [docUrl, setDocUrl] = useState("")

  const editorRef = useRef<HTMLDivElement>(null)

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true)
    try {
      const res = await adminFetch("/api/admin/groups")
      const data = await res.json()
      setGroups(data.groups || [])
    } catch { /* silent */ } finally { setLoadingGroups(false) }
  }, [adminFetch])

  const fetchCampaigns = useCallback(async () => {
    setLoadingCampaigns(true)
    try {
      const res = await adminFetch("/api/admin/campaigns")
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch { /* silent */ } finally { setLoadingCampaigns(false) }
  }, [adminFetch])

  useEffect(() => { fetchGroups() }, [fetchGroups])
  useEffect(() => { if (sidebarView === "history") fetchCampaigns() }, [sidebarView, fetchCampaigns])

  // ── Computed recipients ────────────────────────────────────────────────────
  const getRecipients = useCallback(() => {
    if (!composeTarget) return []
    const active = contacts.filter(c => !c.unsubscribed)

    if (composeTarget.type === "all") return active
    if (composeTarget.type === "tag") {
      return active.filter(c => Array.isArray(c.tags) && c.tags.includes(composeTarget.value!))
    }
    if (composeTarget.type === "individual") return [] // handled separately
    return active
  }, [composeTarget, contacts])

  // ── Tags derived from contacts ─────────────────────────────────────────────
  const allTags = Array.from(new Set([
    ...CORE_TAGS,
    ...contacts.flatMap(c => c.tags || []),
  ]))

  // ── Groups CRUD ────────────────────────────────────────────────────────────
  const createGroup = async () => {
    if (!newGroupName.trim()) return
    try {
      await adminFetch("/api/admin/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc, color: newGroupColor }),
      })
      setNewGroupName(""); setNewGroupDesc(""); setNewGroupColor("#8B2B3E")
      setShowCreateGroup(false)
      fetchGroups()
    } catch { /* silent */ }
  }

  const deleteGroup = async (id: string) => {
    if (!confirm("Delete this group? Members won't be deleted, just the group.")) return
    await adminFetch(`/api/admin/groups/${id}`, { method: "DELETE" })
    fetchGroups()
  }

  const saveEditGroup = async () => {
    if (!editingGroup) return
    await adminFetch(`/api/admin/groups/${editingGroup.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingGroup.name, description: editingGroup.description, color: editingGroup.color }),
    })
    setEditingGroup(null)
    fetchGroups()
  }

  const addMembersToGroup = async () => {
    if (!addToGroupId || addToGroupContacts.size === 0) return
    await adminFetch(`/api/admin/groups/${addToGroupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_ids: Array.from(addToGroupContacts) }),
    })
    setAddToGroupId(null)
    setAddToGroupContacts(new Set())
    fetchGroups()
  }

  // ── Compose helpers ────────────────────────────────────────────────────────
  // Insert plain text at cursor position in the contenteditable editor
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

  // Insert raw HTML (links, docs) at cursor position
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
    insertHtmlAtCursor(`<a href="${linkUrl}" style="color:#2563eb;text-decoration:underline;" target="_blank">${linkText}</a>`)
    setLinkText(""); setLinkUrl(""); setShowLinkDialog(false)
  }

  const insertDoc = () => {
    if (!docName.trim() || !docUrl.trim()) return
    insertHtmlAtCursor(`<a href="${docUrl}" style="color:#8B2B3E;text-decoration:underline;" target="_blank">📄 ${docName}</a>`)
    setDocName(""); setDocUrl(""); setShowDocDialog(false)
  }

  const resetCompose = () => {
    setCampaignName(""); setSubject(""); setEmailBody("")
    if (editorRef.current) editorRef.current.innerHTML = ""
    setFontFamily("Arial, sans-serif"); setFontSize("14px"); setFontColor("#1a0a0e")
    setIsBold(false); setIsItalic(false); setIsUnderline(false); setTextAlign("left")
    setSendResult(null)
  }

  const openCompose = (target: ComposeTarget) => {
    resetCompose()
    setComposeTarget(target)
  }

  // ── Send ───────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!subject.trim() || !emailBody.trim() || !composeTarget) return
    const recipients = getRecipients().map(c => ({
      id: c.id, email: c.email, firstName: c.first_name, lastName: c.last_name,
    }))
    if (recipients.length === 0) {
      setSendResult({ message: "No recipients found for this selection.", type: "error" }); return
    }

    setIsSending(true); setSendResult(null)
    try {
      const res = await adminFetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients, subject, body: emailBody,
          fontFamily, fontSize, fontColor, isBold, isItalic, isUnderline, textAlign,
          campaignName: campaignName || subject,
          sendToType: composeTarget.type,
          sendToValue: composeTarget.value,
        }),
      })
      const data = await res.json()
      setSendResult({ message: data.message || data.error, type: res.ok ? "success" : "error" })
      if (res.ok) { setTimeout(() => { setComposeTarget(null); resetCompose() }, 2500) }
    } catch {
      setSendResult({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setIsSending(false)
    }
  }

  // ── Filter contacts for sidebar ────────────────────────────────────────────
  const filteredContacts = contacts.filter(c => {
    const q = searchTerm.toLowerCase()
    return (
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  const tagCount = (tag: string) => contacts.filter(c => !c.unsubscribed && Array.isArray(c.tags) && c.tags.includes(tag)).length

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-180px)] gap-0 bg-background border border-border rounded-xl overflow-hidden">

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-border bg-[#fdf8f3]">
        {/* Nav tabs */}
        <div className="grid grid-cols-4 border-b border-border">
          {([ 
            { id: "contacts", icon: Users, label: "Contacts" },
            { id: "tags", icon: Tag, label: "Tags" },
            { id: "groups", icon: Layers, label: "Groups" },
            { id: "history", icon: History, label: "History" },
          ] as { id: SidebarView; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSidebarView(id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                sidebarView === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Compose to All button */}
        <div className="p-3 border-b border-border/40">
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
            onClick={() => openCompose({ type: "all", label: "All Contacts" })}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Compose to All ({contacts.filter(c => !c.unsubscribed).length})
          </Button>
        </div>

        {/* Search */}
        {(sidebarView === "contacts") && (
          <div className="p-3 border-b border-border/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="pl-8 h-8 text-xs bg-background border-border"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* CONTACTS VIEW */}
          {sidebarView === "contacts" && (
            <div className="divide-y divide-border/30">
              {filteredContacts.slice(0, 80).map(c => (
                <div key={c.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/40 group">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-medium text-foreground truncate">{c.first_name} {c.last_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
                    {c.unsubscribed && <span className="text-[9px] text-red-500 font-medium">Unsubscribed</span>}
                  </div>
                  {!c.unsubscribed && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={() => openCompose({ type: "individual", value: c.id, label: `${c.first_name} ${c.last_name}` })}
                    >
                      <Mail className="w-3 h-3 text-primary" />
                    </Button>
                  )}
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center p-4">No contacts found</p>
              )}
              {filteredContacts.length > 80 && (
                <p className="text-xs text-muted-foreground text-center p-2">Showing first 80 — use search to narrow</p>
              )}
            </div>
          )}

          {/* TAGS VIEW */}
          {sidebarView === "tags" && (
            <div className="p-3 space-y-1.5">
              {allTags.map(tag => {
                const count = tagCount(tag)
                const color = TAG_COLORS[tag] || "#6b7280"
                return (
                  <div key={tag} className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-background border border-border/40 hover:border-primary/40 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs font-medium text-foreground truncate">{tag}</span>
                      <span className="text-[10px] text-muted-foreground">({count})</span>
                    </div>
                    {count > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 shrink-0 text-primary"
                        onClick={() => openCompose({ type: "tag", value: tag, label: `Tag: ${tag}` })}
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* GROUPS VIEW */}
          {sidebarView === "groups" && (
            <div className="p-3 space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-8 text-xs border-dashed border-primary text-primary hover:bg-primary/10"
                onClick={() => setShowCreateGroup(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Group
              </Button>

              {loadingGroups ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : groups.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No groups yet</p>
              ) : (
                groups.map(g => {
                  const memberCount = g.contact_group_members?.[0]?.count || 0
                  return (
                    <div key={g.id} className="px-3 py-2.5 rounded-lg bg-background border border-border/40 hover:border-primary/40 group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                          <span className="text-xs font-semibold text-foreground truncate">{g.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => setEditingGroup(g)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-destructive" onClick={() => deleteGroup(g.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {g.description && <p className="text-[10px] text-muted-foreground mb-1.5 truncate">{g.description}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{memberCount} member{memberCount !== 1 ? "s" : ""}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-foreground" onClick={() => setAddToGroupId(g.id)}>
                            <Plus className="w-2.5 h-2.5 mr-0.5" /> Add
                          </Button>
                          {memberCount > 0 && (
                            <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[9px] text-primary hover:bg-primary/10"
                              onClick={() => openCompose({ type: "group", value: g.id, label: `Group: ${g.name}` })}>
                              <Send className="w-2.5 h-2.5 mr-0.5" /> Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* HISTORY VIEW */}
          {sidebarView === "history" && (
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">Sent Campaigns</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={fetchCampaigns}>
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
              {loadingCampaigns ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : campaigns.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No campaigns yet</p>
              ) : (
                campaigns.map(c => (
                  <div key={c.id} className="px-3 py-2.5 rounded-lg bg-background border border-border/40 text-xs">
                    <p className="font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-muted-foreground truncate">{c.subject}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        c.status === "sent" ? "bg-green-100 text-green-700" :
                        c.status === "sending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-muted text-muted-foreground"
                      }`}>{c.status}</span>
                      <span className="text-[10px] text-muted-foreground">{c.sent_count}/{c.total_recipients} sent</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── RIGHT COMPOSE PANEL ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {!composeTarget ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Compose an Email</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Select a target from the sidebar to get started — send to all contacts, a specific tag, a group, or an individual.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-auto py-3 flex-col gap-1"
                onClick={() => openCompose({ type: "all", label: "All Contacts" })}>
                <Users className="w-5 h-5" />
                <span className="text-xs">All Contacts</span>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-auto py-3 flex-col gap-1"
                onClick={() => setSidebarView("tags")}>
                <Tag className="w-5 h-5" />
                <span className="text-xs">By Tag</span>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-auto py-3 flex-col gap-1"
                onClick={() => setSidebarView("groups")}>
                <Layers className="w-5 h-5" />
                <span className="text-xs">By Group</span>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-auto py-3 flex-col gap-1"
                onClick={() => setSidebarView("contacts")}>
                <User className="w-5 h-5" />
                <span className="text-xs">Individual</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Compose Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[#fdf8f3] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {composeTarget.label || "Compose Email"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {composeTarget.type === "individual"
                      ? "Individual email"
                      : `${getRecipients().length} recipient${getRecipients().length !== 1 ? "s" : ""} (unsubscribed excluded)`}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setComposeTarget(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {/* Campaign name + Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Campaign Name</Label>
                  <Input value={campaignName} onChange={e => setCampaignName(e.target.value)}
                    placeholder="e.g. May Newsletter" className="h-8 text-xs border-border" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Subject <span className="text-destructive">*</span></Label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="Email subject line..." className="h-8 text-xs border-border" />
                </div>
              </div>

              {/* Message editor */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Message <span className="text-destructive">*</span></Label>
                <div className="border-2 border-primary/40 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
                  
                  {/* FONT TOOLBAR ROW 1 */}
                  <div className="bg-[#fdf8f3] border-b border-border/40 p-2 flex flex-wrap items-center gap-1.5">
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="w-[120px] h-7 text-xs bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map(f => <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="w-[100px] h-7 text-xs bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={fontColor} onValueChange={setFontColor}>
                      <SelectTrigger className="w-[90px] h-7 text-xs bg-background border-border">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: fontColor }} />
                          <span>{FONT_COLORS.find(c => c.value === fontColor)?.label}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_COLORS.map(c => (
                          <SelectItem key={c.value} value={c.value} className="text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.value }} />
                              {c.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="w-px h-5 bg-border mx-0.5" />
                    {[
                      { icon: Bold, active: isBold, toggle: () => setIsBold(v => !v) },
                      { icon: Italic, active: isItalic, toggle: () => setIsItalic(v => !v) },
                      { icon: Underline, active: isUnderline, toggle: () => setIsUnderline(v => !v) },
                    ].map(({ icon: Icon, active, toggle }) => (
                      <Button key={Icon.displayName} type="button" size="sm"
                        variant={active ? "default" : "outline"}
                        className={`h-7 w-7 p-0 ${active ? "bg-primary text-primary-foreground" : "border-border"}`}
                        onClick={toggle}>
                        <Icon className="w-3.5 h-3.5" />
                      </Button>
                    ))}
                    <div className="w-px h-5 bg-border mx-0.5" />
                    {[
                      { icon: AlignLeft, align: "left" as const },
                      { icon: AlignCenter, align: "center" as const },
                      { icon: AlignRight, align: "right" as const },
                    ].map(({ icon: Icon, align }) => (
                      <Button key={align} type="button" size="sm"
                        variant={textAlign === align ? "default" : "outline"}
                        className={`h-7 w-7 p-0 ${textAlign === align ? "bg-primary text-primary-foreground" : "border-border"}`}
                        onClick={() => setTextAlign(align)}>
                        <Icon className="w-3.5 h-3.5" />
                      </Button>
                    ))}
                  </div>

                  {/* FONT TOOLBAR ROW 2 */}
                  <div className="bg-[#fdf8f3] border-b border-border/40 p-2 flex flex-wrap items-center gap-1.5">
                    <Button type="button" variant="outline" size="sm" className="h-7 text-xs border-primary/50 text-primary hover:bg-primary/10" onClick={() => setShowLinkDialog(true)}>
                      <LinkIcon className="w-3 h-3 mr-1" /> Insert Link
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-7 text-xs border-primary/50 text-primary hover:bg-primary/10" onClick={() => setShowDocDialog(true)}>
                      <FileText className="w-3 h-3 mr-1" /> Attach Doc
                    </Button>
                    <div className="w-px h-5 bg-border mx-0.5" />
                    <span className="text-xs text-muted-foreground">Personalize:</span>
                    {[
                      { label: "First Name", token: "{{first_name}}" },
                      { label: "Last Name", token: "{{last_name}}" },
                      { label: "Email", token: "{{email}}" },
                    ].map(({ label, token }) => (
                      <Button key={token} type="button" variant="outline" size="sm"
                        className="h-7 text-xs px-2 border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                        onClick={() => insertAtCursor(token)}>
                        <User className="w-3 h-3 mr-1" />{label}
                      </Button>
                    ))}
                  </div>

                  {/* Rich text editor - contenteditable so links render visually */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={e => setEmailBody((e.currentTarget as HTMLDivElement).innerHTML)}
                    data-placeholder="Write your message here... Use personalization buttons above to insert tags like {{first_name}}."
                    className="min-h-[300px] p-3 bg-background outline-none overflow-y-auto"
                    style={{
                      fontFamily, fontSize, color: fontColor,
                      fontWeight: isBold ? "bold" : "normal",
                      fontStyle: isItalic ? "italic" : "normal",
                      textDecoration: isUnderline ? "underline" : "none",
                      textAlign,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  An unsubscribe link is automatically added to the footer of every email.
                </p>
              </div>

              {/* Result */}
              {sendResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
                  sendResult.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
                }`}>
                  {sendResult.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{sendResult.message}</span>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-[#fdf8f3] shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ChevronRight className="w-3.5 h-3.5" />
                {composeTarget.type !== "individual"
                  ? `${getRecipients().length} recipient${getRecipients().length !== 1 ? "s" : ""}`
                  : "Individual email"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border" onClick={() => setComposeTarget(null)}>
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={isSending || !subject.trim() || !emailBody.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Sending...</> : <><Send className="w-3.5 h-3.5 mr-1.5" /> Send Email</>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CREATE GROUP DIALOG ────────────────────────────────────────────── */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>Groups let you organize contacts for targeted emails.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Group Name *</Label>
              <Input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g. VIP Members" className="border-border" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Optional description" className="border-border" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {GROUP_COLORS.map(color => (
                  <button key={color} onClick={() => setNewGroupColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${newGroupColor === color ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
              <Button onClick={createGroup} disabled={!newGroupName.trim()} className="bg-primary text-primary-foreground">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT GROUP DIALOG ──────────────────────────────────────────────── */}
      <Dialog open={!!editingGroup} onOpenChange={open => !open && setEditingGroup(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Group</DialogTitle></DialogHeader>
          {editingGroup && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input value={editingGroup.name} onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })} className="border-border" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input value={editingGroup.description || ""} onChange={e => setEditingGroup({ ...editingGroup, description: e.target.value })} className="border-border" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {GROUP_COLORS.map(color => (
                    <button key={color} onClick={() => setEditingGroup({ ...editingGroup, color })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${editingGroup.color === color ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setEditingGroup(null)}>Cancel</Button>
                <Button onClick={saveEditGroup} className="bg-primary text-primary-foreground">Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── ADD TO GROUP DIALOG ────────────────────────────────────────────── */}
      <Dialog open={!!addToGroupId} onOpenChange={open => !open && setAddToGroupId(null)}>
        <DialogContent className="max-w-sm max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Contacts to Group</DialogTitle>
            <DialogDescription>Select contacts to add to this group.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
            {contacts.filter(c => !c.unsubscribed).map(c => (
              <label key={c.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={addToGroupContacts.has(c.id)}
                  onChange={e => {
                    const next = new Set(addToGroupContacts)
                    e.target.checked ? next.add(c.id) : next.delete(c.id)
                    setAddToGroupContacts(next)
                  }}
                  className="accent-primary"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{c.first_name} {c.last_name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">{addToGroupContacts.size} selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAddToGroupId(null)}>Cancel</Button>
              <Button size="sm" onClick={addMembersToGroup} disabled={addToGroupContacts.size === 0} className="bg-primary text-primary-foreground">
                Add {addToGroupContacts.size > 0 ? `(${addToGroupContacts.size})` : ""}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── INSERT LINK DIALOG ─────────────────────────────────────────────── */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Link Text</Label>
              <Input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Click here" className="border-border" /></div>
            <div className="space-y-1"><Label className="text-xs">URL</Label>
              <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" className="border-border" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
              <Button onClick={insertLink} disabled={!linkText.trim() || !linkUrl.trim()} className="bg-primary text-primary-foreground">Insert</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── ATTACH DOC DIALOG ─────────────────────────────────────────────── */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Attach Document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Document Name</Label>
              <Input value={docName} onChange={e => setDocName(e.target.value)} placeholder="Registration Form" className="border-border" /></div>
            <div className="space-y-1"><Label className="text-xs">Document URL</Label>
              <Input value={docUrl} onChange={e => setDocUrl(e.target.value)} placeholder="https://example.com/doc.pdf" className="border-border" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDocDialog(false)}>Cancel</Button>
              <Button onClick={insertDoc} disabled={!docName.trim() || !docUrl.trim()} className="bg-primary text-primary-foreground">Insert</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
