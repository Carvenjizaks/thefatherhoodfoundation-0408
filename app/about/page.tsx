"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Star, CheckCircle2, ArrowRight } from "lucide-react"

const stats = [
  { value: "20 000+", label: "Impacted Men" },
  { value: "500+", label: "Touched Marriages" },
  { value: "15 000+", label: "Youth Reached" },
  { value: "10+", label: "Years of Impact" },
]

const values = [
  {
    icon: Heart,
    title: "Service",
    description: "We lead by serving others, putting the needs of families and communities at the forefront of everything we do.",
  },
  {
    icon: Shield,
    title: "Responsibility",
    description: "We believe in accountability and taking ownership of our roles as fathers, husbands, and community leaders.",
  },
  {
    icon: Star,
    title: "Transformation",
    description: "We are committed to long-term, lasting change that impacts generations to come.",
  },
  {
    icon: Users,
    title: "Brotherhood",
    description: "We foster authentic community where men can grow, be challenged, and support one another.",
  },
]

const boardMembers = [
  {
    initials: "CJI",
    name: "Carven J. Izaks",
    role: "Founder & Chairman",
    bio: "Carven J. Izaks is the Founder and Chairman of The Fatherhood Foundation. He is a speaker, mentor, and strategic leader committed to restoring men, strengthening families, and advancing community transformation through principled leadership and values-based development. His public profile also identifies him as Director at Nexium Business Intelligence.",
  },
  {
    initials: "CN",
    name: "Christo Nicholls",
    role: "Board of Governors",
    bio: "Christo Nicholls serves as Chief Executive Officer of Utility Consulting Solutions (UtCS), where he leads efforts to develop practical, affordable electricity solutions. His leadership is marked by innovation, strategic thinking, and a commitment to improving utility access and energy sustainability.",
  },
  {
    initials: "RB",
    name: "Robert Burdett",
    role: "Board of Governors",
    bio: "Robert Burdett is the Senior Pastor of PowerHouse Church in Katy, Texas, and a seasoned church leader with years of pastoral and executive ministry experience. He is known for his strong leadership, biblical teaching, and dedication to building a church culture marked by discipleship, outreach, and community impact.",
  },
  {
    initials: "BS",
    name: "Brandon Sanders",
    role: "Board of Governors",
    bio: "Brandon Sanders is a transformational leader and ministry practitioner serving as Executive Director of Wings of Life in Mobile, Alabama. With a deep commitment to restoration, recovery, and youth mentorship, he works closely with schools, counselors, and families to support vulnerable young people and individuals facing life-controlling challenges.",
  },
  {
    initials: "BH",
    name: "Bruce Hansen",
    role: "Board of Governors",
    bio: "Bruce Hansen serves as Managing Director of Simonis Storm Securities, bringing seasoned leadership and deep expertise in financial services, investment markets, and economic analysis. His work reflects a strong commitment to sound strategy, responsible stewardship, and long-term financial growth.",
  },
]

const managementTeam = [
  {
    initials: "CI",
    name: "Carven Izaks",
    role: "Founder & Executive Leader",
    bio: "As founder of The Fatherhood Foundation, Carven Izaks leads the organization's vision, strategic direction, and core initiatives. He works closely with both governance and management structures to ensure the foundation remains mission-focused, impactful, and aligned with its calling to raise fathers, leaders, and communities of strength.",
  },
  {
    initials: "BC",
    name: "Bianca Clarke",
    role: "Management Team",
    bio: "Bianca Clarke is a leadership and personal development professional serving through Africa B-Inspired (PTY) Ltd. With a focus on coaching, leadership facilitation, and empowering people and organizations, she brings insight, encouragement, and practical development expertise to the spaces she serves. She brings her wealth of knowledge in the area of governance.",
  },
  {
    initials: "AB",
    name: "Astrido Barth-Philander",
    role: "Management Team",
    bio: "Astrido Barth-Philander brings strong financial leadership and professional expertise in accounting, reporting, and business support. As Senior Manager: Finance at SanlamAllianz Namibia, he contributes strategic insight, governance discipline, and sound financial stewardship shaped by his chartered accountancy background and training through the University of Cape Town and the Institute of Chartered Accountants of Namibia.",
  },
]

