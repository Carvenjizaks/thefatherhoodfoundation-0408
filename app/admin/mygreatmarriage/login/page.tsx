"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/mgm/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push("/admin/mygreatmarriage")
        router.refresh()
      } else {
        setError("Incorrect password.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574] mb-2">My Great Marriage</p>
          <h1 className="text-2xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>Admin Dashboard</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8d8c8] p-8 shadow-sm space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full font-semibold">
            {loading ? "Checking..." : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  )
}
