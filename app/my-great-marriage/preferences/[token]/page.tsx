import { createClient } from "@/lib/supabase/server"
import PreferencesClient from "./preferences-client"

export default async function PreferencesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  // Find subscription by any of the three tokens
  const { data: sub } = await supabase
    .from("mgm_subscriptions")
    .select("*")
    .or(`husband_preference_token.eq.${token},wife_preference_token.eq.${token},couple_preference_token.eq.${token}`)
    .eq("is_active", true)
    .maybeSingle()

  if (!sub) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#1a0a0e] mb-4" style={{ fontFamily: "Georgia, serif" }}>Link Not Found</h1>
          <p className="text-[#6b4c52]">This preference link is invalid or has expired. Please contact us if you need help.</p>
        </div>
      </main>
    )
  }

  const role =
    sub.husband_preference_token === token ? "husband"
    : sub.wife_preference_token === token ? "wife"
    : "couple"

  return <PreferencesClient sub={sub} token={token} role={role} />
}
