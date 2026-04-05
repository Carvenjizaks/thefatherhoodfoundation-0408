import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Impact - Stories of Transformation",
  description:
    "See the measurable impact of The Fatherhood Foundation. Discover stories of transformed fathers, strengthened marriages, and communities changed through our programs.",
  keywords: [
    "fatherhood impact",
    "family transformation",
    "success stories",
    "program results",
    "community impact",
    "changed lives",
    "nonprofit outcomes",
  ],
  openGraph: {
    title: "Our Impact - Stories of Transformation | The Fatherhood Foundation",
    description:
      "Discover stories of transformed fathers, strengthened marriages, and communities changed through our programs.",
    url: "https://thefatherhoodfoundation.org/impact",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/impact",
  },
}

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
