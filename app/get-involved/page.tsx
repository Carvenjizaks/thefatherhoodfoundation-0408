"use client"

// v4 - Force rebuild to fix hydration and Supabase URL
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
      month: "MARCH",
      sessions: [
        { date: "28 March 2026", dateValue: "2026-03-28", time: "8:30am - 10:30am", isOpen: true },
      ]
    },
    { 
      month: "APRIL",
      sessions: [
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

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Get Involved
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              Join us in our mission to empower men and strengthen families. There are many ways to contribute and
              benefit from The Fatherhood Foundation.
            </p>
          </div>
        </section>

        {/* Monthly Table Talk */}
        <section className="py-20 lg:py-32 bg-[#F5F0E8]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Monthly Table Talk for Men</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Join us for monthly gatherings where men come together for honest conversation, mutual encouragement,
                and shared meals. No agenda, no pressure—just authentic fellowship.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-[#8B2B3E] text-white px-6 py-3 rounded-lg">
                <span className="font-semibold">NAD 50</span>
                <span className="text-white/80">|</span>
                <span>Includes Drinks & Light Meal</span>
              </div>
            </div>

            <Card className="mb-8 border-2 overflow-hidden">
              <CardHeader className="bg-[#1E3A5F] text-white py-6 px-6">
                <CardTitle className="text-2xl mb-2">Upcoming Table Talk Sessions</CardTitle>
                <CardDescription className="text-white/80 text-base">
                  All sessions at Scouts Hall, Suiderhof, Windhoek | 8:30am - 10:30am
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {tableTalkSessions.map((monthGroup, groupIndex) => (
                  <div key={monthGroup.month}>
                    <div className="bg-[#8B2B3E] text-white px-6 py-3 font-bold text-lg">
                      {monthGroup.month}
                    </div>
                    <div className="divide-y">
                      {monthGroup.sessions.map((session, index) => (
                        <div
                          key={index}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 transition-colors ${session.isOpen ? 'hover:bg-muted/50' : 'bg-muted/30'}`}
                        >
                          <div className="flex items-start gap-4">
                            <Calendar className={`w-6 h-6 flex-shrink-0 mt-1 ${session.isOpen ? 'text-[#8B2B3E]' : 'text-muted-foreground'}`} />
                            <div>
                              <p className={`font-bold text-lg ${session.isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>{session.date}</p>
                              <p className="text-muted-foreground text-sm">
                                <span className="font-medium">TIME: {session.time}</span> (Includes Drinks & Light Meal)
                              </p>
                            </div>
                          </div>
                          {session.isOpen ? (
                            <Button 
                              className="bg-[#8B2B3E] hover:bg-[#6d2230]"
                              onClick={() => setSelectedSession(session.dateValue)}
                            >
                              Register Now
                            </Button>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-md bg-muted text-muted-foreground font-medium text-sm">
                              NOT OPEN YET
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-white rounded-xl p-8 border-2 text-center">
              <h3 className="text-xl font-bold mb-4">Payment Instructions</h3>
              <p className="text-muted-foreground mb-4">
                After registration, you will receive a <strong>Dynamic Code</strong>. Use this code as your payment reference.
              </p>
              <p className="text-lg">
                Send payment to: <strong className="text-[#8B2B3E]">finance@fathersfound.org</strong>
              </p>
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
                    <p><strong>Fee:</strong> NAD 50 (Includes Drinks & Light Meal)</p>
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
