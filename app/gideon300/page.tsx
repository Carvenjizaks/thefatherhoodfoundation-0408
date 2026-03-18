"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  Crown,
  Globe,
  Ticket,
  Gift,
  Users,
  Star,
  Sparkles,
  CheckCircle2,
  Heart,
  Shield,
  Flame,
  Swords,
  Milestone,
  Medal,
} from "lucide-react"

const benefits = [
  {
    icon: Globe,
    title: "Mission Trips",
    description:
      "Travel with us on domestic and international mission trips. Be hands-on in communities where fathers need support the most.",
  },
  {
    icon: Ticket,
    title: "VIP Event Access",
    description:
      "Receive priority seating, backstage access, and exclusive invitations to all Foundation events, galas, and conferences.",
  },
  {
    icon: Gift,
    title: "Partner Discounts",
    description:
      "Enjoy special pricing on all programs, curriculum materials, merchandise, and services from our partner network.",
  },
  {
    icon: Users,
    title: "Inner Circle Community",
    description:
      "Join private gatherings with fellow Gideon300 members and Foundation leadership. Network with like-minded men committed to the mission.",
  },
  {
    icon: Star,
    title: "Recognition & Impact Reports",
    description:
      "Receive named recognition at events and in publications, plus quarterly reports showing exactly how your partnership creates change.",
  },
  {
    icon: Sparkles,
    title: "Legacy Builder Status",
    description:
      "Help shape the strategic direction of Foundation initiatives. Your voice matters in building programs that transform generations.",
  },
  {
    icon: Heart,
    title: "Direct Father Sponsorship",
    description:
      "Your partnership directly sponsors fathers through our programs. Receive updates and stories from the men whose lives you are changing.",
  },
  {
    icon: Shield,
    title: "Founding Member Recognition",
    description:
      "As part of the original 300, your name will be permanently honored as a founding partner of this transformational movement.",
  },
]

export default function Gideon300Page() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    occupation: "",
    whyJoin: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E]/10 via-background to-[#8B2B3E]/5" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B2B3E]/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-[#8B2B3E] text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8">
                <Crown className="w-5 h-5" />
                Limited to 300 Partners
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
                The <span className="text-[#8B2B3E]">Gideon300</span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-4 font-medium">
                The Foundation. The Voice. The Feet.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
                Gideon300 Partners are not just donors — they are the heartbeat of our mission. They give, go, and grow
                with us. Like Gideon's 300, this select group of committed partners will help us achieve what seems
                impossible: ending fatherlessness in our generation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                >
                  <a href="#apply">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-base font-semibold border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5"
                >
                  <a href="#benefits">See Benefits</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Gideon300 */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                  The Story Behind the Name
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
                  Why <span className="text-[#8B2B3E]">Gideon's 300</span>?
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In the ancient story, Gideon faced an army of 135,000 with just 300 chosen men. Against all odds,
                    they achieved victory — not through numbers, but through commitment, courage, and divine purpose.
                  </p>
                  <p>
                    Today, fatherlessness affects millions. The statistics are overwhelming. But we believe that a
                    committed few, standing together with unwavering resolve, can spark a movement that transforms
                    generations.
                  </p>
                  <p className="font-medium text-foreground">
                    The Gideon300 is our committed core — 300 partners who will not just give, but go. Who will not just
                    fund, but fight alongside us for every father, every family, every community.
                  </p>
                </div>
              </div>

              {/* Placeholder for image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B2B3E]/20 to-[#8B2B3E]/5 border-2 border-dashed border-[#8B2B3E]/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <Crown className="w-16 h-16 text-[#8B2B3E]/40 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">Image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 lg:py-28 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Exclusive Partner Benefits
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                What You Receive as a Gideon300 Partner
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your partnership unlocks exclusive experiences, access, and recognition reserved only for our most
                committed supporters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="group border-2 hover:border-[#8B2B3E]/50 transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#8B2B3E]/10 flex items-center justify-center mb-4 group-hover:bg-[#8B2B3E] transition-colors">
                      <benefit.icon className="w-6 h-6 text-[#8B2B3E] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 lg:py-20 bg-[#8B2B3E]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">The Gideon300 Commitment</h2>
              <p className="text-lg text-white/90 mb-10 leading-relaxed">
                Becoming a Gideon300 Partner is a meaningful commitment — both for you and for us. Here is what
                partnership looks like:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Give</h3>
                  <p className="text-white/80 text-sm">Annual financial commitment to sustain and grow our programs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Go</h3>
                  <p className="text-white/80 text-sm">
                    Participate in at least one mission trip or major event annually
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Grow</h3>
                  <p className="text-white/80 text-sm">
                    Engage with the community and help spread the mission to others
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="apply" className="py-20 lg:py-28 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8B2B3E] mb-4">
                Applications Open
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Apply to Join the Gideon300</h2>
              <p className="text-muted-foreground">
                Applications are reviewed quarterly. We will reach out within 2-4 weeks to discuss next steps.
              </p>
            </div>

            {!submitted ? (
              <Card className="border-2">
                <CardContent className="p-8 lg:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City / Location *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whyJoin">Why do you want to join the Gideon300? *</Label>
                      <Textarea
                        id="whyJoin"
                        value={formData.whyJoin}
                        onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                        required
                        rows={4}
                        placeholder="Share your story and why this mission matters to you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-base font-semibold bg-[#8B2B3E] hover:bg-[#6B1B2E]"
                    >
                      Submit Application
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to be contacted about Gideon300 partnership opportunities.
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-[#8B2B3E]/30">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Application Received</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you for your interest in joining the Gideon300. Our team will review your application and
                    reach out within 2-4 weeks.
                  </p>
                  <Button asChild variant="outline" className="border-2 border-[#8B2B3E] text-[#8B2B3E]">
                    <Link href="/">Return Home</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-20 bg-background border-t">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-muted-foreground mb-4">Not ready for Gideon300?</p>
            <h3 className="text-2xl font-bold text-foreground mb-6">There are other ways to get involved</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-2 border-[#8B2B3E] text-[#8B2B3E]">
                <Link href="/partnership">View All Partnership Options</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-[#8B2B3E] text-[#8B2B3E]">
                <Link href="/donate">Make a One-Time Gift</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
