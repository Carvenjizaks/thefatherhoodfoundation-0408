"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase-client"
import { Search, CheckCircle, XCircle, UserCheck, AlertCircle, Loader2 } from "lucide-react"

interface VerificationResult {
  valid: boolean
  alreadyCheckedIn?: boolean
  checkedInAt?: string
  success?: boolean
  message?: string
  error?: string
  registration?: {
    id: string
    firstName: string
    lastName: string
    email?: string
    sessionDate: string
    paymentStatus?: string
    checkedIn?: boolean
  }
}

export default function AdminCheckinPage() {
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const supabase = useMemo(() => createClient(), [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoginError("Invalid credentials")
      return
    }

    setIsAuthenticated(true)
  }

  const handleVerify = async () => {
    if (!code.trim()) return

    setIsVerifying(true)
    setResult(null)

    try {
      const response = await fetch(`/api/registrations/verify?code=${encodeURIComponent(code.trim())}`)
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ valid: false, error: "Failed to verify code" })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCheckin = async () => {
    if (!code.trim()) return

    setIsCheckingIn(true)

    try {
      const response = await fetch("/api/registrations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), action: "checkin" }),
      })
      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Clear code after successful check-in
        setTimeout(() => {
          setCode("")
          setResult(null)
        }, 3000)
      }
    } catch {
      setResult({ valid: false, error: "Failed to check in" })
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-muted/30 py-12">
          <div className="max-w-md mx-auto px-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>Sign in to access check-in system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-600">{loginError}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Event Check-In</h1>
            <p className="text-muted-foreground">Verify registration codes and check in attendees</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Verify Registration Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter code (e.g., TFF-A3B7C9)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-mono tracking-wider"
                  maxLength={10}
                />
                <Button onClick={handleVerify} disabled={isVerifying || !code.trim()}>
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className={`border-2 ${
              result.success ? "border-green-500 bg-green-50" :
              result.alreadyCheckedIn ? "border-yellow-500 bg-yellow-50" :
              result.valid ? "border-blue-500 bg-blue-50" :
              "border-red-500 bg-red-50"
            }`}>
              <CardContent className="pt-6">
                {result.success ? (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">Check-In Successful!</h3>
                    <p className="text-green-700">
                      {result.registration?.firstName} {result.registration?.lastName}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Session: {result.registration?.sessionDate}
                    </p>
                  </div>
                ) : result.alreadyCheckedIn ? (
                  <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Already Checked In</h3>
                    <p className="text-yellow-700">
                      {result.registration?.firstName} {result.registration?.lastName}
                    </p>
                    <p className="text-sm text-yellow-600 mt-2">
                      Checked in at: {new Date(result.checkedInAt!).toLocaleString()}
                    </p>
                  </div>
                ) : result.valid && result.registration ? (
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <UserCheck className="w-10 h-10 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">
                          {result.registration.firstName} {result.registration.lastName}
                        </h3>
                        <p className="text-blue-700">{result.registration.email}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Session: {result.registration.sessionDate}
                        </p>
                        <p className="text-sm text-blue-600">
                          Payment: <span className={
                            result.registration.paymentStatus === "paid" ? "text-green-600 font-semibold" : "text-orange-600"
                          }>
                            {result.registration.paymentStatus || "pending"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleCheckin}
                      disabled={isCheckingIn}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isCheckingIn ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking In...</>
                      ) : (
                        <><CheckCircle className="w-5 h-5 mr-2" /> Confirm Check-In</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Invalid Code</h3>
                    <p className="text-red-700">{result.error || "Registration not found"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Scan QR code or enter registration code manually</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
