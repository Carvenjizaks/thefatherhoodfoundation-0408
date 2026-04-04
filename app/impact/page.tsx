"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, GraduationCap, Home, ArrowRight, Quote, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FadeIn, ScaleIn, Parallax } from "@/components/ui/motion"

const slideAnimationStyles = `
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-in-left { animation: slideInLeft 0.7s ease-out forwards; }
  .slide-in-right { animation: slideInRight 0.7s ease-out forwards; }
  .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .animation-delay-100 { animation-delay: 0.1s; }
  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-300 { animation-delay: 0.3s; }
  .animation-delay-400 { animation-delay: 0.4s; }
  .animation-delay-500 { animation-delay: 0.5s; }
`

// Animated counter that counts up when in view
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

return (
    <div ref={ref} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

const impactStats = [
  { value: 20000, suffix: "+", label: "Men Transformed", description: "Fathers equipped with purpose and identity" },
  { value: 500, suffix: "+", label: "Marriages Strengthened", description: "Couples restored and thriving" },
  { value: 15000, suffix: "+", label: "Youth Reached", description: "Young people mentored in character" },
  { value: 10, suffix: "+", label: "Years of Impact", description: "A decade of transformation" },
]

const stories = [
  {
    quote: "The Fatherhood Foundation gave me the tools to become the father I never had. My relationship with my children has been completely transformed.",
    name: "Michael T.",
    role: "Programme Graduate",
    image: "/images/impact/father-child-hero.jpg"
  },
  {
    quote: "Through the mentorship programme, I discovered my true identity as a man. It changed everything about how I lead my family.",
    name: "David K.",
    role: "Community Leader",
    image: "/images/impact/men-mentorship.jpg"
  },
  {
    quote: "The youth programme changed my life. I now have purpose and direction thanks to the mentors who believed in me.",
    name: "James M.",
    role: "Youth Programme Graduate",
    image: "/images/impact/youth-program.jpg"
  },
]

const programmes = [
  {
    icon: Users,
    title: "Men's Mentorship",
    description: "One-on-one and group mentorship helping men discover their identity, receive affirmation, and step into their purpose.",
    impact: "500+ men mentored annually"
  },
  {
    icon: Heart,
    title: "My Great Marriage",
    description: "Transformative conferences and workshops equipping couples with tools for lasting, fulfilling marriages.",
    impact: "100+ couples per conference"
  },
  {
    icon: GraduationCap,
    title: "Youth Character Development",
    description: "School-based programmes instilling values, principles, and practical life skills in young people.",
    impact: "50+ schools reached"
  },
  {
    icon: Home,
    title: "Family Strengthening",
    description: "Community initiatives supporting families through resources, counselling referrals, and practical support.",
    impact: "1,000+ families supported"
  },
]

export default function ImpactPage() {
  const [activeStory, setActiveStory] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{ __html: slideAnimationStyles }} />

      <main className="min-h-screen">
        {/* Hero - Emotional Opening */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/impact/father-child-hero.jpg"
              alt="Father embracing his son"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>

          {/* Floating decorative elements with parallax */}
          <Parallax speed={0.3} className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#D4956A]/20 blur-3xl" />
          <Parallax speed={0.5} className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#8B2B3E]/20 blur-3xl" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <FadeIn direction="up" delay={0.1}>
              <p className="text-[#D4956A] uppercase tracking-[0.3em] text-sm font-medium mb-6">
                Committed to Transformation
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
                Every Father Matters.
                <br />
                <span className="text-[#D4956A]">Every Family Counts.</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join us in building a generation of strong fathers, healthy marriages, and thriving communities. 
                Your support transforms lives.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" className="bg-[#D4956A] hover:bg-[#c4855a] hover:scale-105 transition-all duration-300 text-white px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl">
                    Give Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#our-impact">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 px-10 py-7 text-lg rounded-full">
                    See Our Impact
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Impact Numbers - Warm Section */}
        <section id="our-impact" className="py-20 lg:py-28" style={{ background: "linear-gradient(180deg, #FDF8F4 0%, #FDEEE3 100%)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#D4956A] uppercase tracking-widest text-sm font-semibold mb-4">Our Impact</p>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#5a3d2b] mb-4 tracking-tight">
                Numbers That Tell a Story
              </h2>
              <p className="text-[#7a6455] text-lg max-w-2xl mx-auto leading-relaxed tracking-normal">
                Behind every number is a father restored, a marriage healed, a young person empowered.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat) => (
                <div 
                  key={stat.label}
                  className="text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-[#D4956A]">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="text-xl font-bold text-[#5a3d2b] mt-4 mb-2 tracking-normal">{stat.label}</h3>
                  <p className="text-[#7a6455] text-sm leading-relaxed tracking-normal">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Problem We're Solving */}
        <section className="py-20 lg:py-28 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D4956A 0%, transparent 50%)" }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#D4956A] uppercase tracking-widest text-sm font-semibold mb-4">The Challenge</p>
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Fatherlessness is a Crisis We Can Solve, One Man at a Time
                </h2>
                <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                  <p>
                    Millions of children grow up without the presence, guidance, or affirmation of a father. 
                    This absence ripples through generations, affecting identity, relationships, and communities.
                  </p>
                  <p>
                    But there is hope. When men discover their true identity, receive the affirmation they never had, 
                    and step into their purpose - transformation happens.
                  </p>
                </div>
                
                <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[#D4956A] text-2xl font-bold mb-2">Our Belief</p>
                  <p className="text-white text-lg italic">
                    "Men secure in their manhood, create strong sons."
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative h-[500px] rounded-3xl overflow-hidden">
                  <Image
                    src="/images/impact/men-mentorship.jpg"
                    alt="Men in mentorship programme"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                {/* Stats overlay */}
                <div className="absolute -bottom-6 -left-6 bg-[#D4956A] text-white p-6 rounded-2xl shadow-xl">
                  <p className="text-4xl font-bold">85%</p>
                  <p className="text-sm opacity-90">of youth in prison grew up without a father</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multicultural Unity Section - Animated */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#FDF8F4] via-white to-[#FDEEE3] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text content - slides in from left */}
              <div className="opacity-0 slide-in-left">
                <p className="text-[#D4956A] uppercase tracking-widest text-sm font-semibold mb-4">United in Purpose</p>
                <h2 className="text-3xl lg:text-5xl font-bold text-[#5a3d2b] mb-6 leading-tight">
                  Men From All Walks of Life, Standing Together
                </h2>
                <p className="text-[#7a6455] text-lg leading-relaxed mb-8">
                  Our community brings together men from diverse backgrounds, cultures, and experiences. 
                  When men unite across boundaries, they discover strength in brotherhood and shared purpose.
                </p>
                
                {/* Animated stat placeholders */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="opacity-0 fade-in-up animation-delay-200 text-center p-4 rounded-2xl bg-white shadow-md">
                    <p className="text-3xl font-bold text-[#8B2B3E]">15+</p>
                    <p className="text-sm text-[#7a6455]">Communities</p>
                  </div>
                  <div className="opacity-0 fade-in-up animation-delay-300 text-center p-4 rounded-2xl bg-white shadow-md">
                    <p className="text-3xl font-bold text-[#D4956A]">50+</p>
                    <p className="text-sm text-[#7a6455]">Mentors</p>
                  </div>
                  <div className="opacity-0 fade-in-up animation-delay-400 text-center p-4 rounded-2xl bg-white shadow-md">
                    <p className="text-3xl font-bold text-[#8B2B3E]">100%</p>
                    <p className="text-sm text-[#7a6455]">Commitment</p>
                  </div>
                </div>
              </div>

              {/* Image - slides in from right */}
              <div className="relative opacity-0 slide-in-right animation-delay-200">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/impact/multicultural-men.jpg"
                    alt="Diverse group of men standing together in unity"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#8B2B3E] text-white px-6 py-4 rounded-2xl shadow-xl opacity-0 fade-in-up animation-delay-500">
                  <p className="text-lg font-bold">Manhood</p>
                  <p className="text-sm opacity-90">Across All Cultures</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Programmes */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#8B2B3E] uppercase tracking-widest text-sm font-semibold mb-4">How We Help</p>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                Programmes That Transform
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each initiative is designed to create lasting impact through identity, affirmation, and purpose.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {programmes.map((programme) => (
                <Card key={programme.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300" style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }}>
                        <programme.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#8B2B3E] transition-colors">{programme.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{programme.description}</p>
                        <p className="text-[#D4956A] font-semibold text-sm">{programme.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-20 lg:py-28" style={{ background: "linear-gradient(180deg, #FDEEE3 0%, #FDF8F4 100%)" }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#D4956A] uppercase tracking-widest text-sm font-semibold mb-4">Stories of Change</p>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#5a3d2b]">
                Lives Transformed
              </h2>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-xl p-10 lg:p-14">
                <Quote className="w-12 h-12 text-[#D4956A]/30 mb-6" />
                <p className="text-2xl lg:text-3xl text-[#5a3d2b] leading-relaxed mb-8 font-light italic">
                  "{stories[activeStory].quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative">
                    <Image
                      src={stories[activeStory].image}
                      alt={stories[activeStory].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#5a3d2b]">{stories[activeStory].name}</p>
                    <p className="text-[#D4956A] text-sm">{stories[activeStory].role}</p>
                  </div>
                </div>
              </div>

              {/* Story indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStory(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeStory ? "w-8 bg-[#D4956A]" : "w-2 bg-[#D4956A]/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Donation CTA - Full Width */}
        <section className="py-20 lg:py-28 bg-[#8B2B3E] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <p className="text-[#D4956A] uppercase tracking-widest text-sm font-semibold mb-4">Partner With Us</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Generosity Changes Everything
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every donation directly supports mentoring programmes, marriage conferences, 
              youth development, and community transformation.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold text-white mb-2">Get Involved</p>
                <p className="text-white/70 text-sm">Donate your time, resources - Get involved in a school</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold text-white mb-2">Reaching Men</p>
                <p className="text-white/70 text-sm">Get involved in reaching men in your community</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold text-white mb-2">Community Impact</p>
                <p className="text-white/70 text-sm">Let&apos;s solve a problem in a community</p>
              </div>
            </div>

            <Link href="/get-involved">
              <Button size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 px-10 py-8 text-lg lg:text-xl rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Come, Bring Your Time, Talent &amp; Resources - Let&apos;s Do It Together
                <Heart className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Ways to Give */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[#8B2B3E] uppercase tracking-widest text-sm font-semibold mb-4">Ways to Support</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Multiple Ways to Give
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-[#D4956A]/20 hover:border-[#D4956A]/50 transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#D4956A]/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-[#D4956A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">One-Time Gift</h3>
                  <p className="text-muted-foreground text-sm mb-4">Make an immediate impact with a single donation</p>
                  <Link href="/donate">
                    <Button variant="outline" className="border-[#D4956A] text-[#D4956A] hover:bg-[#D4956A] hover:text-white">
                      Give Once
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#8B2B3E]/20 hover:border-[#8B2B3E]/50 transition-all duration-300 text-center bg-[#8B2B3E]/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Monthly Partner</h3>
                  <p className="text-muted-foreground text-sm mb-4">Join our community of regular supporters</p>
                  <Link href="/donate">
                    <Button className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white">
                      Become a Partner
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#D4956A]/20 hover:border-[#D4956A]/50 transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#D4956A]/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-[#D4956A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Corporate Sponsor</h3>
                  <p className="text-muted-foreground text-sm mb-4">Partner with us as an organization</p>
                  <Link href="/get-involved">
                    <Button variant="outline" className="border-[#D4956A] text-[#D4956A] hover:bg-[#D4956A] hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
