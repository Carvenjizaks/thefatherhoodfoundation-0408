"use client"

// v4 - Force rebuild to fix hydration and Supabase URL
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle, Heart, Trophy, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
}: {
  number: string
  icon: React.ElementType
  title: string
  content: string
  delay?: number
}) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative flex gap-6 lg:gap-8">
        {/* Timeline connector */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#8B2B3E] text-white font-bold text-lg shadow-lg">
            {number}
          </div>
          <div className="w-0.5 h-full bg-[#8B2B3E]/30 mt-4" />
        </div>

        {/* Content */}
        <div className="flex-1 pb-16">
          <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#8B2B3E]/10">
                <Icon className="w-6 h-6 text-[#8B2B3E]" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">{content}</p>
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

          <div
            ref={heroRef}
            className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20 transition-all duration-1000 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Monthly Table Talk for Men
            </h1>
            <p className="text-lg lg:text-xl text-white/80 text-balance leading-relaxed max-w-2xl mx-auto">
              A gathering space where men from all walks of life come together for real conversation about everyday life.
            </p>
            <p className="mt-6 text-white font-semibold text-lg">
              Include these dates in your calendar
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-[#8B0000] hover:bg-[#6B0000] text-white font-semibold">
                <Link href="/get-involved">
                  Join the Table <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Animated scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-20 lg:py-32 bg-[#F5F0E8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                The Journey Around the Table
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover what happens when men gather with purpose and honesty.
              </p>
            </div>

            <div className="relative">
              <JourneyStep
                number="01"
                icon={MessageCircle}
                title="Honest Conversations"
                content="Here we speak honestly about the challenges men face — in our families, our work, our faith, and our personal struggles. It's a place to listen and learn from one another, discovering wisdom through the real-life journeys of other men who have faced similar battles and found a way forward."
                delay={0}
              />

              <JourneyStep
                number="02"
                icon={Users}
                title="Wisdom in Stories"
                content="Often the answers we need are found in the stories of others — in their pain, their perseverance, and their victories. Around this table, men share openly, encourage one another, and grow stronger together."
                delay={100}
              />

              <JourneyStep
                number="03"
                icon={Trophy}
                title="Celebrating Victories"
                content="This is also a place to celebrate the wins. When a brother succeeds, overcomes, or reaches a milestone, the community stands with him and celebrates the victory."
                delay={200}
              />

              <JourneyStep
                number="04"
                icon={Heart}
                title="A Place for Honest Men"
                content="The Monthly Table Talk is not a place for perfect men. It is a place for honest men — men who desire growth, authentic community, and true brotherhood as they pursue becoming better fathers, husbands, leaders, and men of character."
                delay={300}
              />
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real Talk",
                  description: "No pretenses. No facades. Just authentic conversations about real life.",
                  bgColor: "bg-[#8B0000]",
                  textColor: "text-white",
                },
                {
                  title: "Brotherhood",
                  description: "A community of men who stand together, support each other, and grow as one.",
                  bgColor: "bg-[#1E3A5F]",
                  textColor: "text-white",
                },
                {
                  title: "Growth",
                  description: "Every gathering is an opportunity to become a better man, father, and leader.",
                  bgColor: "bg-[#A67C52]",
                  textColor: "text-white",
                },
              ].map((item, index) => {
                const { ref, isInView } = useInView()
                return (
                  <div
                    key={item.title}
                    ref={ref}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-700 hover:scale-105 ${
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    } ${item.bgColor}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className={`p-8 lg:p-10 min-h-[250px] flex flex-col justify-end ${item.textColor}`}>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="opacity-90 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-[#1E3A5F] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            {/* Open Chair Illustration */}
            <div className="mb-10">
              <svg
                viewBox="0 0 240 220"
                className="w-48 h-44 mx-auto drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Wood grain gradient */}
                  <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5A2B" />
                    <stop offset="25%" stopColor="#A0522D" />
                    <stop offset="50%" stopColor="#8B4513" />
                    <stop offset="75%" stopColor="#A0522D" />
                    <stop offset="100%" stopColor="#6B3D1E" />
                  </linearGradient>
                  <linearGradient id="woodGrainDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5D3A1A" />
                    <stop offset="50%" stopColor="#704214" />
                    <stop offset="100%" stopColor="#5D3A1A" />
                  </linearGradient>
                  <linearGradient id="seatTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#CD853F" />
                    <stop offset="100%" stopColor="#8B4513" />
                  </linearGradient>
                  <linearGradient id="legGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5D3A1A" />
                    <stop offset="30%" stopColor="#8B4513" />
                    <stop offset="70%" stopColor="#8B4513" />
                    <stop offset="100%" stopColor="#4A2F15" />
                  </linearGradient>
                  {/* Shadow filter */}
                  <filter id="chairShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.3" />
                  </filter>
                </defs>
                
                <g filter="url(#chairShadow)">
                  {/* Back legs (behind) */}
                  <path d="M65 115 C63 140, 55 170, 50 200" stroke="url(#legGradient)" strokeWidth="10" strokeLinecap="round" fill="none" />
                  <path d="M175 115 C177 140, 185 170, 190 200" stroke="url(#legGradient)" strokeWidth="10" strokeLinecap="round" fill="none" />
                  
                  {/* Chair back frame - outer */}
                  <path
                    d="M55 105 L55 35 Q55 25 65 22 L175 22 Q185 25 185 35 L185 105"
                    fill="url(#woodGrain)"
                    stroke="#4A2F15"
                    strokeWidth="2"
                  />
                  
                  {/* Chair back inner panel */}
                  <rect x="65" y="32" width="110" height="68" rx="3" fill="#6B3D1E" opacity="0.4" />
                  
                  {/* Vertical slats with rounded tops */}
                  <path d="M85 38 L85 92 Q85 95 88 95 L92 95 Q95 95 95 92 L95 38 Q95 35 90 35 Q85 35 85 38" fill="url(#woodGrainDark)" />
                  <path d="M110 38 L110 92 Q110 95 113 95 L117 95 Q120 95 120 92 L120 38 Q120 35 115 35 Q110 35 110 38" fill="url(#woodGrainDark)" />
                  <path d="M135 38 L135 92 Q135 95 138 95 L142 95 Q145 95 145 92 L145 38 Q145 35 140 35 Q135 35 135 38" fill="url(#woodGrainDark)" />
                  <path d="M160 38 L160 92 Q160 95 163 95 L167 95 Q170 95 170 92 L170 38 Q170 35 165 35 Q160 35 160 38" fill="url(#woodGrainDark)" />
                  
                  {/* Top rail with curve */}
                  <path
                    d="M55 35 Q55 25 65 22 L175 22 Q185 25 185 35 L185 45 Q120 50 55 45 Z"
                    fill="url(#woodGrain)"
                    stroke="#4A2F15"
                    strokeWidth="1"
                  />
                  
                  {/* Seat - 3D effect */}
                  <path
                    d="M45 105 L195 105 L185 125 L55 125 Z"
                    fill="url(#seatTop)"
                    stroke="#4A2F15"
                    strokeWidth="2"
                  />
                  {/* Seat front edge */}
                  <path
                    d="M55 125 L185 125 L180 132 L60 132 Z"
                    fill="#6B3D1E"
                    stroke="#4A2F15"
                    strokeWidth="1"
                  />
                  {/* Seat highlight */}
                  <ellipse cx="120" cy="112" rx="55" ry="6" fill="white" opacity="0.15" />
                  
                  {/* Front legs with taper */}
                  <path d="M60 132 C58 155, 48 180, 42 210" stroke="url(#legGradient)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <path d="M180 132 C182 155, 192 180, 198 210" stroke="url(#legGradient)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  
                  {/* Cross brace between front legs */}
                  <path d="M52 175 Q120 180 188 175" stroke="url(#woodGrainDark)" strokeWidth="6" strokeLinecap="round" fill="none" />
                  
                  {/* Subtle wood grain lines on seat */}
                  <path d="M70 110 Q120 108 170 110" stroke="#6B3D1E" strokeWidth="0.5" opacity="0.3" fill="none" />
                  <path d="M65 115 Q120 113 175 115" stroke="#6B3D1E" strokeWidth="0.5" opacity="0.3" fill="none" />
                  <path d="M60 120 Q120 118 180 120" stroke="#6B3D1E" strokeWidth="0.5" opacity="0.3" fill="none" />
                </g>
                
                {/* Floor shadow */}
                <ellipse cx="120" cy="212" rx="70" ry="8" fill="black" opacity="0.2" />
              </svg>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-balance">
              Your Seat at the Table is Waiting
            </h2>
            <p className="text-lg text-white/70 mb-10 text-balance leading-relaxed max-w-2xl mx-auto">
              Join a brotherhood of men committed to growth, honesty, and becoming the best versions of themselves.
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
