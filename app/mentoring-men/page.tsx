"use client"

// v5 - Added cinematic animations
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle, Heart, Trophy, Users, Coffee, Calendar, MapPin, Clock, Quote, Handshake, Target, Shield } from "lucide-react"
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
            <FadeIn delay={0.05} direction="up">
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/tabletalk-logo.jpg"
                  alt="TableTalk for Men - Fatherhood Foundation logo"
                  width={180}
                  height={180}
                  className="rounded-full shadow-2xl border-4 border-white/20"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
                Monthly Table Talk for Men
              </h1>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
            <p className="text-lg lg:text-xl text-white/80 text-balance leading-relaxed max-w-2xl mx-auto">
              Where men come together to rub shoulders, share life experiences, and engage in meaningful conversations about the <span className="text-[#D4A574] font-semibold">Matters of Life</span> — as men, husbands, and fathers.
            </p>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4" /> First Saturday of Each Month
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" /> 8:30am - 10:30am
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4" /> Scouts Hall, Suiderhof
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <div className="mt-10">
                <Button asChild size="lg" className="bg-[#8B0000] hover:bg-[#6B0000] hover:scale-105 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl">
                  <Link href="/get-involved#signup-form">
                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
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

        {/* What is TableTalk Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full text-sm font-semibold mb-4">
                  More Than Just a Meeting
                </span>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                  What is TableTalk for Men?
                </h2>
              </div>
            </FadeIn>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left" delay={0.2}>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">TableTalk for Men</span> is a monthly gathering where men from all walks of life come together to engage in authentic, meaningful conversations about the things that matter most.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    It&apos;s not a seminar. It&apos;s not a lecture. It&apos;s a <span className="font-semibold text-[#8B2B3E]">table</span> — where men sit together, share a meal, and talk openly about their journeys as <span className="font-semibold">men</span>, <span className="font-semibold">husbands</span>, and <span className="font-semibold">fathers</span>.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We call it <span className="italic text-[#8B2B3E] font-semibold">&quot;TableTalk-4-Men&quot;</span> — because we talk about the things that matter to men in every facet of his life. The real stuff. The hard stuff. The victories and the struggles. The questions that keep us up at night and the breakthroughs that change everything.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="right" delay={0.3}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E] rounded-2xl p-8 text-white">
                    <Quote className="w-12 h-12 text-white/30 mb-4" />
                    <p className="text-xl lg:text-2xl font-medium leading-relaxed mb-6">
                      &quot;Around this table, I found men who understood my struggles without judgment. For the first time, I didn&apos;t have to pretend to have it all together.&quot;
                    </p>
                    <p className="text-white/70">— A TableTalk Participant</p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4A574]/20 rounded-full blur-2xl" />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Matters of Life Topics */}
        <section className="py-20 lg:py-28 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Matters of Life We Discuss
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Every month, we gather around topics that touch the core of a man&apos;s existence.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Being a Man", desc: "What does true masculinity look like in today's world? How do we lead with strength and humility?" },
                { icon: Heart, title: "Marriage & Relationships", desc: "Building and maintaining strong, loving relationships with our spouses and partners." },
                { icon: Users, title: "Fatherhood", desc: "Raising children with intention, being present, and leaving a legacy that matters." },
                { icon: Target, title: "Purpose & Direction", desc: "Finding clarity in our calling, careers, and the impact we want to make." },
                { icon: Handshake, title: "Build Authentic Manhood", desc: "Why men need other men, and how to build authentic friendships." },
                { icon: Coffee, title: "Life's Challenges", desc: "Navigating hardships, failures, and setbacks with resilience and hope." },
              ].map((topic, index) => (
                <ScaleIn key={topic.title} delay={index * 0.1}>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                    <div className="w-12 h-12 bg-[#8B2B3E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#8B2B3E] transition-colors duration-300">
                      <topic.icon className="w-6 h-6 text-[#8B2B3E] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{topic.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{topic.desc}</p>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <JourneyAroundTable />

        {/* Who is TableTalk For */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Who is This Table For?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The table is set for every man who desires to grow, connect, and become better.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeIn direction="left" delay={0.2}>
                <div className="bg-[#F5F0E8] rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-6">This table IS for you if...</h3>
                  <ul className="space-y-4">
                    {[
                      "You want to connect with other men on a deeper level",
                      "You're looking for a safe space to share your journey",
                      "You desire to grow as a man, husband, or father",
                      "You believe in the power of authentic community",
                      "You want to learn from other men's experiences",
                      "You're ready to invest in yourself and others",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              
              <FadeIn direction="right" delay={0.3}>
                <div className="bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E] rounded-2xl p-8 text-white h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-6">You don&apos;t need to be...</h3>
                  <ul className="space-y-4">
                    {[
                      "A perfect man with everything figured out",
                      "Religious or from any particular background",
                      "An expert speaker or communicator",
                      "Already connected to a community",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm">-</span>
                        </div>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-lg text-white/80 italic">
                    &quot;The only requirement is a willingness to show up authentically.&quot;
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Values circles */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 mt-16">
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
                      className={`group relative w-56 h-56 lg:w-64 lg:h-64 rounded-full ${item.bgColor} shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 flex items-center justify-center text-center p-6`}
                    >
                      <div className="text-white">
                        <h3 className="text-xl lg:text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-xs lg:text-sm opacity-90 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* A Typical Morning Section */}
        <section className="py-20 lg:py-28 bg-[#1E3A5F] text-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Happens at TableTalk?</h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  A glimpse into a typical Saturday morning with us.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { time: "8:30am", title: "Arrival & Breakfast", desc: "Grab a plate, pour some coffee, and find your seat at the table." },
                { time: "9:00am", title: "Welcome & Icebreaker", desc: "We kick things off with introductions and a light conversation starter." },
                { time: "9:15am", title: "The Topic", desc: "A facilitator introduces the month's 'Matter of Life' and opens the floor." },
                { time: "10:00am", title: "Table Discussions", desc: "Men share openly, ask questions, and learn from each other's journeys." },
              ].map((item, index) => (
                <ScaleIn key={item.time} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-[#D4A574] font-bold text-lg mb-2">{item.time}</div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </ScaleIn>
              ))}
            </div>
            
            <FadeIn direction="up" delay={0.4}>
              <div className="mt-16 text-center">
                <p className="text-xl text-white/80 italic max-w-2xl mx-auto">
                  &quot;By 10:30am, you&apos;ll leave with new perspectives, meaningful connections, and something to think about for the rest of the week.&quot;
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <FadeIn direction="up" delay={0.1}>
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/tabletalk-logo.jpg"
                  alt="TableTalk for Men logo"
                  width={140}
                  height={140}
                  className="rounded-full shadow-2xl border-4 border-white/20"
                />
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 text-balance">
                Your Seat at the Table is Waiting
              </h2>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.3}>
              <p className="text-lg lg:text-xl text-white/80 mb-8 text-balance leading-relaxed max-w-2xl mx-auto">
                Join a brotherhood of men committed to growth, honesty, and becoming the best versions of themselves. The conversations that change your life start here.
              </p>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.4}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-10 max-w-md mx-auto">
                <p className="text-white/70 text-sm mb-2">Registration Fee</p>
                <p className="text-4xl font-bold text-white mb-2">
                  NAD 65 <span className="text-lg font-normal text-white/60">per person</span>
                </p>
                <p className="text-white/60 text-sm">Includes breakfast and materials</p>
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href="/events">
                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <Link href="/get-involved">Get Involved</Link>
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.6}>
              <p className="mt-10 text-white/60 text-sm">
                Questions? Contact us at <a href="mailto:info@ffrep.org" className="text-[#D4A574] hover:underline">info@ffrep.org</a>
              </p>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
