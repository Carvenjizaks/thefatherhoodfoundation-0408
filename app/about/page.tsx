"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Star, TrendingUp, Award, Globe, HandHeart, Target } from "lucide-react"

// ── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "20 000+", label: "Impacted Men" },
  { value: "500+", label: "Touched Marriages" },
  { value: "15 000+", label: "Youth Reached" },
  { value: "10+", label: "Years of Impact" },
]

const values = [
  { icon: Heart, title: "Service", description: "We lead by serving others, putting the needs of families and communities at the forefront of everything we do." },
  { icon: Shield, title: "Responsibility", description: "We believe in accountability and taking ownership of our roles as fathers, husbands, and community leaders." },
  { icon: Star, title: "Transformation", description: "We are committed to long-term, lasting change that impacts generations to come." },
  { icon: Users, title: "Brotherhood", description: "We foster authentic community where men can grow, be challenged, and support one another." },
]

const impactAreas = [
  { icon: TrendingUp, title: "Measurable Results", description: "Every programme is tracked to ensure real transformation in families and communities." },
  { icon: Award, title: "Proven Approach", description: "Our three-pillar model of Identity, Affirmation, and Purpose creates lasting change." },
  { icon: Globe, title: "Growing Reach", description: "Expanding from local communities to national and international impact." },
  { icon: HandHeart, title: "100% Committed", description: "Every donation directly supports programmes that transform lives." },
]

const boardOfGovernors = [
  {
    name: "Carven J. Izaks",
    role: "Founder & Chairman",
    bio: "Carven J. Izaks is the Founder and Chairman of The Fatherhood Foundation. He is a speaker, mentor, and strategic leader committed to restoring men, strengthening families, and advancing community transformation through principled leadership and values-based development.",
    image: "",
  },
  {
    name: "Christo Nicholls",
    role: "Board of Governors",
    bio: "Christo Nicholls serves as Chief Executive Officer of Utility Consulting Solutions (UtCS), where he leads efforts to develop practical, affordable electricity solutions. His leadership is marked by innovation, strategic thinking, and a commitment to improving utility access and energy sustainability.",
    image: "",
  },
  {
    name: "Robert Burdett",
    role: "Board of Governors",
    bio: "Robert Burdett is the Senior Pastor of PowerHouse Church in Katy, Texas, and a seasoned church leader with years of pastoral and executive ministry experience. He is known for his strong leadership, biblical teaching, and dedication to building a church culture marked by discipleship, outreach, and community impact.",
    image: "",
  },
  {
    name: "Brandon Sanders",
    role: "Board of Governors",
    bio: "Brandon Sanders is a transformational leader and ministry practitioner serving as Executive Director of Wings of Life in Mobile, Alabama. With a deep commitment to restoration, recovery, and youth mentorship, he works closely with schools, counselors, and families to support vulnerable young people.",
    image: "",
  },
  {
    name: "Bruce Hansen",
    role: "Board of Governors",
    bio: "Bruce Hansen serves as Managing Director of Simonis Storm Securities, bringing seasoned leadership and deep expertise in financial services, investment markets, and economic analysis. His work reflects a strong commitment to sound strategy, responsible stewardship, and long-term financial growth.",
    image: "/team/bruce-hansen.jpg",
  },
]

const managementTeam = [
  {
    name: "Carven Izaks",
    role: "Founder & Executive Leader",
    bio: "As founder of The Fatherhood Foundation, Carven Izaks leads the organization's vision, strategic direction, and core initiatives. He works closely with both governance and management structures to ensure the foundation remains mission-focused, impactful, and aligned with its calling to raise fathers, leaders, and communities of strength.",
    image: "",
  },
  {
    name: "Bianca Clarke",
    role: "Management Team",
    bio: "Bianca Clarke is a leadership and personal development professional serving through Africa B-Inspired (PTY) Ltd. With a focus on coaching, leadership facilitation, and empowering people and organizations, she brings insight, encouragement, and practical development expertise to the spaces she serves.",
    image: "",
  },
  {
    name: "Astrido Barth-Philander",
    role: "Management Team",
    bio: "Astrido Barth-Philander brings strong financial leadership and professional expertise in accounting, reporting, and business support. As Senior Manager: Finance at SanlamAllianz Namibia, he contributes strategic insight, governance discipline, and sound financial stewardship.",
    image: "",
  },
]

// ── Components ───────────────────────────────────────────────────────────────

