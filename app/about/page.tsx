"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield, Target, Heart, TrendingUp, Award, Globe, HandHeart } from "lucide-react"
import Link from "next/link"

// Animated counter component
function AnimatedStat({ value, label, prefix = "", suffix = "" }: { value: string; label: string; prefix?: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
        {prefix}{value}{suffix}
      </div>
      <div className="text-white/70 text-sm sm:text-base uppercase tracking-wider">{label}</div>
    </div>
  )
}

// Governor card with slide-open bio on hover - Warm styling
function GovernorCard({ member, isChairman = false }: { member: { name: string; role: string; bio: string; image: string }, isChairman?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`border-0 transition-all duration-500 overflow-hidden cursor-pointer rounded-2xl ${
        isHovered 
          ? "shadow-2xl scale-[1.02]" 
          : "shadow-lg hover:shadow-xl"
      } ${isChairman ? "bg-gradient-to-br from-[#FDF8F4] via-[#FEF3EB] to-[#FDEEE3]" : "bg-gradient-to-br from-[#FDF8F4] to-[#FEF3EB]"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={`p-6 ${isChairman ? "py-10" : "py-8"}`}>
        {/* Warm peach avatar */}
        <div className={`rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
          isHovered 
            ? isChairman ? "w-32 h-32" : "w-24 h-24"
            : isChairman ? "w-28 h-28" : "w-20 h-20"
        }`} style={{ background: "linear-gradient(135deg, #D4956A 0%, #E8B896 50%, #D4956A 100%)" }}>
          <span className={`text-white font-bold transition-all duration-500 drop-shadow-md ${
            isHovered 
              ? isChairman ? "text-4xl" : "text-2xl"
              : isChairman ? "text-3xl" : "text-xl"
          }`}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        <h3 className={`font-bold text-[#5a3d2b] text-center mb-1 transition-all duration-300 ${
          isChairman ? "text-2xl" : "text-lg"
        }`}>
          {member.name}
        </h3>
        <p className={`font-semibold text-center mb-3 ${
          isChairman ? "text-base" : "text-sm"
        }`} style={{ color: "#D4956A" }}>
          {member.role}
        </p>
        
        <div className={`overflow-hidden transition-all duration-500 ease-out ${
          isHovered ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="pt-4 border-t" style={{ borderColor: "#D4956A40" }}>
            <p className={`text-[#6b5344] leading-relaxed text-center ${
              isChairman ? "text-sm" : "text-xs"
            }`}>
              {member.bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Horizontal sliding profile card for management team
function HorizontalProfileCard({ member }: { member: { name: string; role: string; bio: string; image: string } }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`border-2 transition-all duration-500 overflow-hidden bg-background cursor-pointer ${
        isHovered 
          ? "border-[#8B2B3E] shadow-2xl z-20 flex-[2]" 
          : "border-border hover:border-[#8B2B3E]/50 hover:shadow-lg flex-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 h-full flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className={`rounded-full bg-gradient-to-br from-[#8B2B3E] to-[#6d2230] flex-shrink-0 flex items-center justify-center shadow-lg transition-all duration-500 ${
            isHovered ? "w-20 h-20" : "w-16 h-16"
          }`}>
            <span className={`text-white font-bold transition-all duration-500 ${
              isHovered ? "text-xl" : "text-lg"
            }`}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1 truncate">
              {member.name}
            </h3>
            <p className="text-[#8B2B3E] font-semibold text-sm">
              {member.role}
            </p>
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-500 ${
          isHovered ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {member.bio}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Profile card for mobile
function ProfileCard({ member }: { member: { name: string; role: string; bio: string; image: string } }) {
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
      <CardContent className="p-6">
        <div className={`rounded-full bg-gradient-to-br from-[#8B2B3E] to-[#6d2230] mx-auto mb-3 flex items-center justify-center shadow-lg transition-all duration-500 ${
          isHovered ? "w-24 h-24 mb-4" : "w-20 h-20 mb-4"
        }`}>
          <span className={`text-white font-bold transition-all duration-500 ${
            isHovered ? "text-2xl" : "text-2xl"
          }`}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1 text-center">
          {member.name}
        </h3>
        <p className="text-[#8B2B3E] font-semibold text-center mb-3 text-sm">
          {member.role}
        </p>
        <div className={`overflow-hidden transition-all duration-500 ${
          isHovered ? "max-h-96 opacity-100" : "max-h-20 opacity-80"
        }`}>
          <p className="text-muted-foreground leading-relaxed text-center text-sm">
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
    name: "Bianca Clarke",
    role: "Management Team",
    bio: "Bianca Clarke is a leadership and personal development professional serving through Africa B-Inspired (PTY) Ltd. With a focus on coaching, leadership facilitation, and empowering people and organizations, she brings insight, encouragement, and practical development expertise to the spaces she serves. She brings her wealth of knowledge in the area of governance.",
    image: "/team/bianca-clarke.jpg",
  },
  {
    name: "Astrido Barth-Philander",
    role: "Management Team",
    bio: "Astrido Barth-Philander brings strong financial leadership and professional expertise in accounting, reporting, and business support. As Senior Manager: Finance at SanlamAllianz Namibia, he contributes strategic insight, governance discipline, and sound financial stewardship shaped by his chartered accountancy background and training through the University of Cape Town and the Institute of Chartered Accountants of Namibia.",
    image: "/team/astrido-barth-philander.jpg",
  },
]

const impactAreas = [
  {
    icon: TrendingUp,
    title: "Measurable Results",
    description: "Every programme is tracked to ensure real transformation in families and communities.",
  },
  {
    icon: Award,
    title: "Proven Approach",
    description: "Our three-pillar model of Identity, Affirmation, and Purpose creates lasting change.",
  },
  {
    icon: Globe,
    title: "Growing Reach",
    description: "Expanding from local communities to national and international impact.",
  },
  {
    icon: HandHeart,
    title: "100% Committed",
    description: "Every donation directly supports programmes that transform lives.",
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
        {/* Hero Section - Donor Focused */}
        <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/20 via-transparent to-[#8B2B3E]/10" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#D4956A] mb-4">
                Know That Your Support Makes a Difference
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 text-balance leading-tight">
                Transforming Lives,{" "}
                <span className="text-[#D4956A]">One Father at a Time</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-10">
                The Fatherhood Foundation is a values-driven organization committed to raising strong men, 
                strengthening families, and building healthier communities. Through mentoring, leadership development, 
                youth engagement, school-based programmes, and community initiatives, we equip and empower men to 
                go and train young people in character, instill values, principles, and the practical tools needed 
                to flourish in life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-8 py-6 text-lg">
                    Donate Now
                  </Button>
                </Link>
                <Link href="/get-involved">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    Get Involved
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Statistics - Dark Section */}
        <section className="py-16 lg:py-20 bg-[#1a1a1a] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <AnimatedStat value="20 000" suffix="+" label="Impacted Men" />
              <AnimatedStat value="500" suffix="+" label="Touched Marriages" />
              <AnimatedStat value="15 000" suffix="+" label="Youth Reached" />
              <AnimatedStat value="10" suffix="+" label="Years of Impact" />
            </div>
          </div>
        </section>

        {/* Why Support Us - Impact Areas */}
        <section className="py-16 lg:py-24 bg-[#faf9f7]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Why Partner With Us
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Your Investment Creates Lasting Change
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                When you support The Fatherhood Foundation, you are directly investing in the transformation 
                of men, families, and entire communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area) => (
                <Card key={area.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#8B2B3E] flex items-center justify-center mx-auto mb-4">
                      <area.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{area.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement with Donation CTA */}
        <section className="py-16 lg:py-24 bg-[#8B2B3E] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-xl text-white/90 leading-relaxed mb-6">
                  We exist to equip men with the values, tools, and support needed to become intentional fathers, 
                  committed husbands, and impactful leaders.
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  Through strategic programmes, mentorship, and community engagement, we are building a culture 
                  of responsibility, leadership, and transformation that spans generations.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Help Us Reach More Fathers</h3>
                <p className="text-white/80 mb-6">
                  Your donation directly funds mentoring programmes, leadership training, and youth development 
                  initiatives that transform lives.
                </p>
<div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="w-3 h-3 rounded-full bg-[#D4956A]" />
                    <span>Support to reach more youth</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="w-3 h-3 rounded-full bg-[#D4956A]" />
                    <span>Support the ministry to men through mentorship</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="w-3 h-3 rounded-full bg-[#D4956A]" />
                    <span>Reach more new schools with our Character Development programme</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="w-3 h-3 rounded-full bg-[#D4956A]" />
                    <span>Join us to touch more marriages</span>
                  </div>
                </div>
                <Link href="/donate" className="block mt-8">
                  <Button className="w-full bg-white text-[#8B2B3E] hover:bg-white/90 py-6 text-lg font-semibold">
                    Make a Donation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                What Guides Us
              </p>
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

        {/* Board of Governors - Warm Section */}
        <section className="py-16 lg:py-24 overflow-hidden relative" style={{ background: "linear-gradient(180deg, #FDF8F4 0%, #FDEEE3 50%, #FDF8F4 100%)" }}>
          {/* Decorative warm circles */}
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-30" style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }} />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-20" style={{ background: "linear-gradient(135deg, #E8B896, #D4956A)" }} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-20" style={{ background: "#D4956A" }} />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4956A" }}>
                Leadership You Can Trust
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#5a3d2b" }}>The Board of Governors</h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "#7a6455" }}>
                The Board of Governors serves as a strategic advisory body to help strengthen the long-term vision, 
                direction, and governance-minded thinking of The Fatherhood Foundation. This team brings leadership 
                insight, wisdom, and counsel to support the growth and sustainability of the organization.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Chairman - Featured prominently */}
              <div className="flex justify-center mb-10">
                <div className="w-full max-w-lg">
                  <GovernorCard member={boardOfGovernors[0]} isChairman={true} />
                </div>
              </div>
              
              {/* Other board members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {boardOfGovernors.slice(1).map((member) => (
                  <GovernorCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Dedicated Team
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">The Management Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The Management Team leads the day-to-day implementation of the vision and programmes of 
                The Fatherhood Foundation. This team helps ensure that strategy becomes action and that the 
                organization's work is carried out with excellence, consistency, and purpose.
              </p>
            </div>

            <div className="lg:hidden flex flex-col gap-6 max-w-lg mx-auto">
              {managementTeam.map((member) => (
                <ProfileCard key={`${member.name}-${member.role}`} member={member} />
              ))}
            </div>

            <div className="hidden lg:flex gap-4 max-w-6xl mx-auto items-stretch" style={{ minHeight: "200px" }}>
              {managementTeam.map((member) => (
                <HorizontalProfileCard key={`${member.name}-${member.role}`} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Final Donation CTA */}
        <section className="py-20 lg:py-28 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B2B3E]/20 via-transparent to-[#8B2B3E]/20" />
          
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Join Us in Restoring Fathers and Transforming Generations
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Whether through a donation, partnership, or volunteering, your support helps us reach more men, 
              strengthen more families, and build healthier communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-10 py-6 text-lg">
                  Give Today
                </Button>
              </Link>
              <Link href="/partnership-inquiry">
                <Button size="lg" variant="outline" className="border-[#D4956A] text-[#D4956A] hover:bg-[#D4956A]/10 px-10 py-6 text-lg">
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
