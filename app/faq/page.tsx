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
  ],
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
      "You can register for the MyGreatMarriage Conference 2026 directly on our website. Visit the Events page and click on the MyGreatMarriage Conference to access the registration form. Early bird pricing is available until May 1, 2026.",
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
      "You can reach us through our website contact form, email us at info@thefatherhoodfoundation.org, or connect with us on social media. We typically respond to inquiries within 1-2 business days.",
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
