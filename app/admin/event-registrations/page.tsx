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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase-client"
import { Search, Download, RefreshCw, LogOut, Calendar, Users } from "lucide-react"

interface EventRegistration {
  id: string
  event_id: string
  event_name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  spouse_name: string | null
  spouse_email: string | null
  spouse_phone: string | null
  session_date: string
  dynamic_code: string
  payment_status: string
  payment_amount: number
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
}

const EVENTS = [
  { slug: "all", name: "All Events" },
  { slug: "mgm-may-2026", name: "MyGreatMarriage May 2026" },
  { slug: "mgm-sept-2026", name: "MyGreatMarriage Sept 2026" },
  { slug: "goc26", name: "Gathering of Champions 2026" },
]

export default function AdminEventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    let filtered = registrations

    if (selectedEvent !== "all") {
      filtered = filtered.filter((reg) => reg.event_id === selectedEvent)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.dynamic_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reg.spouse_name && reg.spouse_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredRegistrations(filtered)
  }, [searchTerm, selectedEvent, registrations])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setIsAuthenticated(true)
      fetchRegistrations()
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
      fetchRegistrations()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setRegistrations([])
  }

  const fetchRegistrations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/event-registrations")
      const data = await response.json()
      
      if (data.registrations) {
        setRegistrations(data.registrations)
        setFilteredRegistrations(data.registrations)
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Event",
      "Name",
      "Email",
      "Phone",
      "Spouse Name",
      "Spouse Email",
      "Session Date",
      "Dynamic Code",
      "Payment Status",
      "Amount",
      "Checked In",
      "Registered At",
    ]
    const rows = filteredRegistrations.map((reg) => [
      reg.event_name,
      `${reg.first_name} ${reg.last_name}`,
      reg.email,
      reg.phone,
      reg.spouse_name || "",
      reg.spouse_email || "",
      new Date(reg.session_date).toLocaleDateString(),
      reg.dynamic_code,
      reg.payment_status,
      reg.payment_amount,
      reg.checked_in ? "Yes" : "No",
      new Date(reg.created_at).toLocaleString(),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map(cell => `"${cell}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `event-registrations-${selectedEvent}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getEventStats = () => {
    const stats: Record<string, number> = {}
    registrations.forEach((reg) => {
      stats[reg.event_id] = (stats[reg.event_id] || 0) + 1
    })
    return stats
  }

  const eventStats = getEventStats()

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
                  Sign in to access event registrations
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
              <h1 className="text-3xl font-bold text-foreground">Event Registrations</h1>
              <p className="text-muted-foreground">
                {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchRegistrations} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Event Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {EVENTS.filter(e => e.slug !== "all").map((event) => (
              <Card key={event.slug} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedEvent(event.slug)}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{event.name}</p>
                      <p className="text-3xl font-bold text-foreground">{eventStats[event.slug] || 0}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#8B2B3E]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENTS.map((event) => (
                      <SelectItem key={event.slug} value={event.slug}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">
                  Loading registrations...
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No registrations found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Attendee</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Spouse</TableHead>
                        <TableHead>Session Date</TableHead>
                        <TableHead>Dynamic Code</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell>
                            <Badge variant="outline" className="whitespace-nowrap">
                              {reg.event_name.length > 20 ? reg.event_name.substring(0, 20) + "..." : reg.event_name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {reg.first_name} {reg.last_name}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{reg.email}</div>
                              <div className="text-muted-foreground">{reg.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {reg.spouse_name ? (
                              <div className="text-sm">
                                <div>{reg.spouse_name}</div>
                                <div className="text-muted-foreground">{reg.spouse_email}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(reg.session_date)}</TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {reg.dynamic_code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={reg.payment_status === "paid" ? "default" : "secondary"}
                              className={reg.payment_status === "paid" ? "bg-green-500" : ""}
                            >
                              {reg.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={reg.checked_in ? "default" : "outline"}
                              className={reg.checked_in ? "bg-blue-500" : ""}
                            >
                              {reg.checked_in ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(reg.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
