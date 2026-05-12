/**
 * Centralized tag system for subscribers, registrants, and contacts.
 *
 * Core tags:
 *   - MGM     : MyGreatMarriage subscribers
 *   - FF-NL   : Normal newsletter (Fatherhood Foundation Newsletter)
 *   - TT4Men  : Table Talk for Men registrants
 *   - Event   : Generic event registrant (paired with a specific event tag)
 *
 * Event-specific tags are auto-generated from the event_id / event slug
 * (e.g. "GoC-2026", "MGM-Event-2026").
 */

export type CoreTag = "MGM" | "FF-NL" | "TT4Men" | "Event"

export const CORE_TAGS: CoreTag[] = ["MGM", "FF-NL", "TT4Men", "Event"]

export const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MGM:     { bg: "#8B2B3E15", text: "#8B2B3E", border: "#8B2B3E" },
  "FF-NL": { bg: "#16a34a15", text: "#15803d", border: "#16a34a" },
  TT4Men:  { bg: "#2563eb15", text: "#1d4ed8", border: "#2563eb" },
  Event:   { bg: "#ea580c15", text: "#c2410c", border: "#ea580c" },
}

/** Default color for unknown / event-specific tags */
export const DEFAULT_TAG_COLOR = { bg: "#6b728015", text: "#374151", border: "#6b7280" }

export function getTagColor(tag: string) {
  return TAG_COLORS[tag] || DEFAULT_TAG_COLOR
}

/**
 * Convert a generic `source` + optional `sourceDetails` into an array of tags.
 * Used by createContact() and any unified contact insert.
 */
export function tagsFromSource(source?: string | null, sourceDetails?: string | null): string[] {
  const s = (source || "").toLowerCase()
  const d = (sourceDetails || "").toLowerCase()
  const tags: string[] = []

  if (s.includes("mgm") || s.includes("marriage") || d.includes("marriage") || d.includes("mygreatmarriage")) {
    tags.push("MGM")
  } else if (s.includes("tt4men") || s.includes("table_talk") || s.includes("tabletalk") || d.includes("table talk")) {
    tags.push("TT4Men")
  } else if (s.includes("event") || d.includes("gathering") || d.includes("goc")) {
    tags.push("Event")
  } else if (s.includes("newsletter") || s.includes("ff-nl") || s.includes("ff_nl") || s === "" || s === "homepage") {
    tags.push("FF-NL")
  } else {
    tags.push("FF-NL")
  }

  return tags
}

/**
 * Build tags for an event registration. Always produces ["Event", "<event_slug>"]
 * so admins can target either all event-goers or a specific event.
 */
export function tagsForEvent(eventId?: string | null): string[] {
  const slug = (eventId || "").trim()
  if (!slug) return ["Event"]
  return Array.from(new Set(["Event", slug]))
}

/** Merge two tag arrays, dedupe, and keep CoreTag order first */
export function mergeTags(existing: string[] | null | undefined, incoming: string[]): string[] {
  const set = new Set<string>(existing || [])
  for (const t of incoming) set.add(t)
  const all = Array.from(set)
  // Sort: core tags first (in order), then alphabetical for the rest
  const coreOrder = new Map(CORE_TAGS.map((t, i) => [t as string, i]))
  return all.sort((a, b) => {
    const ai = coreOrder.has(a) ? (coreOrder.get(a) as number) : 100 + a.localeCompare(b)
    const bi = coreOrder.has(b) ? (coreOrder.get(b) as number) : 100 + b.localeCompare(a)
    if (coreOrder.has(a) && coreOrder.has(b)) return (coreOrder.get(a) as number) - (coreOrder.get(b) as number)
    if (coreOrder.has(a)) return -1
    if (coreOrder.has(b)) return 1
    return a.localeCompare(b)
  })
}
