import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/ui/motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | The Fatherhood Foundation",
  description:
    "Find answers to common questions about The Fatherhood Foundation's programs, events, membership, and how to get involved.",
  keywords: [
    "fatherhood foundation FAQ",
    "marriage programs questions",
    "Gideon300 membership",
    "volunteer questions",
    "event registration help",
    "Table Talk for Men",
    "MyGreatMarriage Conference",
    "Active Parenting Namibia",
  ],
  openGraph: {
    title: "Frequently Asked Questions | The Fatherhood Foundation",
    description: "Find answers about our programs, events, Table Talk for Men, MyGreatMarriage Conference, and how to get involved.",
    type: "website",
    url: "https://thefatherhoodfoundation.org/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | The Fatherhood Foundation",
    description: "Find answers about our programs, events, and how to get involved.",
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/faq",
  },
}

const faqs = [
  {
    question: "What is The Fatherhood Foundation?",
    answer:
      "The Fatherhood Foundation is a nonprofit organization dedicated to empowering men to become intentional fathers, committed husbands, and impactful leaders. We provide mentorship programs, marriage enrichment events, and community development initiatives throughout Namibia.",
  },
  {
    question: "What programs do you offer?",
    answer:
      "We offer several key programs: Missions for Men (mentorship and leadership development), My Great Marriage (marriage enrichment conferences and resources), Active Parenting (parenting skills training), the Gideon300 membership program, and various community outreach initiatives.",
  },
  {
    question: "What is the Gideon300 program?",
    answer:
      "The Gideon300 is our premium membership program for committed men who want to make a lasting impact. Members receive exclusive access to events, mentorship opportunities, leadership training, and become part of a brotherhood dedicated to strengthening families and communities.",
  },
  {
    question: "How can I register for the MyGreatMarriage Conference?",
    answer:
      "You can register for the MyGreatMarriage Conference 2026 directly on our website. Visit the Events page and click on the MyGreatMarriage Conference to access the registration form. Early Bird pricing (NAD 400 per couple) is available until April 24, 2026. Standard pricing is NAD 550 per couple.",
  },
  {
    question: "How can I become a volunteer?",
    answer:
      "We welcome volunteers who share our passion for strengthening families. Visit our Volunteer Application page to submit your information. Our team will review your application and contact you about available opportunities that match your skills and interests.",
  },
  {
    question: "How can I support The Fatherhood Foundation financially?",
    answer:
      "There are several ways to support our work: become a Gideon300 member, make a one-time donation, set up recurring giving, or partner with us as a corporate sponsor. Visit our Partnership page to learn more about giving opportunities.",
  },
  {
    question: "Where are you located?",
    answer:
      "The Fatherhood Foundation is based in Windhoek, Namibia. Our programs and events primarily serve communities throughout Namibia, though our resources and impact extend across Southern Africa.",
  },
  {
    question: "How can I contact The Fatherhood Foundation?",
    answer:
      "You can reach us through our website contact form, email us at admin@fathersfound.org, or connect with us on social media. We typically respond to inquiries within 1-2 business days.",
  },
  {
    question: "Are your events only for married couples?",
    answer:
      "While our MyGreatMarriage conferences are designed for married couples, many of our other programs welcome all men regardless of marital status. Our Missions for Men and mentorship programs are open to single men, engaged couples, and married men alike.",
  },
  {
    question: "Do you offer resources for churches or organizations?",
    answer:
      "Yes! We partner with churches, community organizations, and businesses to deliver our curriculum and programs. Contact us to discuss how we can collaborate to strengthen families in your community.",
  },
  {
    question: "What is Table Talk for Men?",
    answer:
      "Table Talk for Men is a monthly gathering where men come together for honest conversation, mutual encouragement, and shared meals. Sessions are held at Scouts Hall, Suiderhof, Windhoek from 8:30am to 10:30am. Registration costs NAD 50 per person, which includes a light meal and drinks. You can register through our Get Involved page.",
  },
  {
    question: "How much does the MyGreatMarriage Conference cost?",
    answer:
      "The MyGreatMarriage Conference 2026 offers two pricing tiers: Early Bird at NAD 400 per couple (available until April 24, 2026) and Standard at NAD 550 per couple. The conference takes place May 7-9, 2026 in Windhoek, Namibia. Registration includes all sessions, materials, and meals during the event.",
  },
  {
    question: "What is Active Parenting?",
    answer:
      "Active Parenting is our evidence-based parenting skills program that equips parents with practical tools for raising responsible, cooperative children. The program covers communication skills, discipline techniques, and building strong parent-child relationships. Sessions are facilitated by trained leaders and are available throughout Namibia.",
  },
  {
    question: "How do I register for Table Talk for Men?",
    answer:
      "To register for Table Talk for Men, visit our Get Involved page and fill out the registration form in the Sign Up Today section. Select your preferred session date, provide your contact details, and complete the registration. You will receive a unique Dynamic Code for payment reference. The registration fee is NAD 50 per person.",
  },
  {
    question: "What is the Missions for Men program?",
    answer:
      "Missions for Men is our community service and outreach initiative where men serve together on purpose-driven projects that transform neighborhoods. Projects include home repairs for vulnerable families, school maintenance, community clean-ups, and mentoring youth. It builds brotherhood while making a tangible difference in Namibian communities.",
  },
  {
    question: "Can I attend events if I am not from Namibia?",
    answer:
      "Yes, our events are open to men and couples from all countries. While The Fatherhood Foundation is based in Windhoek, Namibia, we welcome international attendees to our conferences and gatherings. For the MyGreatMarriage Conference, we recommend booking accommodation in advance as the event spans multiple days.",
  },
]

// FAQ structured data for rich search results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-b from-[#D4B896]/20 to-background">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <FadeIn direction="up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8B2B3E]/10 mb-6">
                <HelpCircle className="w-8 h-8 text-[#8B2B3E]" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our programs, events, and how to get involved
                with The Fatherhood Foundation.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-border rounded-lg px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-[#8B2B3E] py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 lg:py-24 bg-[#8B2B3E]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Can&apos;t find what you&apos;re looking for? Our team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#8B2B3E] font-semibold rounded-full hover:bg-white/90 transition-colors"
              >
                Contact Us
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
