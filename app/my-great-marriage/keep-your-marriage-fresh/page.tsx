import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
  title: "Keep Your Marriage Fresh | My Great Marriage | The Fatherhood Foundation",
  description:
    "Get a free Monthly Marriage Check-In template and weekly encouragement for husbands, wives, and couples to help keep your marriage fresh, connected, and Christ-centered.",
  openGraph: {
    title: "Keep Your Marriage Fresh | My Great Marriage",
    description:
      "Get a free Monthly Marriage Check-In template and weekly encouragement for husbands, wives, and couples to help keep your marriage fresh, connected, and Christ-centered.",
    url: "https://www.thefatherhoodfoundation.org/my-great-marriage/keep-your-marriage-fresh",
    siteName: "The Fatherhood Foundation",
    type: "website",
  },
  alternates: {
    canonical: "https://www.thefatherhoodfoundation.org/my-great-marriage/keep-your-marriage-fresh",
  },
}

export default function KeepYourMarriageFreshPage() {
  return (
    <>
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
