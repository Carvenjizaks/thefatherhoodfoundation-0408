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

// Allowed admin emails - add your Google email here
const ALLOWED_ADMIN_EMAILS = [
  "carvenjizaks@gmail.com", // Add your email here
]

export default function AdminDashboardPage() {
  const [tableTalkRegistrations, setTableTalkRegistrations] = useState<TableTalkRegistration[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("table-talk")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email
        if (email && ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
          setIsAuthenticated(true)
          setUserEmail(email)
          fetchAllData()
        } else {
          setLoginError("Access denied. Your email is not authorized for admin access.")
          supabase.auth.signOut()
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setUserEmail(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email && ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      setIsAuthenticated(true)
      setUserEmail(user.email)
      fetchAllData()
    } else {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoginError("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    })
    if (error) {
      setLoginError("Failed to sign in with Google. Please try again.")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserEmail(null)
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
              <CardContent className="space-y-4">
                {loginError && (
                  <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{loginError}</p>
                )}
                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
                <p className="text-xs text-center text-[#5C3D2E]/60 mt-4">
                  Admin access only. Use your authorized Google account.
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
