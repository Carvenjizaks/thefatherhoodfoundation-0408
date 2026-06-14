import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { processExecution, triggerWorkflow } from "@/lib/workflows/executor"
import type { Workflow, WorkflowExecution } from "@/lib/workflows/types"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()
  let resumed = 0
  let scheduled = 0

  // Resume waiting executions whose delay has elapsed
  const { data: waiting } = await supabase
    .from("workflow_executions")
    .select("*, workflows(*)")
    .eq("status", "waiting")
    .lte("resume_at", now)
    .limit(50)

  if (waiting) {
    for (const row of waiting) {
      const execution = row as WorkflowExecution & { workflows: Workflow }
      const workflow = execution.workflows
      if (!workflow) continue
      await processExecution(execution, workflow)
      resumed++
    }
  }

  // Fire scheduled workflows (trigger_type = 'scheduled')
  // The cron schedule is managed in vercel.json; here we just trigger all active scheduled workflows
  const result = await triggerWorkflow({ trigger_type: "scheduled" })
  scheduled = result.triggered

  return NextResponse.json({ success: true, resumed, scheduled })
}
