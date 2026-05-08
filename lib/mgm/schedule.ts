// Whether to loop back to month 1 after month 12 or stop
export const LOOP_AFTER_MONTH_12 = true

export function computeNextSendAt(from: Date = new Date()): Date {
  const next = new Date(from)
  next.setDate(next.getDate() + 7)
  return next
}

export function advanceProgress(currentMonth: number, currentWeek: number): {
  nextMonth: number
  nextWeek: number
  isCompleted: boolean
} {
  if (currentWeek < 4) {
    return { nextMonth: currentMonth, nextWeek: currentWeek + 1, isCompleted: false }
  }

  // Week 4 done — advance month
  if (currentMonth < 12) {
    return { nextMonth: currentMonth + 1, nextWeek: 1, isCompleted: false }
  }

  // Month 12 done
  if (LOOP_AFTER_MONTH_12) {
    return { nextMonth: 1, nextWeek: 1, isCompleted: false }
  }

  return { nextMonth: 12, nextWeek: 4, isCompleted: true }
}
