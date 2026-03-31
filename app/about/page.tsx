"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Target, Heart, Users, TrendingUp, Award, Globe, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// named imports — header.tsx and footer.tsx use named exports only

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
  image: "/team/carven-izaks.jpg",
  bio: "Carven J. Izaks is the Founder and Chairman of The Fatherhood Foundation. He is a speaker, mentor, and strategic leader committed to restoring men, strengthening families, and advancing community transformation through principled leadership and values-based development. His public profile also identifies him as Director at Nexium Business Intelligence.",
}

const governors = [
  {
    name: "Christo Nicholls",
    initials: "CN",
    role: "Board of Governors",
    image: "/team/christo-nicholls.jpg",
    bio: "Christo Nicholls serves as Chief Executive Officer of Utility Consulting Solutions (UtCS), where he leads efforts to develop practical, affordable electricity solutions. His leadership is marked by innovation, strategic thinking, and a commitment to improving utility access and energy sustainability.",
  },
  {
    name: "Robert Burdett",
    initials: "RB",
    role: "Board of Governors",
    image: "/team/robert-burdett.jpg",
    bio: "Robert Burdett brings extensive experience in business strategy and community leadership. He serves as a trusted advisor helping The Fatherhood Foundation navigate growth and governance with wisdom and integrity.",
  },
  {
    name: "Brandon Sanders",
    initials: "BS",
    role: "Board of Governors",
    image: "/team/brandon-sanders.jpg",
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
  { name: "Bianca Clark",      initials: "BC",  role: "Organisation Secretary", image: "/team/bianca-clark.jpg", bio: "Bianca Clark is a leadership and personal development professional serving through Africa B-Inspired (PTY) Ltd. As Organisation Secretary, she brings coaching expertise and practical development insight to strengthen families and communities through The Fatherhood Foundation." },
  { name: "Astrido Philander", initials: "AP",  role: "Treasurer",              image: "/team/astrido-philander.jpg", bio: "Astrido Philander oversees the financial stewardship of The Fatherhood Foundation, ensuring responsible management of resources to sustain and grow the organisation's impact." },
]

// ─── BoardSection — click-to-flip card grid ──────────────────────────────────

type BoardMember = { name: string; initials: string; role: string; image: string; bio: string }

function BoardMemberCard({ member }: { member: BoardMember }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px", width: "210px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        style={{
          position: "relative",
          width: "210px",
          height: "300px",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — photo + name */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: member.image ? "transparent" : "linear-gradient(135deg, #D4956A 0%, #E8B896 100%)",
            border: "3px solid #E8D5C4",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "top", flexShrink: 0 }} />
          ) : (
            <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "2rem" }}>{member.initials}</span>
            </div>
          )}
          <div style={{ padding: "10px 12px", background: "#FDF8F4", flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#3D1F0F", margin: 0, lineHeight: 1.3 }}>{member.name}</p>
            <p style={{ fontWeight: 600, fontSize: "0.72rem", color: "#8B2B3E", margin: "3px 0 0" }}>{member.role}</p>
            <p style={{ fontSize: "0.65rem", color: "#9A7B6A", margin: "5px 0 0" }}>Click to read bio</p>
          </div>
        </div>

        {/* Back — bio */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #FDF8F4 0%, #FEF3EB 100%)",
            border: "3px solid #8B2B3E",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 16px",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#3D1F0F", textAlign: "center", marginBottom: "4px" }}>{member.name}</p>
          <p style={{ fontWeight: 600, fontSize: "0.72rem", color: "#8B2B3E", textAlign: "center", marginBottom: "12px" }}>{member.role}</p>
          <p style={{ fontSize: "0.72rem", color: "#5C3D2E", lineHeight: 1.6, textAlign: "center", overflowY: "auto", maxHeight: "180px" }}>{member.bio}</p>
          <p style={{ fontSize: "0.62rem", color: "#9A7B6A", marginTop: "10px", flexShrink: 0 }}>Click to flip back</p>
        </div>
      </div>
    </div>
  )
}

function BoardSection({ members }: { members: BoardMember[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {members.map((m) => (
        <BoardMemberCard key={m.name} member={m} />
      ))}
    </div>
  )
}

// ─── ManagementCard ───────────────────────────────────────────────────────────

function ManagementCard({ member }: { member: typeof management[0] }) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
      <CardContent className="p-6 text-center">
        <div
          className="w-40 h-48 rounded-2xl mx-auto mb-5 overflow-hidden flex items-center justify-center shadow-md"
          style={{ background: member.image ? "transparent" : "linear-gradient(135deg, #8B2B3E 0%, #6B1B2E 100%)" }}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
          ) : (
            <span className="text-white font-bold text-2xl">{member.initials}</span>
          )}
        </div>
        <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">{member.name}</h3>
        <p className="text-sm text-[#8B2B3E] font-semibold mb-3">{member.role}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
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
      <section className="py-24 bg-white overflow-hidden">
        <style>{`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(48px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .value-card {
            opacity: 0;
            animation: slideUpFade 0.6s ease forwards;
          }
          .value-card:nth-child(1) { animation-delay: 0.1s; }
          .value-card:nth-child(2) { animation-delay: 0.25s; }
          .value-card:nth-child(3) { animation-delay: 0.4s; }
          .value-card:nth-child(4) { animation-delay: 0.55s; }
        `}</style>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2B3E] mb-3">What Guides Us</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Our work is built on these core principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="value-card border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-white"
              >
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-6">
                    <v.icon className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">{v.desc}</p>
                </div>
              </div>
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

          {/* All board members — hover avatar to slide in full profile */}
          <BoardSection members={[chairman, ...governors]} />
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
          <div className="flex flex-wrap justify-center gap-8">
            {management.map((m) => (
              <div key={m.name} className="w-full sm:w-72">
                <ManagementCard member={m} />
              </div>
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