function PersonCard({ initials, name, role, bio }: { initials: string; name: string; role: string; bio: string }) {
  return (
    <Card className="border border-border/50 hover:shadow-lg transition-all duration-300 hover:border-[#8B2B3E]/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8B2B3E] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{name}</h3>
            <p className="text-sm text-[#8B2B3E] font-medium mb-3">{role}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-black min-h-screen">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#8B2B3E] to-[#6B1B2E] pt-32 pb-20 text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-widest text-white/70 mb-4 font-medium">Know That Your Support Makes a Difference</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Transforming Lives, One Father at a Time
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-10">
              The Fatherhood Foundation is a values-driven organization committed to raising strong men, strengthening families, and building healthier communities. Through mentoring, leadership development, youth engagement, school-based programmes, and community initiatives, we equip and empower men to go and train young people in character, instill values, principles, and the practical tools needed to flourish in life.
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

        {/* Stats Section */}
        <section className="bg-white border-b border-border/30 py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#8B2B3E] mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-[#8B2B3E] font-medium mb-3">Why Partner With Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Your Investment Creates Lasting Change</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                When you support The Fatherhood Foundation, you are directly investing in the transformation of men, families, and entire communities.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Measurable Results", desc: "Every programme is tracked to ensure real transformation in families and communities." },
                { title: "Proven Approach", desc: "Our three-pillar model of Identity, Affirmation, and Purpose creates lasting change." },
                { title: "Growing Reach", desc: "Expanding from local communities to national and international impact." },
                { title: "100% Committed", desc: "Every donation directly supports programmes that transform lives." },
              ].map((item) => (
                <Card key={item.title} className="border border-border/50 hover:border-[#8B2B3E]/40 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <CheckCircle2 className="w-6 h-6 text-[#8B2B3E] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm uppercase tracking-widest text-[#8B2B3E] font-medium mb-3">Our Mission</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance leading-tight">
                  We exist to equip men with the values, tools, and support needed to become intentional fathers, committed husbands, and impactful leaders.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Through strategic programmes, mentorship, and community engagement, we are building a culture of responsibility, leadership, and transformation that spans generations.
                </p>
              </div>
              <div className="bg-[#8B2B3E]/5 rounded-2xl p-8 border border-[#8B2B3E]/10">
                <h3 className="text-lg font-bold text-[#8B2B3E] mb-6">Help Us Reach More Fathers</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Your donation directly funds mentoring programmes, leadership training, and youth development initiatives that transform lives.</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Support to reach more youth",
                    "Support the ministry to men through mentorship",
                    "Reach more new schools with our Character Development programme",
                    "Join us to touch more marriages",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-[#8B2B3E] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-[#8B2B3E] hover:bg-[#6B1B2E] text-white font-semibold h-12">
                  <Link href="/donate">Make a Donation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-[#8B2B3E] font-medium mb-3">What Guides Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Values</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Our work is built on these core principles that guide everything we do.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="text-center border border-border/50 hover:border-[#8B2B3E]/40 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-[#8B2B3E]" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Board of Governors */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-[#8B2B3E] font-medium mb-3">Leadership You Can Trust</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Board of Governors</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The Board of Governors serves as a strategic advisory body to help strengthen the long-term vision, direction, and governance-minded thinking of The Fatherhood Foundation. This team brings leadership insight, wisdom, and counsel to support the growth and sustainability of the organization.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boardMembers.map((member) => (
                <PersonCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-[#8B2B3E] font-medium mb-3">Dedicated Team</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Management Team</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The Management Team leads the day-to-day implementation of the vision and programmes of The Fatherhood Foundation. This team helps ensure that strategy becomes action and that the organization's work is carried out with excellence, consistency, and purpose.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementTeam.map((member) => (
                <PersonCard key={member.name + member.role} {...member} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#8B2B3E] text-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Join Us in Restoring Fathers and Transforming Generations
            </h2>
            <p className="text-white/80 leading-relaxed mb-10 text-lg">
              Whether through a donation, partnership, or volunteering, your support helps us reach more men, strengthen more families, and build healthier communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold h-12 px-8">
                <Link href="/donate">Give Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold h-12 px-8">
                <Link href="/partnership">Become a Partner <ArrowRight className="ml-2 w-4 h-4 inline" /></Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
