import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ workflows: data })
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const body = await request.json()
  const { name, description, trigger_type, trigger_config, actions } = body

  if (!name || !trigger_type) {
    return NextResponse.json({ error: "name and trigger_type are required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("workflows")
    .insert({ name, description, trigger_type, trigger_config: trigger_config || {}, actions: actions || [] })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ workflow: data }, { status: 201 })
}
