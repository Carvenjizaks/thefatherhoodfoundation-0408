"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Target, Heart, Users, TrendingUp, Award, Globe, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "20,000+", label: "Men Impacted" },
  { value: "500+",    label: "Marriages Strengthened" },
  { value: "15,000+", label: "Youth Reached" },
  { value: "10+",     label: "Years of Service" },
]

const whyPartner = [
  { icon: TrendingUp, title: "Measurable Results",   desc: "Every programme is tracked to ensure real transformation in families and communities." },
  { icon: Award,      title: "Proven Approach",      desc: "Our three-pillar model of Identity, Affirmation, and Purpose creates lasting change." },
  { icon: Globe,      title: "Growing Reach",        desc: "Expanding from local communities to national and international impact." },
  { icon: HandHeart,  title: "100% Committed",       desc: "Every donation directly supports programmes that transform lives." },
]

const values = [
  { icon: Shield, title: "Service",        desc: "We lead by serving others, putting the needs of families and communities at the forefront of everything we do." },
  { icon: Target, title: "Responsibility", desc: "We believe in accountability and taking ownership of our roles as fathers, husbands, and community leaders." },
  { icon: Heart,  title: "Transformation",desc: "We are committed to long-term, lasting change that impacts generations to come." },
  { icon: Users,  title: "Brotherhood",   desc: "We foster authentic community where men can grow, be challenged, and support one another." },
]

const chairman = {
  name: "Carven J. Izaks",
  initials: "CJI",
  role: "Founder & Chairman",
  image: "",
  bio: "Carven J. Izaks is the Founder and Chairman of The Fatherhood Foundation. He is a speaker, mentor, and strategic leader committed to restoring men, strengthening families, and advancing community transformation through principled leadership and values-based development. His public profile also identifies him as Director at Nexium Business Intelligence.",
}

const governors = [
  {
    name: "Christo Nicholls",
    initials: "CN",
    role: "Board of Governors",
    image: "",
    bio: "Christo Nicholls serves as Chief Executive Officer of Utility Consulting Solutions (UtCS), where he leads efforts to develop practical, affordable electricity solutions. His leadership is marked by innovation, strategic thinking, and a commitment to improving utility access and energy sustainability.",
  },
  {
    name: "Robert Burdett",
    initials: "RB",
    role: "Board of Governors",
    image: "",
    bio: "Robert Burdett brings extensive experience in business strategy and community leadership. He serves as a trusted advisor helping The Fatherhood Foundation navigate growth and governance with wisdom and integrity.",
  },
  {
    name: "Brandon Sanders",
    initials: "BS",
    role: "Board of Governors",
    image: "",
    bio: "Brandon Sanders is a dedicated leader committed to empowering men and strengthening families through community-driven initiatives and mentorship programmes.",
  },
  {
    name: "Bruce Hansen",
    initials: "BH",
    role: "Board of Governors",
    image: "/team/bruce-hansen.jpg",
    bio: "Bruce Hansen brings a wealth of experience in leadership and community development. His commitment to building stronger families and communities makes him an invaluable member of The Fatherhood Foundation's Board of Governors.",
  },
]

const management = [
  { name: "Carven J. Izaks", initials: "CJI", role: "Founder & Director",    bio: "Visionary leader and founder driving the mission forward." },
  { name: "Operations Lead",  initials: "OL",  role: "Head of Operations",    bio: "Ensuring seamless delivery of all programmes and initiatives." },
  { name: "Programmes Lead",  initials: "PL",  role: "Head of Programmes",    bio: "Developing and overseeing all training and development programmes." },
]

// ─── GovernorCard ─────────────────────────────────────────────────────────────

