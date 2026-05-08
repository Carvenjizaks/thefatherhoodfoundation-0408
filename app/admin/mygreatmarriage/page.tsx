import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboardClient from "./admin-client"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  // Password gate
  const cookieStore = await cookies()
  const authenticated = cookieStore.get("mgm_admin_auth")?.value === "true"

  if (!authenticated) {
    redirect("/admin/mygreatmarriage/login")
  }

  const supabase = await createClient()

  // Stats
  const { count: totalActive } = await supabase
    .from("mgm_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: husbandTrack } = await supabase
    .from("mgm_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("receive_husband_emails", true)

  const { count: wifeTrack } = await supabase
    .from("mgm_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("receive_wife_emails", true)

  const { count: coupleTrack } = await supabase
    .from("mgm_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("receive_couple_emails", true)

  // Recent subscriptions
  let query = supabase
    .from("mgm_subscriptions")
    .select("id, husband_first_name, husband_last_name, husband_email, wife_first_name, wife_last_name, wife_email, country, city, current_month, current_week_in_cycle, is_active, last_sent_at, next_send_at, created_at")
    .order("created_at", { ascending: false })
    .limit(20)

  if (search) {
    query = query.or(`husband_email.ilike.%${search}%,wife_email.ilike.%${search}%`)
  }

  const { data: subscriptions } = await query

  // Recent email logs
  const { data: emailLogs } = await supabase
    .from("mgm_email_logs")
    .select("id, subscription_id, stream_type, recipient_type, recipient_email, subject, sent_at, status")
    .order("sent_at", { ascending: false })
    .limit(20)

  return (
    <AdminDashboardClient
      stats={{ totalActive: totalActive || 0, husbandTrack: husbandTrack || 0, wifeTrack: wifeTrack || 0, coupleTrack: coupleTrack || 0 }}
      subscriptions={subscriptions || []}
      emailLogs={emailLogs || []}
      search={search || ""}
    />
  )
}
