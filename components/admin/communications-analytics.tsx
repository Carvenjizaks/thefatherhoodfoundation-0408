"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
  Mail, MousePointerClick, Eye, AlertCircle, Users, TrendingUp,
  RefreshCw, ChevronRight, Clock,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

type CampaignSummary = {
  id: string
  name: string
  subject: string
  status: string
  send_to_type: string
  send_to_value: string | null
  total_recipients: number
  sent_count: number
  sent_at: string | null
  created_at: string
  delivered_count: number
  opened_count: number
  clicked_count: number
  failed_count: number
  unopened_count: number
}

type RecipientLog = {
  id: string
  email: string
  first_name: string | null
  status: string
  sent_at: string | null
  opened_at: string | null
  click_count: number
  last_clicked_at: string | null
  error: string | null
}

type ClickEvent = {
  id: string
  email: string
  original_url: string
  clicked_at: string
}

type CampaignDetail = {
  campaign: CampaignSummary
  logs: RecipientLog[]
  clicks: ClickEvent[]
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: "bg-green-100 text-green-800",
    sending: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-700",
    failed: "bg-red-100 text-red-800",
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  )
}

function RecipientStatus({ log }: { log: RecipientLog }) {
  if (log.status === "failed") return <span className="text-xs text-red-600 font-medium">Failed</span>
  if (log.click_count > 0) return <span className="text-xs text-purple-700 font-medium">Clicked ({log.click_count}x)</span>
  if (log.opened_at) return <span className="text-xs text-green-700 font-medium">Opened</span>
  if (log.status === "sent") return <span className="text-xs text-amber-600 font-medium">Unopened</span>
  return <span className="text-xs text-gray-500">Pending</span>
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
  color: string
}) {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function CommunicationsAnalytics({ adminFetch }: { adminFetch: (url: string, options?: RequestInit) => Promise<Response> }) {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<CampaignDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/admin/campaigns")
      const json = await res.json()
      setCampaigns(json.campaigns || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [adminFetch])

  useEffect(() => { load() }, [load])

  const openDetail = async (campaign: CampaignSummary) => {
    setDetailLoading(true)
    try {
      const res = await adminFetch(`/api/admin/campaigns/${campaign.id}`)
      const json = await res.json()
      setSelected(json)
    } catch {
      // silently fail
    } finally {
      setDetailLoading(false)
    }
  }

  // Aggregate stats across all campaigns
  const totals = campaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + (c.sent_count || 0),
      opened: acc.opened + (c.opened_count || 0),
      clicked: acc.clicked + (c.clicked_count || 0),
      failed: acc.failed + (c.failed_count || 0),
    }),
    { sent: 0, opened: 0, clicked: 0, failed: 0 }
  )

  const overallOpenRate = totals.sent > 0 ? Math.round((totals.opened / totals.sent) * 100) : 0
  const overallClickRate = totals.sent > 0 ? Math.round((totals.clicked / totals.sent) * 100) : 0

  // Chart data — last 8 campaigns
  const chartData = [...campaigns]
    .filter(c => c.status === "sent")
    .slice(0, 8)
    .reverse()
    .map(c => ({
      name: c.name.length > 14 ? c.name.slice(0, 14) + "…" : c.name,
      Sent: c.sent_count || 0,
      Opened: c.opened_count || 0,
      Clicked: c.clicked_count || 0,
    }))

  // Dormant contacts = sent emails but never opened any
  const dormantEmails = selected
    ? selected.logs.filter(l => l.status === "sent" && !l.opened_at)
    : []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Email Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} total</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Global stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Mail} label="Total Sent" value={totals.sent} color="bg-primary" />
        <StatCard icon={Eye} label="Total Opened" value={totals.opened} sub={`${overallOpenRate}% open rate`} color="bg-blue-500" />
        <StatCard icon={MousePointerClick} label="Total Clicked" value={totals.clicked} sub={`${overallClickRate}% click rate`} color="bg-purple-500" />
        <StatCard icon={AlertCircle} label="Failed" value={totals.failed} color="bg-red-500" />
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Campaign Performance (last {chartData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="Sent" fill="#8B2B3E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Opened" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Clicked" fill="#a855f7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground justify-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Sent</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Opened</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /> Clicked</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns table */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground p-4">Loading...</p>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No campaigns yet. Send your first email to see analytics.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Campaign</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                  <TableHead className="text-xs text-center">Recipients</TableHead>
                  <TableHead className="text-xs text-center">Open Rate</TableHead>
                  <TableHead className="text-xs text-center">Click Rate</TableHead>
                  <TableHead className="text-xs text-right">Sent</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(c => {
                  const openRate = c.sent_count > 0 ? Math.round((c.opened_count / c.sent_count) * 100) : 0
                  const clickRate = c.sent_count > 0 ? Math.round((c.clicked_count / c.sent_count) * 100) : 0
                  return (
                    <TableRow key={c.id} className="cursor-pointer hover:bg-muted/30" onClick={() => openDetail(c)}>
                      <TableCell className="py-2">
                        <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{c.subject}</p>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-center text-sm py-2">
                        <span className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          {c.sent_count || c.total_recipients}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-semibold text-blue-600">{openRate}%</span>
                          <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${openRate}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-semibold text-purple-600">{clickRate}%</span>
                          <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${clickRate}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground py-2">
                        {c.sent_at ? formatDistanceToNow(new Date(c.sent_at), { addSuffix: true }) : "—"}
                      </TableCell>
                      <TableCell className="py-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Campaign detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {detailLoading || !selected ? (
            <p className="text-sm text-muted-foreground p-4">Loading...</p>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selected.campaign.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selected.campaign.subject}</p>
              </DialogHeader>

              {/* Mini stat row */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { label: "Sent", value: selected.campaign.sent_count, color: "text-foreground" },
                  { label: "Opened", value: selected.campaign.opened_count, color: "text-blue-600" },
                  { label: "Clicked", value: selected.campaign.clicked_count, color: "text-purple-600" },
                  { label: "Failed", value: selected.campaign.failed_count, color: "text-red-600" },
                ].map(s => (
                  <div key={s.label} className="text-center bg-muted/30 rounded-lg p-2">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Dormant alert */}
              {dormantEmails.length > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      {dormantEmails.length} dormant recipient{dormantEmails.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-amber-700">These contacts received the email but never opened it.</p>
                  </div>
                </div>
              )}

              {/* Per-recipient table */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recipients</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Recipient</TableHead>
                      <TableHead className="text-xs text-center">Status</TableHead>
                      <TableHead className="text-xs text-center">Opened</TableHead>
                      <TableHead className="text-xs text-center">Clicks</TableHead>
                      <TableHead className="text-xs text-right">Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.logs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="py-1.5">
                          <p className="text-sm font-medium">{log.first_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{log.email}</p>
                        </TableCell>
                        <TableCell className="text-center py-1.5">
                          <RecipientStatus log={log} />
                        </TableCell>
                        <TableCell className="text-center text-xs py-1.5 text-muted-foreground">
                          {log.opened_at ? format(new Date(log.opened_at), "MMM d, h:mm a") : "—"}
                        </TableCell>
                        <TableCell className="text-center py-1.5">
                          {log.click_count > 0 ? (
                            <Badge variant="secondary" className="text-xs">{log.click_count}x</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground py-1.5">
                          {log.last_clicked_at
                            ? formatDistanceToNow(new Date(log.last_clicked_at), { addSuffix: true })
                            : log.opened_at
                            ? formatDistanceToNow(new Date(log.opened_at), { addSuffix: true })
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Link clicks */}
              {selected.clicks.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Link Clicks</p>
                  <div className="space-y-1">
                    {selected.clicks.map(click => (
                      <div key={click.id} className="flex items-center justify-between text-xs bg-muted/30 rounded px-3 py-2">
                        <span className="font-medium text-foreground truncate max-w-[300px]">{click.email}</span>
                        <span className="text-muted-foreground truncate max-w-[200px] mx-2">{click.original_url}</span>
                        <span className="text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(click.clicked_at), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
