"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  Download, 
  UserX, 
  Search, 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight
} from "lucide-react"
import EmailComposer from "@/components/admin/email-composer"

type Subscription = Record<string, any>
type EmailLog = Record<string, any>

interface Stats {
  totalActive: number
  husbandTrack: number
  wifeTrack: number
  coupleTrack: number
}

const STREAM_COLORS: Record<string, string> = {
  WELCOME: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  COUPLES_1: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  HUSBANDS: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  WIVES: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  COUPLES_2: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  ADMIN: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
}

export default function AdminDashboardClient({
  stats,
  subscriptions,
  emailLogs,
  search,
}: {
  stats: Stats
  subscriptions: Subscription[]
  emailLogs: EmailLog[]
  search: string
}) {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState(search)
  const [actionMsg, setActionMsg] = useState("")
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set())
  const [emailComposerOpen, setEmailComposerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"subscribers" | "emails">("subscribers")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin/mygreatmarriage?search=${encodeURIComponent(searchInput)}`)
  }

  async function handleResendWelcome(subId: string, husbandEmail: string, wifeEmail: string) {
    setActionMsg("")
    const res = await fetch("/api/mgm/admin-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resend_welcome", subId }),
    })
    if (res.ok) {
      setActionMsg(`Welcome email resent to ${husbandEmail} and ${wifeEmail}`)
    } else {
      setActionMsg("Failed to resend welcome email")
    }
  }

  async function handleMarkInactive(subId: string) {
    if (!confirm("Mark this subscription as inactive?")) return
    setActionMsg("")
    const res = await fetch("/api/mgm/admin-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_inactive", subId }),
    })
    if (res.ok) {
      setActionMsg("Subscription marked inactive")
      router.refresh()
    } else {
      setActionMsg("Failed to update subscription")
    }
  }

  function handleExportCsv() {
    window.location.href = "/api/mgm/export-csv"
  }

  function toggleSelectSub(subId: string) {
    setSelectedSubs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subId)) {
        newSet.delete(subId)
      } else {
        newSet.add(subId)
      }
      return newSet
    })
  }

  function toggleSelectAll() {
    if (selectedSubs.size === subscriptions.length) {
      setSelectedSubs(new Set())
    } else {
      setSelectedSubs(new Set(subscriptions.map(s => s.id)))
    }
  }

  const selectedRecipients = subscriptions
    .filter(s => selectedSubs.has(s.id))
    .flatMap(s => [
      { id: s.id, email: s.husband_email, name: `${s.husband_first_name} ${s.husband_last_name}`, gender: "male" as const },
      { id: s.id, email: s.wife_email, name: `${s.wife_first_name} ${s.husband_last_name}`, gender: "female" as const },
    ])

  async function handleSendEmail(data: { subject: string; body: string; fontFamily: string; fontSize: string; fontColor: string; scheduledAt: string | null; recipients: string[]; recipientType: "all" | "men" | "women" }) {
    setActionMsg("")
    const res = await fetch("/api/mgm/admin-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send_bulk_email",
        subIds: data.recipients,
        subject: data.subject,
        body: data.body,
        scheduledAt: data.scheduledAt,
        recipientType: data.recipientType,
      }),
    })
    if (res.ok) {
      const recipientLabel = data.recipientType === "men" ? "men" : data.recipientType === "women" ? "women" : "participants"
      const scheduledMsg = data.scheduledAt 
        ? `Email scheduled for ${new Date(data.scheduledAt).toLocaleString()} (${recipientLabel})`
        : `Email sent to ${data.recipients.length} subscription(s) (${recipientLabel})`
      setActionMsg(scheduledMsg)
      setSelectedSubs(new Set())
    } else {
      throw new Error("Failed to send email")
    }
  }

  function handleLogout() {
    document.cookie = "mgm_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/mygreatmarriage/login")
  }

  const statCards = [
    { label: "Active Subscribers", value: stats.totalActive, icon: Users, color: "from-rose-500 to-pink-600" },
    { label: "Husband Track", value: stats.husbandTrack, icon: TrendingUp, color: "from-blue-500 to-cyan-600" },
    { label: "Wife Track", value: stats.wifeTrack, icon: Calendar, color: "from-purple-500 to-violet-600" },
    { label: "Couple Track", value: stats.coupleTrack, icon: BarChart3, color: "from-amber-500 to-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-white">My Great Marriage</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Admin Dashboard</p>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "subscribers" 
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5" />
              Subscribers
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === "subscribers" ? "rotate-90" : ""}`} />
            </button>
            <button
              onClick={() => setActiveTab("emails")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "emails" 
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              Email Logs
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === "emails" ? "rotate-90" : ""}`} />
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-zinc-800 space-y-2">
            <button
              onClick={handleExportCsv}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {activeTab === "subscribers" ? "Subscribers" : "Email Logs"}
                </h2>
                <p className="text-xs text-zinc-500">
                  {activeTab === "subscribers" 
                    ? `${stats.totalActive} active subscribers` 
                    : `${emailLogs.length} recent emails`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedSubs.size > 0 && (
                <Button 
                  onClick={() => setEmailComposerOpen(true)} 
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-rose-500/25"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Email</span> {selectedSubs.size}
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Action Message */}
          {actionMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-sm text-emerald-400">
              {actionMsg}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div 
                key={stat.label} 
                className="relative overflow-hidden bg-zinc-900 rounded-2xl border border-zinc-800 p-5 group hover:border-zinc-700 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          {activeTab === "subscribers" && (
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by email address..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/40 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-6 flex-1 sm:flex-none border border-zinc-700"
                >
                  Search
                </Button>
                {search && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setSearchInput(""); router.push("/admin/mygreatmarriage") }} 
                    className="border-zinc-700 text-zinc-400 rounded-xl bg-transparent hover:bg-zinc-800 hover:text-white"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Content */}
          {activeTab === "subscribers" ? (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSubs.size === subscriptions.length && subscriptions.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-rose-500/40"
                        />
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Couple</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Location</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden lg:table-cell">Progress</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Next Send</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {subscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-zinc-500">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No subscriptions found</p>
                        </td>
                      </tr>
                    ) : subscriptions.map((sub) => (
                      <tr 
                        key={sub.id} 
                        className={`hover:bg-zinc-800/50 transition-colors ${selectedSubs.has(sub.id) ? 'bg-rose-500/5' : ''}`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubs.has(sub.id)}
                            onChange={() => toggleSelectSub(sub.id)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-rose-500/40"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">{sub.husband_first_name} &amp; {sub.wife_first_name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{sub.husband_email}</p>
                          <p className="text-xs text-zinc-500">{sub.wife_email}</p>
                          {!sub.is_active && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-zinc-300">{sub.country}</p>
                          {sub.city && <p className="text-xs text-zinc-500">{sub.city}</p>}
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <p className="text-zinc-300">Month {sub.current_month}, Week {sub.current_week_in_cycle}</p>
                          {sub.last_sent_at && (
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Last: {new Date(sub.last_sent_at).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 hidden sm:table-cell">
                          {sub.next_send_at ? new Date(sub.next_send_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleResendWelcome(sub.id, sub.husband_email, sub.wife_email)}
                              title="Resend welcome email"
                              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            {sub.is_active && (
                              <button
                                onClick={() => handleMarkInactive(sub.id)}
                                title="Mark inactive"
                                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Type</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Recipient</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Subject</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Sent</th>
                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {emailLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-zinc-500">
                          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No email logs yet</p>
                        </td>
                      </tr>
                    ) : emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${STREAM_COLORS[log.stream_type] || "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"}`}>
                            {log.stream_type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-300 text-xs max-w-[180px] truncate">
                          {log.recipient_email}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 text-xs max-w-[220px] truncate hidden md:table-cell">
                          {log.subject}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 text-xs hidden sm:table-cell">
                          {new Date(log.sent_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${
                            log.status === "sent" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        recipients={selectedRecipients}
        onSend={handleSendEmail}
      />
    </div>
  )
}
