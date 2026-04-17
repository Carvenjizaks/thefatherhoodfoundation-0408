import { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Mentoring Men - Monthly Table Talk Program",
  description:
    "Join our Mentoring Men program featuring Monthly Table Talk gatherings where men share wisdom, build brotherhood, and grow together as fathers, husbands, and leaders.",
  keywords: [
    "men's mentorship program",
    "table talk for men",
    "father mentoring",
    "men's growth group",
    "brotherhood community",
    "male mentorship",
    "men's support group",
  ],
  openGraph: {
    title: "Mentoring Men - Monthly Table Talk | The Fatherhood Foundation",
    description:
      "Join our Monthly Table Talk gatherings where men share wisdom, build brotherhood, and grow together.",
    url: "https://thefatherhoodfoundation.org/mentoring-men",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/mentoring-men",
  },
}

export default function MentoringMenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://thefatherhoodfoundation.org" },
        { name: "Mentoring Men", url: "https://thefatherhoodfoundation.org/mentoring-men" },
      ]} />
      {children}
    </>
  )
}
