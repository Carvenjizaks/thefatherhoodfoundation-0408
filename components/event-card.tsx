import Image from "next/image"
import { Calendar, MapPin, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types/event"
import { formatEventDate } from "@/lib/event-utils"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
            {event.category}
          </Badge>
        </div>
        <CardTitle className="text-xl text-balance">{event.title}</CardTitle>
        <CardDescription className="text-pretty">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
