"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase-client"
import { RefreshCw, LogOut, Eye, EyeOff } from "lucide-react"

interface PageSetting {
  id: string
  page_path: string
  page_name: string
  is_visible: boolean
  hidden_message: string | null
  updated_at: string
}

export default function AdminPageSettingsPage() {
  const [pages, setPages] = useState<PageSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [savingPath, setSavingPath] = useState<string | null>(null)
  const [savedPath, setSavedPath] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setIsAuthenticated(true)
      fetchPages()
    } else {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError(error.message)
      setIsLoading(false)
    } else {
      setIsAuthenticated(true)
      fetchPages()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setPages([])
  }

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/page-settings")
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePage = async (page_path: string, updates: Partial<PageSetting>) => {
    setSavingPath(page_path)
    try {
      const response = await fetch("/api/page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_path, ...updates }),
      })
      if (response.ok) {
        const updated = await response.json()
        setPages(prev => prev.map(p => p.page_path === page_path ? { ...p, ...updated } : p))
        setSavedPath(page_path)
        setTimeout(() => setSavedPath(null), 2000)
      }
    } catch (error) {
      console.error("Failed to update page:", error)
    } finally {
      setSavingPath(null)
    }
  }

  const enabledCount = pages.filter(p => p.is_visible).length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <Card className="w-full max-w-md border-2">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-[#8B2B3E]" />
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Sign in to manage page visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                <Button type="submit" className="w-full bg-[#8B2B3E] hover:bg-[#6B1B2E]" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Page Visibility</h1>
              <p className="text-muted-foreground mt-1">
                Toggle pages on or off for public access.{" "}
                <span className="font-medium text-foreground">{enabledCount} of {pages.length}</span> pages enabled.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchPages} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-muted/30 border text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-green-600" /> Enabled — publicly visible</span>
            <span className="flex items-center gap-2"><EyeOff className="w-4 h-4 text-destructive" /> Disabled — redirects to Coming Soon</span>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Loading pages...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pages.map((page) => (
                <Card
                  key={page.id}
                  className={`transition-all duration-200 ${
                    !page.is_visible
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-green-500/30 bg-green-50/30 dark:bg-green-950/10"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          {page.is_visible ? (
                            <Eye className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-destructive shrink-0" />
                          )}
                          <h3 className="text-base font-semibold text-foreground truncate">{page.page_name}</h3>
                          <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {page.page_path}
                          </code>
                        </div>

                        {/* Hidden message field — only shows when disabled */}
                        {!page.is_visible && (
                          <div className="mt-4 space-y-1">
                            <Label htmlFor={`msg-${page.id}`} className="text-xs text-muted-foreground">
                              Custom message shown on Coming Soon page (optional)
                            </Label>
                            <div className="flex gap-2">
                              <Textarea
                                id={`msg-${page.id}`}
                                placeholder="This page will be available soon. Stay tuned!"
                                defaultValue={page.hidden_message || ""}
                                rows={2}
                                className="flex-1 text-sm"
                                onBlur={(e) => {
                                  if (e.target.value !== (page.hidden_message || "")) {
                                    updatePage(page.page_path, { hidden_message: e.target.value })
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Toggle */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <Switch
                          checked={page.is_visible}
                          onCheckedChange={() => updatePage(page.page_path, { is_visible: !page.is_visible })}
                          disabled={savingPath === page.page_path}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <span className={`text-xs font-medium ${page.is_visible ? "text-green-600" : "text-destructive"}`}>
                          {savingPath === page.page_path
                            ? "Saving..."
                            : savedPath === page.page_path
                            ? "Saved!"
                            : page.is_visible
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
