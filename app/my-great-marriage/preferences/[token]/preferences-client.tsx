"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Sub = Record<string, any>

export default function PreferencesClient({ sub, token, role }: { sub: Sub; token: string; role: "husband" | "wife" | "couple" }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [husbandEmails, setHusbandEmails] = useState(sub.receive_husband_emails)
  const [wifeEmails, setWifeEmails] = useState(sub.receive_wife_emails)
  const [coupleEmails, setCoupleEmails] = useState(sub.receive_couple_emails)

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/mgm/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, role, husbandEmails, wifeEmails, coupleEmails }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
    } catch {
      setError("Failed to save preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDF8F3] py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574] mb-2">My Great Marriage</p>
          <h1 className="text-3xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>Email Preferences</h1>
          <p className="mt-3 text-[#6b4c52]">
            {role === "husband" ? `Hi ${sub.husband_first_name},` : role === "wife" ? `Hi ${sub.wife_first_name},` : `Hi ${sub.husband_first_name} and ${sub.wife_first_name},`} manage your email preferences below.
          </p>
        </div>

        {saved ? (
          <div className="bg-white rounded-2xl border border-[#e8d8c8] p-8 text-center shadow-sm">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1a0a0e] mb-2">Preferences Saved</h2>
            <p className="text-[#6b4c52] mb-6">Your email preferences have been updated.</p>
            <Link href="/my-great-marriage" className="text-[#8B2B3E] font-semibold hover:underline">Return to My Great Marriage</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e8d8c8] p-8 shadow-sm space-y-6">
            {(role === "husband" || role === "couple") && (
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" checked={role === "couple" ? coupleEmails : husbandEmails} onChange={(e) => role === "couple" ? setCoupleEmails(e.target.checked) : setHusbandEmails(e.target.checked)} className="mt-1 w-5 h-5 accent-[#8B2B3E] rounded" />
                <div>
                  <p className="font-semibold text-[#1a0a0e]">{role === "couple" ? "Shared couple emails" : "Husband encouragement emails"}</p>
                  <p className="text-sm text-[#6b4c52]">{role === "couple" ? "Weekly encouragement sent to both husband and wife." : "Weekly encouragement sent to the husband."}</p>
                </div>
              </label>
            )}

            {(role === "wife" || role === "couple") && (
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" checked={wifeEmails} onChange={(e) => setWifeEmails(e.target.checked)} className="mt-1 w-5 h-5 accent-[#8B2B3E] rounded" />
                <div>
                  <p className="font-semibold text-[#1a0a0e]">Wife encouragement emails</p>
                  <p className="text-sm text-[#6b4c52]">Weekly encouragement sent to the wife.</p>
                </div>
              </label>
            )}

            {role === "couple" && (
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" checked={husbandEmails} onChange={(e) => setHusbandEmails(e.target.checked)} className="mt-1 w-5 h-5 accent-[#8B2B3E] rounded" />
                <div>
                  <p className="font-semibold text-[#1a0a0e]">Husband encouragement emails</p>
                  <p className="text-sm text-[#6b4c52]">Weekly encouragement for the husband.</p>
                </div>
              </label>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={handleSave} disabled={saving} className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full font-semibold">
              {saving ? "Saving..." : "Save Preferences"}
            </Button>

            <div className="border-t border-[#e8d8c8] pt-4">
              <p className="text-sm text-[#6b4c52] text-center">Want to unsubscribe completely?{" "}
                <Link href={`/unsubscribe/${token}`} className="text-[#8B2B3E] hover:underline">Click here</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
