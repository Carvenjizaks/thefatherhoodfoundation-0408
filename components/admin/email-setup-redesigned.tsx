"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Send,
  Clock,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  FileText,
  List,
  ListOrdered,
  Eye,
  Download,
  Share2,
  Settings,
  Plus,
  X,
  Check,
  AlertCircle,
  Users,
  Tag,
  FolderOpen,
} from "lucide-react"

interface EmailSetupRedesignedProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (data: EmailData) => Promise<void>
}

interface EmailData {
  subject: string
  body: string
  fontFamily: string
  fontSize: string
  fontColor: string
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  textAlign: "left" | "center" | "right"
  recipientType: "all" | "individuals" | "group" | "tag"
  recipients?: string[]
  groupId?: string
  tagId?: string
  scheduledAt?: string
}

interface PersonalizationTag {
  value: string
  label: string
  description: string
}

const FONT_FAMILIES = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
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
  { value: "#1a0a0e", label: "Black", hex: "#1a0a0e" },
  { value: "#8B2B3E", label: "Maroon", hex: "#8B2B3E" },
  { value: "#2563eb", label: "Blue", hex: "#2563eb" },
  { value: "#16a34a", label: "Green", hex: "#16a34a" },
  { value: "#dc2626", label: "Red", hex: "#dc2626" },
  { value: "#9333ea", label: "Purple", hex: "#9333ea" },
  { value: "#ea580c", label: "Orange", hex: "#ea580c" },
  { value: "#6b7280", label: "Gray", hex: "#6b7280" },
]

const PERSONALIZATION_TAGS: PersonalizationTag[] = [
  { value: "{{first_name}}", label: "First Name", description: "Recipient's first name" },
  { value: "{{last_name}}", label: "Last Name", description: "Recipient's last name" },
  { value: "{{email}}", label: "Email", description: "Recipient's email address" },
  { value: "{{husband_name}}", label: "Husband Name", description: "Husband's first name" },
  { value: "{{wife_name}}", label: "Wife Name", description: "Wife's first name" },
  { value: "{{couple_name}}", label: "Couple Name", description: "Both names (e.g., John & Jane)" },
]

