import type React from "react"
import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Gathering of Champions 2026 | The Fatherhood Foundation",
  description:
    "Register for GOC26 - the Gathering of Champions 2026 on July 17-18 in Windhoek, Namibia. An annual men's conference for champions ready to step up in their homes, workplaces, and communities.",
  keywords: [
    "men's conference",
    "gathering of champions",
    "GOC26",
    "men's ministry",
    "Fatherhood Foundation",
    "Windhoek events",
    "men's retreat",
  ],
  openGraph: {
    title: "Gathering of Champions 2026",
    description: "Join hundreds of men for an unforgettable weekend of transformation. July 17-18, 2026 in Windhoek, Namibia.",
    type: "website",
    url: "https://thefatherhoodfoundation.org/events/goc26",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gathering of Champions 2026",
    description: "Annual men's conference. July 17-18, 2026 in Windhoek, Namibia. NAD 250 per man.",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/events/goc26",
  },
}

// Event structured data for rich search results
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Gathering of Champions 2026",
  description:
    "The flagship annual conference for men ready to step up as champions in their homes, workplaces, and communities.",
  startDate: "2026-07-17T18:00:00+02:00",
  endDate: "2026-07-18T17:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Windhoek",
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
      name: "Standard Registration",
      price: "250",
      priceCurrency: "NAD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: "https://thefatherhoodfoundation.org/events/goc26",
    },
  ],
  image: "https://thefatherhoodfoundation.org/images/goc/goc26-poster.jpeg",
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
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://thefatherhoodfoundation.org" },
        { name: "Events", url: "https://thefatherhoodfoundation.org/events" },
        { name: "GOC26", url: "https://thefatherhoodfoundation.org/events/goc26" },
      ]} />
      {children}
    </>
  )
}
