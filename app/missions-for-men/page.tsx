"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Globe, Heart, Users, MapPin, ArrowRight, Shield, Flame, ChevronRight, Quote } from "lucide-react"
import { useState } from "react"

const missionAreas = [
  {
    id: "international",
    title: "International Missions",
    description: "Travel to communities around the world where fathers and families need support the most. Build, teach, and serve alongside local partners.",
    icon: Globe,
    image: "/images/goc/goc-group-beach.jpg",
  },
  {
    id: "domestic",
    title: "Domestic Outreach",
    description: "Make an impact closer to home. Serve in local communities, support fatherless families, and mentor young men seeking guidance.",
    icon: MapPin,
    image: "/images/goc/goc-training-1.jpg",
  },
  {
    id: "team",
    title: "Team Building",
    description: "Every mission is a brotherhood experience. Train together, serve together, and forge bonds that last a lifetime.",
    icon: Users,
    image: "/images/goc/goc-men-learning.jpg",
  },
]

const impactStats = [
  { number: "500+", label: "Men Served" },
  { number: "12", label: "Mission Trips" },
  { number: "5", label: "Countries Reached" },
  { number: "1000+", label: "Lives Impacted" },
]

export default function MissionsForMenPage() {
  const [activeArea, setActiveArea] = useState("international")
  const activeData = missionAreas.find(a => a.id === activeArea) || missionAreas[0]

  return (
    <>
      <Header />
      <main className="bg-[#0a0a0a] text-white min-h-screen">
        {/* Hero Section - Full Screen with Split Layout */}
        <section className="relative min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/goc/goc-group-beach.jpg"
              alt="Men on mission"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[2px] bg-[#D4A574]" />
                <span className="text-[#D4A574] text-sm font-semibold tracking-widest uppercase">Go. Serve. Transform.</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1]">
                Missions<br />
                <span className="text-[#D4A574]">for Men</span>
              </h1>
              
              <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-xl">
                Step beyond your comfort zone and into your calling. Join fellow men on transformative mission trips that change communities and change you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base px-8 py-6 bg-[#D4A574] text-black hover:bg-[#c4956a] rounded-none font-semibold">
                  <Link href="/get-involved">
                    Join a Mission <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10 rounded-none bg-transparent">
                  <Link href="#upcoming">View Upcoming Trips</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </section>

        {/* Impact Stats Bar */}
        <section className="bg-[#8B2B3E] py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* International Section */}
        <section className="py-16 lg:py-24 bg-[#1E3A5F]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="bg-white rounded-full p-4 shadow-xl">
                  <Image
                    src="/images/ff-blue-logo.png"
                    alt="Fatherhood Foundation International Logo"
                    width={120}
                    height={120}
                    className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <span className="text-[#D4A574] text-sm font-semibold tracking-widest uppercase">International</span>
                <h3 className="text-2xl lg:text-4xl font-bold text-white mt-2">The Father Foundation</h3>
                
                {/* Leaders */}
                <div className="flex flex-col sm:flex-row gap-6 mt-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-[#D4A574]">
                      <Image
                        src="/images/leaders/robert-burdett.jpg"
                        alt="Robert Burdett"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold">Robert Burdett</p>
                      <p className="text-[#D4A574] text-sm">Director</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-[#D4A574]">
                      <Image
                        src="/images/leaders/brandon-sanders.jpg"
                        alt="Brandon Sanders"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold">Brandon Sanders</p>
                      <p className="text-[#D4A574] text-sm">Leader</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <a 
                href="https://thefatherfoundation.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A574] text-[#1E3A5F] font-bold rounded-none hover:bg-[#c4956a] transition-colors shadow-lg"
              >
                Visit International Site
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 lg:py-32 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-8 text-[#D4A574] mb-12">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">Brotherhood</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D4A574]" />
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">Purpose</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D4A574]" />
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">Service</span>
              </div>
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold mb-8">
              Called to <span className="text-[#D4A574]">Serve</span>
            </h2>
            <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
              Missions for Men is more than a trip — it is a transformational experience. We believe that men discover their deepest purpose when they step out in faith to serve others. Whether building homes, mentoring youth, or providing essential support to underserved communities, every mission is an opportunity to grow as a man of character and impact.
            </p>
          </div>
        </section>

        {/* What We Do - Interactive Section */}
        <section className="py-24 lg:py-32 bg-[#111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-[#D4A574]" />
              <span className="text-[#D4A574] text-sm font-semibold tracking-widest uppercase">What We Do</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold mb-16 max-w-2xl">
              Our missions combine hands-on service with spiritual growth
            </h2>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left - Navigation */}
              <div className="space-y-4">
                {missionAreas.map((area) => {
                  const Icon = area.icon
                  const isActive = activeArea === area.id
                  return (
                    <button
                      key={area.id}
                      onClick={() => setActiveArea(area.id)}
                      className={`w-full text-left p-6 border transition-all duration-300 ${
                        isActive 
                          ? 'border-[#D4A574] bg-[#D4A574]/10' 
                          : 'border-white/10 hover:border-white/30 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Icon className={`w-6 h-6 ${isActive ? 'text-[#D4A574]' : 'text-white/50'}`} />
                          <span className={`text-xl font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {area.title}
                          </span>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90 text-[#D4A574]' : 'text-white/30'}`} />
                      </div>
                      {isActive && (
                        <p className="mt-4 text-white/60 leading-relaxed pl-10">
                          {area.description}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Right - Image */}
              <div className="relative h-[400px] lg:h-auto">
                <Image
                  src={activeData.image}
                  alt={activeData.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 lg:py-32 bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute top-20 left-10 text-[#D4A574]/10">
            <Quote className="w-40 h-40" />
          </div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <p className="text-2xl lg:text-4xl text-white font-light italic mb-10 leading-relaxed">
              &ldquo;Going on a mission trip with the Foundation changed my perspective on what it means to be a man. Serving others showed me my true purpose.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8B2B3E] flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Mission Trip Participant</p>
                <p className="text-white/50 text-sm">GOC 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Missions */}
        <section id="upcoming" className="py-24 lg:py-32 bg-[#111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-[#D4A574]" />
              <span className="text-[#D4A574] text-sm font-semibold tracking-widest uppercase">Upcoming</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold max-w-xl">
                Mission trips coming soon
              </h2>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none bg-transparent w-fit">
                <Link href="/get-involved">
                  Register Interest <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mission Card 1 */}
              <div className="group relative bg-[#1a1a1a] border border-white/10 hover:border-[#D4A574]/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/goc/goc-training-1.jpg"
                    alt="Local Outreach"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#D4A574] text-black text-xs font-bold uppercase tracking-wider">
                    Coming Soon
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Local Community Outreach</h3>
                  <p className="text-white/60 text-sm mb-4">Namibia - Q2 2026</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Serve local communities through mentorship and support programs.
                  </p>
                </div>
              </div>

              {/* International Card */}
              <div className="group relative bg-[#1E3A5F] border border-[#D4A574]/30 hover:border-[#D4A574] transition-all duration-300">
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#D4A574] text-black text-xs font-bold uppercase tracking-wider z-10">
                  International
                </div>
                <div className="p-6 pt-14">
                  <a 
                    href="https://thefatherfoundation.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#D4A574] transition-colors">
                      The Father Foundation
                    </h3>
                  </a>
                  
                  {/* Leaders */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A574]">
                        <Image
                          src="/images/leaders/robert-burdett.jpg"
                          alt="Robert Burdett"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Robert Burdett</p>
                        <p className="text-[#D4A574] text-sm">Director</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A574]">
                        <Image
                          src="/images/leaders/brandon-sanders.jpg"
                          alt="Brandon Sanders"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Brandon Sanders</p>
                        <p className="text-[#D4A574] text-sm">Leader</p>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href="https://thefatherfoundation.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm text-white/70 hover:text-[#D4A574] transition-colors"
                  >
                    Visit Website <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Mission Card 3 */}
              <div className="group relative bg-[#1a1a1a] border border-white/10 hover:border-[#D4A574]/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/goc/goc-speaker.jpg"
                    alt="Leadership Summit"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
                    Planning
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Leadership Development</h3>
                  <p className="text-white/60 text-sm mb-4">Location TBA - Q4 2026</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Intensive leadership training combined with community service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/goc/goc-men-learning.jpg"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Answer the Call?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Take the next step in your journey. Join Missions for Men and discover the impact you can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-10 py-6 bg-white text-[#8B2B3E] hover:bg-white/90 rounded-none font-semibold">
                <Link href="/get-involved">
                  Get Involved <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-10 py-6 border-white text-white hover:bg-white/10 rounded-none bg-transparent">
                <Link href="/partnership">Support Our Missions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
