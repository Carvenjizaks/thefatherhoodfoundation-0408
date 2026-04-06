import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Great Marriage - Marriage Enrichment Program",
  description:
    "Strengthen your marriage with My Great Marriage program. Learn communication skills, conflict resolution, intimacy building, and financial planning for couples seeking a thriving relationship.",
  keywords: [
    "marriage enrichment",
    "couples program",
    "marriage counseling",
    "relationship building",
    "communication skills couples",
    "conflict resolution marriage",
    "marriage strengthening",
    "healthy marriage",
  ],
  openGraph: {
    title: "My Great Marriage - Marriage Enrichment | The Fatherhood Foundation",
    description:
      "Strengthen your marriage with expert guidance on communication, conflict resolution, and building lasting intimacy.",
    url: "https://thefatherhoodfoundation.org/my-great-marriage",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/my-great-marriage",
  },
}

export default function MyGreatMarriageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
