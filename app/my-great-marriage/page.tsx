"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { FadeIn } from "@/components/ui/motion"

// Diverse couples for the slider
const coupleSlides = [
  { src: "/images/couples/couple-african.jpg", alt: "African couple sharing an intimate moment" },
  { src: "/images/couples/couple-asian.jpg", alt: "Asian couple laughing together" },
  { src: "/images/couples/couple-hispanic.jpg", alt: "Hispanic couple embracing" },
  { src: "/images/couples/couple-mixed.jpg", alt: "Mixed-race couple in love" },
  { src: "/images/couples/couple-1.jpg", alt: "Couple celebrating together" },
  { src: "/images/couples/couple-2.jpg", alt: "Couple sharing a tender moment" },
]

// Carven Izaks quotes for scrolling marquee
const carvenQuotes = [
  "Marriage trust breaks down when fear becomes stronger than truth",
  "Nothing is more devastating than having your pain used as a weapon against you",
  "Healing begins where honesty is met with mercy",
  '"I was wrong" can open a door that defensiveness keeps shut',
  "Your marriage will be tested — but the test is not to destroy you; it is to strengthen what is real",
]

const cssStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee-content {
    display: inline-block;
    animation: marquee 40s linear infinite;
  }
  .marquee-content:hover {
    animation-play-state: paused;
  }
  @keyframes fadeSlideUp { 
    from { opacity: 0; transform: translateY(20px); } 
    to { opacity: 1; transform: translateY(0); } 
  }
  .fade-slide-up { animation: fadeSlideUp 0.6s ease both; }
`

export default function MyGreatMarriagePage() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % coupleSlides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + coupleSlides.length) % coupleSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <Header />

      <main className="pt-20">

        {/* Hero with Sliding Couples */}
        <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
          {coupleSlides.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 fade-slide-up">
                My Great Marriage
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 fade-slide-up" style={{ animationDelay: "0.1s" }}>
                Build something beautiful. Together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center fade-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button
                  size="lg"
                  className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8 font-semibold"
                  asChild
                >
                  <Link href="/my-great-marriage/keep-your-marriage-fresh">
                    Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {coupleSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50"}`}
              />
            ))}
          </div>
        </section>

        {/* Scrolling Quotes Marquee */}
        <section className="bg-[#3D1520] py-5 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content">
              {[...carvenQuotes, ...carvenQuotes].map((quote, i) => (
                <span key={i} className="inline-flex items-center mx-12">
                  <span className="text-white/90 text-sm md:text-base italic">&ldquo;{quote}&rdquo;</span>
                  <span className="ml-4 text-[#D4A574] text-xs font-semibold tracking-wide">— Carven Izaks</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Value Proposition */}
        <section className="py-20 lg:py-28 bg-white px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Heart of It</span>
              <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#1a0a0e] leading-snug text-balance" style={{ fontFamily: "Georgia, serif" }}>
                Great marriages don&apos;t happen by accident.
              </h2>
              <p className="mt-6 text-lg text-[#6b4c52] leading-relaxed max-w-2xl mx-auto">
                They&apos;re built with intention, honesty, and small steps taken together. 
                We&apos;re here to help you take those steps.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Visual Grid with Couples */}
        <section className="py-16 bg-[#FDF8F3] px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coupleSlides.slice(0, 4).map((slide, i) => (
                <FadeIn key={slide.src} direction="up" delay={i * 0.1}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Second Scrolling Quote - Different Direction */}
        <section className="bg-[#8B2B3E] py-5 overflow-hidden">
          <div className="marquee-container" style={{ direction: "rtl" }}>
            <div className="marquee-content" style={{ direction: "ltr" }}>
              {[...carvenQuotes.slice().reverse(), ...carvenQuotes.slice().reverse()].map((quote, i) => (
                <span key={i} className="inline-flex items-center mx-12">
                  <span className="text-white/90 text-sm md:text-base italic">&ldquo;{quote}&rdquo;</span>
                  <span className="ml-4 text-[#D4A574] text-xs font-semibold tracking-wide">— Carven Izaks</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer - Minimal */}
        <section className="py-20 lg:py-28 bg-white px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What We Offer</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>
                Tools for Real Life
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Weekly Encouragement", desc: "Short, practical emails for husbands, wives, and couples." },
                { title: "Monthly Check-Ins", desc: "A simple template to keep the conversation going." },
                { title: "Workshops & Events", desc: "Deeper dives when you're ready to go further." },
              ].map((item, i) => (
                <FadeIn key={item.title} direction="up" delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl bg-[#FDF8F3] border border-[#e8d8c8] hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-1 bg-[#8B2B3E] rounded-full mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-[#1a0a0e] mb-3">{item.title}</h3>
                    <p className="text-[#6b4c52] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-[#3D1520] px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Ready to invest in your marriage?
            </h2>
            <p className="text-white/75 mb-8 text-lg">
              Start with a free monthly check-in template and weekly encouragement.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#D4A574] hover:bg-[#c4955e] text-[#1a0a0e] rounded-full px-10 font-semibold"
            >
              <Link href="/my-great-marriage/keep-your-marriage-fresh">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Third Quote Scroll */}
        <section className="bg-[#D4B896] py-4 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content" style={{ animationDuration: "30s" }}>
              {[...carvenQuotes, ...carvenQuotes].map((quote, i) => (
                <span key={i} className="inline-flex items-center mx-10">
                  <span className="text-[#3D1520] text-sm font-medium italic">&ldquo;{quote}&rdquo;</span>
                  <span className="ml-3 text-[#8B2B3E] text-xs font-bold tracking-wide">— Carven Izaks</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Teaser */}
        <section className="py-16 bg-white px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Coming Soon</span>
            <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-[#1a0a0e] mb-4">
              Next Conference: September 2026
            </h2>
            <Button
              asChild
              variant="outline"
              className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full px-8 bg-transparent"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