function GovernorCard({ member }: { member: typeof governors[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <Card
      className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl"
      style={{ background: "linear-gradient(135deg, #FDF8F4 0%, #FEF3EB 100%)" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <CardContent className="p-8 text-center">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center shadow-md"
          style={{ background: member.image ? "transparent" : "linear-gradient(135deg, #D4956A 0%, #E8B896 100%)" }}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
          ) : (
            <span className="text-white font-bold text-2xl">{member.initials}</span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#3D1F0F] mb-1">{member.name}</h3>
        <p className="text-sm font-semibold text-[#D4956A] mb-4">{member.role}</p>

        {/* Slide-open bio */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: open ? "200px" : "0px", opacity: open ? 1 : 0 }}
        >
          <hr className="border-[#D4956A]/30 mb-4" />
          <p className="text-sm text-[#5C3D2E] leading-relaxed">{member.bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ChairmanCard ─────────────────────────────────────────────────────────────

function ChairmanCard({ member }: { member: typeof chairman }) {
  return (
    <Card
      className="border-0 shadow-lg rounded-2xl max-w-2xl mx-auto"
      style={{ background: "linear-gradient(135deg, #FDF8F4 0%, #FEF3EB 100%)" }}
    >
      <CardContent className="p-10 text-center">
        <div
          className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center shadow-lg"
          style={{ background: member.image ? "transparent" : "linear-gradient(135deg, #D4956A 0%, #E8B896 100%)" }}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
          ) : (
            <span className="text-white font-bold text-4xl">{member.initials}</span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-[#3D1F0F] mb-2">{member.name}</h3>
        <p className="text-base font-semibold text-[#D4956A] mb-6">{member.role}</p>
        <hr className="border-[#D4956A]/30 mb-6" />
        <p className="text-[#5C3D2E] leading-relaxed">{member.bio}</p>
      </CardContent>
    </Card>
  )
}

// ─── ManagementCard ───────────────────────────────────────────────────────────

function ManagementCard({ member }: { member: typeof management[0] }) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
      <CardContent className="p-6 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow"
          style={{ background: "linear-gradient(135deg, #8B2B3E 0%, #6B1B2E 100%)" }}
        >
          <span className="text-white font-bold text-sm">{member.initials}</span>
        </div>
        <h3 className="font-bold text-[#1a1a1a] mb-1">{member.name}</h3>
        <p className="text-sm text-[#8B2B3E] font-semibold mb-2">{member.role}</p>
        <p className="text-sm text-gray-600">{member.bio}</p>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/20 via-transparent to-[#8B2B3E]/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#D4956A] mb-4">Know That Your Support Makes a Difference</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Transforming Lives,{" "}
            <span className="text-[#D4956A]">One Father at a Time</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto mb-10">
            The Fatherhood Foundation is a values-driven organization committed to raising strong men, strengthening families, and building healthier communities. Through mentoring, leadership development, youth engagement, and community initiatives, we equip and empower men to go and train young people in character, values, and practical life tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold h-12 px-8">
              <Link href="/partnership">Partner With Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold h-12 px-8">
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#8B2B3E]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-white mb-2">{s.value}</p>
                <p className="text-white/70 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-24 bg-[#f8f5f2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2B3E] mb-3">Why Partner With Us</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4 text-balance">Your Investment Creates Lasting Change</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              When you support The Fatherhood Foundation, you are directly investing in the transformation of men, families, and entire communities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartner.map((item) => (
              <Card key={item.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#8B2B3E] flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-[#8B2B3E]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Our Mission</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-balance leading-relaxed">
            "To empower men to become the fathers, husbands, and community leaders they were created to be — through mentoring, education, and transformation."
          </h2>
          <Button asChild size="lg" className="bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold h-12 px-8">
            <Link href="/partnership">Support the Mission</Link>
          </Button>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2B3E] mb-3">What Guides Us</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Our work is built on these core principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-6">
                    <v.icon className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Governors */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#FAF0E8" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-40" style={{ background: "#E8B896", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-20 left-16 w-20 h-20 rounded-full opacity-30" style={{ background: "#D4956A" }} />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full opacity-20" style={{ background: "#E8B896", transform: "translate(40%, -50%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4956A] mb-3">Leadership You Can Trust</p>
            <h2 className="text-4xl font-bold text-[#3D1F0F] mb-6">The Board of Governors</h2>
            <p className="text-[#5C3D2E] max-w-3xl mx-auto leading-relaxed">
              The Board of Governors serves as a strategic advisory body to help strengthen the long-term vision, direction, and governance-minded thinking of The Fatherhood Foundation. This team brings leadership insight, wisdom, and counsel to support the growth and sustainability of the organization.
            </p>
          </div>

          {/* Chairman — large centered card */}
          <div className="mb-12">
            <ChairmanCard member={chairman} />
          </div>

          {/* Other governors — hover to reveal bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {governors.map((g) => (
              <GovernorCard key={g.name} member={g} />
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2B3E] mb-3">Dedicated Team</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">Management Team</h2>
            <p className="text-gray-600 max-w-xl mx-auto">The team that drives the day-to-day work of the Foundation with passion and purpose.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {management.map((m) => (
              <ManagementCard key={m.name} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-white/70 mb-8 leading-relaxed">Join hundreds of partners who are investing in the transformation of men, families, and communities across Namibia and beyond.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold h-12 px-8">
              <Link href="/partnership">Become a Partner</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold h-12 px-8">
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
