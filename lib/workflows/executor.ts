import { createAdminClient } from "@/lib/supabase/server"
import type { Workflow, WorkflowExecution, TriggerPayload, WorkflowAction } from "./types"

const SMTP_API_KEY = process.env.SMTP_API_KEY
const SMTP_SENDER_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org"
const SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation"
const SMTP_CHANNEL = process.env.SMTP_CHANNEL

async function sendEmail(to: string, toName: string, subject: string, body: string): Promise<void> {
  if (!SMTP_API_KEY) throw new Error("SMTP_API_KEY not configured")

  const isHtml = /<[a-z][\s\S]*>/i.test(body)
  const html = isHtml
    ? body
    : `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">${body
        .split("\n")
        .map((l) => `<p style="margin:0 0 10px 0;">${l || "&nbsp;"}</p>`)
        .join("")}</body></html>`

  const response = await fetch("https://api.smtp.com/v4/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SMTP_API_KEY}` },
    body: JSON.stringify({
      channel: SMTP_CHANNEL || "default",
      recipients: { to: [{ address: to, name: toName }] },
      originator: { from: { address: SMTP_SENDER_EMAIL, name: SMTP_SENDER_NAME } },
      subject,
      body: { parts: [{ type: "text/plain", content: body }, { type: "text/html", content: html }] },
    }),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error((result as { error?: { message?: string } }).error?.message || "Email send failed")
  }
}

function interpolate(template: string, context: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(context[key] ?? ""))
}

async function executeAction(action: WorkflowAction, context: Record<string, unknown>): Promise<void> {
  const { type, config } = action

  switch (type) {
    case "send_email": {
      const to = context.contact_email as string
      if (!to) throw new Error("No contact_email in workflow context")
      const name = (context.contact_name as string) || to
      await sendEmail(to, name, interpolate(config.subject || "(No Subject)", context), interpolate(config.body || "", context))
      break
    }

    case "add_tag": {
      if (!config.tag) break
      const supabase = createAdminClient()
      const email = context.contact_email as string
      if (!email) break
      const { data: contact } = await supabase.from("contacts").select("id, tags").eq("email", email).single()
      if (contact) {
        const existing: string[] = contact.tags || []
        if (!existing.includes(config.tag)) {
          await supabase.from("contacts").update({ tags: [...existing, config.tag] }).eq("id", contact.id)
        }
      }
      break
    }

    case "send_notification": {
      const to = config.to || SMTP_SENDER_EMAIL
      const subject = interpolate(config.subject || "Workflow Notification", context)
      const message = interpolate(config.message || "A workflow was triggered.", context)
      await sendEmail(to, "Admin", subject, message)
      break
    }

    case "wait":
      break

    case "webhook": {
      if (!config.url) break
      const method = config.method || "POST"
      const body = config.payload ? interpolate(config.payload, context) : JSON.stringify(context)
      await fetch(config.url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? body : undefined,
      })
      break
    }
  }
}

export async function processExecution(execution: WorkflowExecution, workflow: Workflow): Promise<void> {
  const supabase = createAdminClient()
  const actions = workflow.actions || []

  await supabase.from("workflow_executions").update({ status: "running" }).eq("id", execution.id)

  let idx = execution.current_action_index
  const context = execution.context || {}

  while (idx < actions.length) {
    const action = actions[idx]

    if (action.type === "wait") {
      const days = action.config.days || 1
      const resumeAt = new Date()
      resumeAt.setDate(resumeAt.getDate() + days)
      await supabase
        .from("workflow_executions")
        .update({ status: "waiting", current_action_index: idx + 1, resume_at: resumeAt.toISOString(), context })
        .eq("id", execution.id)
      return
    }

    try {
      await executeAction(action, context)
      idx++
    } catch (err) {
      await supabase
        .from("workflow_executions")
        .update({ status: "failed", error: (err as Error).message, completed_at: new Date().toISOString(), context })
        .eq("id", execution.id)
      return
    }
  }

  await supabase
    .from("workflow_executions")
    .update({ status: "completed", completed_at: new Date().toISOString(), context })
    .eq("id", execution.id)

  await supabase
    .from("workflows")
    .update({ execution_count: (workflow.execution_count || 0) + 1, last_executed_at: new Date().toISOString() })
    .eq("id", workflow.id)
}

export async function triggerWorkflow(payload: TriggerPayload): Promise<{ triggered: number }> {
  const supabase = createAdminClient()

  const { data: workflows } = await supabase
    .from("workflows")
    .select("*")
    .eq("is_active", true)
    .eq("trigger_type", payload.trigger_type)

  if (!workflows || workflows.length === 0) return { triggered: 0 }

  let triggered = 0

  for (const workflow of workflows as Workflow[]) {
    if (payload.trigger_type === "tag_added" && workflow.trigger_config?.tag) {
      if (workflow.trigger_config.tag !== payload.tag) continue
    }
    if (payload.trigger_type === "event_registered" && workflow.trigger_config?.event_id) {
      if (workflow.trigger_config.event_id !== payload.event_id) continue
    }

    const context: Record<string, unknown> = {
      contact_email: payload.contact_email,
      contact_id: payload.contact_id,
      event_id: payload.event_id,
      tag: payload.tag,
      ...payload.context,
    }

    const { data: execution } = await supabase
      .from("workflow_executions")
      .insert({
        workflow_id: workflow.id,
        contact_email: payload.contact_email || null,
        contact_id: payload.contact_id || null,
        status: "pending",
        current_action_index: 0,
        context,
      })
      .select()
      .single()

    if (!execution) continue
    await processExecution(execution as WorkflowExecution, workflow)
    triggered++
  }

  return { triggered }
}
