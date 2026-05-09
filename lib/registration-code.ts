/**
 * Event slug to abbreviation mapping
 */
const EVENT_ABBREVIATIONS: Record<string, string> = {
  'my-great-marriage-2026': 'MGM',
  'my-great-marriage': 'MGM',
  'table-talk-for-men': 'TT4M',
  'tabletalk-for-men': 'TT4M',
  'mentoring-men': 'MM',
  'world-youth-conference': 'WYC',
  'family-conference': 'FC',
  'leaders-summit': 'LS',
}

/**
 * Gets the event abbreviation from the event slug
 * Falls back to first 3 letters of slug uppercase if not mapped
 */
export function getEventAbbreviation(eventSlug: string): string {
  const normalized = eventSlug.toLowerCase().trim()
  
  // Check exact match first
  if (EVENT_ABBREVIATIONS[normalized]) {
    return EVENT_ABBREVIATIONS[normalized]
  }
  
  // Check partial match
  for (const [key, abbrev] of Object.entries(EVENT_ABBREVIATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return abbrev
    }
  }
  
  // Fallback: take first letters of each word, max 4 chars
  const words = normalized.split(/[-_\s]+/)
  const fallback = words
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4)
  
  return fallback || 'EVT'
}

/**
 * Generates a sequential registration code
 * Format: PREFIX-XX (e.g., MGM-01, TT4M-02)
 * 
 * @param eventSlug - The event slug to generate abbreviation from
 * @param currentMax - The current highest registration number for this event
 * @returns The next sequential registration code
 */
export function generateRegistrationCode(eventSlug: string, currentMax: number = 0): string {
  const prefix = getEventAbbreviation(eventSlug)
  const nextNumber = currentMax + 1
  const paddedNumber = String(nextNumber).padStart(2, '0')
  
  return `${prefix}-${paddedNumber}`
}

/**
 * Extracts the number from a registration code
 * e.g., "MGM-047" returns 47
 */
export function extractCodeNumber(code: string): number | null {
  const match = code.match(/-(\d+)$/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

/**
 * Validates the format of a registration code
 */
export function isValidCodeFormat(code: string): boolean {
  // Format: 2-4 letter prefix, dash, 2+ digits (e.g., MGM-01, TT4M-02)
  const codePattern = /^[A-Z0-9]{2,4}-\d{2,}$/
  return codePattern.test(code.toUpperCase())
}

/**
 * Generates a QR code data string for the registration
 */
export function generateQRData(registrationId: string, code: string, eventDate: string): string {
  return JSON.stringify({
    id: registrationId,
    code: code,
    event: eventDate,
    v: 1 // version for future compatibility
  })
}

/**
 * Formats a registration code for display
 */
export function formatCodeForDisplay(code: string): string {
  return code.toUpperCase()
}
