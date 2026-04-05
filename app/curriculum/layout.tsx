import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Curriculum - Fatherhood & Marriage Resources",
  description:
    "Access The Fatherhood Foundation's curriculum including books, workbooks, and training materials for fatherhood programs, marriage enrichment, and men's development.",
  keywords: [
    "fatherhood curriculum",
    "parenting resources",
    "marriage workbooks",
    "men's development materials",
    "father training resources",
    "family education",
  ],
  openGraph: {
    title: "Curriculum & Resources | The Fatherhood Foundation",
    description:
      "Access books, workbooks, and training materials for fatherhood programs and marriage enrichment.",
    url: "https://thefatherhoodfoundation.org/curriculum",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/curriculum",
  },
}

export default function CurriculumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
