import type { Event, QuarterInfo } from "@/types/event"

export function isUpcoming(date: string): boolean {
  return new Date(date) > new Date()
}

export function sortEvents(events: Event[], ascending = true): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export function getEventQuarter(date: string): QuarterInfo {
  const eventDate = new Date(date)
  const month = eventDate.getMonth() + 1
  const year = eventDate.getFullYear()

  if (month <= 3) {
    return { quarter: "Q1", year, months: "January - March", startMonth: 1, endMonth: 3 }
  } else if (month <= 6) {
    return { quarter: "Q2", year, months: "April - June", startMonth: 4, endMonth: 6 }
  } else if (month <= 9) {
    return { quarter: "Q3", year, months: "July - September", startMonth: 7, endMonth: 9 }
  } else {
    return { quarter: "Q4", year, months: "October - December", startMonth: 10, endMonth: 12 }
  }
}

export function getAllQuarters(year: number): QuarterInfo[] {
  return [
    { quarter: "Q1", year, months: "January - March", startMonth: 1, endMonth: 3 },
    { quarter: "Q2", year, months: "April - June", startMonth: 4, endMonth: 6 },
    { quarter: "Q3", year, months: "July - September", startMonth: 7, endMonth: 9 },
    { quarter: "Q4", year, months: "October - December", startMonth: 10, endMonth: 12 },
  ]
}

export function groupEventsByQuarter(events: Event[]): Map<string, Event[]> {
  const grouped = new Map<string, Event[]>()

  events.forEach((event) => {
    const { quarter, year } = getEventQuarter(event.date)
    const key = `${year}-${quarter}`

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(event)
  })

  return grouped
}

export function getQuartersWithoutEvents(events: Event[], year: number, isUpcomingSection: boolean): QuarterInfo[] {
  const allQuarters = getAllQuarters(year)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const eventQuarters = events.map((event) => {
    const { quarter, year: eventYear } = getEventQuarter(event.date)
    return `${eventYear}-${quarter}`
  })

  return allQuarters.filter((quarter) => {
    const key = `${quarter.year}-${quarter.quarter}`
    const hasEvents = eventQuarters.includes(key)

    if (hasEvents) return false

    // For upcoming section, only show quarters that are in the future or current
    if (isUpcomingSection && year === currentYear) {
      return quarter.endMonth >= currentMonth
    }

    // For past section, only show quarters that are in the past
    if (!isUpcomingSection && year === currentYear) {
      return quarter.startMonth < currentMonth
    }

    return true
  })
}

export function filterEventsByCategory(events: Event[], category: string): Event[] {
  if (category === "all") return events
  return events.filter((event) => event.category === category)
}

export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
