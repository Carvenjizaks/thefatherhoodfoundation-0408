import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events | The Fatherhood Foundation",
  description:
    "Join us for workshops, conferences, and community gatherings designed to strengthen fathers, families, and our community. Explore upcoming and past events.",
  openGraph: {
    title: "Events | The Fatherhood Foundation",
    description: "Discover upcoming workshops, conferences, and community events for fathers and families.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | The Fatherhood Foundation",
    description: "Discover upcoming workshops, conferences, and community events for fathers and families.",
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