export function EmailSetupRedesigned({ open, onOpenChange, onSend }: EmailSetupRedesignedProps) {
  const [activeTab, setActiveTab] = useState("recipients")
  
  // Recipient selection state
  const [recipientType, setRecipientType] = useState<"all" | "individuals" | "group" | "tag">("all")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [selectedTag, setSelectedTag] = useState<string>("")

  // Email composition state
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [fontColor, setFontColor] = useState("#1a0a0e")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")

  // Scheduling state
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")

  // Dialog states
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showPersonalizationMenu, setShowPersonalizationMenu] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Insert text at cursor position
  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newBody = body.substring(0, start) + text + body.substring(end)
    setBody(newBody)
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length
      textarea.focus()
    }, 0)
  }

  const insertLink = () => {
    if (linkText && linkUrl) {
      insertAtCursor(`\n[Link: ${linkText}](${linkUrl})\n`)
      setLinkText("")
      setLinkUrl("")
      setShowLinkDialog(false)
    }
  }

  const insertPersonalizationTag = (tag: PersonalizationTag) => {
    insertAtCursor(tag.value)
    setShowPersonalizationMenu(false)
  }

  const handleFileAttachment = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileName = file.name
      insertAtCursor(`\n[Attachment: ${fileName}]\n`)
    }
  }

  const handleSend = async () => {
    if (!subject || !body) {
      alert("Please fill in subject and email body")
      return
    }

    setIsSending(true)
    try {
      const scheduledAt =
        scheduleType === "scheduled" && scheduledDate && scheduledTime
          ? `${scheduledDate}T${scheduledTime}`
          : undefined

      await onSend({
        subject,
        body,
        fontFamily,
        fontSize,
        fontColor,
        isBold,
        isItalic,
        isUnderline,
        textAlign,
        recipientType,
        recipients: selectedRecipients.length > 0 ? selectedRecipients : undefined,
        groupId: selectedGroup || undefined,
        tagId: selectedTag || undefined,
        scheduledAt,
      })

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onOpenChange(false)
        resetForm()
      }, 2000)
    } catch (error) {
      alert("Error sending email")
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  const resetForm = () => {
    setSubject("")
    setBody("")
    setFontFamily("Arial, sans-serif")
    setFontSize("14px")
    setFontColor("#1a0a0e")
    setIsBold(false)
    setIsItalic(false)
    setIsUnderline(false)
    setTextAlign("left")
    setRecipientType("all")
    setSelectedRecipients([])
    setSelectedGroup("")
    setSelectedTag("")
    setScheduleType("now")
    setScheduledDate("")
    setScheduledTime("")
    setActiveTab("recipients")
  }

  const previewStyle = {
    fontFamily,
    fontSize,
    color: fontColor,
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    textDecoration: isUnderline ? "underline" : "none",
    textAlign: textAlign as any,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Email Campaign Creator</DialogTitle>
          <DialogDescription>
            Select recipients, compose your message, customize formatting, and preview before sending
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="recipients" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Recipients</span>
            </TabsTrigger>
            <TabsTrigger value="compose" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Compose</span>
            </TabsTrigger>
            <TabsTrigger value="formatting" className="flex items-center gap-1 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Format</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1 text-xs sm:text-sm">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>

          {/* RECIPIENTS TAB */}
          <TabsContent value="recipients" className="flex-1 overflow-y-auto space-y-4 p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Recipients</CardTitle>
                <CardDescription>Choose who receives this email campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { type: "all", icon: Users, label: "Send to All", description: "All active contacts" },
                    { type: "individuals", icon: Users, label: "Select Individuals", description: "Pick specific people" },
                    { type: "group", icon: FolderOpen, label: "Send to Group", description: "Select a saved group" },
                    { type: "tag", icon: Tag, label: "Send by Tag", description: "All contacts with a tag" },
                  ].map(({ type, icon: Icon, label, description }) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setRecipientType(type as any)}
                    >
                      <input
                        type="radio"
                        name="recipients"
                        value={type}
                        checked={recipientType === type}
                        readOnly
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {recipientType === "individuals" && (
                  <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    <label className="text-sm font-medium">Selected Recipients ({selectedRecipients.length})</label>
                    <Input placeholder="Search and add recipients..." className="mb-2 text-sm" />
                    <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-10 bg-background">
                      {selectedRecipients.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No recipients selected</span>
                      ) : (
                        selectedRecipients.map((id) => (
                          <div key={id} className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                            {id}
                            <button onClick={() => setSelectedRecipients(selectedRecipients.filter(r => r !== id))}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {recipientType === "group" && (
                  <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    <label className="text-sm font-medium">Select Group</label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Choose a group..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group1">Team Leaders</SelectItem>
                        <SelectItem value="group2">Newsletter Subscribers</SelectItem>
                        <SelectItem value="group3">Active Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {recipientType === "tag" && (
                  <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    <label className="text-sm font-medium">Select Tag</label>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Choose a tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MGM">My Great Marriage</SelectItem>
                        <SelectItem value="TT4Men">Table Talk for Men</SelectItem>
                        <SelectItem value="FF-NL">Newsletter</SelectItem>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPOSE TAB */}
          <TabsContent value="compose" className="flex-1 overflow-y-auto space-y-4 p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Email Content</CardTitle>
                <CardDescription>Write your message with personalization options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line *</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject (keep it clear and compelling)..."
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">{subject.length}/60 characters</p>
                </div>

                <Separator className="my-3" />

                {/* Formatting Toolbar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Formatting Tools</label>
                  <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted/50">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isBold ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setIsBold(!isBold)}
                          className="h-8 px-2"
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold text</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isItalic ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setIsItalic(!isItalic)}
                          className="h-8 px-2"
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic text</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isUnderline ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setIsUnderline(!isUnderline)}
                          className="h-8 px-2"
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Underline text</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {[
                      { align: "left", icon: AlignLeft },
                      { align: "center", icon: AlignCenter },
                      { align: "right", icon: AlignRight },
                    ].map(({ align, icon: Icon }) => (
                      <Tooltip key={align}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={textAlign === align ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTextAlign(align as any)}
                            className="h-8 px-2"
                          >
                            <Icon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align {align}</TooltipContent>
                      </Tooltip>
                    ))}

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowLinkDialog(true)}
                          className="h-8 px-2"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert link</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleFileAttachment}
                          className="h-8 px-2"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={showPersonalizationMenu ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setShowPersonalizationMenu(!showPersonalizationMenu)}
                          className="h-8 px-2 text-xs font-bold"
                        >
                          {'{}'}</Button>
                      </TooltipTrigger>
                      <TooltipContent>Personalization tags</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Personalization Menu */}
                {showPersonalizationMenu && (
                  <div className="p-3 border rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm font-medium">Personalization Tags - Click to insert:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PERSONALIZATION_TAGS.map((tag) => (
                        <Tooltip key={tag.value}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => insertPersonalizationTag(tag)}
                              className="text-left p-2 rounded border hover:bg-muted transition-colors text-xs bg-background hover:border-primary"
                            >
                              <p className="font-medium">{tag.label}</p>
                              <p className="text-xs text-muted-foreground">{tag.value}</p>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{tag.description}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Body *</label>
                  <Textarea
                    ref={textareaRef}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email message here... Use {{first_name}}, {{wife_name}}, etc. for personalization."
                    className="min-h-48 resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">{body.length} characters</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FORMATTING TAB */}
          <TabsContent value="formatting" className="flex-1 overflow-y-auto space-y-4 p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Text Formatting</CardTitle>
                <CardDescription>Customize the appearance of your email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Font Family */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {FONT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFontColor(color.value)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          fontColor === color.value
                            ? "border-primary ring-2 ring-primary"
                            : "border-muted hover:border-primary"
                        }`}
                        title={color.label}
                      >
                        <div className="w-full h-8 rounded" style={{ backgroundColor: color.hex }} />
                        <p className="text-xs mt-1 text-center">{color.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Scheduling */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Schedule Delivery
                  </h3>

                  <div className="space-y-3">
                    {[
                      { type: "now", label: "Send Now", description: "Deliver immediately" },
                      { type: "scheduled", label: "Schedule for Later", description: "Choose date and time" },
                    ].map(({ type, label, description }) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => setScheduleType(type as any)}
                      >
                        <input
                          type="radio"
                          name="schedule"
                          checked={scheduleType === type}
                          readOnly
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-sm">{label}</p>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </label>
                    ))}

                    {scheduleType === "scheduled" && (
                      <div className="grid grid-cols-2 gap-3 ml-7 mt-3 p-3 border rounded-lg bg-muted/30">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Date</label>
                          <Input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Time</label>
                          <Input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PREVIEW TAB */}
          <TabsContent value="preview" className="flex-1 overflow-y-auto p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Email Preview</CardTitle>
                <CardDescription>This is how your email will appear to recipients</CardDescription>
              </CardHeader>
              <CardContent>
                {!subject || !body ? (
                  <div className="p-8 text-center border rounded-lg bg-muted/30">
                    <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Add subject and body content to see preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview Header */}
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                      <p className="font-semibold text-base" style={previewStyle}>
                        {subject}
                      </p>
                    </div>

                    {/* Preview Body */}
                    <div className="p-4 border rounded-lg min-h-64 bg-white">
                      <div style={previewStyle} className="whitespace-pre-wrap break-words text-sm">
                        {body}
                      </div>
                    </div>

                    {/* Preview Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 border rounded-lg bg-muted/30">
                      <div>
                        <p className="text-muted-foreground">Font</p>
                        <p className="font-medium">{FONT_FAMILIES.find(f => f.value === fontFamily)?.label}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{fontSize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Style</p>
                        <p className="font-medium">
                          {[isBold && "Bold", isItalic && "Italic", isUnderline && "Underline"]
                            .filter(Boolean)
                            .join(", ") || "Normal"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Alignment</p>
                        <p className="font-medium capitalize">{textAlign}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 animate-in">
            <Check className="w-5 h-5" />
            <span className="text-sm">Email campaign created successfully!</span>
          </div>
        )}

        {/* Dialog: Insert Link */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">Insert Link</DialogTitle>
              <DialogDescription>Add a clickable link to your email</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Text</label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g., Learn More"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g., https://example.com"
                  className="text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLinkDialog(false)} className="text-sm">
                Cancel
              </Button>
              <Button onClick={insertLink} className="text-sm">
                Insert Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer Actions */}
        <CardFooter className="flex gap-2 justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              resetForm()
            }}
            className="text-sm"
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("preview")}
              className="flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !subject || !body}
              className="flex items-center gap-2 text-sm bg-primary hover:bg-primary/90"
            >
              {isSending ? (
                <>
                  <span className="inline-block animate-spin">⌛</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </DialogContent>
    </Dialog>
  )
}
