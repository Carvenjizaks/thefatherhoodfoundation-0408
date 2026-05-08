/**
 * MGM Email Journey — Schedule Utilities
 *
 * Nurture send day: Tuesday
 * Timezone for business logic: Africa/Johannesburg (UTC+2)
 * nextSendAt is always stored as UTC in Supabase.
 */

export const LOOP_AFTER_MONTH_12 = true

// Nurture send day: 2 = Tuesday (0=Sun, 1=Mon, 2=Tue...)
const NURTURE_WEEKDAY = 2
const TIMEZONE = "Africa/Johannesburg"

/**
 * Returns the next occurrence of the nurture send day (Tuesday)
 * from a given signup date, calculated in Africa/Johannesburg time,
 * then returned as a UTC Date.
 *
 * If today IS the nurture day but it's before 6am JHB, we use today.
 * Otherwise we find the next occurrence.
 */
export function getNextNurtureSendAt(signupDate: Date = new Date()): Date {
  // Work in JHB time — get the current weekday in that timezone
  const jhbFormatter = new Intl.DateTimeFormat("en-ZA", {
    timeZone: TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Parse current JHB date parts
  const parts = jhbFormatter.formatToParts(signupDate)
  const jhbYear = parseInt(parts.find((p) => p.type === "year")!.value)
  const jhbMonth = parseInt(parts.find((p) => p.type === "month")!.value) - 1
  const jhbDay = parseInt(parts.find((p) => p.type === "day")!.value)
  const jhbHour = parseInt(parts.find((p) => p.type === "hour")!.value)

  // Build a Date object representing midnight JHB on signup day
  // We do this by finding what UTC time corresponds to 06:00 JHB on the target day
  const candidateDate = new Date(signupDate)
  candidateDate.setUTCHours(0, 0, 0, 0)

  // Find the JHB weekday for today
  const todayJhb = new Date(
    Date.UTC(jhbYear, jhbMonth, jhbDay)
  )
  const todayWeekday = todayJhb.getDay()

  // Days until next Tuesday
  let daysUntilTuesday = (NURTURE_WEEKDAY - todayWeekday + 7) % 7

  // If today is already Tuesday but past 06:00 JHB, push to next Tuesday
  if (daysUntilTuesday === 0 && jhbHour >= 6) {
    daysUntilTuesday = 7
  }
  // If today is Tuesday and before 06:00 JHB, use today
  if (daysUntilTuesday === 0 && jhbHour < 6) {
    daysUntilTuesday = 0
  }

  // Target day: signup day + daysUntilTuesday, at 06:00 JHB = 04:00 UTC
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
 */
export function advanceProgress(
  currentMonth: number,
  currentWeek: number
): { nextMonth: number; nextWeek: number; isCompleted: boolean } {
  if (currentWeek < 4) {
    return { nextMonth: currentMonth, nextWeek: currentWeek + 1, isCompleted: false }
  }

  // Week 4 done — advance month
  if (currentMonth < 12) {
    return { nextMonth: currentMonth + 1, nextWeek: 1, isCompleted: false }
  }

  // Month 12 Week 4 done
  if (LOOP_AFTER_MONTH_12) {
    return { nextMonth: 1, nextWeek: 1, isCompleted: false }
  }

  return { nextMonth: 12, nextWeek: 4, isCompleted: true }
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
