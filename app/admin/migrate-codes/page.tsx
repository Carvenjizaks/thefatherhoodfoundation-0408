"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase-client"
import { RefreshCw, Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

interface MigrationResult {
  id: string
  email: string
  oldCode: string
  newCode: string
  emailSent: boolean
}

export default function MigrateCodesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [sendEmails, setSendEmails] = useState(true)
  const [eventFilter, setEventFilter] = useState("")
  const [results, setResults] = useState<MigrationResult[]>([])
  const [summary, setSummary] = useState<{ updated: number; emailsSent: number } | null>(null)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginError(error.message)
    } else {
      setIsAuthenticated(true)
    }
  }

  const handleMigrate = async () => {
    setIsMigrating(true)
    setError("")
    setResults([])
    setSummary(null)

    try {
      const response = await fetch("/api/admin/migrate-registration-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sendEmails,
          eventId: eventFilter || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Migration failed")
      }

      setResults(data.results || [])
      setSummary({ updated: data.updated, emailsSent: data.emailsSent })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Migration failed")
    } finally {
      setIsMigrating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Sign in to access migration tools</CardDescription>
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
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Migrate Registration Codes</h1>
          <p className="text-muted-foreground mt-2">
            Update existing registration codes to new sequential format (e.g., MGM-001, TT4M-102)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Migration Options</CardTitle>
              <CardDescription>
                Configure and run the code migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventFilter">Event Filter (optional)</Label>
                <Input
                  id="eventFilter"
                  placeholder="e.g., my-great-marriage-2026"
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to migrate all events
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="sendEmails">Send Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Email registrants their new code as payment reference
                  </p>
                </div>
                <Switch
                  id="sendEmails"
                  checked={sendEmails}
                  onCheckedChange={setSendEmails}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {summary && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Migration complete! Updated {summary.updated} codes, sent {summary.emailsSent} emails.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="w-full"
              >
                {isMigrating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Run Migration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Code Format</CardTitle>
              <CardDescription>
                Event abbreviation mappings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">MGM</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">My Great Marriage</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">TT4M</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">TableTalk for Men</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">MM</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Mentoring Men</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">WYC</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">World Youth Conference</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                The code becomes the payment reference for easy bank reconciliation.
              </p>
            </CardContent>
          </Card>
        </div>

        {results.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Migration Results</CardTitle>
              <CardDescription>
                {results.length} registration(s) updated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Old Code</TableHead>
                    <TableHead>New Code</TableHead>
                    <TableHead>Email Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.email}</TableCell>
                      <TableCell className="text-muted-foreground">{result.oldCode}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{result.newCode}</Badge>
                      </TableCell>
                      <TableCell>
                        {result.emailSent ? (
                          <Badge className="bg-green-100 text-green-800">Sent</Badge>
                        ) : (
                          <Badge variant="outline">Not Sent</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
