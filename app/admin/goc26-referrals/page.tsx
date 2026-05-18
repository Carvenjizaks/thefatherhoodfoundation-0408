"use client"

import { useEffect, useState, useMemo } from "react"

export const dynamic = "force-dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase-client"
import { Search, Download, RefreshCw, LogOut, Users, UserPlus, CheckCircle, Mail, ArrowRight, ExternalLink } from "lucide-react"

interface Referral {
  id: string
  referrer_id: string | null
  referrer_name: string
  referrer_email: string | null
  friend_name: string
  friend_email: string
  personal_note: string | null
  sent_at: string
  status: string
  converted: boolean
  converted_at: string | null
}

interface ReferrerStats {
  id: string
  name: string
  email: string
  registrationCode: string
  referralsSent: number
  conversions: number
  referralEmailSent: boolean
  referralToken: string | null
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginError("Invalid credentials. Please try again.")
    } else {
      setIsAuthenticated(true)
      fetchData()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setReferrals([])
    setReferrerStats([])
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch referrals
      const { data: referralData, error: referralError } = await supabase
        .from("goc26_referrals")
        .select("*")
        .order("sent_at", { ascending: false })

      if (referralError) throw referralError
      setReferrals(referralData || [])

      // Fetch registrations with referral data for stats
      const { data: regData, error: regError } = await supabase
        .from("event_registrations")
        .select("id, first_name, last_name, email, dynamic_code, referrals_sent, referral_email_sent, referral_token")
        .eq("event_id", "goc26")
        .order("created_at", { ascending: false })

      if (regError) throw regError

      // Calculate stats for each referrer
      const stats: ReferrerStats[] = (regData || []).map(reg => {
        const conversions = (referralData || []).filter(
          r => r.referrer_email === reg.email && r.converted
        ).length

        return {
          id: reg.id,
          name: `${reg.first_name} ${reg.last_name}`,
          email: reg.email,
          registrationCode: reg.dynamic_code,
          referralsSent: reg.referrals_sent || 0,
          conversions,
          referralEmailSent: reg.referral_email_sent || false,
          referralToken: reg.referral_token,
        }
      })

      setReferrerStats(stats)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter referrals based on search
  const filteredReferrals = referrals.filter(
    ref =>
      ref.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.friend_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.friend_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ref.referrer_email && ref.referrer_email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Filter referrer stats based on search
  const filteredStats = referrerStats.filter(
    stat =>
      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.registrationCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalReferralsSent = referrals.length
  const totalConversions = referrals.filter(r => r.converted).length
  const conversionRate = totalReferralsSent > 0 
    ? ((totalConversions / totalReferralsSent) * 100).toFixed(1) 
    : "0"
  const activeReferrers = referrerStats.filter(s => s.referralsSent > 0).length

  const exportReferralsCSV = () => {
    const headers = ["Referrer Name", "Referrer Email", "Friend Name", "Friend Email", "Sent At", "Status", "Converted", "Converted At"]
    const rows = filteredReferrals.map(ref => [
      ref.referrer_name,
      ref.referrer_email || "",
      ref.friend_name,
      ref.friend_email,
      new Date(ref.sent_at).toLocaleString(),
      ref.status,
      ref.converted ? "Yes" : "No",
      ref.converted_at ? new Date(ref.converted_at).toLocaleString() : "",
    ])

    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `goc26-referrals-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyReferralLink = (token: string) => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/events/goc26/refer?token=${token}`
    navigator.clipboard.writeText(link)
    alert("Referral link copied to clipboard!")
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-muted/30">
          <div className="max-w-md mx-auto px-6 py-20">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Sign in to access GOC26 referral tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-500">{loginError}</p>
                  )}
                  <Button type="submit" className="w-full bg-[#8B2B3E] hover:bg-[#6d2230]">
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
      <main className="pt-20 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">GOC26 Referral Tracking</h1>
              <p className="text-muted-foreground">
                Track who invited whom and conversions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportReferralsCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals Sent</p>
                    <p className="text-3xl font-bold text-foreground">{totalReferralsSent}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-3xl font-bold text-foreground">{totalConversions}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold text-foreground">{conversionRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Referrers</p>
                    <p className="text-3xl font-bold text-foreground">{activeReferrers}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-[#8B2B3E]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Registrant Overview</TabsTrigger>
                  <TabsTrigger value="referrals">All Referrals</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {isLoading ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Loading data...
                    </div>
                  ) : filteredStats.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No registrations found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Registrant</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Email Sent</TableHead>
                            <TableHead>Referrals Sent</TableHead>
                            <TableHead>Conversions</TableHead>
                            <TableHead>Referral Link</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStats.map((stat) => (
                            <TableRow key={stat.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{stat.name}</div>
                                  <div className="text-sm text-muted-foreground">{stat.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                  {stat.registrationCode}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge variant={stat.referralEmailSent ? "default" : "secondary"} className={stat.referralEmailSent ? "bg-green-500" : ""}>
                                  {stat.referralEmailSent ? "Sent" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold">{stat.referralsSent}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-green-600">{stat.conversions}</span>
                              </TableCell>
                              <TableCell>
                                {stat.referralToken ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyReferralLink(stat.referralToken!)}
                                    className="text-[#8B2B3E]"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Copy Link
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground text-sm">No token</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="referrals">
                  {isLoading ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Loading referrals...
                    </div>
                  ) : filteredReferrals.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No referrals found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Referrer</TableHead>
                            <TableHead>Invited Friend</TableHead>
                            <TableHead>Sent At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Converted</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReferrals.map((ref) => (
                            <TableRow key={ref.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{ref.referrer_name}</div>
                                  <div className="text-sm text-muted-foreground">{ref.referrer_email || "N/A"}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{ref.friend_name}</div>
                                  <div className="text-sm text-muted-foreground">{ref.friend_email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(ref.sent_at)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{ref.status}</Badge>
                              </TableCell>
                              <TableCell>
                                {ref.converted ? (
                                  <div>
                                    <Badge className="bg-green-500">Registered</Badge>
                                    {ref.converted_at && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {formatDate(ref.converted_at)}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
