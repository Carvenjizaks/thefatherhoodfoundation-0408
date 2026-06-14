export type TriggerType =
  | "event_registered"
  | "contact_created"
  | "tag_added"
  | "manual"
  | "scheduled"

export type ActionType =
  | "send_email"
  | "add_tag"
  | "send_notification"
  | "wait"
  | "webhook"

export interface WorkflowActionConfig {
  subject?: string
  body?: string
  tag?: string
  to?: string
  message?: string
  days?: number
  url?: string
  method?: "GET" | "POST"
  payload?: string
}

export interface WorkflowAction {
  id: string
  type: ActionType
  config: WorkflowActionConfig
}

export interface TriggerConfig {
  event_id?: string
  tag?: string
  schedule?: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  trigger_type: TriggerType
  trigger_config: TriggerConfig
  actions: WorkflowAction[]
  is_active: boolean
  execution_count: number
  last_executed_at?: string
  created_at: string
  updated_at: string
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  contact_id?: string
  contact_email?: string
  status: "pending" | "running" | "completed" | "failed" | "waiting"
  current_action_index: number
  resume_at?: string
  context: Record<string, unknown>
  error?: string
  started_at: string
  completed_at?: string
}

export interface TriggerPayload {
  trigger_type: TriggerType
  contact_email?: string
  contact_id?: string
  event_id?: string
  tag?: string
  context?: Record<string, unknown>
}
