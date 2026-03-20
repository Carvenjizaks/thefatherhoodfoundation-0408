"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Globe, Heart, Users, MapPin, Calendar, ArrowRight, Shield, Flame } from "lucide-react"

export default function MissionsForMenPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-black min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B2B3E] via-[#6B1B2E] to-[#4A1020]">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Globe className="w-5 h-5 text-white" />
              <span className="text-white/90 text-sm font-medium">Go. Serve. Transform.</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
              Missions for Men
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-3xl mx-auto text-balance leading-relaxed">
              Step beyond your comfort zone and into your calling. Join fellow men on transformative mission trips that change communities and change you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-6 bg-white text-[#8B2B3E] hover:bg-gray-100">
                <Link href="/get-involved">
                  Join a Mission <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 border-white text-white hover:bg-white/10">
                <Link href="#upcoming">View Upcoming Trips</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-6">
              Called to Serve
            </h2>
            <p className="text-lg text-black leading-relaxed mb-8">
              Missions for Men is more than a trip — it is a transformational experience. We believe that men discover their deepest purpose when they step out in faith to serve others. Whether building homes, mentoring youth, or providing essential support to underserved communities, every mission is an opportunity to grow as a man of character and impact.
            </p>
            <div className="flex items-center justify-center gap-8 text-[#8B2B3E]">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="font-semibold">Brotherhood</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6" />
                <span className="font-semibold">Purpose</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                <span className="font-semibold">Service</span>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-4">What We Do</h2>
              <p className="text-lg text-black max-w-2xl mx-auto">
                Our missions combine hands-on service with spiritual growth and brotherhood.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-2 hover:border-[#8B2B3E]/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-3">International Missions</h3>
                  <p className="text-black leading-relaxed">
                    Travel to communities around the world where fathers and families need support the most. Build, teach, and serve alongside local partners.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 hover:border-[#8B2B3E]/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-3">Domestic Outreach</h3>
                  <p className="text-black leading-relaxed">
                    Make an impact closer to home. Serve in local communities, support fatherless families, and mentor young men seeking guidance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 hover:border-[#8B2B3E]/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-3">Team Building</h3>
                  <p className="text-black leading-relaxed">
                    Every mission is a brotherhood experience. Train together, serve together, and forge bonds that last a lifetime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Missions */}
        <section id="upcoming" className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-4">Upcoming Missions</h2>
              <p className="text-lg text-black max-w-2xl mx-auto">
                Join us on an upcoming mission trip and discover the transformative power of service.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 text-center">
              <Calendar className="w-12 h-12 text-[#8B2B3E] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4">Mission Trips Coming Soon</h3>
              <p className="text-black mb-8 max-w-xl mx-auto">
                We are currently planning our next mission trips for 2026. Register your interest below to be the first to know when dates are announced.
              </p>
              <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6B1B2E]">
                <Link href="/get-involved">
                  Register Interest <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 lg:py-28 bg-[#8B2B3E]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-2xl lg:text-3xl text-white font-medium italic mb-8 leading-relaxed">
              "Going on a mission trip with the Foundation changed my perspective on what it means to be a man. Serving others showed me my true purpose."
            </p>
            <p className="text-white/80">— Mission Trip Participant</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-6">
              Ready to Answer the Call?
            </h2>
            <p className="text-lg text-black mb-10 max-w-2xl mx-auto">
              Take the next step in your journey. Join Missions for Men and discover the impact you can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6B1B2E]">
                <Link href="/get-involved">
                  Get Involved <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/10">
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
