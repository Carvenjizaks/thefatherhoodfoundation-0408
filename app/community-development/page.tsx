"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Building2, Handshake, Users2, Target, Heart, CheckCircle2, Calendar, MapPin, GraduationCap, Briefcase, Crown } from "lucide-react"
import { ScrollingImageCarousel } from "@/components/scrolling-image-carousel"
import { FadeIn, ScaleIn, Parallax } from "@/components/ui/motion"

// Animation styles
const animationStyles = `
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-80px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(80px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .slide-left { animation: slideInLeft 0.8s ease-out forwards; }
  .slide-right { animation: slideInRight 0.8s ease-out forwards; }
  .fade-up { animation: fadeInUp 0.7s ease-out forwards; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
`

// Warm color palette matching the brand
const warmColors = {
  primary: "#D4956A",
  primaryLight: "#E8B896",
  accent: "#8B2B3E",
  cream: "#FDF8F4",
  warmBg: "#FDEEE3",
  textDark: "#5a3d2b",
  textMuted: "#7a6455",
}

const communityImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Attachment-13-P4o703bCzecPRn2XTxweMqrFwiVPBB.jpeg",
    alt: "Men gathered at outdoor community event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Attachment-23-4yRyf2gOFliphn4aFCNjLy5TgTODaP.jpeg",
    alt: "Large outdoor gathering with community members",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2878-vWbv5h5xMMzNviWuPgX7B6PRdRxE86.jpeg",
    alt: "Community outreach serving children",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0874-Fqq2iEybmNDZZuiYWArJtCT0o92K7z.jpeg",
    alt: "Men attending community seminar",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0044-ZSKV5F7rVNiE5f9ir9qwYZ9bA4ueGR.jpeg",
    alt: "Group photo of community members at event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7685-GxblfQHicLe9Iznc2UP1blYefuDBwf.jpeg",
    alt: "School assembly presentation",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0056-4k8zuQ2If9yvsmecd5ldQlIbM80kzH.jpeg",
    alt: "Indoor community meeting",
  },
]

// Animated counter component
function AnimatedStat({ value, suffix = "", label }: { value: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const numericValue = parseInt(value.replace(/\s/g, "").replace(/,/g, ""), 10)

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

    const duration = 2000
    const steps = 60
    const stepValue = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, numericValue])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white/80 font-medium">{label}</div>
    </div>
  )
}

