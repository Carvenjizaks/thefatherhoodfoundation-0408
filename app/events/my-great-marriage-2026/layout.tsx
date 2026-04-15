import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyGreatMarriage Conference 2026 | The Fatherhood Foundation",
  description:
    "Register for the MyGreatMarriage Conference on May 7-9, 2026 in Windhoek, Namibia. A transformative event for couples focused on strengthening marriages and building lasting relationships.",
  keywords: [
    "marriage conference",
    "couples retreat",
    "marriage enrichment",
    "MyGreatMarriage",
    "Fatherhood Foundation",
    "Windhoek events",
    "relationship workshop",
  ],
  openGraph: {
    title: "MyGreatMarriage Conference 2026",
    description: "A transformative conference for couples seeking deeper connection and renewed love. May 7-9, 2026 in Windhoek, Namibia.",
    type: "website",
    url: "https://thefatherhoodfoundation.org/events/my-great-marriage-2026",
  },
}

// Event structured data for rich search results
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "MyGreatMarriage Conference 2026",
  description:
    "A transformative conference for couples seeking deeper connection and renewed love. Learn practical tools to strengthen your marriage.",
  startDate: "2026-05-07T09:00:00+02:00",
  endDate: "2026-05-09T17:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Windhoek Conference Center",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Windhoek",
      addressCountry: "Namibia",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "The Fatherhood Foundation",
    url: "https://thefatherhoodfoundation.org",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Early Bird Ticket",
      price: "400",
      priceCurrency: "NAD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: "https://thefatherhoodfoundation.org/events/my-great-marriage-2026",
    },
    {
      "@type": "Offer",
      name: "Standard Ticket",
      price: "500",
      priceCurrency: "NAD",
      availability: "https://schema.org/InStock",
      url: "https://thefatherhoodfoundation.org/events/my-great-marriage-2026",
    },
  ],
  image: "https://thefatherhoodfoundation.org/images/couples/couple-together-1.jpg",
  performer: {
    "@type": "Organization",
    name: "The Fatherhood Foundation",
  },
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {children}
    </>
  )
}
