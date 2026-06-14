import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: workflow, error }, { data: executions }] = await Promise.all([
    supabase.from("workflows").select("*").eq("id", id).single(),
    supabase
      .from("workflow_executions")
      .select("*")
      .eq("workflow_id", id)
      .order("started_at", { ascending: false })
      .limit(50),
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ workflow, executions: executions || [] })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const body = await request.json()
  const { name, description, trigger_type, trigger_config, actions } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("workflows")
    .update({ name, description, trigger_type, trigger_config, actions })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ workflow: data })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from("workflows").delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
