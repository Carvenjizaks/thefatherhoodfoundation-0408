"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Clock, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface EmailComposerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipients: { id: string; email: string; name: string }[]
  onSend: (data: EmailData) => Promise<void>
}

interface EmailData {
  subject: string
  body: string
  fontFamily: string
  fontSize: string
  scheduledAt: string | null
  recipients: string[]
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

export default function EmailComposer({ open, onOpenChange, recipients, onSend }: EmailComposerProps) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [fontSize, setFontSize] = useState("14px")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in both subject and body")
      return
    }

    if (scheduleType === "scheduled" && (!scheduledDate || !scheduledTime)) {
      alert("Please select both date and time for scheduled emails")
      return
    }

    setIsSending(true)
    try {
      const scheduledAt = scheduleType === "scheduled" 
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString() 
        : null

      // Build styled HTML body
      const styledBody = `
        <div style="font-family: ${fontFamily}; font-size: ${fontSize}; ${isBold ? 'font-weight: bold;' : ''} ${isItalic ? 'font-style: italic;' : ''} ${isUnderline ? 'text-decoration: underline;' : ''} text-align: ${textAlign};">
          ${body.replace(/\n/g, '<br>')}
        </div>
      `

      await onSend({
        subject,
        body: styledBody,
        fontFamily,
        fontSize,
        scheduledAt,
        recipients: recipients.map(r => r.id),
      })

      // Reset form
      setSubject("")
      setBody("")
      setScheduleType("now")
      setScheduledDate("")
      setScheduledTime("")
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1a0a0e] text-xl">Compose Email</DialogTitle>
          <DialogDescription className="text-[#8B6B5A]">
            Send an email to {recipients.length} selected participant{recipients.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipients preview */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B6B5A] mb-1 block">To</label>
            <div className="bg-[#fdf8f3] border border-[#e8d8c8] rounded-lg p-3 max-h-20 overflow-y-auto">
              <p className="text-sm text-[#6b4c52]">
                {recipients.slice(0, 3).map(r => r.name || r.email).join(", ")}
                {recipients.length > 3 && ` and ${recipients.length - 3} more...`}
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
                <SelectTrigger className="w-[160px] bg-white border-[#e8d8c8]">
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
                <SelectTrigger className="w-[140px] bg-white border-[#e8d8c8]">
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
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
                textDecoration: isUnderline ? "underline" : "none",
                textAlign,
              }}
              className="w-full border border-[#e8d8c8] rounded-lg px-4 py-3 text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 resize-none"
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
            disabled={isSending || !subject.trim() || !body.trim()}
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
                {isSending ? "Sending..." : "Send Now"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
