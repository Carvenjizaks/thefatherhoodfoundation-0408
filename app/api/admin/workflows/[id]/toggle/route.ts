import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const supabase = createAdminClient()

  const { data: current } = await supabase.from("workflows").select("is_active").eq("id", id).single()
  if (!current) return NextResponse.json({ error: "Workflow not found" }, { status: 404 })

  const { data, error } = await supabase
    .from("workflows")
    .update({ is_active: !current.is_active })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ workflow: data })
}
