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
  UserPlus,
  ShieldCheck,
  CalendarDays,
  TrendingUp,
  Lock,
  Trash2,
  AlertTriangle,
  Settings,
  UserCog,
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

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "owner" | "staff"
}

interface AdminStaffUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

export default function AdminDashboardPage() {
  const [tableTalkRegistrations, setTableTalkRegistrations] = useState<TableTalkRegistration[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("table-talk")
  const [eventFilter, setEventFilter] = useState("all") // Filter by specific event for check-in

  // Admin users management (owner only)
  const [adminUsers, setAdminUsers] = useState<AdminStaffUser[]>([])
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [addUserForm, setAddUserForm] = useState({ email: "", password: "", firstName: "", lastName: "" })
  const [isAddingUser, setIsAddingUser] = useState(false)

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
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [selectedDonations, setSelectedDonations] = useState<Set<string>>(new Set())

  // Walk-in registration state
  const [addRegDialogOpen, setAddRegDialogOpen] = useState(false)
  const [addRegType, setAddRegType] = useState<"event" | "table-talk">("event")
  const [addRegForm, setAddRegForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", spouseName: "", eventName: ""
  })
  const [isAddingReg, setIsAddingReg] = useState(false)
  const [addRegResult, setAddRegResult] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; table: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
      try {
        const testResponse = await fetch("/api/admin/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (testResponse.status === 401) {
          sessionStorage.removeItem("ff_admin_token")
          sessionStorage.removeItem("ff_admin_auth")
          sessionStorage.removeItem("ff_admin_user")
          setIsAuthenticated(false)
          setCurrentUser(null)
          setIsLoading(false)
          return
        }
        // Restore user info from sessionStorage
        const savedUser = sessionStorage.getItem("ff_admin_user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          setCurrentUser(user)
          // If owner, also fetch admin users
          if (user.role === "owner") {
            fetchAdminUsers(token)
          }
        }
        setIsAuthenticated(true)
        await fetchAllData()
      } catch {
        sessionStorage.removeItem("ff_admin_token")
        sessionStorage.removeItem("ff_admin_auth")
        sessionStorage.removeItem("ff_admin_user")
        setIsAuthenticated(false)
        setCurrentUser(null)
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
        sessionStorage.setItem("ff_admin_token", data.token)
        sessionStorage.setItem("ff_admin_auth", "authenticated")
        sessionStorage.setItem("ff_admin_user", JSON.stringify(data.user))
        setCurrentUser(data.user)
        setIsAuthenticated(true)
        await fetchAllData()
        // If owner, also fetch admin users
        if (data.user.role === "owner") {
          fetchAdminUsers(data.token)
        }
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
    sessionStorage.removeItem("ff_admin_user")
    setIsAuthenticated(false)
    setCurrentUser(null)
    setTableTalkRegistrations([])
    setEventRegistrations([])
    setContacts([])
    setDonations([])
    setAdminUsers([])
  }

  const fetchAdminUsers = async (token?: string) => {
    try {
      const authToken = token || sessionStorage.getItem("ff_admin_token")
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAdminUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching admin users:", error)
    }
  }

  const handleAddUser = async () => {
    if (!addUserForm.email || !addUserForm.password || !addUserForm.firstName || !addUserForm.lastName) return
    setIsAddingUser(true)
    try {
      const response = await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      })
      if (response.ok) {
        setAddUserForm({ email: "", password: "", firstName: "", lastName: "" })
        setAddUserDialogOpen(false)
        fetchAdminUsers()
      }
    } catch (error) {
      console.error("Error adding user:", error)
    } finally {
      setIsAddingUser(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return
    try {
      const response = await adminFetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      })
      if (response.ok) {
        fetchAdminUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [ttResponse, eventResponse, contactsResponse, donationsResponse] = await Promise.all([
        adminFetch("/api/admin/registrations"),
        adminFetch("/api/admin/event-registrations"),
        adminFetch("/api/admin/contacts"),
        adminFetch("/api/admin/donations"),
      ])

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

      if (ttData.registrations) setTableTalkRegistrations(ttData.registrations)
      if (eventData.registrations) setEventRegistrations(eventData.registrations)
      if (contactsData.contacts) setContacts(contactsData.contacts)
      if (donationsData.donations) setDonations(donationsData.donations)
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

  const handleToggleCheckin = async (id: string, currentCheckedIn: boolean, table: string) => {
    const newValue = !currentCheckedIn
    try {
      const response = await adminFetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, table, field: "checked_in", value: newValue }),
      })
      if (response.ok) {
        if (table === "event_registrations") {
          setEventRegistrations(prev => prev.map(r => r.id === id ? { ...r, checked_in: newValue } : r))
        } else if (table === "table_talk_registrations") {
          setTableTalkRegistrations(prev => prev.map(r => r.id === id ? { ...r, checked_in: newValue } : r))
        }
      }
    } catch (error) {
      console.error("Failed to update check-in:", error)
    }
  }

  const handleTogglePayment = async (id: string, currentStatus: string, table: string) => {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid"
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
        } else if (table === "donations") {
          setDonations(prev => prev.map(r => r.id === id ? { ...r, payment_status: newStatus } : r))
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const openAddRegistration = (type: "event" | "table-talk") => {
    setAddRegType(type)
    setAddRegForm({ firstName: "", lastName: "", email: "", phone: "", spouseName: "", eventName: "" })
    setAddRegResult(null)
    setAddRegDialogOpen(true)
  }

  const handleAddRegistration = async () => {
    if (!addRegForm.firstName || !addRegForm.lastName || !addRegForm.email) return
    setIsAddingReg(true)
    setAddRegResult(null)
    try {
      const endpoint = addRegType === "event" ? "/api/events/register" : "/api/table-talk/register"
      const body = addRegType === "event"
        ? {
            firstName: addRegForm.firstName,
            lastName: addRegForm.lastName,
            email: addRegForm.email,
            phone: addRegForm.phone,
            spouseName: addRegForm.spouseName,
            eventName: addRegForm.eventName || "Walk-in Registration",
            eventId: "walk-in",
          }
        : {
            firstName: addRegForm.firstName,
            lastName: addRegForm.lastName,
            email: addRegForm.email,
            phone: addRegForm.phone,
            sessionDate: new Date().toISOString().split("T")[0],
          }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        setAddRegResult({ message: `${addRegForm.firstName} ${addRegForm.lastName} registered successfully!`, type: "success" })
        setAddRegForm({ firstName: "", lastName: "", email: "", phone: "", spouseName: "", eventName: "" })
        await fetchAllData()
        setTimeout(() => setAddRegDialogOpen(false), 2000)
      } else {
        const data = await response.json()
        setAddRegResult({ message: data.error || "Registration failed", type: "error" })
      }
    } catch {
      setAddRegResult({ message: "Failed to register. Please try again.", type: "error" })
    } finally {
      setIsAddingReg(false)
    }
  }

  const openDeleteDialog = (id: string, table: string, name: string) => {
    setDeleteTarget({ id, table, name })
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await adminFetch("/api/admin/delete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id, table: deleteTarget.table }),
      })
      if (response.ok) {
        // Remove from local state
        if (deleteTarget.table === "event_registrations") {
          setEventRegistrations(prev => prev.filter(r => r.id !== deleteTarget.id))
          setSelectedEventRegs(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n })
        } else if (deleteTarget.table === "table_talk_registrations") {
          setTableTalkRegistrations(prev => prev.filter(r => r.id !== deleteTarget.id))
          setSelectedTableTalkRegs(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n })
        } else if (deleteTarget.table === "contacts") {
          setContacts(prev => prev.filter(c => c.id !== deleteTarget.id))
          setSelectedContacts(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n })
        } else if (deleteTarget.table === "donations") {
          setDonations(prev => prev.filter(d => d.id !== deleteTarget.id))
          setSelectedDonations(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n })
        }
        setDeleteDialogOpen(false)
        setDeleteTarget(null)
      }
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "confirmed":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-medium text-xs">Pending</Badge>
      case "unpaid":
        return <Badge className="bg-red-50 text-red-600 border border-red-200 font-medium text-xs">Unpaid</Badge>
      default:
        return <Badge className="bg-red-50 text-red-600 border border-red-200 font-medium text-xs">Unpaid</Badge>
    }
  }

  const openEmailForOne = (email: string, firstName: string, lastName: string) => {
    setEmailRecipients([{ email, firstName, lastName }])
    setEmailSubject("")
    setEmailBody("")
    setEmailResult(null)
    setEmailDialogOpen(true)
  }

  const openEmailForBulk = (recipients: { email: string; firstName: string; lastName: string }[]) => {
    if (recipients.length === 0) return
    setEmailRecipients(recipients)
    setEmailSubject("")
    setEmailBody("")
    setEmailResult(null)
    setEmailDialogOpen(true)
  }

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
          setSelectedContacts(new Set())
          setSelectedDonations(new Set())
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
    if (allSelected) setSelectedEventRegs(new Set())
    else setSelectedEventRegs(new Set(regs.map(r => r.id)))
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
    if (allSelected) setSelectedTableTalkRegs(new Set())
    else setSelectedTableTalkRegs(new Set(regs.map(r => r.id)))
  }

  const toggleContactSelection = (id: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllContacts = (items: Contact[]) => {
    const allSelected = items.every(c => selectedContacts.has(c.id))
    if (allSelected) setSelectedContacts(new Set())
    else setSelectedContacts(new Set(items.map(c => c.id)))
  }

  const toggleDonationSelection = (id: string) => {
    setSelectedDonations(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllDonations = (items: Donation[]) => {
    const allSelected = items.every(d => selectedDonations.has(d.id))
    if (allSelected) setSelectedDonations(new Set())
    else setSelectedDonations(new Set(items.map(d => d.id)))
  }

  const totalCount = tableTalkRegistrations.length + eventRegistrations.length + contacts.length + donations.length

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <div className="w-full max-w-md px-6">
              {/* Top icon */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
              </div>

              <Card className="border-border/60 shadow-lg">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-foreground">Admin Dashboard</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign in with your admin credentials to continue
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground font-medium text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin@fathersfound.org"
                          className="pl-10 border-border bg-secondary/30 focus:bg-background transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground font-medium text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 border-border bg-secondary/30 focus:bg-background transition-colors"
                          required
                        />
                      </div>
                    </div>
                    {loginError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...</>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                  <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-border/50">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Authorized personnel only
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ==================== DASHBOARD ====================
  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary/20 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                  <Badge className="bg-primary/10 text-primary border-0 font-medium text-xs">Admin</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Manage registrations, contacts, and donations across all programs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAllData}
                  disabled={isLoading}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button onClick={() => setActiveTab("table-talk")} className="text-left">
              <Card className={`border transition-all hover:shadow-md cursor-pointer ${activeTab === "table-talk" ? "border-primary/40 shadow-md ring-1 ring-primary/20" : "border-border/60 hover:border-border"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{tableTalkRegistrations.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Table Talk</p>
                </CardContent>
              </Card>
            </button>
            <button onClick={() => setActiveTab("events")} className="text-left">
              <Card className={`border transition-all hover:shadow-md cursor-pointer ${activeTab === "events" ? "border-primary/40 shadow-md ring-1 ring-primary/20" : "border-border/60 hover:border-border"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A574]/15 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{eventRegistrations.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Events</p>
                </CardContent>
              </Card>
            </button>
            <button onClick={() => setActiveTab("contacts")} className="text-left">
              <Card className={`border transition-all hover:shadow-md cursor-pointer ${activeTab === "contacts" ? "border-primary/40 shadow-md ring-1 ring-primary/20" : "border-border/60 hover:border-border"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-sky-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Subscriptions</p>
                </CardContent>
              </Card>
            </button>
            <button onClick={() => setActiveTab("donations")} className="text-left">
              <Card className={`border transition-all hover:shadow-md cursor-pointer ${activeTab === "donations" ? "border-primary/40 shadow-md ring-1 ring-primary/20" : "border-border/60 hover:border-border"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{donations.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Donations</p>
                </CardContent>
              </Card>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border/60 h-10"
                />
              </div>
              {activeTab === "events" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Event:</span>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="h-10 rounded-md border border-border/60 bg-background px-3 text-sm min-w-[200px]"
                  >
                    <option value="all">All Events</option>
                    {(() => {
                      const eventNames = [...new Set(eventRegistrations.map(r => r.event_name || "Unknown Event"))]
                      return eventNames.map(name => (
                        <option key={name} value={name}>{name} ({eventRegistrations.filter(r => (r.event_name || "Unknown Event") === name).length})</option>
                      ))
                    })()}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-background border border-border/60 p-1 h-auto flex-wrap">
              <TabsTrigger value="table-talk" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                Table Talk ({tableTalkRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                Events ({eventRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                Subscriptions ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="donations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                Donations ({donations.length})
              </TabsTrigger>
              {currentUser?.role === "owner" && (
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                  <UserCog className="w-4 h-4 mr-1" />
                  Manage Users
                </TabsTrigger>
              )}
            </TabsList>

            {/* ==================== TABLE TALK TAB ==================== */}
            <TabsContent value="table-talk">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="border-b border-border/40 bg-secondary/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-foreground text-lg">Table Talk Registrations</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">All Table Talk session sign-ups</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => openAddRegistration("table-talk")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                        Walk-in
                      </Button>
                      {selectedTableTalkRegs.size > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const selected = tableTalkRegistrations.filter(r => selectedTableTalkRegs.has(r.id))
                            openEmailForBulk(selected.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Email ({selectedTableTalkRegs.size})
                        </Button>
                      )}
                      {currentUser?.role === "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToCSV(filterData(tableTalkRegistrations, searchTerm), "table-talk-registrations")}
                          className="border-border text-foreground h-8 text-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          CSV
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                      <p className="text-sm text-muted-foreground">Loading registrations...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                            <TableHead className="w-10">
                              <Checkbox
                                checked={filterData(tableTalkRegistrations, searchTerm).length > 0 && filterData(tableTalkRegistrations, searchTerm).every(r => selectedTableTalkRegs.has(r.id))}
                                onCheckedChange={() => toggleAllTableTalk(filterData(tableTalkRegistrations, searchTerm))}
                              />
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check-in</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(tableTalkRegistrations, searchTerm).map((reg) => (
                            <TableRow key={reg.id} className="hover:bg-secondary/10">
                              <TableCell>
                                <Checkbox
                                  checked={selectedTableTalkRegs.has(reg.id)}
                                  onCheckedChange={() => toggleTableTalkSelection(reg.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium text-foreground">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{reg.first_name} {reg.last_name}</span>
                                  <button
                                    onClick={() => openEmailForOne(reg.email, reg.first_name, reg.last_name)}
                                    className="text-primary/60 hover:text-primary transition-colors"
                                    title={`Email ${reg.first_name}`}
                                    aria-label={`Email ${reg.first_name} ${reg.last_name}`}
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{reg.email}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{reg.phone}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{formatDate(reg.session_date)}</TableCell>
                              <TableCell>
                                <code className="text-xs bg-secondary/50 text-foreground px-2 py-0.5 rounded-md font-mono">{reg.dynamic_code}</code>
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleTogglePayment(reg.id, reg.payment_status, "table_talk_registrations")}
                                  className={`cursor-pointer px-2 py-1 rounded-md text-xs font-medium transition-all ${
                                    reg.payment_status === "paid" 
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200" 
                                      : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                                  }`}
                                  title="Click to toggle payment status"
                                >
                                  {reg.payment_status === "paid" ? "Paid" : "Unpaid"}
                                </button>
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleToggleCheckin(reg.id, reg.checked_in, "table_talk_registrations")}
                                  className={`cursor-pointer px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                                    reg.checked_in 
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200" 
                                      : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                  }`}
                                  title={reg.checked_in ? "Click to undo check-in" : "Click to check in"}
                                >
                                  {reg.checked_in ? (
                                    <><CheckCircle className="w-3.5 h-3.5" /> Here</>
                                  ) : (
                                    <><XCircle className="w-3.5 h-3.5" /> Check In</>
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{formatDateTime(reg.created_at)}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() => openDeleteDialog(reg.id, "table_talk_registrations", `${reg.first_name} ${reg.last_name}`)}
                                  className="text-muted-foreground/50 hover:text-red-600 transition-colors p-1 rounded"
                                  title="Delete registration"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {filterData(tableTalkRegistrations, searchTerm).length === 0 && (
                        <div className="text-center py-12">
                          <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No registrations found</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ==================== EVENTS TAB ==================== */}
            <TabsContent value="events">
              <div className="space-y-6">
                {/* Event Overview Mini-Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(() => {
                    const eventCounts = filterData(eventRegistrations, searchTerm).reduce((acc, reg) => {
                      const eventName = reg.event_name || "Unknown Event"
                      acc[eventName] = (acc[eventName] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(eventCounts).map(([eventName, count]) => (
                      <Card key={eventName} className="border-border/60">
                        <CardContent className="p-4 text-center">
                          <p className="text-xl font-bold text-primary">{count}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{eventName}</p>
                        </CardContent>
                      </Card>
                    ))
                  })()}
                </div>

                {/* Bulk Actions Bar */}
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => openAddRegistration("event")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                    Walk-in
                  </Button>
                  {selectedEventRegs.size > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        const selected = eventRegistrations.filter(r => selectedEventRegs.has(r.id))
                        openEmailForBulk(selected.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Email ({selectedEventRegs.size})
                    </Button>
                  )}
                  {currentUser?.role === "owner" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(filterData(eventRegistrations, searchTerm), "all-event-registrations")}
                      className="border-border text-foreground h-8 text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Export All CSV
                    </Button>
                  )}
                </div>

                {/* Segmented Event Cards */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Loading events...</p>
                  </div>
                ) : (
                  (() => {
                    // Apply both search filter and event filter
                    let filteredEvents = filterData(eventRegistrations, searchTerm)
                    if (eventFilter !== "all") {
                      filteredEvents = filteredEvents.filter(r => (r.event_name || "Unknown Event") === eventFilter)
                    }
                    const groupedEvents = filteredEvents.reduce((acc, reg) => {
                      const eventName = reg.event_name || "Unknown Event"
                      if (!acc[eventName]) acc[eventName] = []
                      acc[eventName].push(reg)
                      return acc
                    }, {} as Record<string, typeof eventRegistrations>)

                    const eventOrder = ["MyGreatMarriage 2026", "Gathering of Champions 2026", "Table Talk"]
                    const sortedEventNames = Object.keys(groupedEvents).sort((a, b) => {
                      const indexA = eventOrder.findIndex(e => a.includes(e)) 
                      const indexB = eventOrder.findIndex(e => b.includes(e))
                      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
                      if (indexA === -1) return 1
                      if (indexB === -1) return -1
                      return indexA - indexB
                    })

                    if (sortedEventNames.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No event registrations found</p>
                        </div>
                      )
                    }

                    return sortedEventNames.map((eventName) => {
                      const regs = groupedEvents[eventName]
                      const eventColor = eventName.includes("Marriage") ? "bg-pink-50 text-pink-700 border-pink-200" 
                        : eventName.includes("Champion") || eventName.includes("GOC") ? "bg-sky-50 text-sky-700 border-sky-200"
                        : eventName.includes("Table") ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-secondary text-foreground border-border"

                      return (
                        <Card key={eventName} className="border-border/60 shadow-sm overflow-hidden">
                          <CardHeader className="border-b border-border/40 bg-secondary/30 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <Badge className={`${eventColor} font-medium text-xs border`}>{eventName}</Badge>
                                <span className="text-xs text-muted-foreground">{regs.length} registration{regs.length !== 1 ? "s" : ""}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEmailForBulk(regs.map(r => ({ email: r.email, firstName: r.first_name, lastName: r.last_name })))}
                                  className="border-border text-foreground h-7 text-xs"
                                >
                                  <Mail className="w-3 h-3 mr-1.5" />
                                  Email All
                                </Button>
                                {currentUser?.role === "owner" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportToCSV(regs, `${eventName.toLowerCase().replace(/\s+/g, "-")}-registrations`)}
                                    className="border-border text-foreground h-7 text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1.5" />
                                    Export
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-secondary/10 hover:bg-secondary/10">
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
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spouse</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check-in</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {regs.map((reg) => (
                                    <TableRow key={reg.id} className="hover:bg-secondary/10">
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedEventRegs.has(reg.id)}
                                          onCheckedChange={() => toggleEventRegSelection(reg.id)}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{reg.first_name} {reg.last_name}</span>
                                          <button
                                            onClick={() => openEmailForOne(reg.email, reg.first_name, reg.last_name)}
                                            className="text-primary/60 hover:text-primary transition-colors"
                                            title={`Email ${reg.first_name}`}
                                            aria-label={`Email ${reg.first_name} ${reg.last_name}`}
                                          >
                                            <Mail className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{reg.email}</TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{reg.phone}</TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{reg.spouse_name || "-"}</TableCell>
                                      <TableCell>
                                        <code className="text-xs bg-secondary/50 text-foreground px-2 py-0.5 rounded-md font-mono">{reg.dynamic_code}</code>
                                      </TableCell>
                                      <TableCell>
                                        <button
                                          onClick={() => handleTogglePayment(reg.id, reg.payment_status, "event_registrations")}
                                          className={`cursor-pointer px-2 py-1 rounded-md text-xs font-medium transition-all ${
                                            reg.payment_status === "paid" 
                                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200" 
                                              : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                                          }`}
                                          title="Click to toggle payment status"
                                        >
                                          {reg.payment_status === "paid" ? "Paid" : "Unpaid"}
                                        </button>
                                      </TableCell>
                                      <TableCell>
                                        <button
                                          onClick={() => handleToggleCheckin(reg.id, reg.checked_in, "event_registrations")}
                                          className={`cursor-pointer px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                                            reg.checked_in 
                                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200" 
                                              : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                          }`}
                                          title={reg.checked_in ? "Click to undo check-in" : "Click to check in"}
                                        >
                                          {reg.checked_in ? (
                                            <><CheckCircle className="w-3.5 h-3.5" /> Here</>
                                          ) : (
                                            <><XCircle className="w-3.5 h-3.5" /> Check In</>
                                          )}
                                        </button>
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(reg.created_at)}</TableCell>
                                      <TableCell>
                                        <button
                                          onClick={() => openDeleteDialog(reg.id, "event_registrations", `${reg.first_name} ${reg.last_name}`)}
                                          className="text-muted-foreground/50 hover:text-red-600 transition-colors p-1 rounded"
                                          title="Delete registration"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </TableCell>
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

            {/* ==================== CONTACTS TAB ==================== */}
            <TabsContent value="contacts">
              <div className="space-y-6">
                {/* Source Overview Mini-Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(() => {
                    const sourceCounts = filterData(contacts, searchTerm).reduce((acc, contact) => {
                      const source = contact.source || "Unknown"
                      acc[source] = (acc[source] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(sourceCounts).map(([source, count]) => (
                      <Card key={source} className="border-border/60">
                        <CardContent className="p-4 text-center">
                          <p className="text-xl font-bold text-sky-600">{count}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5 capitalize truncate">{source}</p>
                        </CardContent>
                      </Card>
                    ))
                  })()}
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap justify-end gap-2">
                  {selectedContacts.size > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        const selected = contacts.filter(c => selectedContacts.has(c.id))
                        openEmailForBulk(selected.map(c => ({ email: c.email, firstName: c.first_name, lastName: c.last_name })))
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Email ({selectedContacts.size})
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const filtered = filterData(contacts, searchTerm)
                      openEmailForBulk(filtered.map(c => ({ email: c.email, firstName: c.first_name, lastName: c.last_name })))
                    }}
                    className="border-border text-foreground h-8 text-xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Email All ({filterData(contacts, searchTerm).length})
                  </Button>
                  {currentUser?.role === "owner" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(filterData(contacts, searchTerm), "all-contacts-subscriptions")}
                      className="border-border text-foreground h-8 text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Export All CSV
                    </Button>
                  )}
                </div>

                {/* Categorized by Source */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Loading contacts...</p>
                  </div>
                ) : (
                  (() => {
                    const filteredContacts = filterData(contacts, searchTerm)
                    const groupedContacts = filteredContacts.reduce((acc, contact) => {
                      const source = contact.source || "Unknown"
                      if (!acc[source]) acc[source] = []
                      acc[source].push(contact)
                      return acc
                    }, {} as Record<string, typeof contacts>)

                    const sourceOrder = ["Newsletter", "Contact Form", "Event Registration", "Table Talk", "Popup"]
                    const sortedSourceNames = Object.keys(groupedContacts).sort((a, b) => {
                      const indexA = sourceOrder.findIndex(s => a.toLowerCase().includes(s.toLowerCase()))
                      const indexB = sourceOrder.findIndex(s => b.toLowerCase().includes(s.toLowerCase()))
                      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
                      if (indexA === -1) return 1
                      if (indexB === -1) return -1
                      return indexA - indexB
                    })

                    if (sortedSourceNames.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <Mail className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No contacts found</p>
                        </div>
                      )
                    }

                    return sortedSourceNames.map((source) => {
                      const sourceContacts = groupedContacts[source]
                      const sourceColor = source.toLowerCase().includes("newsletter") ? "bg-sky-50 text-sky-700 border-sky-200"
                        : source.toLowerCase().includes("contact") ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : source.toLowerCase().includes("event") ? "bg-pink-50 text-pink-700 border-pink-200"
                        : source.toLowerCase().includes("table") ? "bg-amber-50 text-amber-700 border-amber-200"
                        : source.toLowerCase().includes("popup") ? "bg-violet-50 text-violet-700 border-violet-200"
                        : "bg-secondary text-foreground border-border"

                      return (
                        <Card key={source} className="border-border/60 shadow-sm overflow-hidden">
                          <CardHeader className="border-b border-border/40 bg-secondary/30 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <Badge className={`${sourceColor} font-medium text-xs border`}>{source}</Badge>
                                <span className="text-xs text-muted-foreground">{sourceContacts.length} subscription{sourceContacts.length !== 1 ? "s" : ""}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEmailForBulk(sourceContacts.map(c => ({ email: c.email, firstName: c.first_name, lastName: c.last_name })))}
                                  className="border-border text-foreground h-7 text-xs"
                                >
                                  <Mail className="w-3 h-3 mr-1.5" />
                                  Email All
                                </Button>
                                {currentUser?.role === "owner" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportToCSV(sourceContacts, `${source.toLowerCase().replace(/\s+/g, "-")}-contacts`)}
                                    className="border-border text-foreground h-7 text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1.5" />
                                    Export
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-secondary/10 hover:bg-secondary/10">
                                    <TableHead className="w-10">
                                      <Checkbox
                                        checked={sourceContacts.every(c => selectedContacts.has(c.id))}
                                        onCheckedChange={() => {
                                          const allSelected = sourceContacts.every(c => selectedContacts.has(c.id))
                                          setSelectedContacts(prev => {
                                            const next = new Set(prev)
                                            sourceContacts.forEach(c => {
                                              if (allSelected) next.delete(c.id)
                                              else next.add(c.id)
                                            })
                                            return next
                                          })
                                        }}
                                      />
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirmed</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {sourceContacts.map((contact) => (
                                    <TableRow key={contact.id} className="hover:bg-secondary/10">
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedContacts.has(contact.id)}
                                          onCheckedChange={() => toggleContactSelection(contact.id)}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{contact.first_name} {contact.last_name}</span>
                                          <button
                                            onClick={() => openEmailForOne(contact.email, contact.first_name, contact.last_name)}
                                            className="text-primary/60 hover:text-primary transition-colors"
                                            title={`Email ${contact.first_name}`}
                                            aria-label={`Email ${contact.first_name} ${contact.last_name}`}
                                          >
                                            <Mail className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{contact.email}</TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{contact.cellphone || "-"}</TableCell>
                                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{contact.source_details || "-"}</TableCell>
                                      <TableCell>
                                        {contact.email_confirmed ? (
                                          <div className="flex items-center gap-1.5">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs text-emerald-700 font-medium sr-only">Confirmed</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            <span className="text-xs text-amber-600 sr-only">Pending</span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(contact.created_at)}</TableCell>
                                      <TableCell>
                                        <button
                                          onClick={() => openDeleteDialog(contact.id, "contacts", `${contact.first_name} ${contact.last_name}`)}
                                          className="text-muted-foreground/50 hover:text-red-600 transition-colors p-1 rounded"
                                          title="Delete contact"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </TableCell>
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

            {/* ==================== DONATIONS TAB ==================== */}
            <TabsContent value="donations">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="border-b border-border/40 bg-secondary/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-foreground text-lg">Donations</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">All donation pledges and payments</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDonations.size > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const selected = donations.filter(d => selectedDonations.has(d.id))
                            openEmailForBulk(selected.map(d => ({ email: d.email, firstName: d.first_name, lastName: d.last_name })))
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Email ({selectedDonations.size})
                        </Button>
                      )}
                      {currentUser?.role === "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToCSV(filterData(donations, searchTerm), "donations")}
                          className="border-border text-foreground h-8 text-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Export CSV
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                      <p className="text-sm text-muted-foreground">Loading donations...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                            <TableHead className="w-10">
                              <Checkbox
                                checked={filterData(donations, searchTerm).length > 0 && filterData(donations, searchTerm).every(d => selectedDonations.has(d.id))}
                                onCheckedChange={() => toggleAllDonations(filterData(donations, searchTerm))}
                              />
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Frequency</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterData(donations, searchTerm).map((donation) => (
                            <TableRow key={donation.id} className="hover:bg-secondary/10">
                              <TableCell>
                                <Checkbox
                                  checked={selectedDonations.has(donation.id)}
                                  onCheckedChange={() => toggleDonationSelection(donation.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium text-foreground">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{donation.first_name} {donation.last_name}</span>
                                  <button
                                    onClick={() => openEmailForOne(donation.email, donation.first_name, donation.last_name)}
                                    className="text-primary/60 hover:text-primary transition-colors"
                                    title={`Email ${donation.first_name}`}
                                    aria-label={`Email ${donation.first_name} ${donation.last_name}`}
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{donation.email}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{donation.phone || "-"}</TableCell>
                              <TableCell>
                                <span className="font-semibold text-emerald-700 text-sm">
                                  {donation.currency} {donation.amount?.toLocaleString()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs font-medium border-border">{donation.frequency || "Once-off"}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{donation.payment_method || "-"}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleTogglePayment(donation.id, donation.payment_status, "donations")}
                                  className="cursor-pointer"
                                  title="Click to toggle payment status"
                                >
                                  {getStatusBadge(donation.payment_status)}
                                </button>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{formatDateTime(donation.created_at)}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() => openDeleteDialog(donation.id, "donations", `${donation.first_name} ${donation.last_name}`)}
                                  className="text-muted-foreground/50 hover:text-red-600 transition-colors p-1 rounded"
                                  title="Delete donation"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {filterData(donations, searchTerm).length === 0 && (
                        <div className="text-center py-12">
                          <DollarSign className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No donations found</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ==================== MANAGE USERS TAB (Owner Only) ==================== */}
            {currentUser?.role === "owner" && (
              <TabsContent value="users">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="border-b border-border/40 bg-secondary/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-foreground text-lg flex items-center gap-2">
                          <UserCog className="w-5 h-5" />
                          Admin User Management
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          Add staff members who can manage registrations and check-ins (only you can export data)
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setAddUserDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Staff User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {adminUsers.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No staff users yet. Add staff to help manage events.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {adminUsers.map((user) => (
                          <div
                            key={user.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              user.role === "owner" ? "bg-primary/5 border-primary/20" : "bg-secondary/20 border-border/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                user.role === "owner" ? "bg-primary/20" : "bg-secondary"
                              }`}>
                                {user.role === "owner" ? (
                                  <ShieldCheck className="w-5 h-5 text-primary" />
                                ) : (
                                  <Users className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.first_name} {user.last_name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={user.role === "owner" ? "default" : "secondary"} className="capitalize">
                                {user.role}
                              </Badge>
                              {user.role !== "owner" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* ==================== EMAIL COMPOSE DIALOG ==================== */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              {emailRecipients.length === 1 ? "Send Email" : `Broadcast to ${emailRecipients.length} Recipients`}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {emailRecipients.length === 1
                ? `To: ${emailRecipients[0].firstName} ${emailRecipients[0].lastName} (${emailRecipients[0].email})`
                : `Sending to ${emailRecipients.length} people`}
            </DialogDescription>
          </DialogHeader>

          {emailRecipients.length > 1 && (
            <div className="max-h-24 overflow-y-auto bg-secondary/30 rounded-lg p-3 border border-border/40">
              <div className="flex flex-wrap gap-1.5">
                {emailRecipients.map((r, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-background border-border">
                    {r.firstName} {r.lastName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="text-foreground font-medium text-sm">Subject</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Payment Confirmation Required"
                className="border-border bg-secondary/30 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body" className="text-foreground font-medium text-sm">Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                className="border-border bg-secondary/30 focus:bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Each recipient will be addressed by name automatically.
              </p>
            </div>

            {emailResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
                emailResult.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {emailResult.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{emailResult.message}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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

      {/* ==================== WALK-IN REGISTRATION DIALOG ==================== */}
      <Dialog open={addRegDialogOpen} onOpenChange={setAddRegDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-emerald-700" />
              </div>
              Add Walk-in Registration
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {addRegType === "event" ? "Register a walk-in attendee for an event" : "Register a walk-in attendee for Table Talk"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {addRegType === "event" && (
              <div className="space-y-2">
                <Label htmlFor="add-event" className="text-foreground font-medium text-sm">Event</Label>
                <select
                  id="add-event"
                  value={addRegForm.eventName}
                  onChange={(e) => setAddRegForm(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  <option value="">Select an event...</option>
                  <option value="MyGreatMarriage 2026">MyGreatMarriage 2026</option>
                  <option value="Gathering of Champions 2026">Gathering of Champions 2026</option>
                  <option value="Table Talk">Table Talk</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-first" className="text-foreground font-medium text-sm">First Name *</Label>
                <Input
                  id="add-first"
                  value={addRegForm.firstName}
                  onChange={(e) => setAddRegForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  className="border-border bg-secondary/30 focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-last" className="text-foreground font-medium text-sm">Last Name *</Label>
                <Input
                  id="add-last"
                  value={addRegForm.lastName}
                  onChange={(e) => setAddRegForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  className="border-border bg-secondary/30 focus:bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email" className="text-foreground font-medium text-sm">Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={addRegForm.email}
                onChange={(e) => setAddRegForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
                className="border-border bg-secondary/30 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone" className="text-foreground font-medium text-sm">Phone</Label>
              <Input
                id="add-phone"
                value={addRegForm.phone}
                onChange={(e) => setAddRegForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+264 81 234 5678"
                className="border-border bg-secondary/30 focus:bg-background"
              />
            </div>
            {addRegType === "event" && (
              <div className="space-y-2">
                <Label htmlFor="add-spouse" className="text-foreground font-medium text-sm">Spouse Name (optional)</Label>
                <Input
                  id="add-spouse"
                  value={addRegForm.spouseName}
                  onChange={(e) => setAddRegForm(prev => ({ ...prev, spouseName: e.target.value }))}
                  placeholder="Spouse full name"
                  className="border-border bg-secondary/30 focus:bg-background"
                />
              </div>
            )}

            {addRegResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
                addRegResult.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {addRegResult.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{addRegResult.message}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddRegDialogOpen(false)} className="border-border">
                Cancel
              </Button>
              <Button
                onClick={handleAddRegistration}
                disabled={isAddingReg || !addRegForm.firstName.trim() || !addRegForm.lastName.trim() || !addRegForm.email.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isAddingReg ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Registering...</>
                ) : (
                  <><UserPlus className="w-4 h-4 mr-2" /> Register</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open)
        if (!open) setDeleteTarget(null)
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {deleteTarget && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">{deleteTarget.name}</p>
                <p className="text-xs text-red-600 mt-1">This record will be permanently removed.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setDeleteDialogOpen(false); setDeleteTarget(null) }} 
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Deleting...</>
              ) : (
                <><Trash2 className="w-4 h-4 mr-2" /> Delete</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Staff User Dialog (Owner Only) */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              Add Staff User
            </DialogTitle>
            <DialogDescription>
              Staff users can manage registrations and check-ins but cannot export data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="staff-first" className="text-foreground font-medium text-sm">First Name</Label>
                <Input
                  id="staff-first"
                  value={addUserForm.firstName}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  className="border-border bg-secondary/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-last" className="text-foreground font-medium text-sm">Last Name</Label>
                <Input
                  id="staff-last"
                  value={addUserForm.lastName}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  className="border-border bg-secondary/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email" className="text-foreground font-medium text-sm">Username / Email</Label>
              <Input
                id="staff-email"
                value={addUserForm.email}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="staff_username"
                className="border-border bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-password" className="text-foreground font-medium text-sm">Password</Label>
              <Input
                id="staff-password"
                type="password"
                value={addUserForm.password}
                onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Set a secure password"
                className="border-border bg-secondary/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={isAddingUser || !addUserForm.email || !addUserForm.password || !addUserForm.firstName || !addUserForm.lastName}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isAddingUser ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Add User</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
