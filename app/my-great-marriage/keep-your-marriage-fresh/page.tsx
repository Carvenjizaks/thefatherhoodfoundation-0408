import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HowToSchema } from "@/components/structured-data"
import HeroSection from "./sections/hero-section"
import WhySection from "./sections/why-section"
import WhatYouGetSection from "./sections/what-you-get-section"
import HowItWorksSection from "./sections/how-it-works-section"
import SignupSection from "./sections/signup-section"
import TemplatePreviewSection from "./sections/template-preview-section"
import TestimonialsSection from "./sections/testimonials-section"
import FaqSection from "./sections/faq-section"
import FinalCtaSection from "./sections/final-cta-section"

export const metadata: Metadata = {
  title: "Keep Your Marriage Fresh | Free Weekly Encouragement for Couples",
  description:
    "Sign up for free weekly marriage encouragement emails and monthly check-in reminders. Get practical faith-based tools to keep your marriage fresh, connected, and thriving.",
  keywords: [
    "marriage encouragement",
    "couples email",
    "marriage check-in",
    "husband encouragement",
    "wife encouragement",
    "marriage tips",
    "faith-based marriage",
    "free marriage resources",
    "couples devotional",
    "marriage newsletter",
  ],
  openGraph: {
    title: "Keep Your Marriage Fresh | Free Weekly Encouragement",
    description:
      "Sign up for free weekly marriage encouragement emails. Practical faith-based tools for husbands, wives, and couples to stay connected.",
    url: "https://thefatherhoodfoundation.org/my-great-marriage/keep-your-marriage-fresh",
    siteName: "The Fatherhood Foundation",
    type: "website",
    images: [
      {
        url: "/images/couples/couple-african.jpg",
        width: 1200,
        height: 630,
        alt: "Couple enjoying their marriage journey together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keep Your Marriage Fresh | Free Weekly Encouragement",
    description: "Free weekly marriage encouragement for couples. Practical faith-based tools to stay connected.",
    images: ["/images/couples/couple-african.jpg"],
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org/my-great-marriage/keep-your-marriage-fresh",
  },
}

// AEO: HowTo steps for AI assistants to understand the signup process
const signupSteps = [
  {
    name: "Enter husband details",
    text: "Provide the husband's first name and email address in the signup form.",
  },
  {
    name: "Enter wife details",
    text: "Provide the wife's first name and email address in the signup form.",
  },
  {
    name: "Add wedding anniversary",
    text: "Enter your wedding anniversary date to receive special anniversary messages.",
  },
  {
    name: "Submit and confirm",
    text: "Click 'Sign Up' to begin receiving weekly encouragement emails every Tuesday.",
  },
]

export default function KeepYourMarriageFreshPage() {
  return (
    <>
      {/* AEO: HowTo Schema for voice/AI discovery */}
      <HowToSchema
        name="How to Sign Up for My Great Marriage"
        description="Sign up for free weekly marriage encouragement emails in 4 simple steps."
        steps={signupSteps}
      />
      
      <Header />
      <main className="pt-20">
        <HeroSection />
        <WhySection />
        <WhatYouGetSection />
        <HowItWorksSection />
        <SignupSection />
        <TemplatePreviewSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
