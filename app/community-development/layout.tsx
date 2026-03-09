import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Development | The Fatherhood Foundation",
  description: "Make a lasting impact in your community through service, leadership, and collaborative initiatives.",
}

export default function CommunityDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
