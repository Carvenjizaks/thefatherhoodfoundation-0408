"use client"

// Partnership page - last updated
import { useState } from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  Heart,
  Handshake,
  Users,
  CheckCircle2,
  Shield,
  Flame,
  Crown,
  Swords,
  Milestone,
  Medal,
} from "lucide-react"

type DonationTier = {
  amount: number
  label: string
  description: string
}

const donationTiers: DonationTier[] = [
  {
    amount: 25,
    label: "Supporter",
    description: "Help us reach one father with essential resources.",
  },
  {
    amount: 75,
    label: "Community Builder",
    description: "Sponsor a monthly Table Talk session.",
  },
  {
    amount: 150,
    label: "Impact Partner",
    description: "Provide curriculum for a small group of men.",
  },
  {
    amount: 350,
    label: "Visionary Leader",
    description: "Fund comprehensive fatherhood programs.",
  },
]

const gideon300Pillars = [
  {
    icon: Shield,
    title: "The Shield of Honor",
    description: "Stand as a guardian for fatherless children and families in need. Your partnership shields the vulnerable.",
    symbol: "Protection & Strength",
  },
  {
    icon: Flame,
    title: "The Torch Bearer",
    description: "Carry the flame of hope into communities. Join mission trips and light the way for others.",
    symbol: "Hope & Purpose",
  },
  {
    icon: Swords,
    title: "The Warrior's Table",
    description: "VIP access to gatherings, events, and the inner circle. Stand shoulder to shoulder with fellow warriors.",
    symbol: "Brotherhood & Unity",
  },
  {
    icon: Milestone,
    title: "The Pillar of Legacy",
    description: "Your name etched among the founders. Shape the direction of initiatives that outlast generations.",
    symbol: "Legacy & Permanence",
  },
  {
    icon: Medal,
    title: "The Mark of Distinction",
    description: "Special recognition, partner privileges, and discounts honoring your commitment to the cause.",
    symbol: "Honor & Recognition",
  },
  {
    icon: Crown,
    title: "The Crown of Service",
    description: "Lead by serving. Mentor, guide, and walk alongside fathers reclaiming their place in their families.",
    symbol: "Servant Leadership",
  },
]

