"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No unsubscribe token found. Please use the link from your email.")
      return
    }

    setStatus("loading")
    fetch(`/api/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmail(data.email)
          setFirstName(data.firstName || "")
          setStatus("success")
        } else {
          setErrorMessage(data.error || "This unsubscribe link is invalid or has already been used.")
          setStatus("error")
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong. Please try again.")
        setStatus("error")
      })
  }, [token])

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 bg-[#8B2B3E] rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a0a0e]">The Fatherhood Foundation</h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-[#e5d8cb] p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="w-10 h-10 text-[#8B2B3E] animate-spin" />
            <p className="text-[#5a3a3a]">Processing your request...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1a0a0e]">
              {firstName ? `${firstName}, you've been unsubscribed` : "You've been unsubscribed"}
            </h2>
            <p className="text-[#5a3a3a] text-sm leading-relaxed">
              {email && <span className="font-medium text-[#1a0a0e]">{email}</span>} has been removed from our mailing list. You will no longer receive bulk emails from The Fatherhood Foundation.
            </p>
            <p className="text-xs text-[#8a6a6a] mt-2">
              If this was a mistake or you change your mind, please contact us at{" "}
              <a href="mailto:info@thefathersfoundations.org" className="text-[#8B2B3E] underline">
                info@thefathersfoundations.org
              </a>
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <XCircle className="w-9 h-9 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1a0a0e]">Unsubscribe failed</h2>
            <p className="text-[#5a3a3a] text-sm leading-relaxed">{errorMessage}</p>
            <p className="text-xs text-[#8a6a6a] mt-2">
              Need help? Contact us at{" "}
              <a href="mailto:info@thefathersfoundations.org" className="text-[#8B2B3E] underline">
                info@thefathersfoundations.org
              </a>
            </p>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="w-10 h-10 text-[#8B2B3E] animate-spin" />
            <p className="text-[#5a3a3a]">Loading...</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost" className="text-[#8B2B3E] hover:bg-[#8B2B3E]/10 text-sm">
          <Link href="/">Return to website</Link>
        </Button>
      </div>
    </div>
  )
}
