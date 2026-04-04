"use client"

// v5 - Added cinematic animations
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JourneySection } from "@/components/journey-section"
import { QuotesTicker } from "@/components/quotes-ticker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, ScaleIn, Parallax, CountUp } from "@/components/ui/motion"
import { BookOpen, TrendingUp, Heart } from "lucide-react"

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
        {/* Hero Section - Cinematic with parallax and fade-ins */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Parallax speed={0.3} className="absolute top-20 left-10 w-64 h-64 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
            <Parallax speed={0.5} className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />
            <Parallax speed={0.2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#8B2B3E]/5 to-transparent rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
            <ScaleIn duration={0.8}>
              <Image
                src="/images/logo.png"
                alt="The Fatherhood Foundation"
                width={120}
                height={120}
                loading="eager"
                priority
                className="mx-auto mb-8 rounded-full shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </ScaleIn>

            <FadeIn delay={0.2} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-6 text-balance leading-tight">
                Empowering men to Learn, Grow and <span className="text-[#8B2B3E] relative inline-block after:absolute after:bottom-2 after:left-0 after:w-full after:h-2 after:bg-[#D4A574]/30 after:-z-10">Contribute through serving</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              <p className="text-lg lg:text-xl text-black mb-12 max-w-3xl mx-auto text-balance leading-relaxed font-medium">
                The Fatherhood Foundation equips men through practical resources, training, teaching, and active engagement to build a healthy community and develop intentional fathers, committed husbands, and impactful leaders.
              </p>
            </FadeIn>

            <FadeIn delay={0.5} direction="up">
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#8B2B3E] mb-8 tracking-tight">PURPOSE</h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-base lg:text-lg text-black leading-relaxed text-balance font-medium">
                    The Fatherhood Foundation exists to address the challenges of fatherlessness through diverse teachings
                    and trainings. We partner with organizations to tackle societal issues stemming from absent fathers,
                    the misunderstanding of masculinity and its purpose, and to empower men to live fulfilled lives.
                  </p>
                  <p className="text-base lg:text-lg text-black leading-relaxed text-balance font-medium">
                    The pursuit of authentic manhood is a journey of discovery—one that unfolds within the context of
                    community, where men connect, learn, and grow together. Through this shared experience, we develop
                    programs designed to build and sustain strong, healthy communities.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.7} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base px-8 py-6 bg-[#8B2B3E] hover:bg-[#6B1B2E] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Link href="/get-involved">
                    Get Involved <ArrowRightIcon />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 bg-white border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                >
                  <Link href="#pillars">Learn More</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#8B2B3E]/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#8B2B3E]/50 rounded-full animate-pulse" />
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
                    <CountUp end={500} suffix="+" duration={2.5} />
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
          
          {/* CSS Animations */}
          <style jsx>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes float-slow {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -30px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            @keyframes float-medium {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-40px, -20px) scale(1.05); }
            }
            @keyframes float-fast {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(20px, -15px); }
              50% { transform: translate(-10px, -25px); }
              75% { transform: translate(-25px, 10px); }
            }
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.2); }
            }
            @keyframes streak {
              0% { transform: translateX(0); }
              100% { transform: translateX(200%); }
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.5); }
            }
            .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
            .animate-float-medium { animation: float-medium 15s ease-in-out infinite; }
            .animate-float-fast { animation: float-fast 10s ease-in-out infinite; }
            .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
            .animate-streak-1 { animation: streak 8s linear infinite; }
            .animate-streak-2 { animation: streak 12s linear infinite 2s; }
            .animate-streak-3 { animation: streak 10s linear infinite 4s; }
            .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
            .animate-twinkle-delay-1 { animation: twinkle 3s ease-in-out infinite 0.5s; }
            .animate-twinkle-delay-2 { animation: twinkle 3s ease-in-out infinite 1s; }
            .animate-twinkle-delay-3 { animation: twinkle 3s ease-in-out infinite 1.5s; }
          `}</style>
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
