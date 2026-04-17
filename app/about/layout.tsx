import { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "About Us - Our Mission & Vision",
  description:
    "Learn about The Fatherhood Foundation's mission to empower men as intentional fathers, committed husbands, and impactful leaders. Discover our history, values, and the team dedicated to strengthening families.",
  keywords: [
    "about fatherhood foundation",
    "fatherhood mission",
    "men's organization",
    "family strengthening nonprofit",
    "intentional fatherhood",
    "community leaders",
  ],
  openGraph: {
    title: "About The Fatherhood Foundation - Our Mission & Vision",
    description:
      "Discover our mission to empower men as intentional fathers, committed husbands, and impactful leaders.",
    url: "https://thefatherhoodfoundation.org/about",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/about",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://thefatherhoodfoundation.org" },
        { name: "About Us", url: "https://thefatherhoodfoundation.org/about" },
      ]} />
      {children}
    </>
  )
}
