"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Lock, ArrowRight } from "lucide-react"

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
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/10 via-transparent to-[#8B6B5A]/10 pointer-events-none" />
      
      <div className="relative max-w-sm w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#8B2B3E] to-[#6d2230] flex items-center justify-center shadow-lg shadow-[#8B2B3E]/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">My Great Marriage</h1>
          <p className="text-sm text-zinc-500 mt-2">Admin Dashboard Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 focus:border-[#8B2B3E]/40 transition-all"
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-[#8B2B3E] to-[#6d2230] hover:from-[#7a2536] hover:to-[#5c1c28] text-white rounded-xl font-medium py-3 shadow-lg shadow-[#8B2B3E]/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Secure access for administrators only
        </p>
      </div>
    </main>
  )
}
