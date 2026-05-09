"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageSquare, Shield, Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { FadeIn, ScaleIn, Parallax } from "@/components/ui/motion"

const bannerSlides = [
  { src: "/images/couples/couple-together-1.jpg", alt: "Happy couple sharing an intimate moment" },
  { src: "/images/couples/couple-1.jpg", alt: "Couple celebrating together" },
  { src: "/images/couples/couple-2.jpg", alt: "Couple sharing a tender moment" },
  { src: "/images/couples/couple-3.jpg", alt: "Loving couple smiling" },
  { src: "/images/couples/couple-4.jpg", alt: "Couple embracing warmly" },
  { src: "/images/couples/couple-5.jpg", alt: "Joyful couple laughing together" },
]

const flipCardStyle = `
  .flip-card { perspective: 1000px; }
  .flip-card-inner { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; position: relative; width: 100%; height: 100%; }
  .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
  .flip-card-front, .flip-card-back { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 1rem; }
  .flip-card-back { transform: rotateY(180deg); }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  .fade-slide-up { animation: fadeSlideUp 0.55s ease both; }
`

const focusAreas = [
  {
    icon: MessageSquare,
    title: "Communication",
    desc: "Learn to listen deeply and express yourself clearly and lovingly.",
  },
  {
    icon: Shield,
    title: "Conflict Resolution",
    desc: "Navigate disagreements constructively and emerge stronger together.",
  },
  {
    icon: Heart,
    title: "Intimacy & Romance",
    desc: "Keep the spark alive and deepen emotional and physical connection.",
  },
  {
    icon: Sparkles,
    title: "Shared Vision",
    desc: "Align your goals and dreams to build a unified future together.",
  },
]

const offerings = [
  {
    title: "Workshops: Finances",
    desc: "Practical sessions to help couples align on money, build a shared budget, and make financial decisions together — without the tension. Because financial unity is a marriage issue.",
  },
  {
    title: "Workshops: Start Out Life Together",
    desc: "Designed for newlyweds and newly committed couples, this workshop lays the foundation — expectations, roles, communication, and values — before bad habits take root.",
  },
  {
    title: "Workshops: Restore & Refresh",
    desc: "For couples who feel stuck, distant, or worn down. A safe space to rediscover each other, address unresolved tension, and rebuild connection with practical tools and guided conversation.",
  },
  {
    title: "Small Groups",
    desc: "Join other couples in ongoing groups for support, accountability, and shared growth.",
  },
]

