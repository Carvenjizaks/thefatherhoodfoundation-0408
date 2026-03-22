"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, Target, Heart } from "lucide-react"

// Hover-expandable profile card component
function ProfileCard({ member, isArc = false }: { member: { name: string; role: string; bio: string; image: string }, isArc?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`border-2 transition-all duration-500 overflow-hidden bg-background cursor-pointer ${
        isHovered 
          ? "border-[#8B2B3E] shadow-2xl z-20" 
          : "border-border hover:border-[#8B2B3E]/50 hover:shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={`transition-all duration-500 ${isArc ? "p-5" : "p-6"}`}>
        <div className={`rounded-full bg-gradient-to-br from-[#8B2B3E] to-[#6d2230] mx-auto mb-3 flex items-center justify-center shadow-lg transition-all duration-500 ${
          isHovered 
            ? "w-24 h-24 mb-4" 
            : isArc ? "w-16 h-16" : "w-20 h-20 mb-4"
        }`}>
          <span className={`text-white font-bold transition-all duration-500 ${
            isHovered ? "text-2xl" : isArc ? "text-lg" : "text-2xl"
          }`}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <h3 className={`font-bold text-foreground mb-1 text-center transition-all duration-300 ${
          isHovered ? "text-xl" : isArc ? "text-lg" : "text-xl"
        }`}>
          {member.name}
        </h3>
        <p className={`text-[#8B2B3E] font-semibold text-center mb-3 transition-all duration-300 ${
          isArc && !isHovered ? "text-xs" : "text-sm"
        }`}>
          {member.role}
        </p>
        <div className={`overflow-hidden transition-all duration-500 ${
          isHovered ? "max-h-96 opacity-100" : isArc ? "max-h-16 opacity-70" : "max-h-20 opacity-80"
        }`}>
          <p className={`text-muted-foreground leading-relaxed text-center transition-all duration-300 ${
            isArc && !isHovered ? "text-xs line-clamp-3" : "text-sm"
          }`}>
            {member.bio}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const boardOfGovernors = [
  {
    name: "Carven J. Izaks",
    role: "Founder & Chairman",
    bio: "Carven J. Izaks is the Founder and Chairman of The Fatherhood Foundation. He is a speaker, mentor, and strategic leader committed to restoring men, strengthening families, and advancing community transformation through principled leadership and values-based development. His public profile also identifies him as Director at Nexium Business Intelligence.",
    image: "/team/carven-izaks.jpg",
  },
  {
    name: "Christo Nicholls",
    role: "Board of Governors",
    bio: "Christo Nicholls serves as Chief Executive Officer of Utility Consulting Solutions (UtCS), where he leads efforts to develop practical, affordable electricity solutions. His leadership is marked by innovation, strategic thinking, and a commitment to improving utility access and energy sustainability.",
    image: "/team/christo-nicholls.jpg",
  },
  {
    name: "Robert Burdett",
    role: "Board of Governors",
    bio: "Robert Burdett is the Senior Pastor of PowerHouse Church in Katy, Texas, and a seasoned church leader with years of pastoral and executive ministry experience. He is known for his strong leadership, biblical teaching, and dedication to building a church culture marked by discipleship, outreach, and community impact. His ministry reflects a heart for people, a commitment to the local church, and a vision for lasting Kingdom influence.",
    image: "/team/robert-burdett.jpg",
  },
  {
    name: "Brandon Sanders",
    role: "Board of Governors",
    bio: "Brandon Sanders is a transformational leader and ministry practitioner serving as Executive Director of Wings of Life in Mobile, Alabama. With a deep commitment to restoration, recovery, and youth mentorship, he works closely with schools, counselors, and families to support vulnerable young people and individuals facing life-controlling challenges. His life and leadership reflect redemption, resilience, and a passion to see lives restored through faith, guidance, and practical care.",
    image: "/team/brandon-sanders.jpg",
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
    image: "/team/carven-izaks.jpg",
  },
  {
    name: "Bianca Clark",
    role: "Management Team",
    bio: "Bianca Clark serves on the management team and helps support the implementation of the foundation's programmes and operational priorities. She is committed to people development, organizational effectiveness, and the practical outworking of the foundation's mission in communities and leadership spaces.",
    image: "/team/bianca-clark.jpg",
  },
  {
    name: "Astrido Barth-Philander",
    role: "Management Team",
    bio: "Astrido Barth-Philander brings strong financial leadership and professional expertise in accounting, reporting, and business support. As Senior Manager: Finance at SanlamAllianz Namibia, he contributes strategic insight, governance discipline, and sound financial stewardship shaped by his chartered accountancy background and training through the University of Cape Town and the Institute of Chartered Accountants of Namibia.",
    image: "/team/astrido-barth-philander.jpg",
  },
]

const values = [
  {
    icon: Shield,
    title: "Service",
    description: "We lead by serving others, putting the needs of families and communities at the forefront of everything we do.",
  },
  {
    icon: Target,
    title: "Responsibility",
    description: "We believe in accountability and taking ownership of our roles as fathers, husbands, and community leaders.",
  },
  {
    icon: Heart,
    title: "Transformation",
    description: "We are committed to long-term, lasting change that impacts generations to come.",
  },
  {
    icon: Users,
    title: "Brotherhood",
    description: "We foster authentic community where men can grow, be challenged, and support one another.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/5 via-background to-[#8B2B3E]/10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8B2B3E]/5 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Who We Are
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
                Raising Strong Men,{" "}
                <span className="text-[#8B2B3E]">Strengthening Families</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                The Fatherhood Foundation is a values-driven organization committed to raising strong men, 
                strengthening families, and building healthier communities. Through mentoring, leadership development, 
                youth engagement, school-based programmes, and community initiatives, we work to equip men and young 
                people with the character, conviction, and practical tools needed to lead well in every sphere of life.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 lg:py-24 bg-[#8B2B3E]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                We exist to equip men with the values, tools, and support needed to become intentional fathers, 
                committed husbands, and impactful leaders. Through strategic programmes, mentorship, and community 
                engagement, we are building a culture of responsibility, leadership, and transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our work is built on these core principles that guide everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-[#8B2B3E]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Board of Governors */}
        <section className="py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">The Board of Governors</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The Board of Governors serves as a strategic advisory body to help strengthen the long-term vision, 
                direction, and governance-minded thinking of The Fatherhood Foundation. This team brings leadership 
                insight, wisdom, and counsel to support the growth and sustainability of the organization.
              </p>
            </div>

            {/* Half-moon arc layout */}
            <div className="relative max-w-6xl mx-auto">
              {/* Mobile: Stack layout */}
              <div className="md:hidden flex flex-col gap-6">
                {boardOfGovernors.map((member) => (
                  <ProfileCard key={member.name} member={member} />
                ))}
              </div>

              {/* Desktop: Half-moon arc layout */}
              <div className="hidden md:block relative" style={{ minHeight: "700px" }}>
                {boardOfGovernors.map((member, index) => {
                  // Calculate position along a half-moon arc
                  const totalMembers = boardOfGovernors.length
                  const angle = Math.PI * (index / (totalMembers - 1)) // 0 to PI (180 degrees)
                  const radius = 280 // radius of the arc
                  const centerX = 50 // center percentage
                  const centerY = 10 // center Y percentage (top of arc)
                  
                  // Calculate x and y positions
                  const x = centerX + (radius / 6) * Math.cos(Math.PI - angle)
                  const y = centerY + (radius / 4) * Math.sin(angle)
                  
                  return (
                    <div
                      key={member.name}
                      className="absolute transform -translate-x-1/2 transition-all duration-500 hover:z-20"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: "280px",
                      }}
                    >
                      <ProfileCard member={member} isArc={true} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">The Management Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The Management Team leads the day-to-day implementation of the vision and programmes of 
                The Fatherhood Foundation. This team helps ensure that strategy becomes action and that the 
                organization's work is carried out with excellence, consistency, and purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {managementTeam.map((member) => (
                <ProfileCard key={`${member.name}-${member.role}`} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 lg:py-24 bg-[#1E3A5F]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Join Us in This Mission</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Whether through partnership, volunteering, or participation in our programmes, 
              you can be part of building stronger families and healthier communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/get-involved"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold rounded-lg transition-colors"
              >
                Get Involved
              </a>
              <a
                href="/partnership"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
