"use client"

// v8 - Cinematic multi-image carousel hero
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JourneySection } from "@/components/journey-section"
import { QuotesTicker } from "@/components/quotes-ticker"
import { CinematicImageCarousel } from "@/components/cinematic-image-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, ScaleIn, Parallax, CountUp } from "@/components/ui/motion"
import { BookOpen, TrendingUp, Heart, Users } from "lucide-react"

const ArrowRightIcon = () => (
  <svg className="inline-block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function HomePage() {

  return (
    <>
      <Header />

      <main className="bg-white text-black min-h-screen overflow-hidden">
        {/* Hero Section - Images on top, text below */}
        <section className="relative">
          {/* Image Carousel - Full width, no overlays */}
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <CinematicImageCarousel />
          </div>
          
          {/* Hero Text Section - Below images, stands out */}
          <div className="relative bg-[#8B2B3E]">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4A574]" />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
              {/* Main headline */}
              <FadeIn delay={0.2} direction="up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight text-balance text-center">
                  Empowering men to{" "}
                  <span className="text-[#D4A574] inline-block">Learn</span>,{" "}
                  <span className="text-[#D4A574] inline-block">Grow</span> and{" "}
                  <span className="text-[#D4A574] inline-block">Contribute</span>{" "}
                  through serving
                </h1>
              </FadeIn>
              
              {/* Mission statement */}
              <FadeIn delay={0.4} direction="up">
                <p className="text-lg lg:text-xl xl:text-2xl text-white/95 leading-relaxed max-w-5xl mx-auto mb-10 text-center text-pretty">
                  The Fatherhood Foundation equips men through practical resources, training, teaching, and active engagement to build a healthy community and develop{" "}
                  <span className="font-bold text-[#D4A574]">intentional fathers</span>,{" "}
                  <span className="font-bold text-[#D4A574]">committed husbands</span>, and{" "}
                  <span className="font-bold text-[#D4A574]">impactful leaders</span>.
                </p>
              </FadeIn>
              
              {/* CTA Buttons */}
              <FadeIn delay={0.5} direction="up">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="text-lg px-10 py-7 bg-white text-[#8B2B3E] hover:bg-[#D4A574] hover:text-white transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl btn-shine hover:scale-105 font-semibold"
                  >
                    <Link href="/get-involved">
                      Get Involved <ArrowRightIcon />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-10 py-7 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#8B2B3E] transition-all duration-300 rounded-full font-semibold"
                  >
                    <Link href="#pillars">
                      Explore Programs
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
          
          {/* Stats bar */}
          <div className="bg-[#FAF8F5] border-b-4 border-[#D4A574]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
              <FadeIn delay={0.6} direction="up">
                <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                  <div className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                      <CountUp end={20} suffix="k+" duration={2} />
                    </p>
                    <p className="text-sm lg:text-base text-black/70 font-medium mt-2">Men Mentored</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                      <CountUp end={25} suffix="+" duration={2} />
                    </p>
                    <p className="text-sm lg:text-base text-black/70 font-medium mt-2">Years Impact</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                      <CountUp end={1000} suffix="+" duration={2} />
                    </p>
                    <p className="text-sm lg:text-base text-black/70 font-medium mt-2">Families Helped</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Scrolling Quotes Ticker */}
        <QuotesTicker />

        {/* Mission Statement with animations */}
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
          <Parallax speed={-0.2} className="absolute top-0 right-0 w-72 h-72 bg-[#D4A574]/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 text-balance">
                Building Stronger Families, One Man at a Time
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg lg:text-xl text-black leading-relaxed text-pretty font-medium">
                We believe that strong families are built by strong men. Through our programs and community, we equip men
                with the tools, wisdom, and support they need to thrive in their roles as fathers, husbands, and community
                leaders.
              </p>
            </FadeIn>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <FadeIn delay={0.1} direction="up">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                    <CountUp end={20} suffix="k+" duration={2.5} />
                  </p>
                  <p className="text-sm text-black/70 mt-2 font-medium">Men Mentored</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2} direction="up">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                    <CountUp end={50} suffix="+" duration={2.5} />
                  </p>
                  <p className="text-sm text-black/70 mt-2 font-medium">Events Hosted</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3} direction="up">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                    <CountUp end={25} suffix="+" duration={2.5} />
                  </p>
                  <p className="text-sm text-black/70 mt-2 font-medium">Years of Impact</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.4} direction="up">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold text-[#8B2B3E]">
                    <CountUp end={1000} suffix="+" duration={2.5} />
                  </p>
                  <p className="text-sm text-black/70 mt-2 font-medium">Families Strengthened</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Journey to Authentic Manhood */}
        <JourneySection />

        {/* Empowering Men Section */}
        <section id="empowering-section" className="py-24 lg:py-32 bg-[#8B2B3E] relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E] via-[#6d2230] to-[#8B2B3E] animate-gradient-shift" 
                 style={{ backgroundSize: '400% 400%', animation: 'gradientShift 15s ease infinite' }} />
          </div>
          
          {/* Floating orbs with motion */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4A574]/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-[#D4A574]/15 rounded-full blur-2xl animate-float-fast" />
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse-slow" />
          
          {/* Moving light streaks */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-full w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-streak-1" />
            <div className="absolute top-1/3 -left-full w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4A574]/30 to-transparent animate-streak-2" />
            <div className="absolute top-2/3 -left-full w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-streak-3" />
          </div>
          
          {/* Particle dots */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-white/40 rounded-full animate-twinkle" />
            <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-[#D4A574]/50 rounded-full animate-twinkle-delay-1" />
            <div className="absolute bottom-[30%] left-[25%] w-1 h-1 bg-white/30 rounded-full animate-twinkle-delay-2" />
            <div className="absolute top-[60%] right-[35%] w-2 h-2 bg-white/20 rounded-full animate-twinkle-delay-3" />
            <div className="absolute bottom-[20%] right-[15%] w-1 h-1 bg-[#D4A574]/40 rounded-full animate-twinkle" />
            <div className="absolute top-[15%] right-[40%] w-1.5 h-1.5 bg-white/25 rounded-full animate-twinkle-delay-2" />
          </div>
          
          <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 text-balance leading-tight drop-shadow-lg">
                Empowering men to Learn, Grow and Contribute through serving
              </h2>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-md">
                The Fatherhood Foundation equips men through practical resources, training, teaching, and active engagement to build a healthy community and develop intentional fathers, committed husbands, and impactful leaders.
              </p>
            </FadeIn>
          </div>
          
        </section>

        {/* Four Pillars with staggered animations */}
        <section id="pillars" className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
          <Parallax speed={0.3} className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-4">Our Four Pillars</h2>
              <p className="text-lg text-black max-w-2xl mx-auto text-balance font-medium">
                Comprehensive programs designed to strengthen every aspect of manhood and family life.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <FadeIn delay={0.1} direction="up">
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors">
                      <Image
                        src="/pillars/mentoring-men.jpg"
                        alt="Diverse men in mentoring conversation"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">Monthly Table Talk for Men</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Connect with experienced mentors who provide guidance, accountability, and wisdom for your journey
                    as a man and leader.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/mentoring-men">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </FadeIn>

              {/* ActiveParenting card - Hidden for now, activate later
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors">
                      <Image
                        src="/pillars/active-parenting.jpg"
                        alt="Diverse fathers with their children"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">ActiveParenting</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Learn practical skills and strategies to become an engaged, present, and effective father to your
                    children.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/active-parenting">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              */}

              <FadeIn delay={0.2} direction="up">
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors group-hover:scale-110 duration-500">
                      <Image
                        src="/pillars/great-marriage.jpg"
                        alt="Diverse couples celebrating their marriages"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center font-serif italic">My Great Marriage</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Build a thriving marriage through proven principles, practical tools, and supportive community for
                    couples.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/my-great-marriage">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </FadeIn>

              <FadeIn delay={0.3} direction="up">
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors group-hover:scale-110 duration-500">
                      <Image
                        src="/pillars/missions-for-men.jpg"
                        alt="Men on mission trips serving communities"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">Missions for Men</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Go beyond your comfort zone on domestic and international mission trips. Serve alongside brothers, transform communities, and discover your purpose through hands-on impact.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/missions-for-men">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </FadeIn>

              <FadeIn delay={0.4} direction="up">
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors group-hover:scale-110 duration-500">
                      <Image
                        src="/pillars/community-development.jpg"
                        alt="Diverse men working together in community service"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">Social Impact</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Make a lasting impact in your community through service, leadership, and collaborative initiatives.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/community-development">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </FadeIn>

              <FadeIn delay={0.5} direction="up">
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors">
                      <Image
                        src="/pillars/men-on-mission.jpg"
                        alt="Men united on a mission to serve"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">Men on a Mission</h3>
                  <p className="text-black mb-6 leading-relaxed text-center">
                    Unite with purpose-driven men committed to making a difference through faith, service, and intentional action in their families and communities.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="group/button p-0 h-auto text-[#8B2B3E] hover:text-[#6B1B2E]"
                    >
                      <Link href="/men-on-mission">
                        Explore Program <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Testimonials Preview Section */}
        <section className="py-20 lg:py-28 bg-[#FAF8F5] relative overflow-hidden">
          <Parallax speed={-0.1} className="absolute top-0 right-0 w-80 h-80 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <FadeIn direction="up" className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full text-sm font-semibold mb-4">
                Success Stories
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-4 text-balance">
                Hear From Our Community
              </h2>
              <p className="text-lg text-black/70 max-w-2xl mx-auto">
                Real stories from real men whose lives have been transformed.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <FadeIn delay={0.1} direction="up">
                <Card className="group h-full bg-white border-2 border-transparent hover:border-[#8B2B3E]/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#D4A574]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-black/80 leading-relaxed mb-4 italic text-sm">
                      {`"The Fatherhood Foundation transformed my perspective on being a father. I am now a more intentional father and husband."`}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                        <span className="text-[#8B2B3E] font-semibold">SI</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a] text-sm">Struggle Ipinginge</p>
                        <p className="text-xs text-black/60">Community Leader</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2} direction="up">
                <Card className="group h-full bg-white border-2 border-transparent hover:border-[#8B2B3E]/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#D4A574]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-black/80 leading-relaxed mb-4 italic text-sm">
                      {`"Being part of the community development initiatives opened my eyes to the power of men supporting each other in Namibia."`}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                        <span className="text-[#8B2B3E] font-semibold">PN</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a] text-sm">Petrus Naubeb</p>
                        <p className="text-xs text-black/60">Program Graduate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.3} direction="up">
                <Card className="group h-full bg-white border-2 border-transparent hover:border-[#8B2B3E]/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#D4A574]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-black/80 leading-relaxed mb-4 italic text-sm">
                      {`"The marriage enrichment program gave us tools to communicate better. Our marriage has never been stronger."`}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                        <span className="text-[#8B2B3E] font-semibold">VR</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a] text-sm">Johan & Mariska Van Rensburg</p>
                        <p className="text-xs text-black/60 font-serif italic">My Great Marriage Couple</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            <FadeIn delay={0.4} direction="up" className="text-center">
              <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="text-base px-8 py-6 border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E] hover:text-white transition-all duration-300 rounded-full"
              >
                <Link href="/testimonials">
                  Read More Stories <ArrowRightIcon />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* Call to Action with cinematic effects */}
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
          <Parallax speed={0.2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#8B2B3E]/5 to-transparent rounded-full" />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 text-balance">
                Ready to Take the Next Step?
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg lg:text-xl text-black mb-10 text-balance leading-relaxed font-medium">
                Join thousands of men who are transforming their families and communities through The Fatherhood
                Foundation.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <Button asChild size="lg" className="text-base px-10 py-6 bg-[#8B2B3E] hover:bg-[#6B1B2E] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full">
                <Link href="/get-involved">
                  Get Involved Today <ArrowRightIcon />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
