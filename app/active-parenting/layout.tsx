import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Active Parenting - Hands-On Fatherhood Program",
  description:
    "Learn active parenting techniques through The Fatherhood Foundation's hands-on program. Develop practical skills for engaged, intentional fatherhood.",
  keywords: [
    "active parenting",
    "hands-on fatherhood",
    "parenting skills",
    "father involvement",
    "engaged parenting",
    "parenting program",
  ],
  openGraph: {
    title: "Active Parenting Program | The Fatherhood Foundation",
    description:
      "Learn active parenting techniques through our hands-on program for engaged, intentional fatherhood.",
    url: "https://thefatherhoodfoundation.org/active-parenting",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/active-parenting",
  },
}

export default function ActiveParentingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
