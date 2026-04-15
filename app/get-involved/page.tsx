"use client"

// v5 - Added cinematic animations
import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, CheckCircle, Copy } from "lucide-react"
import { FadeIn, ScaleIn, Parallax } from "@/components/ui/motion"

export default function GetInvolvedPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    howToInvolve: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Table Talk Registration
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<{
    dynamicCode: string
    sessionDate: string
    sessionTime: string
    location: string
    paymentAmount: string
    paymentEmail: string
  } | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      alert("Please agree to the terms and privacy policy")
      return
    }

    setIsFormSubmitting(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          cellphone: formData.phone,
          source: "newsletter",
          sourceDetails: `Get Involved - Interest: ${formData.interest}`,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          interest: "",
          howToInvolve: "",
        })
        setAgreedToTerms(false)
      }, 5000)
    } catch (error) {
      alert("Failed to submit. Please try again.")
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const tableTalkSessions = [
    { 
      month: "APRIL",
      sessions: [
        { 
          date: "4th April 2026", 
          dateValue: "2026-04-04", 
          time: "8:30am - 10:30am", 
          isOpen: true,
          description: "This Gathering will set the stage for 2026, share what is coming up and how you can get involved. This gathering will set the tone for the year, so make sure to join us. Our current venue has seating limitations."
        },
        { date: "11 April 2026", dateValue: "2026-04-11", time: "8:30am - 10:30am", isOpen: false },
        { date: "25 April 2026", dateValue: "2026-04-25", time: "8:30am - 10:30am", isOpen: false },
      ]
    },
    { 
      month: "MAY",
      sessions: [
        { date: "9 May 2026", dateValue: "2026-05-09", time: "8:30am - 10:30am", isOpen: false },
        { date: "23 May 2026", dateValue: "2026-05-23", time: "8:30am - 10:30am", isOpen: false },
      ]
    },
    { 
      month: "JUNE",
      sessions: [
        { date: "6 June 2026", dateValue: "2026-06-06", time: "8:30am - 10:30am", isOpen: false },
        { date: "20 June 2026", dateValue: "2026-06-20", time: "8:30am - 10:30am", isOpen: false },
      ]
    },
  ]

  const handleSessionRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSession) return
    
    setIsRegistering(true)
    
    try {
      const response = await fetch("/api/table-talk/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          sessionDate: selectedSession,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRegistrationResult(data.registration)
      } else {
        alert(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const copyDynamicCode = () => {
    if (registrationResult?.dynamicCode) {
      navigator.clipboard.writeText(registrationResult.dynamicCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const closeRegistrationDialog = () => {
    setSelectedSession(null)
    setRegistrationData({ firstName: "", lastName: "", email: "", phone: "" })
    setRegistrationResult(null)
  }

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/get-involved-hero.jpg"
              alt="Men working together in community partnership"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <Parallax speed={0.3} className="absolute top-20 left-10 w-64 h-64 bg-[#8B2B3E]/10 rounded-full blur-3xl" />
          <Parallax speed={0.5} className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Get Involved
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
                Real change begins when men step forward — for themselves, their families, and their communities. Whether
                you join a Table Talk, volunteer your time, or simply sign up to stay connected, your involvement helps
                break the cycle of fatherlessness and empowers the next generation.
              </p>
            </FadeIn>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Monthly Table Talk */}
        <section className="py-20 lg:py-32 bg-[#F5F0E8] relative overflow-hidden">
          <Parallax speed={0.2} className="absolute top-0 right-0 w-72 h-72 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
            {/* Sign Up Button */}
            <FadeIn direction="up">
              <div className="text-center mb-10">
                <a href="#signup-form">
                  <Button size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-10 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Sign Up Today
                  </Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Monthly Table Talk for Men</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                  Join us for monthly gatherings where men come together for honest conversation, mutual encouragement,
                  and shared meals. No agenda, no pressure—just authentic fellowship.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-[#8B2B3E] text-white px-6 py-3 rounded-lg">
                  <span className="font-semibold">NAD 50 per person</span>
                  <span className="text-white/80">|</span>
                  <span>Includes Light Meal & Drinks</span>
                </div>
              </div>
            </FadeIn>

            <Card className="mb-8 border-2 overflow-hidden">
              <CardHeader className="bg-[#1E3A5F] text-white py-6 px-6">
                <CardTitle className="text-2xl mb-2">Upcoming Table Talk Sessions</CardTitle>
                <CardDescription className="text-white/80 text-base">
                  All sessions at Scouts Hall, Suiderhof, Windhoek | 8:30am - 10:30am
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {/* Round Table Circles */}
                <div className="flex flex-wrap justify-center gap-8 mb-6">
                  {/* Table 1 - Maroon - With Date */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-[#8B2B3E] flex items-center justify-center shadow-xl border-4 border-[#8B2B3E]/30 hover:scale-105 transition-transform cursor-pointer">
                      <div className="text-center px-2">
                        <span className="text-white text-sm lg:text-base font-bold block">25 April</span>
                        <span className="text-white text-base lg:text-lg font-bold">2026</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-6 py-3 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => setSelectedSession("2026-04-25")}
                    >
                      REGISTER NOW
                    </Button>
                  </div>
                  {/* Table 2 - Navy */}
                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-[#1E3A5F] flex items-center justify-center shadow-xl border-4 border-[#1E3A5F]/30 hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-center">
                      <span className="text-white text-base lg:text-lg font-bold">TBA</span>
                    </div>
                  </div>
                  {/* Table 3 - Terracotta */}
                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-[#D4A574] flex items-center justify-center shadow-xl border-4 border-[#D4A574]/30 hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-center">
                      <span className="text-white text-base lg:text-lg font-bold">TBA</span>
                    </div>
                  </div>
                  {/* Table 4 - Dark Brown */}
                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-[#3D1F0F] flex items-center justify-center shadow-xl border-4 border-[#3D1F0F]/30 hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-center">
                      <span className="text-white text-base lg:text-lg font-bold">TBA</span>
                    </div>
                  </div>
                  {/* Table 5 - Warm Brown */}
                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-[#5C3D2E] flex items-center justify-center shadow-xl border-4 border-[#5C3D2E]/30 hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-center">
                      <span className="text-white text-base lg:text-lg font-bold">TBA</span>
                    </div>
                  </div>
                </div>

                {/* Dates to be Announced */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">More Dates to be Announced</h3>
                  <p className="text-muted-foreground">Additional session dates are coming soon. Sign up to be notified!</p>
                </div>

                {/* Sign Up Button */}
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-[#1E3A5F] hover:bg-[#152d4a] text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedSession("")}
                  >
                    Sign Up and Get Notified Ahead of Time
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-xl p-8 border-2">
              <h3 className="text-xl font-bold mb-6 text-center">Payment Instructions</h3>
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-[#8B2B3E] mb-4">Banking Details (EFT)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium ml-2">FNB</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="font-medium ml-2">Cheque Account</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium ml-2">The FATHERHOOD FOUNDATION</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium ml-2">64279664451</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Branch Code:</span>
                    <span className="font-medium ml-2">282273</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-medium ml-2 text-[#8B2B3E]">Your Name + Cellphone</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Please use your <strong>Name + Cellphone</strong> as payment reference.
              </p>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold text-[#8B2B3E] mb-4 text-center">Or Pay Via PayToday</h4>
                <div className="flex justify-center">
                  <a
                    href="https://site.paytoday.com.na"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold rounded-lg transition-colors"
                  >
                    Pay Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Up Form */}
        <section className="py-20 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Card className="border-2 overflow-hidden">
              {/* Banner Image */}
              <div className="relative h-48 sm:h-64 w-full">
                <Image
                  src="/images/signup-banner.jpg"
                  alt="Join our community of men"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Sign Up Today</h2>
                </div>
              </div>
              <CardHeader className="pt-6">
                <CardDescription className="text-base">
                  Start your journey with The Fatherhood Foundation. Fill out the form below to connect with us and
                  learn about opportunities that match your interests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">Area of Interest *</Label>
                      <Select
                        value={formData.interest}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, interest: value }))}
                        required
                      >
                        <SelectTrigger id="interest">
                          <SelectValue placeholder="Select an area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mentoring">Monthly Table Talk for Men</SelectItem>
                          <SelectItem value="parenting">ActiveParenting</SelectItem>
                          <SelectItem value="marriage">MyGreatMarriage</SelectItem>
                          <SelectItem value="community">Community Development</SelectItem>
                          <SelectItem value="all">All Programs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="howToInvolve">How would you like to get involved?</Label>
                      <Textarea
                        id="howToInvolve"
                        name="howToInvolve"
                        placeholder="Tell us how you'd like to contribute or participate..."
                        value={formData.howToInvolve}
                        onChange={(e) => setFormData((prev) => ({ ...prev, howToInvolve: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                          . I understand that my information will be used to connect me with The Fatherhood Foundation
                          programs and updates.
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isFormSubmitting}>
                      {isFormSubmitting ? "Submitting..." : "SUBMIT"}
                    </Button>
                  </form>
                ) : (
                  <div className="py-12 text-center">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Thank You for Signing Up!</h3>
                    <p className="text-muted-foreground text-lg">
                      We'll be in touch soon with more information about getting involved.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Registration Dialog */}
        <Dialog open={!!selectedSession} onOpenChange={(open) => !open && closeRegistrationDialog()}>
          <DialogContent className="sm:max-w-md">
            {!registrationResult ? (
              <>
                <DialogHeader>
                  <DialogTitle>Register for Table Talk</DialogTitle>
                  <DialogDescription>
                    Fill in your details to register for the session. You will receive a unique Dynamic Code for payment.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSessionRegister} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-firstName">First Name *</Label>
                      <Input
                        id="reg-firstName"
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-lastName">Last Name *</Label>
                      <Input
                        id="reg-lastName"
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email *</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone *</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <p><strong>Fee:</strong> NAD 50 per person (Includes Light Meal & Drinks)</p>
                    <p><strong>Location:</strong> Scouts Hall, Suiderhof, Windhoek</p>
                    <p><strong>Time:</strong> 8:30am - 10:30am</p>
                  </div>
                  <Button type="submit" className="w-full bg-[#8B2B3E] hover:bg-[#6d2230]" disabled={isRegistering}>
                    {isRegistering ? "Registering..." : "Complete Registration"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    Registration Successful!
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="bg-[#8B2B3E] text-white p-6 rounded-lg text-center">
                    <p className="text-sm mb-2">Your Dynamic Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold tracking-wider">{registrationResult.dynamicCode}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:bg-white/20"
                        onClick={copyDynamicCode}
                      >
                        {copiedCode ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Session Date:</strong> {registrationResult.sessionDate}</p>
                    <p><strong>Time:</strong> {registrationResult.sessionTime}</p>
                    <p><strong>Location:</strong> {registrationResult.location}</p>
                    <p><strong>Amount:</strong> {registrationResult.paymentAmount}</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="font-semibold text-amber-800 mb-2">Payment Instructions:</p>
                    <p className="text-sm text-amber-700">
                      Use your Dynamic Code <strong>{registrationResult.dynamicCode}</strong> as your payment reference and send payment to:
                    </p>
                    <p className="text-lg font-bold text-amber-900 mt-2">{registrationResult.paymentEmail}</p>
                  </div>

                  <Button onClick={closeRegistrationDialog} className="w-full">
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </>
  )
}
