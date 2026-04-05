import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Volunteer Application - Join Our Team",
  description:
    "Apply to volunteer with The Fatherhood Foundation. Use your skills and passion to help strengthen families and mentor men in your community.",
  keywords: [
    "volunteer application",
    "nonprofit volunteer",
    "family volunteer",
    "mentor volunteer",
    "community service",
    "help families",
  ],
  openGraph: {
    title: "Volunteer Application | The Fatherhood Foundation",
    description:
      "Apply to volunteer and use your skills to help strengthen families and mentor men in your community.",
    url: "https://thefatherhoodfoundation.org/volunteer-application",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/volunteer-application",
  },
}

export default function VolunteerApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
