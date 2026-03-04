"use client"

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
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Download } from "lucide-react"

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      alert("Please agree to the terms and privacy policy")
      return
    }

    // Form data submission deferred to backend
    console.log("[v0] Form submitted:", formData)

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
  }

  const books = [
    {
      title: "Courage",
      description: "Winning Life's Toughest Battles - Learn how to face life's challenges with courage and faith.",
      image: "/images/books/courage.jpg",
    },
    {
      title: "Maximized Manhood",
      description: "A Guide to Family Survival - Discover biblical principles for leading your family well.",
      image: "/images/books/maximized-manhood.jpg",
    },
    {
      title: "Sexual Integrity",
      description: "Building purity and strength in relationships and personal life.",
      image: "/images/books/sexual-integrity.png",
    },
  ]

  const tableTalkDates = [
    { date: "January 15, 2025", location: "Community Center - Main Hall", time: "7:00 PM" },
    { date: "February 12, 2025", location: "Riverside Church - Fellowship Room", time: "7:00 PM" },
    { date: "March 19, 2025", location: "Downtown Library - Conference Room", time: "7:00 PM" },
    { date: "April 16, 2025", location: "Community Center - Main Hall", time: "7:00 PM" },
  ]

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

        {/* Sign Up Form */}
        <section className="py-20 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl">Sign Up Today</CardTitle>
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

                    <Button type="submit" size="lg" className="w-full">
                      Submit Application
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

        {/* Curriculum for Men */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Curriculum for Men</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Access our comprehensive library of resources designed to help you grow as a man, father, and leader.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {books.map((book, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-80 bg-muted">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{book.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/curriculum">
                  <Download className="mr-2 h-5 w-5" />
                  Explore Full Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Monthly Table Talk */}
        <section className="py-20 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Monthly Table Talk for Men</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Join us for monthly gatherings where men come together for honest conversation, mutual encouragement,
                and shared meals. No agenda, no pressure—just authentic fellowship.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Upcoming Table Talk Sessions</CardTitle>
                <CardDescription>Mark your calendar and join us for our next gathering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tableTalkDates.map((session, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">{session.date}</p>
                          <p className="text-sm text-muted-foreground">{session.location}</p>
                          <p className="text-sm text-muted-foreground">{session.time}</p>
                        </div>
                      </div>
                      <Button variant="outline">Register</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Table Talk is free and open to all men. Dinner is provided. Bring a friend!
              </p>
              <Button asChild size="lg">
                <Link href="/get-involved">
                  Register for Table Talk <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
