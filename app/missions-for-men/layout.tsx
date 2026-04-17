import { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Missions for Men - Community Service & Outreach",
  description:
    "Join Missions for Men and make a tangible difference in your community. Serve alongside brothers in purpose-driven projects that transform neighborhoods and build lasting brotherhood.",
  keywords: [
    "men's community service",
    "volunteer opportunities men",
    "community outreach",
    "men's mission work",
    "neighborhood development",
    "service projects",
    "men helping community",
  ],
  openGraph: {
    title: "Missions for Men - Community Service | The Fatherhood Foundation",
    description:
      "Make a tangible difference through purpose-driven community service projects alongside your brothers.",
    url: "https://thefatherhoodfoundation.org/missions-for-men",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/missions-for-men",
  },
}

export default function MissionsForMenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://thefatherhoodfoundation.org" },
        { name: "Missions for Men", url: "https://thefatherhoodfoundation.org/missions-for-men" },
      ]} />
      {children}
    </>
  )
}
