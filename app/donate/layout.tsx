import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donate - Support Families & Transform Lives",
  description:
    "Your donation to The Fatherhood Foundation directly supports programs that transform men into intentional fathers and strengthen families. Give today and make a lasting impact.",
  keywords: [
    "donate to fatherhood",
    "support families",
    "nonprofit donation",
    "family charity",
    "give to fathers",
    "support men's programs",
    "charitable giving",
  ],
  openGraph: {
    title: "Donate to The Fatherhood Foundation - Transform Lives",
    description:
      "Your donation directly supports programs that transform men into intentional fathers and strengthen families.",
    url: "https://thefatherhoodfoundation.org/donate",
    type: "website",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/donate",
  },
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