export default function PartnershipPage() {
  const [selectedAmount, setSelectedAmount] = useState<string>("")
  const router = useRouter()

  const handleDonate = () => {
    if (selectedAmount) {
      router.push(`/donate?amount=${selectedAmount}`)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/5 via-background to-[#8B2B3E]/10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8B2B3E]/5 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Join the Movement
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
                Be Part of Something{" "}
                <span className="text-[#8B2B3E]">Greater Than Yourself</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                Every father reached, every family strengthened, every community transformed — it starts with people
                like you who believe that fatherlessness can end in our generation. Your involvement changes
                everything.
              </p>
            </div>
          </div>
        </section>

        {/* Ways to Engage Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ways to Make an Impact</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you give, partner, or volunteer — every contribution multiplies into transformed lives.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donate Card */}
              <Card className="border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-background">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Give</CardTitle>
                  <CardDescription className="text-base">
                    Your financial gift directly funds mentorship programs, curriculum development, and community
                    outreach that empowers fathers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="grid grid-cols-2 gap-3">
                      {donationTiers.map((tier) => (
                        <div
                          key={tier.amount}
                          className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer ${
                            selectedAmount === tier.amount.toString()
                              ? "border-[#8B2B3E] bg-[#8B2B3E]/5"
                              : "border-border hover:border-[#8B2B3E]/50"
                          }`}
                          onClick={() => setSelectedAmount(tier.amount.toString())}
                        >
                          <RadioGroupItem
                            value={tier.amount.toString()}
                            id={`tier-${tier.amount}`}
                            className="sr-only"
                          />
                          <Label htmlFor={`tier-${tier.amount}`} className="cursor-pointer block">
                            <span className="text-xl font-bold text-foreground">${tier.amount}</span>
                            <span className="text-xs text-muted-foreground block">{tier.label}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  <Button
                    onClick={handleDonate}
                    disabled={!selectedAmount}
                    className="w-full h-12 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                    size="lg"
                  >
                    Donate Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>

              {/* Partner Card */}
              <Card className="border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-background">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4">
                    <Handshake className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Partner</CardTitle>
                  <CardDescription className="text-base">
                    Align your organization or business with a mission that matters. Corporate partnerships create
                    lasting, scalable impact.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Co-branded community initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Employee engagement programs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Event sponsorship opportunities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Shared impact reporting</span>
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="w-full h-12 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                    size="lg"
                  >
                    <Link href="/partnership-inquiry">
                      Explore Partnership
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Volunteer Card */}
              <Card className="border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-background">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Volunteer</CardTitle>
                  <CardDescription className="text-base">
                    Your time and talents can directly impact fathers in your community. Serve as a mentor, event
                    coordinator, or program facilitator.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Mentor and guide other men</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Facilitate Table Talk sessions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Support events and outreach</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Share your professional skills</span>
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="w-full h-12 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                    size="lg"
                  >
                    <Link href="/volunteer-application">
                      Apply to Volunteer
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gideon300 Partners Section */}
        <section className="py-24 lg:py-36 relative overflow-hidden">
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-50/50 dark:from-amber-950/20 dark:via-background dark:to-amber-950/20" />
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-[#8B2B3E]/20" />
          <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-[#8B2B3E]/20" />
          {/* Subtle radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B2B3E]/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            {/* Elegant Header */}
            <div className="text-center mb-20">
              {/* Decorative shield emblem */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#8B2B3E]/30 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-[#8B2B3E]/20 dark:to-background mb-6">
                <Shield className="w-10 h-10 text-[#8B2B3E]" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8B2B3E] mb-4">
                A Sacred Fellowship
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                The <span className="text-[#8B2B3E]">Gideon300</span>
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-[#8B2B3E]/40" />
                <span className="text-[#8B2B3E] font-serif italic text-lg">The Foundation. The Voice. The Feet.</span>
                <span className="h-px w-12 bg-[#8B2B3E]/40" />
              </div>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
                Like Gideon's 300 who changed history not by numbers but by unwavering commitment, we seek partners of 
                solid character ready to stand in the gap for the fatherless. More than donors — they are the heartbeat, 
                hands, and voice of this mission.
              </p>
              <p className="text-base text-[#8B2B3E] font-medium max-w-2xl mx-auto">
                This fellowship is open to anyone who believes in our cause — all who are ready to give, go, and grow with us.
              </p>
            </div>

            {/* The Six Pillars */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  The Six Pillars of Partnership
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gideon300Pillars.map((pillar, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-white to-amber-50/50 dark:from-background dark:to-[#8B2B3E]/5 border-2 border-[#8B2B3E]/20 hover:border-[#8B2B3E]/50 rounded-xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-[#8B2B3E]/10"
                  >
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B2B3E]/5 group-hover:bg-[#8B2B3E]/10 transition-colors transform rotate-45 translate-x-8 -translate-y-8" />
                    </div>

                    {/* Icon with ornate background */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B2B3E]/10 to-amber-100/50 dark:to-[#8B2B3E]/20 flex items-center justify-center border-2 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E]/40 transition-all">
                        <pillar.icon className="w-8 h-8 text-[#8B2B3E]" />
                      </div>
                    </div>

                    {/* Symbol label */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#8B2B3E]/70 mb-2">
                      {pillar.symbol}
                    </p>

                    <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image placeholders row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-amber-100/80 to-orange-50 dark:from-[#8B2B3E]/20 dark:to-background border-2 border-dashed border-[#8B2B3E]/30 flex items-center justify-center">
                <div className="text-center p-6">
                  <Flame className="w-12 h-12 text-[#8B2B3E]/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">Mission Trip Image</p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-amber-100/80 to-orange-50 dark:from-[#8B2B3E]/20 dark:to-background border-2 border-dashed border-[#8B2B3E]/30 flex items-center justify-center">
                <div className="text-center p-6">
                  <Users className="w-12 h-12 text-[#8B2B3E]/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">Fellowship Gathering</p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-amber-100/80 to-orange-50 dark:from-[#8B2B3E]/20 dark:to-background border-2 border-dashed border-[#8B2B3E]/30 flex items-center justify-center">
                <div className="text-center p-6">
                  <Crown className="w-12 h-12 text-[#8B2B3E]/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">VIP Event Access</p>
                </div>
              </div>
            </div>

            {/* Ornate CTA Card */}
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-[#8B2B3E]/40 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 dark:from-background dark:via-[#8B2B3E]/5 dark:to-background overflow-hidden relative">
                {/* Decorative corner flourishes */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#8B2B3E]/40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#8B2B3E]/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#8B2B3E]/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#8B2B3E]/40" />

                <CardContent className="p-10 lg:p-14">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div className="space-y-5">
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Will You Stand Among the 300?
                      </h3>
                      <p className="text-muted-foreground max-w-xl leading-relaxed">
                        Step into a covenant of purpose. As a Gideon300 Partner, you do not merely support the mission — 
                        you embody it. You are called not by obligation, but by conviction. Limited to 300 partners 
                        committed to generational impact.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#8B2B3E]" />
                          Annual covenant
                        </span>
                        <span className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-[#8B2B3E]" />
                          Mission participation
                        </span>
                        <span className="flex items-center gap-2">
                          <Medal className="w-4 h-4 text-[#8B2B3E]" />
                          Founding recognition
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 lg:shrink-0">
                      <Button
                        asChild
                        size="lg"
                        className="h-14 px-10 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E] shadow-lg shadow-[#8B2B3E]/20"
                      >
                        <Link href="/gideon300">
                          Answer the Call
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <p className="text-xs text-muted-foreground text-center lg:text-right">
                        Applications open to all who share our vision
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-16 lg:py-20 bg-[#8B2B3E]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">20,000+</p>
                <p className="text-sm lg:text-base text-white/80">Fathers Reached</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">12</p>
                <p className="text-sm lg:text-base text-white/80">Communities Served</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">50+</p>
                <p className="text-sm lg:text-base text-white/80">Active Volunteers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">100%</p>
                <p className="text-sm lg:text-base text-white/80">Mission Focused</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Quote Section */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="relative">
              {/* Large quote mark */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] leading-none text-[#8B2B3E]/10 font-serif">
                "
              </span>
              <blockquote className="relative z-10 text-2xl lg:text-3xl font-medium text-foreground leading-relaxed text-balance mb-8">
                Every dollar, every hour, and every partnership multiplies into something far greater — a father who
                shows up, a child who feels seen, and a community that thrives.
              </blockquote>
              <p className="text-muted-foreground font-medium">The Fatherhood Foundation</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              The Time to Act is Now
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Fatherlessness is not inevitable — it is a challenge we can overcome together. Your involvement today
              shapes families and communities for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]">
                <Link href="/donate">
                  Give Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-semibold border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5"
              >
                <Link href="/get-involved">Explore All Options</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