export default function MyGreatMarriagePage() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % bannerSlides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + bannerSlides.length) % bannerSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      <Header />

      <main className="pt-20">

        {/* Hero Banner Slider */}
        <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
          {/* Slides */}
          {bannerSlides.map((slide, i) => (
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
              {/* Subtle gradient for minimal text legibility - images stay clear */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
          ))}

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Logo - positioned left */}
                <div className="flex-shrink-0">
                  <Image
                    src="/images/mgm-logo.png"
                    alt="My Great Marriage Logo"
                    width={200}
                    height={200}
                    className="w-36 h-36 lg:w-48 lg:h-48 object-contain"
                  />
                </div>
                
                {/* Text content */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-tight mb-4">
                    My Great Marriage
                  </h1>
                  <p className="text-2xl lg:text-3xl font-semibold text-white/90 leading-tight text-balance max-w-3xl mb-6">
                    Build the Marriage You&apos;ve Always Dreamed Of
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed max-w-xl mb-8">
                    Through proven principles, expert guidance, and a supportive community, discover how to strengthen your bond and thrive together.
                  </p>
                  <p className="text-sm text-white/90 font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block mb-4">
                    Registration for MyGreatMarriage Conference 2026 is now closed
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button
                      size="lg"
                      className="bg-[#8B2B3E]/50 text-white rounded-full px-8 font-semibold cursor-default"
                      disabled
                    >
                      Registration Closed
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 rounded-full px-8 font-semibold bg-transparent"
                      asChild
                    >
                      <Link href="#overview">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prev / Next arrows */}
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
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50"}`}
              />
            ))}
          </div>
        </section>

        {/* Overview */}
        <section id="overview" className="py-20 lg:py-32 bg-white relative overflow-hidden">
          <Parallax speed={0.2} className="absolute top-20 right-0 w-72 h-72 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right" className="order-2 lg:order-1">
                <div className="relative h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
                  <Image
                    src="/images/couples/couple-together-1.jpg"
                    alt="Couple connecting"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </FadeIn>
              <div className="order-1 lg:order-2 space-y-6">
                <FadeIn direction="left" delay={0.1}>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Programme</span>
                </FadeIn>
                <FadeIn direction="left" delay={0.2}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#1a0a0e] leading-snug text-balance">
                    Invest in Your Most Important Relationship
                  </h2>
                </FadeIn>
                <FadeIn direction="left" delay={0.3}>
                  <p className="text-[#6b4c52] leading-relaxed">
                    <span className="font-semibold text-[#8B2B3E]">My Great Marriage</span> provides couples with the tools, principles, and support needed to build a thriving
                    relationship. Through workshops, retreats, and couple&apos;s groups, you&apos;ll learn effective communication,
                    conflict resolution, and how to maintain romance and intimacy throughout your marriage.
                  </p>
                </FadeIn>
                <FadeIn direction="left" delay={0.4}>
                  <p className="text-[#6b4c52] leading-relaxed">
                    Whether you&apos;re engaged, newlyweds, or have been married for decades, this program will help you
                    strengthen your bond and create the marriage you&apos;ve always desired.
                  </p>
                </FadeIn>
                <FadeIn direction="left" delay={0.5}>
                  <Button
                    size="lg"
                    className="bg-[#8B2B3E]/50 text-white rounded-full px-8 shadow-lg cursor-default"
                    disabled
                  >
                    Registration Closed
                  </Button>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Key Focus Areas */}
        <section className="py-20 lg:py-28 bg-[#FDF8F3] overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: flipCardStyle }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What You&apos;ll Learn</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">Proven Strategies for a Strong Marriage</h2>
              <p className="mt-4 text-[#6b4c52] max-w-xl mx-auto">
                Practical tools and timeless principles that work at every stage of your marriage. Hover each card to learn more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {focusAreas.map((area, i) => (
                <div
                  key={area.title}
                  className="flip-card h-56 fade-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <div className="flip-card-inner h-full">
                    {/* Front */}
                    <div className="flip-card-front bg-white border border-[#e8d8c8] flex flex-col items-center justify-center gap-5 p-8 shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center ring-4 ring-[#8B2B3E]/5">
                        <area.icon className="w-7 h-7 text-[#8B2B3E]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1a0a0e] text-center">{area.title}</h3>
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#D4A574]">Hover to explore</span>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back bg-[#8B2B3E] flex flex-col items-center justify-center gap-4 p-8">
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white text-center">{area.title}</h3>
                      <p className="text-white/85 text-sm leading-relaxed text-center">{area.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-3 mt-10">
              {focusAreas.map((area, i) => (
                <div
                  key={area.title}
                  className="flex flex-col items-center gap-1 group cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-[#8B2B3E]/30 group-hover:bg-[#8B2B3E] transition-colors duration-300" />
                  <span className="text-[10px] text-[#6b4c52] opacity-0 group-hover:opacity-100 transition-opacity font-medium">{area.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider quote */}
        <section className="bg-[#D4B896] py-14">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-xl lg:text-2xl italic text-[#3D2314] leading-relaxed text-balance">
              &ldquo;Good marriages don&apos;t happen by accident. They are built intentionally, one day at a time.&rdquo;
            </p>
          </div>
        </section>

        {/* Keep Your Marriage Fresh Banner */}
        <section className="py-16 bg-[#3D1520] px-6">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">New</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white text-balance mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Keep Your Marriage Fresh
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-8 leading-relaxed">
              Get a free Monthly Marriage Check-In template and weekly encouragement for husbands, wives, and couples — designed to help you stay connected and build a stronger Christ-centered marriage.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#D4A574] hover:bg-[#c4955e] text-[#1a0a0e] rounded-full px-8 font-semibold"
            >
              <Link href="/my-great-marriage/keep-your-marriage-fresh">
                Get the Free Marriage Check-In <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Program Offerings */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">How We Help</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">Programme Offerings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerings.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-[#e8d8c8] hover:border-[#8B2B3E] transition-all duration-500 hover:shadow-xl cursor-default min-h-[220px]"
                >
                  {/* Default state */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
                    <div className="w-10 h-1 bg-[#8B2B3E] rounded-full mb-6" />
                    <h3 className="text-xl font-bold text-[#1a0a0e] leading-snug">{item.title}</h3>
                    <span className="text-xs uppercase tracking-widest text-[#D4A574] font-semibold mt-4">Hover to learn more</span>
                  </div>

                  {/* Hover state */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between bg-[#8B2B3E] opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mt-3 flex-1">{item.desc}</p>
                    <Button
                      asChild
                      size="sm"
                      className="mt-4 bg-white text-[#8B2B3E] hover:bg-white/90 rounded-full font-semibold w-fit"
                    >
                      <Link href="/my-great-marriage">Learn More</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-[#FDF8F3] border-t border-[#e8d8c8]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Get Started</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance">
              Build the Marriage You&apos;ve Always Wanted
            </h2>
            <p className="text-[#6b4c52] leading-relaxed text-balance">
              Your marriage is worth investing in. Take the next step toward a stronger, more fulfilling relationship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                size="lg"
                className="bg-[#8B2B3E]/50 text-white rounded-full px-8 font-semibold cursor-default"
                disabled
              >
                Registration Closed
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full px-8 bg-transparent"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
