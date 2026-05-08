"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Sub = Record<string, any>

export default function UnsubscribeClient({ sub, token, role }: { sub: Sub; token: string; role: "husband" | "wife" | "couple" }) {
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const name = role === "husband" ? sub.husband_first_name : role === "wife" ? sub.wife_first_name : `${sub.husband_first_name} and ${sub.wife_first_name}`

  async function handleUnsubscribe() {
    setConfirming(true)
    setError("")
    try {
      const res = await fetch("/api/mgm/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, role }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError("Failed to unsubscribe. Please try again.")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDF8F3] flex items-center justify-center py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574] mb-2">My Great Marriage</p>

        {done ? (
          <div className="bg-white rounded-2xl border border-[#e8d8c8] p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1a0a0e] mb-4" style={{ fontFamily: "Georgia, serif" }}>You Have Been Unsubscribed</h1>
            <p className="text-[#6b4c52] mb-6">
              {name}, you have been successfully removed from the My Great Marriage email journey. We are sorry to see you go.
            </p>
            <Link href="/my-great-marriage" className="text-[#8B2B3E] font-semibold hover:underline">Return to My Great Marriage</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e8d8c8] p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1a0a0e] mb-4" style={{ fontFamily: "Georgia, serif" }}>Unsubscribe</h1>
            <p className="text-[#6b4c52] mb-6">
              Hi {name}. Are you sure you want to unsubscribe from the My Great Marriage email journey? You will no longer receive weekly encouragement or monthly check-in reminders.
            </p>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col gap-3">
              <Button onClick={handleUnsubscribe} disabled={confirming} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-full">
                {confirming ? "Unsubscribing..." : "Yes, Unsubscribe Me"}
              </Button>
              <Link href={`/my-great-marriage/preferences/${token}`} className="text-sm text-[#8B2B3E] hover:underline">
                Manage preferences instead
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
