"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Trash2, ChevronDown, ChevronUp, Mail, Tag, Bell, Clock, Globe, Zap, Save, X,
} from "lucide-react"
import type { Workflow, WorkflowAction, TriggerType, ActionType } from "@/lib/workflows/types"

// ── Constants ──────────────────────────────────────────────────────────────────

const TRIGGER_OPTIONS: { value: TriggerType; label: string; description: string }[] = [
  { value: "event_registered", label: "Event Registration", description: "Fires when someone registers for an event" },
  { value: "contact_created", label: "New Contact", description: "Fires when a new contact is added" },
  { value: "tag_added", label: "Tag Added", description: "Fires when a specific tag is added to a contact" },
  { value: "manual", label: "Manual Trigger", description: "Triggered manually by an admin" },
  { value: "scheduled", label: "Scheduled", description: "Runs on a recurring schedule (daily/weekly)" },
]

const ACTION_OPTIONS: { value: ActionType; label: string; icon: React.ReactNode }[] = [
  { value: "send_email", label: "Send Email", icon: <Mail className="h-4 w-4" /> },
  { value: "add_tag", label: "Add Tag", icon: <Tag className="h-4 w-4" /> },
  { value: "send_notification", label: "Send Notification", icon: <Bell className="h-4 w-4" /> },
  { value: "wait", label: "Wait / Delay", icon: <Clock className="h-4 w-4" /> },
  { value: "webhook", label: "Webhook", icon: <Globe className="h-4 w-4" /> },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function newAction(type: ActionType = "send_email"): WorkflowAction {
  return { id: crypto.randomUUID(), type, config: {} }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ActionCard({
  action,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  action: WorkflowAction
  index: number
  total: number
  onChange: (updated: WorkflowAction) => void
  onDelete: () => void
  onMove: (dir: "up" | "down") => void
}) {
  const opt = ACTION_OPTIONS.find((o) => o.value === action.type)

  return (
    <div className="relative border rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#8B2B3E] text-white text-xs font-bold">
            {index + 1}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            {opt?.icon}
            <Select
              value={action.type}
              onValueChange={(v) => onChange({ ...action, type: v as ActionType, config: {} })}
            >
              <SelectTrigger className="h-7 text-xs border-0 p-0 shadow-none focus:ring-0 w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    <span className="flex items-center gap-2">
                      {o.icon} {o.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => onMove("up")}>
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === total - 1} onClick={() => onMove("down")}>
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Action-specific config fields */}
      {action.type === "send_email" && (
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">Subject</Label>
            <Input
              value={action.config.subject || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, subject: e.target.value } })}
              placeholder="Email subject (use {{first_name}} for personalization)"
              className="h-8 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Body</Label>
            <Textarea
              value={action.config.body || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, body: e.target.value } })}
              placeholder="Email body (use {{first_name}}, {{contact_email}}, etc.)"
              className="text-sm mt-1 min-h-[80px]"
            />
          </div>
        </div>
      )}

      {action.type === "add_tag" && (
        <div>
          <Label className="text-xs text-gray-500">Tag to add</Label>
          <Input
            value={action.config.tag || ""}
            onChange={(e) => onChange({ ...action, config: { ...action.config, tag: e.target.value } })}
            placeholder="e.g. vip, event-attendee"
            className="h-8 text-sm mt-1"
          />
        </div>
      )}

      {action.type === "send_notification" && (
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">Notify email address</Label>
            <Input
              value={action.config.to || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, to: e.target.value } })}
              placeholder="admin@example.com (leave blank for default)"
              className="h-8 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Subject</Label>
            <Input
              value={action.config.subject || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, subject: e.target.value } })}
              placeholder="Notification subject"
              className="h-8 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Message</Label>
            <Textarea
              value={action.config.message || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, message: e.target.value } })}
              placeholder="Notification message (use {{contact_email}}, etc.)"
              className="text-sm mt-1 min-h-[60px]"
            />
          </div>
        </div>
      )}

      {action.type === "wait" && (
        <div>
          <Label className="text-xs text-gray-500">Wait (days)</Label>
          <Input
            type="number"
            min={1}
            max={365}
            value={action.config.days ?? 1}
            onChange={(e) => onChange({ ...action, config: { ...action.config, days: parseInt(e.target.value) || 1 } })}
            className="h-8 text-sm mt-1 w-28"
          />
          <p className="text-xs text-gray-400 mt-1">Pause execution for this many days before continuing.</p>
        </div>
      )}

      {action.type === "webhook" && (
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">URL</Label>
            <Input
              value={action.config.url || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, url: e.target.value } })}
              placeholder="https://hooks.example.com/..."
              className="h-8 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Method</Label>
            <Select
              value={action.config.method || "POST"}
              onValueChange={(v) => onChange({ ...action, config: { ...action.config, method: v as "GET" | "POST" } })}
            >
              <SelectTrigger className="h-8 text-sm mt-1 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Payload (JSON, optional)</Label>
            <Textarea
              value={action.config.payload || ""}
              onChange={(e) => onChange({ ...action, config: { ...action.config, payload: e.target.value } })}
              placeholder='{"email": "{{contact_email}}"}'
              className="text-sm mt-1 min-h-[60px] font-mono"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface WorkflowBuilderProps {
  initial?: Partial<Workflow>
  onSave: (data: Omit<Workflow, "id" | "created_at" | "updated_at" | "execution_count" | "last_executed_at">) => Promise<void>
  onCancel: () => void
  saving?: boolean
}

