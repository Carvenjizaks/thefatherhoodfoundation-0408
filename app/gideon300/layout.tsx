import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gideon 300 - Elite Men's Leadership Program",
  description:
    "Join Gideon 300, an elite leadership program for men committed to becoming influential fathers, husbands, and community leaders. Limited to 300 dedicated men.",
  keywords: [
    "gideon 300",
    "men's leadership program",
    "elite fatherhood program",
    "men's development",
    "leadership training",
    "committed fathers",
  ],
  openGraph: {
    title: "Gideon 300 - Elite Leadership Program | The Fatherhood Foundation",
    description:
      "An elite leadership program for men committed to becoming influential fathers, husbands, and community leaders.",
    url: "https://thefatherhoodfoundation.org/gideon300",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/gideon300",
  },
}

export default function Gideon300Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
