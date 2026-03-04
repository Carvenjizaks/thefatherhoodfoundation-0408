"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JourneySection } from "@/components/journey-section"
import { FacesParade } from "@/components/faces-parade"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ArrowRightIcon = () => (
  <svg className="inline-block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-section")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const diverseFaces = [
    "/faces/man-usa.jpg",
    "/faces/man-africa.jpg",
    "/faces/man-uk.jpg",
    "/faces/man-asia.jpg",
    "/faces/man-namibia.jpg",
    "/faces/man-australia.jpg",
    "/faces/man-hungary.jpg",
    "/faces/man-germany.jpg",
    "/faces/young-usa.jpg",
    "/faces/young-africa.jpg",
    "/faces/young-asia.jpg",
    "/faces/young-namibia.jpg",
  ]

  // Diverse fathers from all backgrounds
  const portraitFaces = [
    "/gallery/father-black-1.jpg",
    "/gallery/father-white-1.jpg",
    "/gallery/father-coloured-1.jpg",
    "/gallery/father-asian-1.jpg",
    "/gallery/father-latino-1.jpg",
    "/gallery/father-black-2.jpg",
  ]

  return (
    <>
      <Header />

      <main className="bg-white text-black min-h-screen">
        {/* Hero Section - Removed all opacity-0 and animation delays to make content immediately visible */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
            <Image
              src="/images/logo.png"
              alt="The Fatherhood Foundation"
              width={120}
              height={120}
              className="mx-auto mb-8 rounded-full"
            />

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-6 text-balance leading-tight">
              Empowering men to Learn, Grow and <span className="text-[#8B2B3E]">Contribute through serving</span>
            </h1>

            <p className="text-lg lg:text-xl text-black mb-12 max-w-3xl mx-auto text-balance leading-relaxed font-medium">
              The Fatherhood Foundation provides mentorship, resources, and community support to help men become better
              fathers, husbands, and leaders.
            </p>

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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-6 bg-[#8B2B3E] hover:bg-[#6B1B2E]">
                <Link href="/get-involved">
                  Get Involved <ArrowRightIcon />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 bg-white border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-gray-50"
              >
                <Link href="#pillars">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Statement - Removed fade-in-section opacity-0 */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 text-balance">
              Building Stronger Families, One Man at a Time
            </h2>
            <p className="text-lg lg:text-xl text-black leading-relaxed text-pretty font-medium">
              We believe that strong families are built by strong men. Through our programs and community, we equip men
              with the tools, wisdom, and support they need to thrive in their roles as fathers, husbands, and community
              leaders.
            </p>
          </div>
        </section>

        <section className="bg-[#8B2B3E] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-2">Faces of Fatherhood</h2>
            <p className="text-center text-white/80 text-balance">Real men, real stories, real transformation</p>
          </div>
          <FacesParade images={portraitFaces} scrollSpeed={50} />
        </section>

        {/* Journey to Authentic Manhood */}
        <JourneySection />

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 text-balance">
              Empowering men to Learn, Grow and Contribute through serving
            </h2>
            <p className="text-lg lg:text-xl text-black leading-relaxed text-balance font-medium">
              The Fatherhood Foundation provides mentorship, resources, and community support to help men become better
              fathers, husbands, and leaders.
            </p>
          </div>
        </section>

        {/* Four Pillars */}
        <section id="pillars" className="py-20 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-4">Our Four Pillars</h2>
              <p className="text-lg text-black max-w-2xl mx-auto text-balance font-medium">
                Comprehensive programs designed to strengthen every aspect of manhood and family life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#8B2B3E]/50 bg-white">
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

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors">
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

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#8B2B3E]/50 bg-white">
                <CardContent className="p-8 lg:p-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E] transition-colors">
                      <Image
                        src="/pillars/community-development.jpg"
                        alt="Diverse men working together in community service"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4 text-center">Community Development</h3>
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
            </div>
          </div>
        </section>

        {/* Call to Action - Removed fade-in-section opacity-0 */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 text-balance">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg lg:text-xl text-black mb-10 text-balance leading-relaxed font-medium">
              Join thousands of men who are transforming their families and communities through The Fatherhood
              Foundation.
            </p>
            <Button asChild size="lg" className="text-base px-10 py-6 bg-[#8B2B3E] hover:bg-[#6B1B2E]">
              <Link href="/get-involved">
                Get Involved Today <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
