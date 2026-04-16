"use client"

// v5 - Added cinematic animations
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle, Heart, Trophy, Users } from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"
import { FadeIn, ScaleIn, Parallax } from "@/components/ui/motion"

const journeySteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Honest Conversations",
    content: "Here we speak honestly about the challenges men face — in our families, our work, our faith, and our personal struggles. It's a place to listen and learn from one another, discovering wisdom through the real-life journeys of other men who have faced similar battles and found a way forward.",
  },
  {
    number: "02",
    icon: Users,
    title: "Wisdom in Stories",
    content: "Often the answers we need are found in the stories of others — in their pain, their perseverance, and their victories. Around this table, men share openly, encourage one another, and grow stronger together.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Celebrating Victories",
    content: "This is also a place to celebrate the wins. When a brother succeeds, overcomes, or reaches a milestone, the community stands with him and celebrates the victory.",
  },
  {
    number: "04",
    icon: Heart,
    title: "A Place for Honest Men",
    content: "The Monthly Table Talk is not a place for perfect men. It is a place for honest men — men who desire growth, authentic community, and true brotherhood as they pursue becoming better fathers, husbands, leaders, and men of character.",
  },
]

function JourneyAroundTable() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const nextStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % journeySteps.length)
  }, [])

  // Auto-advance effect
  useEffect(() => {
    if (isVisible && !isPaused) {
      const interval = setInterval(() => {
        nextStep()
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isVisible, isPaused, nextStep])

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-[#F5F0E8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}>
            The Journey Around the Table
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}>
            Discover what happens when men gather with purpose and honesty.
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {journeySteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`relative h-2 rounded-full transition-all duration-500 ${
                  i === activeStep ? "w-12 bg-[#8B2B3E]" : "w-2 bg-[#8B2B3E]/30 hover:bg-[#8B2B3E]/50"
                }`}
                aria-label={`Go to step ${i + 1}`}
              >
                {i === activeStep && !isPaused && (
                  <span 
                    className="absolute inset-0 bg-[#8B2B3E]/50 rounded-full animate-pulse"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {journeySteps.map((step, index) => (
            <JourneyStep
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              content={step.content}
              delay={index * 100}
              isActive={index === activeStep}
              onClick={() => setActiveStep(index)}
              onMouseEnter={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

function JourneyStep({
  number,
  icon: Icon,
  title,
  content,
  delay = 0,
  isActive = false,
  onClick,
  onMouseEnter,
}: {
  number: string
  icon: React.ElementType
  title: string
  content: string
  delay?: number
  isActive?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`cursor-pointer transition-all duration-700 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative flex gap-6 lg:gap-8">
        {/* Timeline connector */}
        <div className="flex flex-col items-center">
          <div className={`relative flex items-center justify-center w-14 h-14 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-500 ${
            isActive ? "bg-[#8B2B3E] scale-110" : "bg-[#8B2B3E]/60 scale-100"
          }`}>
            {/* Pulsing ring when active */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-[#8B2B3E] animate-ping opacity-30" />
            )}
            <span className="relative z-10">{number}</span>
          </div>
          <div className={`w-0.5 h-full mt-4 transition-all duration-500 ${
            isActive ? "bg-[#8B2B3E]" : "bg-[#8B2B3E]/30"
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 pb-16">
          <div className={`bg-card border rounded-2xl p-6 lg:p-8 transition-all duration-500 ${
            isActive 
              ? "border-[#8B2B3E] shadow-xl scale-[1.02]" 
              : "border-border shadow-sm hover:shadow-md"
          }`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl transition-all duration-500 ${
                isActive ? "bg-[#8B2B3E] scale-110" : "bg-[#8B2B3E]/10"
              }`}>
                <Icon className={`w-6 h-6 transition-colors duration-500 ${
                  isActive ? "text-white" : "text-[#8B2B3E]"
                }`} />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h3>
            </div>
            <p className={`leading-relaxed text-lg transition-all duration-500 ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`}>{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MentoringMenPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
  }, [])

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/table-talk-banner.jpg"
              alt="Large gathering of men at Monthly Table Talk event"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] via-transparent to-transparent" />
          </div>
          
          {/* Cinematic floating elements */}
          <Parallax speed={0.3} className="absolute top-20 left-10 w-64 h-64 bg-[#8B2B3E]/10 rounded-full blur-3xl" />
          <Parallax speed={0.5} className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />

          <div
            ref={heroRef}
            className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20 transition-all duration-1000 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
                Monthly Table Talk for Men
              </h1>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
            <p className="text-lg lg:text-xl text-white/80 text-balance leading-relaxed max-w-2xl mx-auto">
              A gathering space where men from all walks of life come together for real conversation about everyday life.
            </p>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p className="mt-6 text-white font-semibold text-lg">
                Include these dates in your calendar
              </p>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <div className="mt-10">
                <Button asChild size="lg" className="bg-[#8B0000] hover:bg-[#6B0000] hover:scale-105 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl">
                  <Link href="/get-involved">
                    Join the Table <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Animated scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <JourneyAroundTable />

        {/* Values Grid */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">THE TABLE IS FOR...</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
              {[
                {
                  title: "Real Talk",
                  description: "No pretenses. No facades. Just authentic conversations about real life.",
                  bgColor: "bg-[#8B0000]",
                },
                {
                  title: "Brotherhood",
                  description: "A community of men who stand together, support each other, and grow as one.",
                  bgColor: "bg-[#1E3A5F]",
                },
                {
                  title: "Growth",
                  description: "Every gathering is an opportunity to become a better man, father, and leader.",
                  bgColor: "bg-[#A67C52]",
                },
              ].map((item, index) => {
                const { ref, isInView } = useInView()
                return (
                  <div
                    key={item.title}
                    ref={ref}
                    className={`transition-all duration-700 ${
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`group relative w-64 h-64 lg:w-72 lg:h-72 rounded-full ${item.bgColor} shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 flex items-center justify-center text-center p-8`}
                    >
                      <div className="text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-3">{item.title}</h3>
                        <p className="text-sm lg:text-base opacity-90 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-[#1E3A5F] relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/men-at-table.jpg"
              alt="Men sitting around a table in fellowship"
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/90 via-[#1E3A5F]/50 to-[#1E3A5F]/30" />
          </div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-balance">
              Your Seat at the Table is Waiting
            </h2>
            <p className="text-lg text-white/70 mb-4 text-balance leading-relaxed max-w-2xl mx-auto">
              Join a brotherhood of men committed to growth, honesty, and becoming the best versions of themselves.
            </p>
            <p className="text-2xl font-bold text-[#D4A574] mb-10">
              NAD 50 <span className="text-base font-normal text-white/60">per man</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#8B0000] hover:bg-[#6B0000] text-white font-semibold">
                <Link href="/get-involved">
                  Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
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
