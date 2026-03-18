"use client"

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
  Crown,
  Globe,
  Ticket,
  Gift,
  Star,
  CheckCircle2,
  Sparkles,
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

const gideon300Benefits = [
  {
    icon: Globe,
    title: "Mission Trips",
    description: "Join hands-on mission trips to impact communities locally and globally.",
  },
  {
    icon: Ticket,
    title: "VIP Event Access",
    description: "Priority seating and exclusive access at all Foundation events.",
  },
  {
    icon: Gift,
    title: "Partner Discounts",
    description: "Special discounts on programs, merchandise, and partner services.",
  },
  {
    icon: Users,
    title: "Inner Circle Community",
    description: "Private gatherings, networking, and direct access to leadership.",
  },
  {
    icon: Star,
    title: "Recognition & Impact Reports",
    description: "Named recognition and quarterly updates on your direct impact.",
  },
  {
    icon: Sparkles,
    title: "Legacy Builder Status",
    description: "Shape the future direction of Foundation initiatives.",
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
        <section className="py-20 lg:py-32 bg-gradient-to-b from-background via-[#8B2B3E]/5 to-background relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B2B3E]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B2B3E]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#8B2B3E]/10 text-[#8B2B3E] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Crown className="w-4 h-4" />
                Exclusive Membership
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                Become a <span className="text-[#8B2B3E]">Gideon300</span> Partner
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                More than donors — Gideon300 Partners are the heartbeat of our mission. They give, go, and grow with us.
                They are the foundation, the voice, and the feet of The Fatherhood Foundation.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {gideon300Benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group bg-background border-2 border-border hover:border-[#8B2B3E]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4 group-hover:bg-[#8B2B3E] transition-colors">
                    <benefit.icon className="w-6 h-6 text-[#8B2B3E] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-[#8B2B3E]/30 bg-gradient-to-br from-[#8B2B3E]/5 to-background overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Ready to Join the Gideon300?
                      </h3>
                      <p className="text-muted-foreground max-w-xl">
                        Step into a deeper level of partnership. As a Gideon300 Partner, you will not just support the
                        mission — you will live it. Limited to 300 committed partners who want to make generational
                        impact.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8B2B3E]" />
                          Annual commitment
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8B2B3E]" />
                          Exclusive benefits
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:shrink-0">
                      <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                      >
                        <Link href="/gideon300">
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <p className="text-xs text-muted-foreground text-center lg:text-right">
                        Applications reviewed quarterly
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
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">500+</p>
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
