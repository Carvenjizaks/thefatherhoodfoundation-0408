import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Development | The Fatherhood Foundation",
  description: "Make a lasting impact in your community through service, leadership, and collaborative initiatives.",
  openGraph: {
    title: "Community Development | The Fatherhood Foundation",
    description: "Make a lasting impact in your community through service, leadership, and collaborative initiatives.",
    type: "website",
    url: "https://thefatherhoodfoundation.org/community-development",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Development | The Fatherhood Foundation",
    description: "Make a lasting impact in your community through service, leadership, and collaborative initiatives.",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/community-development",
  },
}

export default function CommunityDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
