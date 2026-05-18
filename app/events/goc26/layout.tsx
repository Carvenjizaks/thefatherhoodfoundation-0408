import type React from "react"
import type { Metadata } from "next"

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

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
