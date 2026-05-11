"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Clock, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link, FileText, Palette } from "lucide-react"

interface EmailComposerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipients: { id: string; email: string; name: string; gender: "male" | "female" }[]
  onSend: (data: EmailData) => Promise<void>
}

interface EmailData {
  subject: string
  body: string
  fontFamily: string
  fontSize: string
  fontColor: string
  scheduledAt: string | null
  recipients: string[]
  recipientType: "all" | "men" | "women"
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
  { value: "#1a0a0e", label: "Black" },
  { value: "#8B2B3E", label: "Maroon" },
  { value: "#2563eb", label: "Blue" },
  { value: "#16a34a", label: "Green" },
  { value: "#dc2626", label: "Red" },
  { value: "#9333ea", label: "Purple" },
  { value: "#ea580c", label: "Orange" },
  { value: "#6b7280", label: "Gray" },
]

export default function EmailComposer({ open, onOpenChange, recipients, onSend }: EmailComposerProps) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [fontColor, setFontColor] = useState("#1a0a0e")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [recipientType, setRecipientType] = useState<"all" | "men" | "women">("all")
  
  // Link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  
  // Document link dialog state
  const [showDocDialog, setShowDocDialog] = useState(false)
  const [docName, setDocName] = useState("")
  const [docUrl, setDocUrl] = useState("")

  // Filter recipients based on selection
  const filteredRecipients = recipients.filter(r => {
    if (recipientType === "all") return true
    if (recipientType === "men") return r.gender === "male"
    if (recipientType === "women") return r.gender === "female"
    return true
  })

  const menCount = recipients.filter(r => r.gender === "male").length
  const womenCount = recipients.filter(r => r.gender === "female").length

  const insertLink = () => {
    if (!linkText.trim() || !linkUrl.trim()) {
      alert("Please fill in both link text and URL")
      return
    }
    const linkHtml = `<a href="${linkUrl}" style="color: #2563eb; text-decoration: underline;">${linkText}</a>`
    setBody(prev => prev + linkHtml)
    setLinkText("")
    setLinkUrl("")
    setShowLinkDialog(false)
  }

  const insertDocLink = () => {
    if (!docName.trim() || !docUrl.trim()) {
      alert("Please fill in both document name and URL")
      return
    }
    const docHtml = `<a href="${docUrl}" style="color: #8B2B3E; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;">📄 ${docName}</a>`
    setBody(prev => prev + docHtml)
    setDocName("")
    setDocUrl("")
    setShowDocDialog(false)
  }

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in both subject and body")
      return
    }

    if (scheduleType === "scheduled" && (!scheduledDate || !scheduledTime)) {
      alert("Please select both date and time for scheduled emails")
      return
    }

    if (filteredRecipients.length === 0) {
      alert("No recipients match the selected criteria")
      return
    }

    setIsSending(true)
    try {
      const scheduledAt = scheduleType === "scheduled" 
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString() 
        : null

      // Build styled HTML body
      const styledBody = `
        <div style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${fontColor}; ${isBold ? 'font-weight: bold;' : ''} ${isItalic ? 'font-style: italic;' : ''} ${isUnderline ? 'text-decoration: underline;' : ''} text-align: ${textAlign};">
          ${body.replace(/\n/g, '<br>')}
        </div>
      `

      await onSend({
        subject,
        body: styledBody,
        fontFamily,
        fontSize,
        fontColor,
        scheduledAt,
        recipients: [...new Set(filteredRecipients.map(r => r.id))],
        recipientType,
      })

      // Reset form
      setSubject("")
      setBody("")
      setScheduleType("now")
      setScheduledDate("")
      setScheduledTime("")
      setRecipientType("all")
      onOpenChange(false)
    } catch {
      alert("Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a0a0e] text-xl">Compose Email</DialogTitle>
            <DialogDescription className="text-[#8B6B5A]">
              Send an email to selected participants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Recipient Type Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-2 block">Send To</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${recipientType === "all" ? "border-[#8B2B3E] bg-[#8B2B3E]/5" : "border-[#e8d8c8] hover:border-[#8B2B3E]/50"}`}>
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={recipientType === "all"}
                    onChange={() => setRecipientType("all")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-[#1a0a0e]">Both</span>
                  <span className="text-xs text-[#8B6B5A]">({recipients.length})</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${recipientType === "men" ? "border-[#2563eb] bg-[#2563eb]/5" : "border-[#e8d8c8] hover:border-[#2563eb]/50"}`}>
                  <input
                    type="radio"
                    name="recipientType"
                    value="men"
                    checked={recipientType === "men"}
                    onChange={() => setRecipientType("men")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-[#1a0a0e]">Men Only</span>
                  <span className="text-xs text-[#8B6B5A]">({menCount})</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${recipientType === "women" ? "border-[#ec4899] bg-[#ec4899]/5" : "border-[#e8d8c8] hover:border-[#ec4899]/50"}`}>
                  <input
                    type="radio"
                    name="recipientType"
                    value="women"
                    checked={recipientType === "women"}
                    onChange={() => setRecipientType("women")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-[#1a0a0e]">Women Only</span>
                  <span className="text-xs text-[#8B6B5A]">({womenCount})</span>
                </label>
              </div>
            </div>

            {/* Recipients preview */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">To ({filteredRecipients.length} recipients)</label>
              <div className="bg-[#fdf8f3] border border-[#e8d8c8] rounded-lg p-3 max-h-20 overflow-y-auto">
                <p className="text-sm text-[#6b4c52]">
                  {filteredRecipients.slice(0, 3).map(r => r.name || r.email).join(", ")}
                  {filteredRecipients.length > 3 && ` and ${filteredRecipients.length - 3} more...`}
                </p>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              />
            </div>

            {/* Font Controls */}
            <div className="border border-[#e8d8c8] rounded-lg p-3 bg-[#fdf8f3]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-2 flex items-center gap-2">
                <Type className="w-3 h-3" />
                Font Settings
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Font Family */}
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-[140px] bg-white border-[#e8d8c8]">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Font Size */}
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-[120px] bg-white border-[#e8d8c8]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Font Color */}
                <div className="flex items-center gap-1 border-l border-[#e8d8c8] pl-3">
                  <Palette className="w-4 h-4 text-[#8B6B5A]" />
                  <Select value={fontColor} onValueChange={setFontColor}>
                    <SelectTrigger className="w-[100px] bg-white border-[#e8d8c8]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: fontColor }} />
                        <span className="text-xs">{FONT_COLORS.find(c => c.value === fontColor)?.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {FONT_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.value }} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Style buttons */}
                <div className="flex items-center gap-1 border-l border-[#e8d8c8] pl-3">
                  <button
                    type="button"
                    onClick={() => setIsBold(!isBold)}
                    className={`p-2 rounded-lg transition-colors ${isBold ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-2 rounded-lg transition-colors ${isItalic ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUnderline(!isUnderline)}
                    className={`p-2 rounded-lg transition-colors ${isUnderline ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </div>

                {/* Alignment buttons */}
                <div className="flex items-center gap-1 border-l border-[#e8d8c8] pl-3">
                  <button
                    type="button"
                    onClick={() => setTextAlign("left")}
                    className={`p-2 rounded-lg transition-colors ${textAlign === "left" ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlign("center")}
                    className={`p-2 rounded-lg transition-colors ${textAlign === "center" ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlign("right")}
                    className={`p-2 rounded-lg transition-colors ${textAlign === "right" ? 'bg-[#8B2B3E] text-white' : 'hover:bg-white text-[#6b4c52]'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Insert Links Row */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#e8d8c8]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkDialog(true)}
                  className="border-[#e8d8c8] text-[#6b4c52] bg-white hover:bg-[#fdf8f3] flex items-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  Insert Link
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocDialog(true)}
                  className="border-[#e8d8c8] text-[#6b4c52] bg-white hover:bg-[#fdf8f3] flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Attach Document Link
                </Button>
              </div>
            </div>

            {/* Email Body */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                rows={8}
                style={{
                  fontFamily,
                  fontSize,
                  color: fontColor,
                  fontWeight: isBold ? "bold" : "normal",
                  fontStyle: isItalic ? "italic" : "normal",
                  textDecoration: isUnderline ? "underline" : "none",
                  textAlign,
                }}
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 resize-none"
              />
            </div>

            {/* Schedule Time */}
            <div className="border border-[#e8d8c8] rounded-lg p-4 bg-[#fdf8f3]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Schedule Time
              </label>
              
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="now"
                      checked={scheduleType === "now"}
                      onChange={() => setScheduleType("now")}
                      className="w-4 h-4 text-[#8B2B3E] accent-[#8B2B3E]"
                    />
                    <span className="text-sm text-[#1a0a0e]">Send immediately</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="scheduled"
                      checked={scheduleType === "scheduled"}
                      onChange={() => setScheduleType("scheduled")}
                      className="w-4 h-4 text-[#8B2B3E] accent-[#8B2B3E]"
                    />
                    <span className="text-sm text-[#1a0a0e]">Schedule for later</span>
                  </label>
                </div>

                {scheduleType === "scheduled" && (
                  <div className="flex gap-3 pt-2">
                    <div className="flex-1">
                      <label className="text-xs text-[#8B6B5A] mb-1 block">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={today}
                        className="w-full border border-[#e8d8c8] rounded-lg px-3 py-2 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-[#8B6B5A] mb-1 block">Time</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full border border-[#e8d8c8] rounded-lg px-3 py-2 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#e8d8c8] text-[#6b4c52] rounded-lg bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !subject.trim() || !body.trim() || filteredRecipients.length === 0}
              className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-lg flex items-center gap-2"
            >
              {scheduleType === "scheduled" ? (
                <>
                  <Clock className="w-4 h-4" />
                  {isSending ? "Scheduling..." : "Schedule Email"}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending..." : `Send to ${filteredRecipients.length}`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insert Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1a0a0e]">Insert Link</DialogTitle>
            <DialogDescription className="text-[#8B6B5A]">
              Add a clickable link to your email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g., Click here"
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)} className="border-[#e8d8c8] text-[#6b4c52] bg-transparent">
              Cancel
            </Button>
            <Button onClick={insertLink} className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white">
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Document Link Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1a0a0e]">Attach Document Link</DialogTitle>
            <DialogDescription className="text-[#8B6B5A]">
              Add a link to a document (PDF, Google Doc, etc.)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">Document Name</label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g., Weekly Guide PDF"
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">Document URL</label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocDialog(false)} className="border-[#e8d8c8] text-[#6b4c52] bg-transparent">
              Cancel
            </Button>
            <Button onClick={insertDocLink} className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white">
              <FileText className="w-4 h-4 mr-2" />
              Attach Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
