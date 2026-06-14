"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
export const dynamic = "force-dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase-client"
import { WorkflowBuilder } from "@/components/admin/workflow-builder"
import {
  Plus, RefreshCw, Play, Pause, Trash2, Zap, CheckCircle, XCircle, Clock,
  ChevronRight, Activity, LogOut,
} from "lucide-react"
import type { Workflow, WorkflowExecution } from "@/lib/workflows/types"

const TRIGGER_LABELS: Record<string, string> = {
  event_registered: "Event Registration",
  contact_created: "New Contact",
  tag_added: "Tag Added",
  manual: "Manual",
  scheduled: "Scheduled",
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
  failed: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  waiting: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
  running: <Activity className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
  pending: <Clock className="h-3.5 w-3.5 text-gray-400" />,
}

export default function WorkflowsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selected, setSelected] = useState<Workflow | null>(null)
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [editing, setEditing] = useState<Workflow | null>(null)
  const [saving, setSaving] = useState(false)
  const [showExecuteModal, setShowExecuteModal] = useState(false)
  const [executeEmail, setExecuteEmail] = useState("")
  const [executing, setExecuting] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setIsAuthenticated(true)
      await loadWorkflows()
    } else {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => { checkAuth() }, [checkAuth])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoginError(error.message); return }
    setIsAuthenticated(true)
    await loadWorkflows()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setWorkflows([])
    setSelected(null)
  }

  async function loadWorkflows() {
    setIsLoading(true)
    const res = await fetch("/api/admin/workflows")
    if (res.ok) {
      const { workflows } = await res.json()
      setWorkflows(workflows || [])
    }
    setIsLoading(false)
  }

  async function loadExecutions(workflowId: string) {
    const res = await fetch(`/api/admin/workflows/${workflowId}`)
    if (res.ok) {
      const { executions } = await res.json()
      setExecutions(executions || [])
    }
  }

  async function selectWorkflow(w: Workflow) {
    setSelected(w)
    await loadExecutions(w.id)
  }

  async function toggleWorkflow(w: Workflow) {
    const res = await fetch(`/api/admin/workflows/${w.id}/toggle`, { method: "POST" })
    if (res.ok) {
      const { workflow } = await res.json()
      setWorkflows((prev) => prev.map((x) => (x.id === workflow.id ? workflow : x)))
      if (selected?.id === workflow.id) setSelected(workflow)
    }
  }

  async function deleteWorkflow(w: Workflow) {
    if (!confirm(`Delete "${w.name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/workflows/${w.id}`, { method: "DELETE" })
    if (res.ok) {
      setWorkflows((prev) => prev.filter((x) => x.id !== w.id))
      if (selected?.id === w.id) setSelected(null)
    }
  }

  async function handleSave(data: Omit<Workflow, "id" | "created_at" | "updated_at" | "execution_count" | "last_executed_at">) {
    setSaving(true)
    const isEdit = !!editing
    const url = isEdit ? `/api/admin/workflows/${editing!.id}` : "/api/admin/workflows"
    const method = isEdit ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    if (res.ok) {
      const json = await res.json()
      const saved = json.workflow
      if (isEdit) {
        setWorkflows((prev) => prev.map((x) => (x.id === saved.id ? saved : x)))
        if (selected?.id === saved.id) setSelected(saved)
      } else {
        setWorkflows((prev) => [saved, ...prev])
      }
      setShowBuilder(false)
      setEditing(null)
    }
    setSaving(false)
  }

  async function executeManually() {
    if (!selected) return
    setExecuting(true)
    const res = await fetch(`/api/admin/workflows/${selected.id}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_email: executeEmail || undefined }),
    })
    if (res.ok) {
      setShowExecuteModal(false)
      setExecuteEmail("")
      await loadExecutions(selected.id)
    }
    setExecuting(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Admin Sign In</CardTitle>
              <CardDescription>Sign in to manage automation workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-3">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                <Button type="submit" className="w-full bg-[#8B2B3E] hover:bg-[#7a2436] text-white">Sign In</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#8B2B3E]" /> Automation Workflows
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{workflows.length} workflow{workflows.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadWorkflows} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              size="sm"
              className="bg-[#8B2B3E] hover:bg-[#7a2436] text-white"
              onClick={() => { setEditing(null); setShowBuilder(true) }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Workflow
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow list */}
          <div className="lg:col-span-1 space-y-2">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
            ) : workflows.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-gray-500">No workflows yet.</p>
                  <Button
                    size="sm"
                    className="mt-3 bg-[#8B2B3E] hover:bg-[#7a2436] text-white"
                    onClick={() => { setEditing(null); setShowBuilder(true) }}
                  >
                    Create your first workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              workflows.map((w) => (
                <Card
                  key={w.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selected?.id === w.id ? "ring-2 ring-[#8B2B3E]" : ""}`}
                  onClick={() => selectWorkflow(w)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{w.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {TRIGGER_LABELS[w.trigger_type] || w.trigger_type}
                          </Badge>
                          <Badge
                            className={`text-xs px-1.5 py-0 ${w.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                          >
                            {w.is_active ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{w.execution_count} run{w.execution_count !== 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Zap className="h-12 w-12 mx-auto mb-3 opacity-15" />
                  <p className="text-sm text-gray-400">Select a workflow to view details</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Workflow detail header */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">{selected.name}</h2>
                        {selected.description && <p className="text-sm text-gray-500 mt-0.5">{selected.description}</p>}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline">{TRIGGER_LABELS[selected.trigger_type]}</Badge>
                          <Badge className={selected.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500"}>
                            {selected.is_active ? "Active" : "Paused"}
                          </Badge>
                          <span className="text-xs text-gray-400">{selected.execution_count} runs</span>
                          {selected.last_executed_at && (
                            <span className="text-xs text-gray-400">
                              Last: {new Date(selected.last_executed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditing(selected); setShowBuilder(true) }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleWorkflow(selected)}
                        >
                          {selected.is_active ? <><Pause className="h-3.5 w-3.5 mr-1" />Pause</> : <><Play className="h-3.5 w-3.5 mr-1" />Activate</>}
                        </Button>
                        {selected.trigger_type === "manual" && (
                          <Button
                            size="sm"
                            className="bg-[#8B2B3E] hover:bg-[#7a2436] text-white"
                            onClick={() => setShowExecuteModal(true)}
                          >
                            <Play className="h-3.5 w-3.5 mr-1" /> Run
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteWorkflow(selected)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Action chain preview */}
                    {selected.actions.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs font-medium text-gray-500 mb-2">Actions ({selected.actions.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.actions.map((a, i) => (
                            <div key={a.id} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs bg-white">
                                {i + 1}. {a.type === "send_email" ? "Email" : a.type === "add_tag" ? `Tag: ${a.config.tag}` : a.type === "wait" ? `Wait ${a.config.days}d` : a.type === "send_notification" ? "Notify" : "Webhook"}
                              </Badge>
                              {i < selected.actions.length - 1 && <span className="text-gray-300 text-xs">→</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Execution history */}
                <Card>
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Recent Executions</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {executions.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No executions yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {executions.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between py-2 border-b last:border-0 text-xs">
                            <div className="flex items-center gap-2">
                              {STATUS_ICON[ex.status]}
                              <span className="font-medium capitalize">{ex.status}</span>
                              {ex.contact_email && <span className="text-gray-400">{ex.contact_email}</span>}
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                              {ex.error && <span className="text-red-400 truncate max-w-[150px]" title={ex.error}>{ex.error}</span>}
                              <span>{new Date(ex.started_at).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Builder dialog */}
      <Dialog open={showBuilder} onOpenChange={(o) => { if (!o) { setShowBuilder(false); setEditing(null) } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Workflow" : "New Workflow"}</DialogTitle>
          </DialogHeader>
          <WorkflowBuilder
            initial={editing || undefined}
            onSave={handleSave}
            onCancel={() => { setShowBuilder(false); setEditing(null) }}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      {/* Manual execute dialog */}
      <Dialog open={showExecuteModal} onOpenChange={setShowExecuteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Run Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-600">Manually trigger <strong>{selected?.name}</strong>.</p>
            <div>
              <label className="text-xs text-gray-500">Contact email (optional)</label>
              <Input
                value={executeEmail}
                onChange={(e) => setExecuteEmail(e.target.value)}
                placeholder="contact@example.com"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setShowExecuteModal(false)}>Cancel</Button>
              <Button
                onClick={executeManually}
                disabled={executing}
                className="bg-[#8B2B3E] hover:bg-[#7a2436] text-white"
              >
                {executing ? "Running…" : "Run Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
