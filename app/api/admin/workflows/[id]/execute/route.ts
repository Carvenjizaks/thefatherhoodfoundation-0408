import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"
import { processExecution } from "@/lib/workflows/executor"
import type { Workflow, WorkflowExecution } from "@/lib/workflows/types"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const { contact_email, context } = body

  const supabase = createAdminClient()
  const { data: workflow, error } = await supabase.from("workflows").select("*").eq("id", id).single()

  if (error || !workflow) return NextResponse.json({ error: "Workflow not found" }, { status: 404 })

  const executionContext: Record<string, unknown> = {
    contact_email: contact_email || null,
    triggered_by: "manual",
    ...context,
  }

  const { data: execution } = await supabase
    .from("workflow_executions")
    .insert({
      workflow_id: id,
      contact_email: contact_email || null,
      status: "pending",
      current_action_index: 0,
      context: executionContext,
    })
    .select()
    .single()

  if (!execution) return NextResponse.json({ error: "Failed to create execution" }, { status: 500 })

  await processExecution(execution as WorkflowExecution, workflow as Workflow)

  const { data: updated } = await supabase.from("workflow_executions").select("*").eq("id", execution.id).single()
  return NextResponse.json({ execution: updated })
}
