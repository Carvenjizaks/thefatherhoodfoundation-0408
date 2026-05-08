import { createClient } from "@/lib/supabase/server"
import UnsubscribeClient from "./unsubscribe-client"

export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from("mgm_subscriptions")
    .select("id, husband_first_name, wife_first_name, husband_preference_token, wife_preference_token, couple_preference_token")
    .or(`husband_preference_token.eq.${token},wife_preference_token.eq.${token},couple_preference_token.eq.${token}`)
    .eq("is_active", true)
    .maybeSingle()

  if (!sub) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#1a0a0e] mb-4" style={{ fontFamily: "Georgia, serif" }}>Already Unsubscribed</h1>
          <p className="text-[#6b4c52]">This link is no longer active. You have already been removed from our mailing list.</p>
        </div>
      </main>
    )
  }

  const role =
    sub.husband_preference_token === token ? "husband"
    : sub.wife_preference_token === token ? "wife"
    : "couple"

  return <UnsubscribeClient sub={sub} token={token} role={role} />
}
