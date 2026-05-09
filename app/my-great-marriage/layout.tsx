import type { Metadata } from "next"
import { ServiceSchema, FAQSchema, PersonSchema, CourseSchema } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "My Great Marriage | Marriage Enrichment Program",
  description:
    "Strengthen your marriage with My Great Marriage - a free 9-month faith-based program offering weekly encouragement, practical action steps, and monthly check-ins for couples to reconnect and grow together.",
  keywords: [
    "marriage enrichment",
    "marriage counseling",
    "couples program",
    "faith-based marriage",
    "marriage strengthening",
    "relationship building",
    "marriage tools",
    "couples retreat",
    "marriage check-in",
    "healthy marriage",
    "marriage communication",
    "christian marriage",
    "marriage advice",
    "how to strengthen marriage",
    "marriage help",
    "couples encouragement",
  ],
  openGraph: {
    title: "My Great Marriage | Free Marriage Enrichment Program",
    description:
      "A free 9-month faith-based journey to strengthen your marriage through weekly encouragement, practical action steps, and couples check-ins.",
    url: "https://thefatherhoodfoundation.org/my-great-marriage",
    type: "website",
    images: [
      {
        url: "/images/couples/couple-1.jpg",
        width: 1200,
        height: 630,
        alt: "My Great Marriage - Couples strengthening their relationship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Great Marriage | Marriage Enrichment",
    description: "Free weekly faith-based encouragement and practical tools to strengthen your marriage.",
    images: ["/images/couples/couple-1.jpg"],
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/my-great-marriage",
  },
}

// FAQs for AEO - answering common voice/AI assistant queries
const marriageFaqs = [
  {
    question: "What is My Great Marriage?",
    answer:
      "My Great Marriage is a free 9-month faith-based marriage enrichment program by The Fatherhood Foundation. It provides couples with weekly encouragement emails, practical action steps, reflection prompts, and monthly check-ins to strengthen their relationship.",
  },
  {
    question: "How does My Great Marriage work?",
    answer:
      "After signing up, couples receive weekly emails on Tuesdays at 6AM South African time. The program runs in three 3-month cycles with 4-week breaks between each. Each week includes scripture, reflection, and a specific action step to implement together.",
  },
  {
    question: "Is My Great Marriage free?",
    answer:
      "Yes, My Great Marriage is completely free. Couples can sign up to receive weekly encouragement emails and access the monthly marriage check-in template at no cost.",
  },
  {
    question: "Who is My Great Marriage for?",
    answer:
      "My Great Marriage is designed for married couples of all backgrounds who want to strengthen their relationship through faith-based principles, practical tools, and intentional connection.",
  },
  {
    question: "How do I sign up for My Great Marriage?",
    answer:
      "Visit thefatherhoodfoundation.org/my-great-marriage/keep-your-marriage-fresh and enter both spouses' names, emails, and wedding anniversary date to begin receiving weekly encouragement.",
  },
  {
    question: "What do I get with My Great Marriage?",
    answer:
      "You receive weekly couples encouragement emails, separate husband and wife encouragement, monthly marriage check-in reminders, practical faith-based tools, and reflection prompts to help you connect with your spouse.",
  },
]

export default function MyGreatMarriageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* AEO: Service Schema for AI/voice discovery */}
      <ServiceSchema
        name="My Great Marriage"
        description="A free 9-month faith-based marriage enrichment program providing weekly encouragement, practical action steps, and monthly check-ins for couples to strengthen their relationship."
        audience="Married Couples"
      />
      
      {/* AEO: Course Schema for program structure */}
      <CourseSchema
        name="My Great Marriage 9-Month Journey"
        description="A structured marriage enrichment program with three themed cycles: Building Strong Foundations, Deepening Intimacy & Connection, and Growing Together in Purpose."
        duration="P9M"
      />
      
      {/* AEO: FAQ Schema for voice assistants and AI answers */}
      <FAQSchema faqs={marriageFaqs} />
      
      {/* AEO: Person Schema for Carven Izaks quotes attribution */}
      <PersonSchema
        name="Carven Izaks"
        jobTitle="Founder"
        affiliation="The Fatherhood Foundation"
      />
      
      {children}
    </>
  )
}
