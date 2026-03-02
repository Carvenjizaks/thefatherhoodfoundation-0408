"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Event } from "@/types/event"
import { EventList } from "@/components/event-list"
import { isUpcoming, sortEvents, filterEventsByCategory } from "@/lib/event-utils"

// Sample event data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Building Strong Fathers Workshop",
    description: "An intensive workshop focused on developing strong fatherhood principles and practices.",
    date: "2025-02-15T10:00:00Z",
    location: "Community Center, Downtown",
    image: "/fathers-workshop-community.jpg",
    category: "Workshop",
  },
  {
    id: "2",
    title: "Monthly Table Talk: Parenting in the Digital Age",
    description: "Join us for our monthly discussion on navigating technology and social media with your children.",
    date: "2025-03-20T18:30:00Z",
    location: "The Fatherhood Foundation Office",
    image: "/fathers-discussion-table.jpg",
    category: "Table Talk",
  },
  {
    id: "3",
    title: "MyGreatMarriage 2026",
    description:
      "A weekend retreat designed to strengthen marriages and build lasting partnerships. Thursday Night: 6:00pm - 8:30pm | Friday: 6:30pm - 9:00pm | Saturday: 8:30am - 1:00pm",
    date: "2026-06-11T18:00:00Z",
    location: "To be Announced",
    image: "/mygreatmarriage-2026.jpg",
    category: "Conference",
  },
  {
    id: "4",
    title: "Community Service Day",
    description: "Father and child volunteer day serving our local community together.",
    date: "2025-06-14T08:00:00Z",
    location: "Various Locations",
    image: "/community-service-volunteers.png",
    category: "Community Event",
  },
  {
    id: "5",
    title: "Active Parenting Webinar Series",
    description: "Online webinar series covering practical parenting strategies for modern fathers.",
    date: "2025-07-22T19:00:00Z",
    location: "Online",
    image: "/online-webinar-education.jpg",
    category: "Webinar",
  },
  {
    id: "6",
    title: "Fatherhood Summit 2024",
    description: "Annual conference bringing together fathers, experts, and community leaders.",
    date: "2024-10-15T09:00:00Z",
    location: "Convention Center",
    image: "/conference-summit-leadership.jpg",
    category: "Conference",
  },
  {
    id: "7",
    title: "Mentoring Men Kickoff",
    description:
      "Launch event for our fall mentoring program connecting experienced fathers with those seeking guidance.",
    date: "2024-09-05T18:00:00Z",
    location: "The Fatherhood Foundation Office",
    image: "/mentoring-men-meeting.jpg",
    category: "Workshop",
  },
  {
    id: "8",
    title: "Summer Family BBQ",
    description: "Community gathering for families to connect, share stories, and build relationships.",
    date: "2024-08-12T12:00:00Z",
    location: "Central Park Pavilion",
    image: "/family-bbq-outdoor.jpg",
    category: "Community Event",
  },
  {
    id: "9",
    title: "The Babylon Community Leaders Gathering",
    description:
      "A Time of Training & Empowerment for community leaders focused on strengthening leadership capacity and collaborative development strategies.",
    date: "2026-01-24T14:00:00Z",
    location: "To be Announced",
    image: "/community-leaders-gathering.jpg",
    category: "Workshop",
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    // Simulate fetching data
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        // In production, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setEvents(sampleEvents)
        setError(null)
      } catch (err) {
        setError("Failed to load events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = filterEventsByCategory(events, selectedCategory)
  const upcomingEvents = sortEvents(
    filteredEvents.filter((e) => isUpcoming(e.date)),
    true,
  )
  const pastEvents = sortEvents(
    filteredEvents.filter((e) => !isUpcoming(e.date)),
    false,
  )

  const categories = ["all", "Workshop", "Conference", "Webinar", "Table Talk", "Community Event"]

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">Events</h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
              Join us for workshops, conferences, and community gatherings designed to strengthen fathers, families, and
              our community.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Filter by category:
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter" className="w-[200px]" aria-label="Filter events by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
          <div>
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Content */}
      {!isLoading && !error && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Upcoming Events</h2>
            <EventList events={upcomingEvents} isUpcoming={true} />
          </div>

          {/* Past Events */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Past Events</h2>
            <EventList events={pastEvents} isUpcoming={false} />
          </div>
        </section>
      )}
    </main>
  )
}