export function WorkflowBuilder({ initial, onSave, onCancel, saving }: WorkflowBuilderProps) {
  const [name, setName] = useState(initial?.name || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [triggerType, setTriggerType] = useState<TriggerType>(initial?.trigger_type || "event_registered")
  const [triggerConfig, setTriggerConfig] = useState(initial?.trigger_config || {})
  const [actions, setActions] = useState<WorkflowAction[]>(initial?.actions || [])
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)

  const selectedTrigger = TRIGGER_OPTIONS.find((t) => t.value === triggerType)

  function updateAction(index: number, updated: WorkflowAction) {
    setActions((prev) => prev.map((a, i) => (i === index ? updated : a)))
  }

  function deleteAction(index: number) {
    setActions((prev) => prev.filter((_, i) => i !== index))
  }

  function moveAction(index: number, dir: "up" | "down") {
    setActions((prev) => {
      const next = [...prev]
      const target = dir === "up" ? index - 1 : index + 1
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSave() {
    await onSave({ name, description, trigger_type: triggerType, trigger_config: triggerConfig, actions, is_active: isActive })
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome new contacts" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Trigger */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#8B2B3E]" /> Trigger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">When should this workflow run?</Label>
            <Select value={triggerType} onValueChange={(v) => { setTriggerType(v as TriggerType); setTriggerConfig({}) }}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-gray-500">{t.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTrigger && (
              <p className="text-xs text-gray-500 mt-1">{selectedTrigger.description}</p>
            )}
          </div>

          {triggerType === "event_registered" && (
            <div>
              <Label className="text-xs text-gray-500">Event ID (optional — leave blank for all events)</Label>
              <Input
                value={triggerConfig.event_id || ""}
                onChange={(e) => setTriggerConfig({ ...triggerConfig, event_id: e.target.value })}
                placeholder="e.g. goc26"
                className="mt-1"
              />
            </div>
          )}

          {triggerType === "tag_added" && (
            <div>
              <Label className="text-xs text-gray-500">Tag that triggers this workflow *</Label>
              <Input
                value={triggerConfig.tag || ""}
                onChange={(e) => setTriggerConfig({ ...triggerConfig, tag: e.target.value })}
                placeholder="e.g. vip"
                className="mt-1"
              />
            </div>
          )}

          {triggerType === "scheduled" && (
            <div>
              <Label className="text-xs text-gray-500">Schedule description</Label>
              <Input
                value={triggerConfig.schedule || ""}
                onChange={(e) => setTriggerConfig({ ...triggerConfig, schedule: e.target.value })}
                placeholder="e.g. Daily at 8am"
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                This workflow fires whenever the process-workflows cron runs (every hour). Use the description to document intent.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Actions ({actions.length})</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActions((prev) => [...prev, newAction()])}
            className="text-xs h-7"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Action
          </Button>
        </div>

        {actions.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No actions yet — add one to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {actions.map((action, i) => (
              <ActionCard
                key={action.id}
                action={action}
                index={i}
                total={actions.length}
                onChange={(u) => updateAction(i, u)}
                onDelete={() => deleteAction(i)}
                onMove={(dir) => moveAction(i, dir)}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActions((prev) => [...prev, newAction()])}
              className="w-full border-dashed border text-xs h-8 text-gray-500"
            >
              <Plus className="h-3 w-3 mr-1" /> Add another action
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          Active
        </label>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name || saving}
            className="bg-[#8B2B3E] hover:bg-[#7a2436] text-white"
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving…" : "Save Workflow"}
          </Button>
        </div>
      </div>
    </div>
  )
}
