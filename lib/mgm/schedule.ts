/**
 * MGM Email Journey — Schedule Utilities
 *
 * Journey Structure:
 * - Cycle 1 (Months 1-3): Foundation — Build your marriage on Christ
 * - 4-week pause
 * - Cycle 2 (Months 4-6): Connection — Deepen intimacy and communication
 * - 4-week pause
 * - Cycle 3 (Months 7-9): Growth — Sustain and strengthen your marriage
 * - 4-week pause
 * - Cycle 4 (Months 10-12): Trust — Restore, rebuild, and strengthen trust
 *
 * Nurture send day: Tuesday
 * Timezone for business logic: Africa/Johannesburg (UTC+2)
 * nextSendAt is always stored as UTC in Supabase.
 */

// Nurture send day: 2 = Tuesday (0=Sun, 1=Mon, 2=Tue...)
const NURTURE_WEEKDAY = 2
const TIMEZONE = "Africa/Johannesburg"

// Total active months (4 cycles x 3 months)
export const TOTAL_ACTIVE_MONTHS = 12

// Pause weeks between cycles
export const PAUSE_WEEKS = 4

// Cycle definitions
export const CYCLES = [
  { start: 1, end: 3, theme: "Foundation", description: "Build your marriage on Christ" },
  { start: 4, end: 6, theme: "Connection", description: "Deepen intimacy and communication" },
  { start: 7, end: 9, theme: "Growth", description: "Sustain and strengthen your marriage" },
  { start: 10, end: 12, theme: "Trust", description: "Restore, rebuild, and strengthen trust" },
]

/**
 * Determines which cycle a month belongs to
 */
export function getCycleForMonth(month: number): { cycle: number; theme: string; description: string } | null {
  for (let i = 0; i < CYCLES.length; i++) {
    if (month >= CYCLES[i].start && month <= CYCLES[i].end) {
      return { cycle: i + 1, ...CYCLES[i] }
    }
  }
  return null
}

/**
 * Check if the subscription is currently in a pause period
 */
export function isInPausePeriod(currentMonth: number, pauseWeeksRemaining: number): boolean {
  return pauseWeeksRemaining > 0
}

/**
 * Returns the next occurrence of the nurture send day (Tuesday)
 * from a given signup date, calculated in Africa/Johannesburg time,
 * then returned as a UTC Date.
 */
