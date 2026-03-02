import type { Event } from "@/types/event"
import { EventCard } from "./event-card"
import { QuarterPlaceholder } from "./quarter-placeholder"
import { getQuartersWithoutEvents } from "@/lib/event-utils"

interface EventListProps {
  events: Event[]
  isUpcoming: boolean
}

export function EventList({ events, isUpcoming }: EventListProps) {
  const currentYear = new Date().getFullYear()
  const emptyQuarters = getQuartersWithoutEvents(events, currentYear, isUpcoming)

  if (events.length === 0 && emptyQuarters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {isUpcoming ? "No upcoming events scheduled." : "No past events to display."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Display events */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Display quarterly placeholders for quarters with no events */}
      {emptyQuarters.length > 0 && (
        <div className="space-y-4 mt-8">
          {emptyQuarters.map((quarter) => (
            <QuarterPlaceholder key={`${quarter.year}-${quarter.quarter}`} quarterInfo={quarter} />
          ))}
        </div>
      )}
    </div>
  )
}
