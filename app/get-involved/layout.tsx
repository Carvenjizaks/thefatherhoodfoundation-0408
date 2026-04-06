import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Involved - Volunteer, Donate & Partner",
  description:
    "Join The Fatherhood Foundation movement. Discover ways to get involved through volunteering, donating, partnering, or joining our programs to strengthen families in your community.",
  keywords: [
    "volunteer opportunities",
    "get involved nonprofit",
    "support fatherhood",
    "community involvement",
    "join men's group",
    "family support volunteer",
    "donate to families",
  ],
  openGraph: {
    title: "Get Involved - Volunteer, Donate & Partner | The Fatherhood Foundation",
    description:
      "Join the movement to strengthen families. Volunteer, donate, or partner with us today.",
    url: "https://thefatherhoodfoundation.org/get-involved",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/get-involved",
  },
}

export default function GetInvolvedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
