import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partnership Opportunities - The Fatherhood Foundation",
  description:
    "Support The Fatherhood Foundation through monthly donations, strategic partnerships, or volunteering. Join us in ending fatherlessness and empowering men to live fulfilled lives.",
  openGraph: {
    title: "Partnership Opportunities - The Fatherhood Foundation",
    description:
      "Support our mission to end fatherlessness. Donate, partner with us, or volunteer your time to make a lasting impact.",
    type: "website",
  },
}

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
