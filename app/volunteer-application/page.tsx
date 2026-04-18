"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function VolunteerApplicationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    availability: "",
    experience: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert("Please agree to the volunteer terms and conditions")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          cellphone: formData.phone,
          source: "volunteer",
          sourceDetails: `Volunteer Application - ${formData.interest} - Availability: ${formData.availability}`,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")
      
      setSubmitted(true)
    } catch (error) {
      alert("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16">
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            <Card className="border-2 shadow-lg text-center">
              <CardContent className="pt-12 pb-12">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Application Received!</h2>
                <p className="text-muted-foreground mb-8">
                  Thank you for your interest in volunteering with The Fatherhood Foundation. We'll review your
                  application and contact you within 5-7 business days.
                </p>
                <Link href="/partnership">
                  <Button variant="outline">Back to Partnership</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Banner */}
        <section className="relative h-[280px] md:h-[340px] w-full overflow-hidden">
          <Image
            src="/images/volunteer-banner.jpg"
            alt="Volunteers working together in the community"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Become a Volunteer
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
              Join our mission to strengthen families and empower fathers in your community
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
          <Link
            href="/partnership"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Partnership
          </Link>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Volunteer Application</CardTitle>
              </div>
              <CardDescription className="text-base">
                Join our team and make a direct impact in the lives of fathers and families in your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Area of Interest</Label>
                  <Select
                    value={formData.interest}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, interest: value }))}
                    required
                  >
                    <SelectTrigger id="interests">
                      <SelectValue placeholder="Select your area of interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentoring-men">Monthly Table Talk for Men</SelectItem>
                      <SelectItem value="active-parenting">ActiveParenting</SelectItem>
                      <SelectItem value="my-great-marriage">MyGreatMarriage</SelectItem>
                      <SelectItem value="community-development">Community Development</SelectItem>
                      <SelectItem value="events">Event Support</SelectItem>
                      <SelectItem value="administrative">Administrative Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                    required
                  >
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="both">Both Weekdays and Weekends</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your experience and skills that would benefit The Fatherhood Foundation..."
                    rows={6}
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the volunteer terms and conditions, including background check requirements and
                      confidentiality agreements. I understand that The Fatherhood Foundation will contact me regarding my
                      application.
                    </Label>
                  </div>
                </div>

                <Button type="submit" disabled={!agreedToTerms || isSubmitting} className="w-full h-12 text-base font-semibold" size="lg">
                  {isSubmitting ? "Submitting..." : "SUBMIT"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
