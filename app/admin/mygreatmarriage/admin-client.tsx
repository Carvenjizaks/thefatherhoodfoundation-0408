"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Download, RefreshCw, UserX, Search, Mail, Send } from "lucide-react"
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
  WELCOME: "bg-green-100 text-green-700",
  COUPLES_1: "bg-blue-100 text-blue-700",
  HUSBANDS: "bg-sky-100 text-sky-700",
  WIVES: "bg-pink-100 text-pink-700",
  COUPLES_2: "bg-purple-100 text-purple-700",
  ADMIN: "bg-gray-100 text-gray-700",
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

  return (
    <main className="min-h-screen bg-[#FDF8F3] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574]">Admin</p>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>My Great Marriage Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {selectedSubs.size > 0 && (
              <Button 
                onClick={() => setEmailComposerOpen(true)} 
                className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span> {selectedSubs.size} <span className="hidden sm:inline">Selected</span>
              </Button>
            )}
            <Button onClick={handleExportCsv} variant="outline" className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full bg-transparent flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span> CSV
            </Button>
          </div>
        </div>

        {actionMsg && (
          <div className="bg-white border border-[#e8d8c8] rounded-xl px-5 py-3 text-sm text-[#3D2314]">{actionMsg}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {[
            { label: "Active Subscribers", value: stats.totalActive },
            { label: "Husband Track", value: stats.husbandTrack },
            { label: "Wife Track", value: stats.wifeTrack },
            { label: "Couple Track", value: stats.coupleTrack },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-[#e8d8c8] p-4 sm:p-6 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-bold text-[#8B2B3E]">{stat.value}</p>
              <p className="text-xs text-[#8B6B5A] mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6B5A]" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email address..."
              className="w-full border border-[#e8d8c8] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
          <Button type="submit" disabled={false} className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-lg px-5 flex-1 sm:flex-none">
            Search
          </Button>
            {search && (
              <Button type="button" variant="outline" onClick={() => { setSearchInput(""); router.push("/admin/mygreatmarriage") }} className="border-[#e8d8c8] text-[#6b4c52] rounded-lg bg-transparent">
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Subscriptions Table */}
        <div>
          <h2 className="text-lg font-bold text-[#1a0a0e] mb-4">Recent Subscriptions</h2>
          <div className="bg-white rounded-2xl border border-[#e8d8c8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
<thead>
                <tr className="border-b border-[#e8d8c8] bg-[#fdf8f3]">
                    <th className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSubs.size === subscriptions.length && subscriptions.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-[#e8d8c8] text-[#8B2B3E] accent-[#8B2B3E]"
                      />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Couple</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Progress</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Next Send</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-[#8B6B5A]">No subscriptions found</td></tr>
                  ) : subscriptions.map((sub) => (
                    <tr key={sub.id} className={`border-b border-[#f0e8e0] last:border-none hover:bg-[#fdf8f3] ${selectedSubs.has(sub.id) ? 'bg-[#8B2B3E]/5' : ''}`}>
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSubs.has(sub.id)}
                          onChange={() => toggleSelectSub(sub.id)}
                          className="w-4 h-4 rounded border-[#e8d8c8] text-[#8B2B3E] accent-[#8B2B3E]"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1a0a0e]">{sub.husband_first_name} &amp; {sub.wife_first_name} {sub.husband_last_name}</p>
                        <p className="text-xs text-[#8B6B5A]">{sub.husband_email}</p>
                        <p className="text-xs text-[#8B6B5A]">{sub.wife_email}</p>
                        {!sub.is_active && <span className="text-xs text-red-500 font-medium">Inactive</span>}
                      </td>
                      <td className="px-5 py-4 text-[#6b4c52]">
                        <p>{sub.country}</p>
                        {sub.city && <p className="text-xs text-[#8B6B5A]">{sub.city}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#1a0a0e]">Month {sub.current_month}, Week {sub.current_week_in_cycle}</p>
                        {sub.last_sent_at && <p className="text-xs text-[#8B6B5A]">Last: {new Date(sub.last_sent_at).toLocaleDateString()}</p>}
                      </td>
                      <td className="px-5 py-4 text-[#6b4c52]">
                        {sub.next_send_at ? new Date(sub.next_send_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResendWelcome(sub.id, sub.husband_email, sub.wife_email)}
                            title="Resend welcome email"
                            className="p-1.5 rounded-lg hover:bg-[#8B2B3E]/10 text-[#8B2B3E] transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          {sub.is_active && (
                            <button
                              onClick={() => handleMarkInactive(sub.id)}
                              title="Mark inactive"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
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
        </div>

        {/* Email Logs */}
        <div>
          <h2 className="text-lg font-bold text-[#1a0a0e] mb-4">Recent Email Logs</h2>
          <div className="bg-white rounded-2xl border border-[#e8d8c8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8d8c8] bg-[#fdf8f3]">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Recipient</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Subject</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Sent</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B6B5A]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-[#8B6B5A]">No email logs yet</td></tr>
                  ) : emailLogs.map((log) => (
                    <tr key={log.id} className="border-b border-[#f0e8e0] last:border-none hover:bg-[#fdf8f3]">
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${STREAM_COLORS[log.stream_type] || "bg-gray-100 text-gray-700"}`}>{log.stream_type}</span>
                      </td>
                      <td className="px-5 py-3 text-[#6b4c52] text-xs max-w-[160px] truncate">{log.recipient_email}</td>
                      <td className="px-5 py-3 text-[#1a0a0e] text-xs max-w-[200px] truncate">{log.subject}</td>
                      <td className="px-5 py-3 text-[#8B6B5A] text-xs">{new Date(log.sent_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${log.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
</div>
  
  </div>

      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        recipients={selectedRecipients}
        onSend={handleSendEmail}
      />
    </main>
  )
}
