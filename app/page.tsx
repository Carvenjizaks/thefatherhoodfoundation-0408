"use client"

// v7 - Cinematic image hero with warm tones
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JourneySection } from "@/components/journey-section"
import { QuotesTicker } from "@/components/quotes-ticker"
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
        {/* Hero Section - Full-screen cinematic image */}
        <section className="relative min-h-screen flex items-end overflow-hidden">
          {/* Full-screen background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-father-child.jpg"
              alt="Father lifting child against sunset"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B2B3E]/30 to-transparent" />
          </div>
          
          {/* Content positioned at bottom-right, inspired by the design */}
          <div className="relative z-10 w-full">
            {/* Main headline - large elegant serif-style typography */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
              <FadeIn delay={0.2} direction="up">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white mb-6 leading-[1.05] tracking-tight">
                  <span className="italic text-white/90">Empowering men</span>
                  <br />
                  <span className="font-normal">to <span className="text-[#D4A574]">LEARN</span>, <span className="text-[#D4A574]">GROW</span></span>
                  <br />
                  <span className="font-normal">& <span className="text-[#D4A574]">CONTRIBUTE</span></span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.4} direction="up">
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    asChild 
                    size="lg" 
                    className="text-base px-8 py-6 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-[#8B2B3E] transition-all duration-300 rounded-full"
                  >
                    <Link href="/get-involved">
                      How we do it <ArrowRightIcon />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
            
            {/* Bottom info bar */}
            <div className="bg-[#FAF8F5] border-t-4 border-[#8B2B3E]">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <FadeIn delay={0.5} direction="up">
                    <p className="text-base lg:text-lg text-black/80 leading-relaxed max-w-xl">
                      The Fatherhood Foundation equips men through practical resources, training, teaching, and active engagement to build a healthy community and develop <span className="font-semibold text-[#8B2B3E]">intentional fathers</span>, <span className="font-semibold text-[#8B2B3E]">committed husbands</span>, and <span className="font-semibold text-[#8B2B3E]">impactful leaders</span>.
                    </p>
                  </FadeIn>
                  
                  <FadeIn delay={0.6} direction="up">
                    <div className="flex flex-wrap gap-8 md:justify-end">
                      <div className="text-center">
                        <p className="text-3xl lg:text-4xl font-bold text-[#8B2B3E]">
                          <CountUp end={20} suffix="k+" duration={2} />
                        </p>
                        <p className="text-sm text-black/60 font-medium mt-1">Men Mentored</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl lg:text-4xl font-bold text-[#8B2B3E]">
                          <CountUp end={25} suffix="+" duration={2} />
                        </p>
                        <p className="text-sm text-black/60 font-medium mt-1">Years Impact</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl lg:text-4xl font-bold text-[#8B2B3E]">
                          <CountUp end={1000} suffix="+" duration={2} />
                        </p>
                        <p className="text-sm text-black/60 font-medium mt-1">Families Helped</p>
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
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
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">MyGreatMarriage</h3>
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
              <Button asChild size="lg" className="text-base px-10 py-6 bg-[#8B2B3E] hover:bg-[#6B1B2E] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
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
