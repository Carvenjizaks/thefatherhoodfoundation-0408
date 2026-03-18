"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DollarSign, Handshake, Heart, Users } from "lucide-react"

type DonationTier = {
  amount: number
  label: string
  description: string
}

const donationTiers: DonationTier[] = [
  {
    amount: 25,
    label: "Basic Supporter",
    description: "Help us reach one father with essential resources and support materials.",
  },
  {
    amount: 75,
    label: "Community Builder",
    description: "Sponsor a monthly Table Talk session and connect fathers in your community.",
  },
  {
    amount: 150,
    label: "Impact Partner",
    description: "Provide curriculum materials for a small group of men seeking authentic manhood.",
  },
  {
    amount: 350,
    label: "Visionary Leader",
    description: "Transform an entire community by funding comprehensive fatherhood programs and training.",
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

  const handlePartnershipInquiry = () => {
    router.push("/partnership-inquiry")
  }

  const handleVolunteerApplication = () => {
    router.push("/volunteer-application")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Partnership Opportunities
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              When you invest in fathers, you invest in families, communities, and generations to come. Your support
              fuels programs that equip men to lead with purpose, raise resilient children, and break the cycle of
              fatherlessness for good.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Donation Options (60%) */}
            <div className="lg:col-span-3">
              <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Support Our Cause</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Your monthly contribution directly powers mentorship circles, parenting workshops, and community
                    gatherings that help men become the fathers and leaders their families need.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="space-y-4">
                      {donationTiers.map((tier) => (
                        <div
                          key={tier.amount}
                          className={`relative rounded-lg border-2 p-4 transition-all ${
                            selectedAmount === tier.amount.toString()
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <RadioGroupItem
                              value={tier.amount.toString()}
                              id={`tier-${tier.amount}`}
                              className="mt-1"
                            />
                            <Label htmlFor={`tier-${tier.amount}`} className="flex-1 cursor-pointer space-y-2">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <span className="text-2xl font-bold text-foreground">${tier.amount}</span>
                                <span className="text-sm text-muted-foreground">/month</span>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{tier.label}</p>
                                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <Button
                    onClick={handleDonate}
                    disabled={!selectedAmount}
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors"
                    size="lg"
                  >
                    Donate Now
                  </Button>

                  {!selectedAmount && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please select a donation tier to continue
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Partnership and Volunteer Options (40%) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Partnership Section */}
              <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Handshake className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">Become a Partner</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Explore collaboration opportunities where our objectives align and we can create lasting change
                    together.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handlePartnershipInquiry}
                    className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors"
                    size="lg"
                  >
                    Explore Partnership Opportunities
                  </Button>
                </CardContent>
              </Card>

              {/* Volunteer Section */}
              <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">Volunteer Your Time</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Contribute your skills and passion to support our work and make a direct impact in the lives of
                    fathers and families.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleVolunteerApplication}
                    className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors"
                    size="lg"
                  >
                    Apply to Volunteer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Your Impact Matters</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every dollar, every hour, and every partnership multiplies into something far greater — a father who shows
              up, a child who feels seen, and a community that thrives. Fatherlessness is not inevitable; it is a
              challenge we can overcome together. Stand with us and be part of the transformation.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
