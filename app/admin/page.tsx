"use client"

import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { 
  Search, 
  Download, 
  RefreshCw, 
  LogOut, 
  Users, 
  Heart, 
  DollarSign,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react"

interface TableTalkRegistration extends Record<string, unknown> {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  session_date: string
  session_time: string
  location: string
  dynamic_code: string
  payment_status: string
  payment_amount: number
  checked_in: boolean
  created_at: string
}

interface EventRegistration extends Record<string, unknown> {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  spouse_name: string
  spouse_email: string
  event_name: string
  event_id: string
  session_date: string
  dynamic_code: string
  payment_status: string
  payment_amount: number
  checked_in: boolean
  created_at: string
}

interface Contact extends Record<string, unknown> {
  id: string
  first_name: string
  last_name: string
  email: string
  cellphone: string
  source: string
  source_details: string
  email_confirmed: boolean
  created_at: string
}

interface Donation extends Record<string, unknown> {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  amount: number
  currency: string
  frequency: string
  payment_method: string
  payment_status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const [tableTalkRegistrations, setTableTalkRegistrations] = useState<TableTalkRegistration[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("table-talk")

  // Email compose state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState<{ email: string; firstName: string; lastName: string }[]>([])
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailResult, setEmailResult] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Bulk selection state
  const [selectedEventRegs, setSelectedEventRegs] = useState<Set<string>>(new Set())
  const [selectedTableTalkRegs, setSelectedTableTalkRegs] = useState<Set<string>>(new Set())

  // Helper to make authenticated fetch requests with Bearer token
  const adminFetch = (url: string, options?: RequestInit) => {
    const token = sessionStorage.getItem("ff_admin_token")
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = sessionStorage.getItem("ff_admin_token")
    if (token) {
      // Verify the token is still valid by making a test request
      try {
        const testResponse = await fetch("/api/admin/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (testResponse.status === 401) {
          // Token invalid, clear session and show login
          sessionStorage.removeItem("ff_admin_token")
          sessionStorage.removeItem("ff_admin_auth")
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }
        // Token is valid, set authenticated and load all data
        setIsAuthenticated(true)
        await fetchAllData()
      } catch {
        sessionStorage.removeItem("ff_admin_token")
        sessionStorage.removeItem("ff_admin_auth")
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      
      if (response.ok) {
        const data = await response.json()
        // Store the token in sessionStorage for Authorization header usage
        sessionStorage.setItem("ff_admin_token", data.token)
        sessionStorage.setItem("ff_admin_auth", "authenticated")
        setIsAuthenticated(true)
        await fetchAllData()
      } else {
        setIsLoading(false)
        setLoginError("Invalid username or password. Please try again.")
      }
    } catch {
      setIsLoading(false)
      setLoginError("Login failed. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" })
    } catch {
      // Continue with client-side logout even if API fails
    }
    sessionStorage.removeItem("ff_admin_token")
    sessionStorage.removeItem("ff_admin_auth")
    setIsAuthenticated(false)
    setTableTalkRegistrations([])
    setEventRegistrations([])
    setContacts([])
    setDonations([])
  }

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch all data in parallel for better performance
      const [ttResponse, eventResponse, contactsResponse, donationsResponse] = await Promise.all([
        adminFetch("/api/admin/registrations"),
        adminFetch("/api/admin/event-registrations"),
        adminFetch("/api/admin/contacts"),
        adminFetch("/api/admin/donations"),
      ])

      // Check if any response is 401 - means token expired or invalid
      if (
        ttResponse.status === 401 ||
        eventResponse.status === 401 ||
        contactsResponse.status === 401 ||
        donationsResponse.status === 401
      ) {
        console.error("Admin session expired or invalid. Logging out.")
        sessionStorage.removeItem("ff_admin_token")
        sessionStorage.removeItem("ff_admin_auth")
        setIsAuthenticated(false)
        setTableTalkRegistrations([])
        setEventRegistrations([])
        setContacts([])
        setDonations([])
        return
      }

      const [ttData, eventData, contactsData, donationsData] = await Promise.all([
        ttResponse.json(),
        eventResponse.json(),
        contactsResponse.json(),
        donationsResponse.json(),
      ])

      if (ttData.registrations) {
        setTableTalkRegistrations(ttData.registrations)
      }
      if (eventData.registrations) {
        setEventRegistrations(eventData.registrations)
      }
      if (contactsData.contacts) {
        setContacts(contactsData.contacts)
      }
      if (donationsData.donations) {
        setDonations(donationsData.donations)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return
    const headers = Object.keys(data[0])
    const rows = data.map((item) => headers.map((h) => String(item[h] ?? "")))
    const csvContent = [headers.join(","), ...rows.map((row) => row.map(cell => `"${cell}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const filterData = <T extends Record<string, unknown>>(data: T[], term: string): T[] => {
    if (!term) return data
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(term.toLowerCase())
      )
    )
  }

  const handleTogglePayment = async (id: string, currentStatus: string, table: string) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid"
    try {
      const response = await adminFetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, table, field: "payment_status", value: newStatus }),
      })
      if (response.ok) {
        if (table === "event_registrations") {
          setEventRegistrations(prev => prev.map(r => r.id === id ? { ...r, payment_status: newStatus } : r))
        } else if (table === "table_talk_registrations") {
          setTableTalkRegistrations(prev => prev.map(r => r.id === id ? { ...r, payment_status: newStatus } : r))
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || "Unknown"}</Badge>
    }
  }

  // Open email compose for a single recipient
  const openEmailForOne = (email: string, firstName: string, lastName: string) => {
    setEmailRecipients([{ email, firstName, lastName }])
    setEmailSubject("")
    setEmailBody("")
    setEmailResult(null)
    setEmailDialogOpen(true)
  }

  // Open email compose for multiple recipients (bulk)
  const openEmailForBulk = (recipients: { email: string; firstName: string; lastName: string }[]) => {
    if (recipients.length === 0) return
    setEmailRecipients(recipients)
    setEmailSubject("")
    setEmailBody("")
    setEmailResult(null)
    setEmailDialogOpen(true)
  }

  // Send email via admin API
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return
    setIsSendingEmail(true)
    setEmailResult(null)
    try {
      const response = await adminFetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: emailRecipients,
          subject: emailSubject,
          body: emailBody,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setEmailResult({ message: data.message, type: "success" })
        setTimeout(() => {
          setEmailDialogOpen(false)
          setSelectedEventRegs(new Set())
          setSelectedTableTalkRegs(new Set())
        }, 2000)
      } else {
        setEmailResult({ message: data.error || "Failed to send", type: "error" })
      }
    } catch {
      setEmailResult({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Toggle bulk selection helpers
  const toggleEventRegSelection = (id: string) => {
    setSelectedEventRegs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllEventRegs = (regs: EventRegistration[]) => {
    const allSelected = regs.every(r => selectedEventRegs.has(r.id))
    if (allSelected) {
      setSelectedEventRegs(new Set())
    } else {
      setSelectedEventRegs(new Set(regs.map(r => r.id)))
    }
  }

  const toggleTableTalkSelection = (id: string) => {
    setSelectedTableTalkRegs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllTableTalk = (regs: TableTalkRegistration[]) => {
    const allSelected = regs.every(r => selectedTableTalkRegs.has(r.id))
    if (allSelected) {
      setSelectedTableTalkRegs(new Set())
    } else {
      setSelectedTableTalkRegs(new Set(regs.map(r => r.id)))
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FDF8F3] pt-24 pb-16">
          <div className="max-w-md mx-auto px-6">
            <Card className="border-[#e8d8c8]">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-[#3D1F0F]">Admin Dashboard</CardTitle>
                <CardDescription>Sign in to access all registrations and leads</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5C3D2E] mb-1">Username</label>
                    <Input
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
                      className="border-[#e8d8c8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5C3D2E] mb-1">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="border-[#e8d8c8]"
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{loginError}</p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
                  >
                    Sign In
                  </Button>
                </form>
                <p className="text-xs text-center text-[#5C3D2E]/60 mt-4">
                  Admin access only. For your eyes only.
                </p>
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
      <main className="min-h-screen bg-[#FDF8F3] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#3D1F0F]">Admin Dashboard</h1>
              <p className="text-[#5C3D2E]">View and manage all registrations and leads</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchAllData}
                className="border-[#8B2B3E] text-[#8B2B3E]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Overview - Categorized Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#e8d8c8] cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("table-talk")}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#8B2B3E]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{tableTalkRegistrations.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Table Talk Registrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#e8d8c8] cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("events")}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#D4A574]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{eventRegistrations.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Event Registrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#e8d8c8] cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("contacts")}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{contacts.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Subscriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#e8d8c8] cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("donations")}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{donations.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C3D2E]" />
              <Input
                placeholder="Search all records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#e8d8c8]"
              />
            </div>
          </div>

          {/* Tabs - Categorized Registrations & Subscriptions */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-[#e8d8c8] flex-wrap h-auto p-1">
              <TabsTrigger value="table-talk" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Table Talk Registrations ({tableTalkRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Event Registrations ({eventRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Subscriptions ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="donations" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Donations ({donations.length})
              </TabsTrigger>
            </TabsList>

            {/* Table Talk Registrations */}
            <TabsContent value="table-talk">
              <Card className="border-[#e8d8c8]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#3D1F0F]">Table Talk Registrations</CardTitle>
                    <CardDescription>All Table Talk session sign-ups</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {selectedTableTalkRegs.size > 0 && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const selected = tableTalkRegistrations.filter(r => selectedTableTalkRegs.has(r.id))
                          openEmailForBulk(selected.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))
                        }}
                        className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Email Selected ({selectedTableTalkRegs.size})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(filterData(tableTalkRegistrations, searchTerm), "table-talk-registrations")}
                      className="border-[#8B2B3E] text-[#8B2B3E]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8B2B3E]" />
                      <p className="mt-2 text-[#5C3D2E]">Loading...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">
                              <Checkbox
                                checked={filterData(tableTalkRegistrations, searchTerm).length > 0 && filterData(tableTalkRegistrations, searchTerm).every(r => selectedTableTalkRegs.has(r.id))}
                                onCheckedChange={() => toggleAllTableTalk(filterData(tableTalkRegistrations, searchTerm))}
                              />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Session Date</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Checked In</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(tableTalkRegistrations, searchTerm).map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedTableTalkRegs.has(reg.id)}
                                  onCheckedChange={() => toggleTableTalkSelection(reg.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <span>{reg.first_name} {reg.last_name}</span>
                                  <button
                                    onClick={() => openEmailForOne(reg.email, reg.first_name, reg.last_name)}
                                    className="text-[#8B2B3E] hover:text-[#6d2230] transition-colors"
                                    title={`Email ${reg.first_name}`}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>{reg.email}</TableCell>
                              <TableCell>{reg.phone}</TableCell>
                              <TableCell>{formatDate(reg.session_date)}</TableCell>
                              <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{reg.dynamic_code}</code></TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleTogglePayment(reg.id, reg.payment_status, "table_talk_registrations")}
                                  className="cursor-pointer"
                                  title="Click to toggle payment status"
                                >
                                  {getStatusBadge(reg.payment_status)}
                                </button>
                              </TableCell>
                              <TableCell>
                                {reg.checked_in ? (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-xs text-green-700">Yes</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                    <span className="text-xs text-gray-500">No</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">{formatDateTime(reg.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {filterData(tableTalkRegistrations, searchTerm).length === 0 && (
                        <p className="text-center py-8 text-[#5C3D2E]">No registrations found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Event Registrations - Segmented by Event */}
            <TabsContent value="events">
              <div className="space-y-6">
                {/* Event Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {(() => {
                    const eventCounts = filterData(eventRegistrations, searchTerm).reduce((acc, reg) => {
                      const eventName = reg.event_name || 'Unknown Event'
                      acc[eventName] = (acc[eventName] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(eventCounts).map(([eventName, count]) => (
                      <Card key={eventName} className="border-[#e8d8c8] bg-gradient-to-br from-white to-[#f5f0eb]">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold text-[#8B2B3E]">{count}</p>
                          <p className="text-xs text-[#5C3D2E] font-medium">{eventName}</p>
                        </CardContent>
                      </Card>
                    ))
                  })()}
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-end gap-2">
                  {selectedEventRegs.size > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        const selected = eventRegistrations.filter(r => selectedEventRegs.has(r.id))
                        openEmailForBulk(selected.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))
                      }}
                      className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Email Selected ({selectedEventRegs.size})
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(eventRegistrations, searchTerm), "all-event-registrations")}
                    className="border-[#8B2B3E] text-[#8B2B3E]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Events CSV
                  </Button>
                </div>

                {/* Segmented Event Cards */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8B2B3E]" />
                    <p className="mt-2 text-[#5C3D2E]">Loading...</p>
                  </div>
                ) : (
                  (() => {
                    const filteredEvents = filterData(eventRegistrations, searchTerm)
                    const groupedEvents = filteredEvents.reduce((acc, reg) => {
                      const eventName = reg.event_name || 'Unknown Event'
                      if (!acc[eventName]) acc[eventName] = []
                      acc[eventName].push(reg)
                      return acc
                    }, {} as Record<string, typeof eventRegistrations>)

                    const eventOrder = ['MyGreatMarriage 2026', 'Gathering of Champions 2026', 'Table Talk']
                    const sortedEventNames = Object.keys(groupedEvents).sort((a, b) => {
                      const indexA = eventOrder.findIndex(e => a.includes(e)) 
                      const indexB = eventOrder.findIndex(e => b.includes(e))
                      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
                      if (indexA === -1) return 1
                      if (indexB === -1) return -1
                      return indexA - indexB
                    })

                    if (sortedEventNames.length === 0) {
                      return <p className="text-center py-8 text-[#5C3D2E]">No event registrations found</p>
                    }

                    return sortedEventNames.map((eventName) => {
                      const regs = groupedEvents[eventName]
                      const eventColor = eventName.includes('Marriage') ? 'bg-pink-100 text-pink-800' 
                        : eventName.includes('Champion') || eventName.includes('GOC') ? 'bg-blue-100 text-blue-800'
                        : eventName.includes('Table') ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'

                      return (
                        <Card key={eventName} className="border-[#e8d8c8]">
                          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#f5f0eb] to-white">
                            <div className="flex items-center gap-3">
                              <Badge className={eventColor}>{eventName}</Badge>
                              <span className="text-sm text-[#5C3D2E]">{regs.length} registration{regs.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEmailForBulk(regs.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))}
                                className="border-[#8B2B3E] text-[#8B2B3E]"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Email All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCSV(regs, `${eventName.toLowerCase().replace(/\s+/g, '-')}-registrations`)}
                                className="border-[#8B2B3E] text-[#8B2B3E]"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-10">
                                      <Checkbox
                                        checked={regs.every(r => selectedEventRegs.has(r.id))}
                                        onCheckedChange={() => {
                                          const allSelected = regs.every(r => selectedEventRegs.has(r.id))
                                          setSelectedEventRegs(prev => {
                                            const next = new Set(prev)
                                            regs.forEach(r => {
                                              if (allSelected) next.delete(r.id)
                                              else next.add(r.id)
                                            })
                                            return next
                                          })
                                        }}
                                      />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Spouse</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Checked In</TableHead>
                                    <TableHead>Registered</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {regs.map((reg) => (
                                    <TableRow key={reg.id}>
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedEventRegs.has(reg.id)}
                                          onCheckedChange={() => toggleEventRegSelection(reg.id)}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                          <span>{reg.first_name} {reg.last_name}</span>
                                          <button
                                            onClick={() => openEmailForOne(reg.email, reg.first_name, reg.last_name)}
                                            className="text-[#8B2B3E] hover:text-[#6d2230] transition-colors"
                                            title={`Email ${reg.first_name}`}
                                          >
                                            <Mail className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </TableCell>
                                      <TableCell>{reg.email}</TableCell>
                                      <TableCell>{reg.phone}</TableCell>
                                      <TableCell>{reg.spouse_name || "-"}</TableCell>
                                      <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{reg.dynamic_code}</code></TableCell>
                                      <TableCell>
                                        <button
                                          onClick={() => handleTogglePayment(reg.id, reg.payment_status, "event_registrations")}
                                          className="cursor-pointer"
                                          title="Click to toggle payment status"
                                        >
                                          {getStatusBadge(reg.payment_status)}
                                        </button>
                                      </TableCell>
                                      <TableCell>
                                        {reg.checked_in ? (
                                          <div className="flex items-center gap-1">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="text-xs text-green-700">Yes</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            <XCircle className="w-5 h-5 text-gray-400" />
                                            <span className="text-xs text-gray-500">No</span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-500">{formatDateTime(reg.created_at)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  })()
                )}
              </div>
            </TabsContent>

            {/* Contacts / Subscriptions - Categorized by Source */}
            <TabsContent value="contacts">
              <div className="space-y-6">
                {/* Subscription Source Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {(() => {
                    const sourceCounts = filterData(contacts, searchTerm).reduce((acc, contact) => {
                      const source = contact.source || 'Unknown'
                      acc[source] = (acc[source] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(sourceCounts).map(([source, count]) => (
                      <Card key={source} className="border-[#e8d8c8] bg-gradient-to-br from-white to-[#f5f0eb]">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold text-blue-600">{count}</p>
                          <p className="text-xs text-[#5C3D2E] font-medium capitalize">{source}</p>
                        </CardContent>
                      </Card>
                    ))
                  })()}
                </div>

                {/* Export All Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(contacts, searchTerm), "all-contacts-subscriptions")}
                    className="border-[#8B2B3E] text-[#8B2B3E]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Contacts CSV
                  </Button>
                </div>

                {/* Categorized by Source */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8B2B3E]" />
                    <p className="mt-2 text-[#5C3D2E]">Loading...</p>
                  </div>
                ) : (
                  (() => {
                    const filteredContacts = filterData(contacts, searchTerm)
                    const groupedContacts = filteredContacts.reduce((acc, contact) => {
                      const source = contact.source || 'Unknown'
                      if (!acc[source]) acc[source] = []
                      acc[source].push(contact)
                      return acc
                    }, {} as Record<string, typeof contacts>)

                    const sourceOrder = ['Newsletter', 'Contact Form', 'Event Registration', 'Table Talk', 'Popup']
                    const sortedSourceNames = Object.keys(groupedContacts).sort((a, b) => {
                      const indexA = sourceOrder.findIndex(s => a.toLowerCase().includes(s.toLowerCase()))
                      const indexB = sourceOrder.findIndex(s => b.toLowerCase().includes(s.toLowerCase()))
                      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
                      if (indexA === -1) return 1
                      if (indexB === -1) return -1
                      return indexA - indexB
                    })

                    if (sortedSourceNames.length === 0) {
                      return <p className="text-center py-8 text-[#5C3D2E]">No contacts/subscriptions found</p>
                    }

                    return sortedSourceNames.map((source) => {
                      const sourceContacts = groupedContacts[source]
                      const sourceColor = source.toLowerCase().includes('newsletter') ? 'bg-blue-100 text-blue-800'
                        : source.toLowerCase().includes('contact') ? 'bg-green-100 text-green-800'
                        : source.toLowerCase().includes('event') ? 'bg-pink-100 text-pink-800'
                        : source.toLowerCase().includes('table') ? 'bg-amber-100 text-amber-800'
                        : source.toLowerCase().includes('popup') ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'

                      return (
                        <Card key={source} className="border-[#e8d8c8]">
                          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#f5f0eb] to-white">
                            <div className="flex items-center gap-3">
                              <Badge className={sourceColor}>{source}</Badge>
                              <span className="text-sm text-[#5C3D2E]">{sourceContacts.length} subscription{sourceContacts.length !== 1 ? 's' : ''}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportToCSV(sourceContacts, `${source.toLowerCase().replace(/\s+/g, '-')}-contacts`)}
                              className="border-[#8B2B3E] text-[#8B2B3E]"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Confirmed</TableHead>
                                    <TableHead>Subscribed</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {sourceContacts.map((contact) => (
                                    <TableRow key={contact.id}>
                                      <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                          <span>{contact.first_name} {contact.last_name}</span>
                                          <button
                                            onClick={() => openEmailForOne(contact.email, contact.first_name, contact.last_name)}
                                            className="text-[#8B2B3E] hover:text-[#6d2230] transition-colors"
                                            title={`Email ${contact.first_name}`}
                                          >
                                            <Mail className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </TableCell>
                                      <TableCell>{contact.email}</TableCell>
                                      <TableCell>{contact.cellphone || "-"}</TableCell>
                                      <TableCell className="text-xs text-gray-500 max-w-[150px] truncate">{contact.source_details || "-"}</TableCell>
                                      <TableCell>
                                        {contact.email_confirmed ? (
                                          <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                          <Clock className="w-5 h-5 text-yellow-500" />
                                        )}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-500">{formatDateTime(contact.created_at)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  })()
                )}
              </div>
            </TabsContent>

            {/* Donations */}
            <TabsContent value="donations">
              <Card className="border-[#e8d8c8]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#3D1F0F]">Donations</CardTitle>
                    <CardDescription>All donation pledges and payments</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(donations, searchTerm), "donations")}
                    className="border-[#8B2B3E] text-[#8B2B3E]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8B2B3E]" />
                      <p className="mt-2 text-[#5C3D2E]">Loading...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(donations, searchTerm).map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.first_name} {donation.last_name}</TableCell>
                              <TableCell>{donation.email}</TableCell>
                              <TableCell>{donation.phone || "-"}</TableCell>
                              <TableCell className="font-semibold text-green-700">
                                {donation.currency} {donation.amount?.toLocaleString()}
                              </TableCell>
                              <TableCell><Badge variant="outline">{donation.frequency || "Once-off"}</Badge></TableCell>
                              <TableCell>{donation.payment_method || "-"}</TableCell>
                              <TableCell>{getStatusBadge(donation.payment_status)}</TableCell>
                              <TableCell className="text-sm text-gray-500">{formatDateTime(donation.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {filterData(donations, searchTerm).length === 0 && (
                        <p className="text-center py-8 text-[#5C3D2E]">No donations found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Email Compose Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#3D1F0F] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8B2B3E]" />
              {emailRecipients.length === 1 ? "Send Email" : `Broadcast to ${emailRecipients.length} Recipients`}
            </DialogTitle>
            <DialogDescription>
              {emailRecipients.length === 1
                ? `To: ${emailRecipients[0].firstName} ${emailRecipients[0].lastName} (${emailRecipients[0].email})`
                : `Sending to ${emailRecipients.length} people`}
            </DialogDescription>
          </DialogHeader>

          {/* Recipient list for bulk */}
          {emailRecipients.length > 1 && (
            <div className="max-h-28 overflow-y-auto bg-[#f5f0eb] rounded-lg p-3">
              <div className="flex flex-wrap gap-1.5">
                {emailRecipients.map((r, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-white">
                    {r.firstName} {r.lastName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email-subject" className="text-[#5C3D2E]">Subject</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Payment Confirmation Required"
                className="mt-1 border-[#e8d8c8]"
              />
            </div>
            <div>
              <Label htmlFor="email-body" className="text-[#5C3D2E]">Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                className="mt-1 border-[#e8d8c8] resize-none"
              />
              <p className="text-xs text-[#5C3D2E]/60 mt-1">
                Each recipient will be addressed by name automatically.
              </p>
            </div>

            {emailResult && (
              <div className={`p-3 rounded-lg text-sm ${
                emailResult.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {emailResult.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
                className="border-[#e8d8c8]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
              >
                {isSendingEmail ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> {emailRecipients.length === 1 ? "Send Email" : `Send to ${emailRecipients.length}`}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
