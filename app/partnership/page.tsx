"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  CalendarCheck,
} from "lucide-react"

type DonationTier = {
  amount: number
  label: string
  description: string
}

const donationTiers: DonationTier[] = [
  {
    amount: 14,
    label: "Supporter",
    description: "Help us reach one father with essential resources.",
  },
  {
    amount: 25,
    label: "Community Builder",
    description: "Sponsor a monthly Table Talk session.",
  },
  {
    amount: 47,
    label: "Impact Partner",
    description: "Provide curriculum for a small group of men.",
  },
  {
    amount: 79,
    label: "Visionary & Impact Leader",
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
  const [paymentMethod, setPaymentMethod] = useState<"once" | "monthly">("once")
  const router = useRouter()

  const handleDonate = (method: string) => {
    if (selectedAmount) {
      router.push(`/donate?amount=${selectedAmount}&method=${method}`)
    }
  }

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
              <Card className="lg:col-span-3 border-2 border-[#8B2B3E]/30 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-background via-[#8B2B3E]/5 to-background overflow-hidden">
                <CardHeader className="pb-6 text-center border-b border-border/50">
                  <div className="w-16 h-16 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground">Give to Transform Lives</CardTitle>
                  <CardDescription className="text-base max-w-xl mx-auto">
                    Your financial gift directly funds mentorship programs, curriculum development, and community
                    outreach that empowers fathers to lead their families well.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 lg:p-8">
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {donationTiers.map((tier) => (
                        <div
                          key={tier.amount}
                          className={`relative rounded-2xl border-2 p-5 transition-all cursor-pointer text-center group ${
                            selectedAmount === tier.amount.toString()
                              ? "border-[#8B2B3E] bg-[#8B2B3E] text-white shadow-lg shadow-[#8B2B3E]/20"
                              : "border-border bg-background hover:border-[#8B2B3E]/50 hover:bg-[#8B2B3E]/5"
                          }`}
                          onClick={() => setSelectedAmount(tier.amount.toString())}
                        >
                          <RadioGroupItem
                            value={tier.amount.toString()}
                            id={`tier-${tier.amount}`}
                            className="sr-only"
                          />
                          <Label htmlFor={`tier-${tier.amount}`} className="cursor-pointer block space-y-2">
                            <span className={`text-3xl lg:text-4xl font-bold block ${
                              selectedAmount === tier.amount.toString() ? "text-white" : "text-foreground"
                            }`}>
                              ${tier.amount}
                            </span>
                            <span className={`text-sm font-semibold block ${
                              selectedAmount === tier.amount.toString() ? "text-white/90" : "text-[#8B2B3E]"
                            }`}>
                              {tier.label}
                            </span>
                            <span className={`text-xs block leading-relaxed ${
                              selectedAmount === tier.amount.toString() ? "text-white/70" : "text-muted-foreground"
                            }`}>
                              {tier.description}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Payment Type Toggle */}
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("once")}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                        paymentMethod === "once"
                          ? "bg-[#8B2B3E] text-white shadow-lg"
                          : "bg-muted text-muted-foreground hover:bg-[#8B2B3E]/10"
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("monthly")}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                        paymentMethod === "monthly"
                          ? "bg-[#8B2B3E] text-white shadow-lg"
                          : "bg-muted text-muted-foreground hover:bg-[#8B2B3E]/10"
                      }`}
                    >
                      Monthly Giving
                    </button>
                  </div>

                  {/* Payment Options */}
                  <div className="border-t border-border/50 pt-6">
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      {paymentMethod === "once" ? "Choose your payment method" : "Set up your monthly debit order"}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      {/* One-Time Payment Options */}
                      {paymentMethod === "once" && (
                        <>
                          {/* PayPal Button - Official styling */}
                          <Button
                            onClick={() => handleDonate("paypal")}
                            disabled={!selectedAmount}
                            className="h-14 px-8 text-base font-semibold bg-[#FFC439] hover:bg-[#F0B72F] text-[#003087] disabled:opacity-50 gap-2 border-0 shadow-md"
                            size="lg"
                          >
                            <svg className="w-20 h-6" viewBox="0 0 101 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.237 6.4H6.935c-.378 0-.7.275-.758.649L4.016 22.025a.456.456 0 0 0 .45.525h2.534c.378 0 .7-.274.758-.648l.582-3.692a.764.764 0 0 1 .758-.649h1.748c3.64 0 5.74-1.762 6.29-5.256.247-1.529.01-2.73-.704-3.572-.786-.925-2.18-1.333-4.195-1.333zm.637 5.18c-.302 1.984-1.817 1.984-3.283 1.984h-.834l.585-3.703a.457.457 0 0 1 .451-.386h.382c.998 0 1.94 0 2.426.569.29.34.379.845.273 1.536z" fill="#003087"/>
                              <path d="M29.857 11.516h-2.545a.457.457 0 0 0-.451.386l-.112.713-.178-.259c-.553-.803-1.786-1.072-3.015-1.072-2.82 0-5.228 2.137-5.696 5.134-.244 1.495.102 2.924.948 3.922.777.918 1.887 1.301 3.207 1.301 2.267 0 3.525-1.457 3.525-1.457l-.114.707a.456.456 0 0 0 .45.525h2.293c.378 0 .7-.274.758-.648l1.377-8.72a.456.456 0 0 0-.447-.532zm-3.55 4.968c-.245 1.454-1.402 2.43-2.875 2.43-.739 0-1.33-.237-1.71-.687-.377-.447-.52-1.083-.399-1.79.229-1.442 1.404-2.45 2.856-2.45.722 0 1.31.24 1.7.695.392.459.546 1.098.428 1.802z" fill="#003087"/>
                              <path d="M46.21 11.516h-2.558a.76.76 0 0 0-.628.333l-3.625 5.34-1.537-5.133a.764.764 0 0 0-.732-.54h-2.513a.456.456 0 0 0-.433.602l2.896 8.502-2.724 3.843a.456.456 0 0 0 .373.718h2.554a.76.76 0 0 0 .625-.327l8.74-12.618a.456.456 0 0 0-.438-.72z" fill="#003087"/>
                              <path d="M55.673 6.4h-5.302c-.378 0-.7.275-.758.649l-2.161 14.976a.456.456 0 0 0 .45.525h2.713c.265 0 .49-.192.53-.453l.613-3.887a.764.764 0 0 1 .758-.649h1.748c3.64 0 5.74-1.762 6.29-5.256.247-1.529.01-2.73-.704-3.572-.786-.925-2.18-1.333-4.177-1.333zm.637 5.18c-.302 1.984-1.817 1.984-3.283 1.984h-.834l.585-3.703a.457.457 0 0 1 .451-.386h.382c.998 0 1.94 0 2.426.569.29.34.378.845.273 1.536z" fill="#0070E0"/>
                              <path d="M73.293 11.516h-2.545a.457.457 0 0 0-.451.386l-.112.713-.178-.259c-.553-.803-1.786-1.072-3.015-1.072-2.82 0-5.228 2.137-5.696 5.134-.244 1.495.102 2.924.948 3.922.777.918 1.887 1.301 3.207 1.301 2.267 0 3.525-1.457 3.525-1.457l-.114.707a.456.456 0 0 0 .45.525h2.293c.378 0 .7-.274.758-.648l1.377-8.72a.456.456 0 0 0-.447-.532zm-3.55 4.968c-.246 1.454-1.403 2.43-2.876 2.43-.738 0-1.33-.237-1.71-.687-.376-.447-.519-1.083-.398-1.79.229-1.442 1.404-2.45 2.855-2.45.723 0 1.311.24 1.701.695.392.459.546 1.098.428 1.802z" fill="#0070E0"/>
                              <path d="M81.87 6.9l-2.194 13.963a.456.456 0 0 0 .45.525h2.193c.378 0 .7-.274.758-.648L85.24 6.764a.456.456 0 0 0-.45-.525h-2.47a.457.457 0 0 0-.45.661z" fill="#0070E0"/>
                            </svg>
                          </Button>

                          {/* PayToday Button */}
                          <Button
                            asChild
                            className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-[#00D4AA] to-[#40E0D0] text-white hover:from-[#00C49A] hover:to-[#30D0C0] shadow-lg gap-3 border-0"
                            size="lg"
                          >
                            <a
                              href="https://site.paytoday.com.na"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img 
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PayToday%20Logo-Z0Y3eORtscSI80Gx8V89GaHIxtGR4T.png" 
                                alt="PayToday" 
                                className="w-8 h-8 rounded"
                              />
                              PayToday
                            </a>
                          </Button>
                        </>
                      )}

                      {/* Monthly Payment Options */}
                      {paymentMethod === "monthly" && (
                        <>
                          {/* PayToday Monthly */}
                          <Button
                            asChild
                            className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-[#00D4AA] to-[#40E0D0] text-white hover:from-[#00C49A] hover:to-[#30D0C0] shadow-lg gap-3 border-0"
                            size="lg"
                          >
                            <a
                              href="https://site.paytoday.com.na"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img 
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PayToday%20Logo-Z0Y3eORtscSI80Gx8V89GaHIxtGR4T.png" 
                                alt="PayToday" 
                                className="w-8 h-8 rounded"
                              />
                              Setup with PayToday
                            </a>
                          </Button>

                          {/* Monthly Debit Order */}
                          <Button
                            onClick={() => handleDonate("debit-order")}
                            disabled={!selectedAmount}
                            variant="outline"
                            className="h-14 px-8 text-base font-semibold border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E] hover:text-white disabled:opacity-50 gap-2"
                            size="lg"
                          >
                            <CalendarCheck className="w-5 h-5" />
                            Monthly Debit Order
                          </Button>
                        </>
                      )}
                    </div>

                    {paymentMethod === "monthly" && selectedAmount && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        You will be charged <span className="font-semibold text-[#8B2B3E]">${selectedAmount}</span> monthly
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Partner Card */}
              <Card className="lg:col-span-1 border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-background flex flex-col">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4">
                    <Handshake className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Partner With Us</CardTitle>
                  <CardDescription className="text-base">
                    Align your organization with a mission that matters. Create lasting, scalable impact together.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
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
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E] hover:text-white"
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
              <Card className="lg:col-span-2 border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-xl bg-background flex flex-col">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-[#8B2B3E]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Volunteer Your Time</CardTitle>
                  <CardDescription className="text-base">
                    Your time and talents can directly impact fathers. Serve as a mentor, facilitator, or event coordinator.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Mentor and guide other men</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Facilitate Table Talk sessions</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Support events and outreach</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#8B2B3E] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Share your professional skills</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E] hover:text-white"
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
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-50/50 dark:from-amber-950/20 dark:via-background dark:to-amber-950/20" />
          <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-[#8B2B3E]/20" />
          <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-[#8B2B3E]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B2B3E]/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#8B2B3E]/30 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-[#8B2B3E]/20 dark:to-background mb-6">
                <Shield className="w-10 h-10 text-[#8B2B3E]" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8B2B3E] mb-4">
                The Remnant
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
                Like Gideon&apos;s 300 who changed history not by numbers but by unwavering commitment, we seek partners of 
                solid character ready to stand in the gap for the fatherless. More than donors — they are the heartbeat, 
                hands, and voice of this mission.
              </p>
              <p className="text-base text-[#8B2B3E] font-medium max-w-2xl mx-auto">
                This fellowship is open to anyone who believes in our cause — all who are ready to give, go, and grow with us.
              </p>
            </div>

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
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B2B3E]/5 group-hover:bg-[#8B2B3E]/10 transition-colors transform rotate-45 translate-x-8 -translate-y-8" />
                    </div>

                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B2B3E]/10 to-amber-100/50 dark:to-[#8B2B3E]/20 flex items-center justify-center border-2 border-[#8B2B3E]/20 group-hover:border-[#8B2B3E]/40 transition-all">
                        <pillar.icon className="w-8 h-8 text-[#8B2B3E]" />
                      </div>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-[#8B2B3E]/70 mb-2">
                      {pillar.symbol}
                    </p>

                    <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

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

            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-[#8B2B3E]/40 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 dark:from-background dark:via-[#8B2B3E]/5 dark:to-background overflow-hidden relative">
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
                        <span className="flex items-center gap-2 font-semibold text-[#8B2B3E]">
                          <Shield className="w-4 h-4 text-[#8B2B3E]" />
                          $197/month commitment
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

        {/* Impact Stats */}
        <section className="py-16 bg-[#8B2B3E]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">20,000+</p>
                <p className="text-sm lg:text-base text-white/80">Fathers Reached</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">12,000+</p>
                <p className="text-sm lg:text-base text-white/80">Community Members Served</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">50+</p>
                <p className="text-sm lg:text-base text-white/80">Programs Running</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">100%</p>
                <p className="text-sm lg:text-base text-white/80">Engagement & Mission Focus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <blockquote className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed mb-6 italic">
              &quot;Every father we reach is a family transformed, a community strengthened, and a generation changed.&quot;
            </blockquote>
            <p className="text-muted-foreground">— The Fatherhood Foundation</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-20 bg-muted/30 border-t">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of supporters who are helping us end fatherlessness, one father at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-10 bg-[#8B2B3E] hover:bg-[#6B1B2E]">
                <Link href="#give">
                  Give Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 border-2 border-[#8B2B3E] text-[#8B2B3E]">
                <Link href="/get-involved">Explore More Ways to Help</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
