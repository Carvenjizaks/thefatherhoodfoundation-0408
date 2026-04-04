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
import { createClient } from "@/lib/supabase-client"
import { Search, Download, RefreshCw, LogOut } from "lucide-react"

interface Registration {
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
  created_at: string
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = registrations.filter(
        (reg) =>
          reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.dynamic_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRegistrations(filtered)
    } else {
      setFilteredRegistrations(registrations)
    }
  }, [searchTerm, registrations])

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
      const response = await fetch("/api/admin/registrations")
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
    const headers = ["Name", "Email", "Phone", "Session Date", "Dynamic Code", "Payment Status", "Registered At"]
    const rows = filteredRegistrations.map((reg) => [
      `${reg.first_name} ${reg.last_name}`,
      reg.email,
      reg.phone,
      new Date(reg.session_date).toLocaleDateString(),
      reg.dynamic_code,
      reg.payment_status,
      new Date(reg.created_at).toLocaleString(),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `table-talk-registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
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
                  Sign in to access the registration dashboard
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
      <main className="pt-20 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Table Talk Registrations</h1>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Session Date</TableHead>
                        <TableHead>Dynamic Code</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">
                            {reg.first_name} {reg.last_name}
                          </TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.phone}</TableCell>
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
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(reg.created_at).toLocaleDateString()}
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
