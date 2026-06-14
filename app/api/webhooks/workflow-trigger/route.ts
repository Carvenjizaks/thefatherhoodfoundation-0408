import { NextRequest, NextResponse } from "next/server"
import { triggerWorkflow } from "@/lib/workflows/executor"
import type { TriggerPayload } from "@/lib/workflows/types"

// Accepts event-based triggers from internal APIs or trusted external callers.
// Protect with WORKFLOW_WEBHOOK_SECRET env var (optional but recommended).
export async function POST(request: NextRequest) {
  const secret = process.env.WORKFLOW_WEBHOOK_SECRET
  if (secret) {
    const provided = request.headers.get("x-webhook-secret")
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  let payload: TriggerPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!payload.trigger_type) {
    return NextResponse.json({ error: "trigger_type is required" }, { status: 400 })
  }

  const result = await triggerWorkflow(payload)
  return NextResponse.json({ success: true, ...result })
}
