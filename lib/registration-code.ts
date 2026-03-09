import crypto from 'crypto'

/**
 * Generates a unique, secure registration code
 * Format: PREFIX-XXXXXX (e.g., TFF-A3B7C9)
 * - 6 alphanumeric characters (excluding confusing chars like 0/O, 1/I/L)
 * - Cryptographically secure random generation
 */
export function generateRegistrationCode(prefix: string = 'TFF'): string {
  // Characters that are easy to read and distinguish
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const codeLength = 6
  
  // Use crypto for secure random generation
  const randomBytes = crypto.randomBytes(codeLength)
  let code = ''
  
  for (let i = 0; i < codeLength; i++) {
    code += chars[randomBytes[i] % chars.length]
  }
  
  return `${prefix}-${code}`
}

/**
 * Validates the format of a registration code
 */
export function isValidCodeFormat(code: string): boolean {
  // Format: XXX-XXXXXX (3 letter prefix, dash, 6 alphanumeric)
  const codePattern = /^[A-Z]{2,4}-[A-Z0-9]{6}$/
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
 * Formats a registration code for display (adds spacing)
 */
export function formatCodeForDisplay(code: string): string {
  return code.toUpperCase()
}
