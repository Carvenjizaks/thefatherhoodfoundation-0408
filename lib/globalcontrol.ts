/**
 * GlobalControl CRM Integration
 * API Docs: https://api.globalcontrol.io/ai-api-docs
 * Automatically syncs leads/contacts to GlobalControl CRM on sign-up
 */

const GC_BASE_URL = "https://api.globalcontrol.io/api/ai"
const GC_API_KEY = process.env.GLOBALCONTROL_API_KEY

export interface GlobalControlContact {
  firstName: string
  lastName: string
  email: string
  phone?: string
  tags?: string[]
  source?: string
}

/**
 * Sync a contact to GlobalControl CRM
 * Creates a new contact or updates an existing one
 */
export async function syncContactToGlobalControl(contact: GlobalControlContact): Promise<boolean> {
  if (!GC_API_KEY) {
    console.error("[GlobalControl] API key not set - skipping sync")
    return false
  }

  try {
    const payload: Record<string, unknown> = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
    }

    if (contact.phone) payload.phone = contact.phone
    if (contact.tags && contact.tags.length > 0) payload.tags = contact.tags

    const response = await fetch(`${GC_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": GC_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[GlobalControl] Failed to sync contact:", data)
      return false
    }

    console.log("[GlobalControl] Contact synced successfully:", contact.email)
    return true
  } catch (error) {
    console.error("[GlobalControl] Error syncing contact:", error)
    return false
  }
}

/**
 * Sync a Table Talk event registration to GlobalControl
 */
export async function syncTableTalkRegistration(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  sessionDate: string
}): Promise<boolean> {
  return syncContactToGlobalControl({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    tags: ["table-talk", "event-registration"],
    source: `Table Talk for Men - ${data.sessionDate}`,
  })
}

/**
 * Sync a general event registration to GlobalControl
 */
export async function syncEventRegistration(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  eventName: string
  eventDate: string
}): Promise<boolean> {
  return syncContactToGlobalControl({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    tags: ["event-registration", data.eventName.toLowerCase().replace(/\s+/g, "-")],
    source: `${data.eventName} - ${data.eventDate}`,
  })
}

/**
 * Sync a newsletter/general sign-up to GlobalControl
 */
export async function syncNewsletterSignup(data: {
  firstName: string
  lastName: string
  email: string
  cellphone?: string
  source: string
}): Promise<boolean> {
  return syncContactToGlobalControl({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.cellphone,
    tags: ["newsletter", data.source.replace(/_/g, "-")],
    source: data.source,
  })
}
