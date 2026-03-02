"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

function DonateContent() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "25"

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
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Complete Your Donation</CardTitle>
            </div>
            <CardDescription className="text-base">
              Thank you for supporting The Fatherhood Foundation. Your contribution makes a real difference.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Donation Amount:</span>
                <span className="text-2xl font-bold text-primary">${amount}</span>
              </div>
            </div>

            <form className="space-y-4">
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
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
                Complete Donation
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              This is a demo page. Payment processing will be integrated with a secure payment gateway in production.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-32 pb-16">Loading...</div>}>
      <DonateContent />
    </Suspense>
  )
}