function GovernorCard({ member, isChairman = false }: { member: typeof boardOfGovernors[0]; isChairman?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const initials = member.name.split(" ").map(n => n[0]).join("")

  return (
    <Card
      className={`border-0 transition-all duration-500 overflow-hidden cursor-pointer rounded-2xl ${hovered ? "shadow-2xl scale-[1.02]" : "shadow-lg"} bg-gradient-to-br from-[#FDF8F4] to-[#FEF3EB]`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="p-6 py-8 flex flex-col items-center">
        {/* Avatar */}
        <div className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg transition-all duration-500 mb-4 ${hovered ? "w-24 h-24" : "w-20 h-20"}`}
          style={member.image ? {} : { background: "linear-gradient(135deg, #D4956A 0%, #E8B896 50%, #D4956A 100%)" }}>
          {member.image ? (
            <Image src={member.image} alt={member.name} width={96} height={96} className="w-full h-full object-cover object-top" />
          ) : (
            <span className="text-white font-bold text-xl">{initials}</span>
          )}
        </div>

        <h3 className={`font-bold text-[#5a3d2b] text-center mb-1 ${isChairman ? "text-xl" : "text-lg"}`}>{member.name}</h3>
        <p className="text-sm font-semibold text-center mb-3" style={{ color: "#D4956A" }}>{member.role}</p>

        <div className={`overflow-hidden transition-all duration-500 ease-out w-full ${hovered ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pt-4 border-t" style={{ borderColor: "#D4956A40" }}>
            <p className="text-xs text-[#6b5344] leading-relaxed text-center">{member.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TeamCard({ member }: { member: typeof managementTeam[0] }) {
  const [hovered, setHovered] = useState(false)
  const initials = member.name.split(" ").map(n => n[0]).join("")

  return (
    <Card
      className={`border-2 transition-all duration-300 cursor-pointer ${hovered ? "border-[#8B2B3E] shadow-xl" : "border-border hover:border-[#8B2B3E]/40"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8B2B3E] flex items-center justify-center flex-shrink-0">
            {member.image ? (
              <Image src={member.image} alt={member.name} width={56} height={56} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-white font-bold text-sm">{initials}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
            <p className="text-sm text-[#8B2B3E] font-medium mb-3">{member.role}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-black min-h-screen">

        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[#8B2B3E] to-[#6B1B2E] pt-32 pb-20 text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-widest text-white/70 mb-4 font-medium">Know That Your Support Makes a Difference</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Transforming Lives, <span className="text-[#D4956A]">One Father at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-10">
              The Fatherhood Foundation is a values-driven organization committed to raising strong men, strengthening families, and building healthier communities. Through mentoring, leadership development, youth engagement, school-based programmes, and community initiatives, we equip and empower men to flourish in life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold h-12 px-8">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold h-12 px-8">
                <Link href="/partnership">Get Involved</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#8B2B3E] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#8B2B3E] mb-4">Why Partner With Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your partnership creates measurable, lasting impact across Namibia and beyond.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactAreas.map(area => (
                <Card key={area.title} className="border border-border/50 hover:shadow-lg transition-all duration-300 hover:border-[#8B2B3E]/30 text-center">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                      <area.icon className="w-6 h-6 text-[#8B2B3E]" />
                    </div>
                    <h3 className="font-bold text-[#8B2B3E] mb-2">{area.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{area.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8B2B3E] mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              To raise strong, responsible men who invest in their families and communities — creating a generational legacy of integrity, purpose, and servant leadership across Namibia and Africa.
            </p>
            <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6B1B2E] text-white h-12 px-10">
              <Link href="/partnership">Support Our Mission</Link>
            </Button>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#8B2B3E] mb-4">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(value => (
                <Card key={value.title} className="border border-border/50 hover:shadow-lg transition-all duration-300 hover:border-[#8B2B3E]/30 text-center">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-[#8B2B3E]" />
                    </div>
                    <h3 className="font-bold text-[#8B2B3E] mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Board of Governors */}
        <section className="py-20 bg-[#FDF8F4]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#8B2B3E] mb-4">Board of Governors</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Hover over a card to learn more about each board member.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardOfGovernors.map((member, i) => (
                <GovernorCard key={member.name} member={member} isChairman={i === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#8B2B3E] mb-4">Management Team</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementTeam.map(member => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-[#8B2B3E] to-[#6B1B2E] text-white text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-white/80 text-lg mb-10">Join us in transforming lives, strengthening families, and building communities of lasting impact.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold h-12 px-8">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold h-12 px-8">
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
