"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Handshake } from "lucide-react"
import Link from "next/link"

export default function PartnershipInquiryPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    console.log("[v0] Partnership inquiry form submitted")
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <Card className="border-2 shadow-lg text-center">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You for Your Interest!</h2>
              <p className="text-muted-foreground mb-8">
                We've received your partnership inquiry and will be in touch within 2-3 business days to discuss
                collaboration opportunities.
              </p>
              <Link href="/partnership">
                <Button variant="outline">Back to Partnership</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
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
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Partnership Inquiry</CardTitle>
            </div>
            <CardDescription className="text-base">
              Tell us about your organization and how we can collaborate to end fatherlessness and strengthen
              communities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <Input id="organization" placeholder="Your Organization" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Tell Us About Your Partnership Interest</Label>
                <Textarea
                  id="message"
                  placeholder="Describe how you'd like to partner with The Fatherhood Foundation..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
                Submit Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
