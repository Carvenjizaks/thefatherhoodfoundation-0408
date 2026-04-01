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
import { 
  Search, 
  Download, 
  RefreshCw, 
  LogOut, 
  Users, 
  Calendar, 
  Heart, 
  DollarSign,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"

interface TableTalkRegistration {
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

interface EventRegistration {
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

interface Contact {
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

interface Donation {
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

// Simple hardcoded admin credentials - FOR YOUR EYES ONLY
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "FatherhoodAdmin2026!"

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

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    // Check if admin is authenticated via sessionStorage
    const isAdmin = sessionStorage.getItem("ff_admin_auth")
    if (isAdmin === "authenticated") {
      setIsAuthenticated(true)
      fetchAllData()
    } else {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("ff_admin_auth", "authenticated")
      setIsAuthenticated(true)
      fetchAllData()
    } else {
      setLoginError("Invalid username or password. Please try again.")
    }
  }

  const handleLogout = () => {
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
      // Fetch Table Talk registrations
      const ttResponse = await fetch("/api/admin/registrations")
      const ttData = await ttResponse.json()
      if (ttData.registrations) {
        setTableTalkRegistrations(ttData.registrations)
      }

      // Fetch Event registrations
      const eventResponse = await fetch("/api/admin/event-registrations")
      const eventData = await eventResponse.json()
      if (eventData.registrations) {
        setEventRegistrations(eventData.registrations)
      }

      // Fetch Contacts directly from Supabase
      if (supabase) {
        const { data: contactsData } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false })
        if (contactsData) {
          setContacts(contactsData)
        }

        // Fetch Donations
        const { data: donationsData } = await supabase
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })
        if (donationsData) {
          setDonations(donationsData)
        }
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
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
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
                    <p className="text-red-600 text-sm">{loginError}</p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
                  >
                    Sign In
                  </Button>
                </form>
                <p className="text-xs text-center text-[#5C3D2E]/60 mt-4">
                  Admin access only. Contact administrator if you need credentials.
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

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#e8d8c8]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#8B2B3E]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{tableTalkRegistrations.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Table Talk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#e8d8c8]">
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
            <Card className="border-[#e8d8c8]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#3D1F0F]">{contacts.length}</p>
                    <p className="text-sm text-[#5C3D2E]">Contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#e8d8c8]">
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-[#e8d8c8]">
              <TabsTrigger value="table-talk" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Table Talk ({tableTalkRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Events ({eventRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-[#8B2B3E] data-[state=active]:text-white">
                Contacts ({contacts.length})
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(tableTalkRegistrations, searchTerm), "table-talk-registrations")}
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
                            <TableHead>Session Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Checked In</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(tableTalkRegistrations, searchTerm).map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">{reg.first_name} {reg.last_name}</TableCell>
                              <TableCell>{reg.email}</TableCell>
                              <TableCell>{reg.phone}</TableCell>
                              <TableCell>{formatDate(reg.session_date)}</TableCell>
                              <TableCell>{reg.location}</TableCell>
                              <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{reg.dynamic_code}</code></TableCell>
                              <TableCell>{getStatusBadge(reg.payment_status)}</TableCell>
                              <TableCell>
                                {reg.checked_in ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-400" />
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

            {/* Event Registrations */}
            <TabsContent value="events">
              <Card className="border-[#e8d8c8]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#3D1F0F]">Event Registrations</CardTitle>
                    <CardDescription>MyGreatMarriage and other event sign-ups</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(eventRegistrations, searchTerm), "event-registrations")}
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
                            <TableHead>Spouse</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(eventRegistrations, searchTerm).map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">{reg.first_name} {reg.last_name}</TableCell>
                              <TableCell>{reg.email}</TableCell>
                              <TableCell>{reg.phone}</TableCell>
                              <TableCell>{reg.spouse_name || "-"}</TableCell>
                              <TableCell><Badge variant="outline">{reg.event_name}</Badge></TableCell>
                              <TableCell>{reg.session_date ? formatDate(reg.session_date) : "-"}</TableCell>
                              <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{reg.dynamic_code}</code></TableCell>
                              <TableCell>{getStatusBadge(reg.payment_status)}</TableCell>
                              <TableCell className="text-sm text-gray-500">{formatDateTime(reg.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {filterData(eventRegistrations, searchTerm).length === 0 && (
                        <p className="text-center py-8 text-[#5C3D2E]">No event registrations found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts */}
            <TabsContent value="contacts">
              <Card className="border-[#e8d8c8]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#3D1F0F]">Contacts</CardTitle>
                    <CardDescription>Newsletter sign-ups and contact form submissions</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filterData(contacts, searchTerm), "contacts")}
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
                            <TableHead>Source</TableHead>
                            <TableHead>Confirmed</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(contacts, searchTerm).map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell className="font-medium">{contact.first_name} {contact.last_name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.cellphone || "-"}</TableCell>
                              <TableCell><Badge variant="outline">{contact.source || "Unknown"}</Badge></TableCell>
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
                      {filterData(contacts, searchTerm).length === 0 && (
                        <p className="text-center py-8 text-[#5C3D2E]">No contacts found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
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
    </>
  )
}
