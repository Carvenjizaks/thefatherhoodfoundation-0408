"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ConfigStatus {
  configured: {
    SMTP_API_KEY: boolean
    SMTP_USERNAME: boolean
    SMTP_PASSWORD: boolean
    SMTP_SENDER_EMAIL: string
    SMTP_SENDER_NAME: string
    SMTP_CHANNEL: string
  }
  methods: {
    "SMTP.com API": boolean
    "Nodemailer SMTP": boolean
  }
}

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
    method?: string
    messageId?: string
  } | null>(null)
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [configLoading, setConfigLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/test-email")
        const data = await res.json()
        setConfig(data)
      } catch {
        console.error("Failed to fetch config")
      } finally {
        setConfigLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-muted/30 py-8 px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Link>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="bg-[#8B2B3E] text-white p-6">
            <h1 className="text-2xl font-bold">Email Test</h1>
            <p className="text-white/80 mt-1">
              Test your email configuration to ensure emails are being sent correctly.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Configuration Status */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h2 className="font-semibold mb-3">Configuration Status</h2>
              {configLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading configuration...
                </div>
              ) : config ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {config.methods["SMTP.com API"] ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      SMTP.com API
                    </div>
                    <div className="flex items-center gap-2">
                      {config.methods["Nodemailer SMTP"] ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      Nodemailer SMTP
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground border-t pt-3 mt-3">
                    <p><strong>Sender:</strong> {config.configured.SMTP_SENDER_NAME} &lt;{config.configured.SMTP_SENDER_EMAIL}&gt;</p>
                    <p><strong>Channel:</strong> {config.configured.SMTP_CHANNEL}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">Failed to load configuration</p>
              )}
            </div>

            {/* Test Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Send test email to:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#8B2B3E] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#7a2536] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Test Email
                  </>
                )}
              </button>
            </form>

            {/* Result */}
            {result && (
              <div
                className={`rounded-lg p-4 ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.success ? "Email Sent Successfully!" : "Failed to Send Email"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.success ? result.message : result.error}
                    </p>
                    {result.method && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        Method: {result.method}
                      </p>
                    )}
                    {result.messageId && (
                      <p className="text-xs mt-2 text-muted-foreground font-mono">
                        Message ID: {result.messageId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