export function getNextNurtureSendAt(signupDate: Date = new Date()): Date {
  const jhbFormatter = new Intl.DateTimeFormat("en-ZA", {
    timeZone: TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  const parts = jhbFormatter.formatToParts(signupDate)
  const jhbYear = parseInt(parts.find((p) => p.type === "year")!.value)
  const jhbMonth = parseInt(parts.find((p) => p.type === "month")!.value) - 1
  const jhbDay = parseInt(parts.find((p) => p.type === "day")!.value)
  const jhbHour = parseInt(parts.find((p) => p.type === "hour")!.value)

  const todayJhb = new Date(Date.UTC(jhbYear, jhbMonth, jhbDay))
  const todayWeekday = todayJhb.getDay()

  let daysUntilTuesday = (NURTURE_WEEKDAY - todayWeekday + 7) % 7

  if (daysUntilTuesday === 0 && jhbHour >= 6) {
    daysUntilTuesday = 7
  }

  const targetUtc = new Date(
    Date.UTC(jhbYear, jhbMonth, jhbDay + daysUntilTuesday, 4, 0, 0, 0)
  )

  return targetUtc
}

/**
 * From a given nextSendAt, compute the following send date (+7 days exactly).
 */
export function computeNextSendAt(prevSendAt: Date): Date {
  const next = new Date(prevSendAt)
  next.setUTCDate(next.getUTCDate() + 7)
  return next
}

/**
 * Advance the journey state after a successful send.
 * Handles the 3-cycle structure with 4-week pauses between cycles.
 */
export function advanceProgress(
  currentMonth: number,
  currentWeek: number,
  pauseWeeksRemaining: number = 0
): { 
  nextMonth: number
  nextWeek: number
  pauseWeeksRemaining: number
  isCompleted: boolean
  isPaused: boolean
} {
  // If currently in pause period, decrement pause weeks
  if (pauseWeeksRemaining > 0) {
    const newPauseWeeks = pauseWeeksRemaining - 1
    if (newPauseWeeks > 0) {
      // Still in pause
      return { 
        nextMonth: currentMonth, 
        nextWeek: 1, 
        pauseWeeksRemaining: newPauseWeeks, 
        isCompleted: false,
        isPaused: true
      }
    } else {
      // Pause ended, continue to next month
      return { 
        nextMonth: currentMonth, 
        nextWeek: 1, 
        pauseWeeksRemaining: 0, 
        isCompleted: false,
        isPaused: false
      }
    }
  }

  // Normal progression within a month
  if (currentWeek < 4) {
    return { 
      nextMonth: currentMonth, 
      nextWeek: currentWeek + 1, 
      pauseWeeksRemaining: 0, 
      isCompleted: false,
      isPaused: false
    }
  }

  // Week 4 done — check if at end of a cycle
  const isEndOfCycle1 = currentMonth === 3
  const isEndOfCycle2 = currentMonth === 6
  const isEndOfCycle3 = currentMonth === 9

  if (isEndOfCycle1 || isEndOfCycle2) {
    // Start 4-week pause, then advance to next month
    return { 
      nextMonth: currentMonth + 1, 
      nextWeek: 1, 
      pauseWeeksRemaining: PAUSE_WEEKS, 
      isCompleted: false,
      isPaused: true
    }
  }

  if (isEndOfCycle3) {
    // Journey complete!
    return { 
      nextMonth: 9, 
      nextWeek: 4, 
      pauseWeeksRemaining: 0, 
      isCompleted: true,
      isPaused: false
    }
  }

  // Normal month advancement within a cycle
  return { 
    nextMonth: currentMonth + 1, 
    nextWeek: 1, 
    pauseWeeksRemaining: 0, 
    isCompleted: false,
    isPaused: false
  }
}

/**
 * Determine if the husband should receive this stream type.
 */
export function shouldSendToHusband(
  sub: {
    receive_couple_emails: boolean
    receive_husband_emails: boolean
    unsubscribed_husband: boolean
  },
  streamType: "COUPLES_1" | "HUSBANDS" | "WIVES" | "COUPLES_2"
): boolean {
  if (sub.unsubscribed_husband) return false
  if (streamType === "HUSBANDS") return sub.receive_husband_emails
  if (streamType === "COUPLES_1" || streamType === "COUPLES_2") return sub.receive_couple_emails
  return false
}

/**
 * Determine if the wife should receive this stream type.
 */
export function shouldSendToWife(
  sub: {
    receive_couple_emails: boolean
    receive_wife_emails: boolean
    unsubscribed_wife: boolean
  },
  streamType: "COUPLES_1" | "HUSBANDS" | "WIVES" | "COUPLES_2"
): boolean {
  if (sub.unsubscribed_wife) return false
  if (streamType === "WIVES") return sub.receive_wife_emails
  if (streamType === "COUPLES_1" || streamType === "COUPLES_2") return sub.receive_couple_emails
  return false
}

/**
 * Returns true if ALL streams are disabled / unsubscribed — subscription should be marked inactive.
 */
export function markInactiveIfNoStreamsEnabled(sub: {
  receive_couple_emails: boolean
  receive_husband_emails: boolean
  receive_wife_emails: boolean
  unsubscribed_husband: boolean
  unsubscribed_wife: boolean
}): boolean {
  const husbandHasAny =
    !sub.unsubscribed_husband && (sub.receive_couple_emails || sub.receive_husband_emails)
  const wifeHasAny =
    !sub.unsubscribed_wife && (sub.receive_couple_emails || sub.receive_wife_emails)
  return !husbandHasAny && !wifeHasAny
}

/**
 * Stream type by week number.
 */
export function resolveEmailForState(
  week: number
): "COUPLES_1" | "HUSBANDS" | "WIVES" | "COUPLES_2" {
  const map: Record<number, "COUPLES_1" | "HUSBANDS" | "WIVES" | "COUPLES_2"> = {
    1: "COUPLES_1",
    2: "HUSBANDS",
    3: "WIVES",
    4: "COUPLES_2",
  }
  return map[week] ?? "COUPLES_1"
}

/**
 * Get a friendly description of the current journey status
 */
export function getJourneyStatus(
  currentMonth: number,
  currentWeek: number,
  pauseWeeksRemaining: number
): string {
  if (pauseWeeksRemaining > 0) {
    const cycle = getCycleForMonth(currentMonth - 1)
    return `Rest period — ${pauseWeeksRemaining} week(s) remaining before next cycle`
  }
  
  const cycle = getCycleForMonth(currentMonth)
  if (!cycle) return "Journey complete"
  
  return `Cycle ${cycle.cycle}: ${cycle.theme} — Month ${currentMonth}, Week ${currentWeek}`
}
