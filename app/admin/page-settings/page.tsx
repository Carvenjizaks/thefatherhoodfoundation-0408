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
import { RefreshCw, LogOut, Eye, EyeOff, Save } from "lucide-react"

interface PageSetting {
  id: string
  slug: string
  page_name: string
  is_active: boolean
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
  const [savingSlug, setSavingSlug] = useState<string | null>(null)

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

  const updatePage = async (slug: string, updates: Partial<PageSetting>) => {
    setSavingSlug(slug)
    try {
      const response = await fetch("/api/page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...updates }),
      })

      if (response.ok) {
        const updated = await response.json()
        setPages(pages.map(p => p.slug === slug ? { ...p, ...updated } : p))
      }
    } catch (error) {
      console.error("Failed to update page:", error)
    } finally {
      setSavingSlug(null)
    }
  }

  const togglePageVisibility = (page: PageSetting) => {
    updatePage(page.slug, { is_active: !page.is_active })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Sign in to manage page visibility</CardDescription>
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
                {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Page Visibility Settings</h1>
              <p className="text-muted-foreground mt-1">Show or hide pages on your website</p>
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

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Loading pages...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <Card key={page.id} className={!page.is_active ? "border-destructive/50 bg-destructive/5" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {page.is_active ? (
                            <Eye className="h-5 w-5 text-green-600" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-destructive" />
                          )}
                          <h3 className="text-lg font-semibold">{page.page_name}</h3>
                          <span className="text-sm text-muted-foreground">/{page.slug}</span>
                        </div>
                        
                        {!page.is_active && (
                          <div className="mt-4 space-y-2">
                            <Label htmlFor={`message-${page.id}`} className="text-sm">
                              Hidden Page Message
                            </Label>
                            <div className="flex gap-2">
                              <Textarea
                                id={`message-${page.id}`}
                                placeholder="This page is temporarily unavailable..."
                                defaultValue={page.hidden_message || ""}
                                className="flex-1"
                                rows={2}
                                onBlur={(e) => {
                                  if (e.target.value !== page.hidden_message) {
                                    updatePage(page.slug, { hidden_message: e.target.value })
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${page.is_active ? "text-green-600" : "text-destructive"}`}>
                          {page.is_active ? "Visible" : "Hidden"}
                        </span>
                        <Switch
                          checked={page.is_active}
                          onCheckedChange={() => togglePageVisibility(page)}
                          disabled={savingSlug === page.slug}
                        />
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