export default function CommunityDevelopmentPage() {
  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <main className="pt-20">
        {/* Scrolling Image Carousel */}
        <ScrollingImageCarousel images={communityImages} />
        
        {/* Hero Section - Warm Styling */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${warmColors.cream} 0%, ${warmColors.warmBg} 100%)` }}>
          {/* Decorative circles with parallax */}
          <Parallax speed={0.3} className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-30" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }} />
          <Parallax speed={0.5} className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-20" style={{ background: `linear-gradient(135deg, ${warmColors.primaryLight}, ${warmColors.primary})` }} />
          <Parallax speed={0.2} className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full opacity-20" style={{ background: warmColors.primary }} />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <FadeIn direction="up" delay={0.1}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: warmColors.primary }}>
                Building Stronger Communities
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance" style={{ color: warmColors.textDark }}>
                Social Impact
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <p className="text-lg lg:text-xl text-balance leading-relaxed mb-8" style={{ color: warmColors.textMuted }}>
                Strong communities are built by engaged men who serve, lead, and make a difference. Discover how you can
                create lasting impact in your neighborhood and beyond.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                  <Link href="/donate">
                    <Heart className="mr-2 h-5 w-5" /> Support Our Work
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold hover:scale-105 transition-all duration-300" style={{ borderColor: warmColors.primary, color: warmColors.textDark }}>
                  <Link href="/get-involved">
                    Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 rounded-full flex justify-center pt-2" style={{ borderColor: `${warmColors.primary}50` }}>
              <div className="w-1.5 h-3 rounded-full animate-pulse" style={{ background: `${warmColors.primary}80` }} />
            </div>
          </div>
        </section>

        {/* Impact Statistics - Dark Section */}
        <section className="py-16 lg:py-20" style={{ background: warmColors.accent }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <AnimatedStat value="20000" suffix="+" label="Impacted Men" />
              <AnimatedStat value="1500" suffix="+" label="Touched Marriages" />
              <AnimatedStat value="15000" suffix="+" label="Youth Reached" />
              <AnimatedStat value="10" suffix="+" label="Years of Impact" />
            </div>
          </div>
        </section>

        {/* Overview - Warm Section */}
        <section className="py-20 lg:py-32" style={{ background: warmColors.cream }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1 shadow-xl">
                <Image src="/images/impact/men-mentorship.jpg" alt="Community development" fill className="object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${warmColors.primary}30, transparent)` }} />
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: warmColors.primary }}>
                  Our Approach
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: warmColors.textDark }}>
                  Leaders Who Serve, Communities That Thrive
                </h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: warmColors.textMuted }}>
                  Our Community Development program mobilizes men to address critical needs in their neighborhoods.
                  Through organized service projects, leadership training, and collaborative partnerships, we're
                  building stronger communities one project at a time.
                </p>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: warmColors.textMuted }}>
                  Whether it's mentoring youth, supporting local schools, serving vulnerable families, or leading
                  community initiatives, you'll find meaningful ways to make a difference.
                </p>
                <Button asChild size="lg" className="text-white font-semibold shadow-lg" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                  <Link href="/get-involved">
                    Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Babylon Community Section - Heart of Our Work */}
        <section className="py-20 lg:py-32 overflow-hidden" style={{ background: `linear-gradient(180deg, white 0%, ${warmColors.warmBg} 100%)` }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-0 fade-up" style={{ color: warmColors.accent }}>
                The Heart of What We Do
              </p>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 opacity-0 fade-up delay-100" style={{ color: warmColors.textDark }}>
                Babylon Community
              </h2>
              <p className="text-lg max-w-3xl mx-auto opacity-0 fade-up delay-200" style={{ color: warmColors.textMuted }}>
                Located in Katutura, our weekly engagement brings together men from all walks of life for mentorship, growth, and leadership development.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Image - slides from left */}
              <div className="relative h-[450px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl opacity-0 slide-left">
                <Image 
                  src="/images/impact/babylon-community.jpg" 
                  alt="Babylon Community weekly mentorship gathering in Katutura" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-white/90 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Katutura, Windhoek</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Weekly Engagements</span>
                  </div>
                </div>
              </div>

              {/* Content - slides from right */}
              <div className="opacity-0 slide-right delay-200">
                <h3 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: warmColors.textDark }}>
                  Training Leaders Who Transform Communities
                </h3>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: warmColors.textMuted }}>
                  This team manages team leaders, leading teams, who are active in communities. Every week, we gather to pour into the lives of men who are called to lead — in their homes, workplaces, and neighbourhoods.
                </p>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: warmColors.textMuted }}>
                  Our mentorship model creates a ripple effect: we train leaders who train other leaders, multiplying our impact across Namibia.
                </p>
                
                {/* Leader Types */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift opacity-0 fade-up delay-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold mb-1" style={{ color: warmColors.textDark }}>Corporate Leaders</h4>
                    <p className="text-sm" style={{ color: warmColors.textMuted }}>Business professionals leading with purpose</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift opacity-0 fade-up delay-400">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${warmColors.accent}, #a83850)` }}>
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold mb-1" style={{ color: warmColors.textDark }}>Community Leaders</h4>
                    <p className="text-sm" style={{ color: warmColors.textMuted }}>Pillars of strength in their neighbourhoods</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift opacity-0 fade-up delay-500">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold mb-1" style={{ color: warmColors.textDark }}>Headmasters</h4>
                    <p className="text-sm" style={{ color: warmColors.textMuted }}>Shaping the next generation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote/Testimony Block */}
            <div className="max-w-4xl mx-auto text-center opacity-0 fade-up delay-300">
              <div className="bg-white rounded-3xl p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${warmColors.accent}, ${warmColors.primary})` }} />
                <blockquote className="text-xl lg:text-2xl italic leading-relaxed mb-6" style={{ color: warmColors.textDark }}>
                  &ldquo;When men gather with intention, transformation happens. In Babylon, we don&apos;t just meet — we build each other up, challenge each other to grow, and send each other out to lead.&rdquo;
                </blockquote>
                <p className="font-semibold" style={{ color: warmColors.primary }}>
                  — The Fatherhood Foundation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas - Warm Cards */}
        <section className="py-20 lg:py-32" style={{ background: `linear-gradient(180deg, ${warmColors.warmBg} 0%, ${warmColors.cream} 100%)` }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: warmColors.primary }}>
                Making A Difference
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: warmColors.textDark }}>Where We Make an Impact</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: warmColors.textMuted }}>
                Our community development initiatives focus on creating sustainable, positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover-lift opacity-0 fade-up" style={{ background: "white" }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                    <Users2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: warmColors.textDark }}>Youth Mentorship</h3>
                  <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                    Mentor young men in schools, community centers, and through after-school programs. Help the next
                    generation develop character, skills, and vision for their future.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover-lift opacity-0 fade-up delay-100" style={{ background: "white" }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: warmColors.textDark }}>Neighborhood Revitalization</h3>
                  <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                    Participate in projects that improve local infrastructure, create community spaces, and enhance neighborhood safety and beauty. We turn community centers into multi-purpose facilities to truly serve the community.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover-lift opacity-0 fade-up delay-200" style={{ background: "white" }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: warmColors.textDark }}>Creating Authentic Communities</h3>
                  <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                    Where people come together because they want to — in small groups, to support, help, and share life with one another. These are spaces built on genuine connection and mutual care.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover-lift opacity-0 fade-up delay-300" style={{ background: "white" }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: warmColors.textDark }}>Leadership Development</h3>
                  <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                    Train emerging community leaders through workshops, coaching, and hands-on experience in organizing
                    and leading local initiatives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How Your Support Helps - Donor Appeal Section */}
        <section className="py-20 lg:py-32" style={{ background: warmColors.accent }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: warmColors.primaryLight }}>
                  Your Support Matters
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Help Us Reach More Communities
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Every donation enables us to expand our reach, train more leaders, and transform more communities. Together, we can build a generation of engaged fathers and strong families.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: warmColors.primaryLight }} />
                    <span>Support to reach more youth</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: warmColors.primaryLight }} />
                    <span>Support the ministry to men through mentorship</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: warmColors.primaryLight }} />
                    <span>Reach more new schools with our Character Development programme</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: warmColors.primaryLight }} />
                    <span>Join us to touch more marriages</span>
                  </div>
                </div>

                <Button asChild size="lg" className="text-white font-semibold shadow-lg" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                  <Link href="/donate">
                    <Heart className="mr-2 h-5 w-5" /> Donate Now
                  </Link>
                </Button>
              </div>

              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/impact/youth-program.jpg" alt="Youth programme" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Involved - Warm Styling */}
        <section className="py-20 lg:py-32" style={{ background: warmColors.cream }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: warmColors.primary }}>
                Take Action
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: warmColors.textDark }}>Ways to Serve</h2>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden" style={{ background: "white" }}>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.textDark }}>Join a Service Project</h3>
                    <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                      Participate in one of our monthly community service events. No long-term commitment required—just
                      show up and serve.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden" style={{ background: "white" }}>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.textDark }}>Lead an Initiative</h3>
                    <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                      Have a vision for community impact? We'll help you develop and launch your own initiative with
                      training, resources, and support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden" style={{ background: "white" }}>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: warmColors.textDark }}>Partner with Us</h3>
                    <p className="leading-relaxed" style={{ color: warmColors.textMuted }}>
                      If you represent a local organization, let's collaborate to multiply our impact and serve our
                      community more effectively.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA - Warm Gradient */}
        <section className="py-20 lg:py-32" style={{ background: `linear-gradient(135deg, ${warmColors.warmBg} 0%, ${warmColors.cream} 100%)` }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance" style={{ color: warmColors.textDark }}>
              Be Part of Something Bigger
            </h2>
            <p className="text-lg mb-10 text-balance leading-relaxed" style={{ color: warmColors.textMuted }}>
              Your community needs your time, talents, and leadership. Join us in creating lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-white font-semibold shadow-lg" style={{ background: `linear-gradient(135deg, ${warmColors.primary}, ${warmColors.primaryLight})` }}>
                <Link href="/donate">
                  <Heart className="mr-2 h-5 w-5" /> Support Our Mission
                </Link>
              </Button>
              <Button asChild size="lg" className="text-white font-semibold shadow-lg" style={{ background: warmColors.accent }}>
                <Link href="/get-involved">
                  Start Serving <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
