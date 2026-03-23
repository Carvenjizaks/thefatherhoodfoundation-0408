"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, Building2, CreditCard, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase-client"

const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000]

const frequencyOptions = [
  { value: "once-off", label: "Once Off", description: "One-time donation" },
  { value: "monthly", label: "Monthly", description: "Give every month" },
  { value: "yearly", label: "Yearly", description: "Give once a year" },
]

const paymentMethods = [
  { 
    value: "paytoday", 
    label: "PayToday", 
    description: "Local payment processing",
    icon: "paytoday"
  },
  { 
    value: "bank-transfer", 
    label: "Bank Transfer", 
    description: "Direct bank deposit",
    icon: "bank"
  },
]

const bankDetails = {
  bankName: "First National Bank (FNB)",
  accountName: "The Fatherhood Foundation",
  accountNumber: "62875823456",
  branchCode: "280172",
  reference: "DONATION-[YOUR NAME]"
}

function DonateContent() {
  const searchParams = useSearchParams()
  const initialAmount = searchParams.get("amount") || ""
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount ? parseInt(initialAmount) : null)
  const [customAmount, setCustomAmount] = useState("")
  const [frequency, setFrequency] = useState("once-off")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!finalAmount || finalAmount <= 0) {
      setSubmitError("Please select or enter a donation amount")
      return
    }
    
    if (!paymentMethod) {
      setSubmitError("Please select a payment method")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.from("donations").insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        amount: finalAmount,
        currency: "NAD",
        frequency: frequency,
        payment_method: paymentMethod,
        status: "pending"
      })

      if (error) throw error

      // Send notification
      await fetch("/api/donations/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          amount: finalAmount,
          frequency,
          paymentMethod
        })
      })

      setSubmitSuccess(true)
    } catch (error) {
      console.error("Donation submission error:", error)
      setSubmitError("There was an error processing your donation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <main className="min-h-screen pt-32 pb-16" style={{ background: "linear-gradient(180deg, #FDF8F4 0%, #FDEEE3 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#5a3d2b" }}>Thank You for Your Generosity!</h2>
              <p className="text-lg mb-6" style={{ color: "#7a6455" }}>
                Your {frequency === "once-off" ? "donation" : `${frequency} donation`} of <strong>N${finalAmount?.toLocaleString()}</strong> will help transform lives.
              </p>
              
              {paymentMethod === "bank-transfer" && (
                <div className="bg-[#FDF8F4] p-6 rounded-xl text-left mb-6">
                  <h3 className="font-bold mb-4" style={{ color: "#5a3d2b" }}>Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm" style={{ color: "#7a6455" }}>
                    <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                    <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>Branch Code:</strong> {bankDetails.branchCode}</p>
                    <p><strong>Reference:</strong> DONATION-{firstName.toUpperCase()}</p>
                  </div>
                </div>
              )}

              {paymentMethod === "paytoday" && (
                <div className="mb-6">
                  <p className="text-sm mb-4" style={{ color: "#7a6455" }}>Click below to complete your payment via PayToday:</p>
                  <Button className="text-white font-semibold flex items-center gap-3 px-6 py-3 h-auto" style={{ background: "#00C8C8" }}>
                    <Image src="/images/paytoday-logo.jpg" alt="PayToday" width={28} height={28} className="rounded-md" />
                    Pay with PayToday
                  </Button>
                </div>
              )}

              <p className="text-sm mb-6" style={{ color: "#9a8a7a" }}>
                A confirmation email has been sent to {email}
              </p>
              
              <Link href="/">
                <Button variant="outline" className="border-2" style={{ borderColor: "#D4956A", color: "#D4956A" }}>
                  Return Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-16" style={{ background: "linear-gradient(180deg, #FDF8F4 0%, #FDEEE3 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 hover:opacity-80 mb-8 transition-colors font-semibold"
          style={{ color: "#D4956A" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
          <CardHeader className="pb-4" style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Complete Your Donation</CardTitle>
            </div>
            <CardDescription className="text-white/90 text-base">
              Your generosity empowers men, strengthens families, and transforms communities.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-8">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {submitError}
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <Label className="text-lg font-semibold mb-4 block" style={{ color: "#5a3d2b" }}>
                Select Amount (N$)
              </Label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${
                      selectedAmount === amount 
                        ? "text-white shadow-lg scale-[1.02]" 
                        : "bg-white hover:bg-[#FDF8F4]"
                    }`}
                    style={selectedAmount === amount 
                      ? { background: "linear-gradient(135deg, #D4956A, #E8B896)", borderColor: "#D4956A" } 
                      : { borderColor: "#e8ddd4", color: "#5a3d2b" }
                    }
                  >
                    N${amount.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color: "#7a6455" }}>N$</span>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-xl border-2"
                  style={{ borderColor: customAmount ? "#D4956A" : "#e8ddd4" }}
                />
              </div>
            </div>

            {/* Giving Frequency */}
            <div>
              <Label className="text-lg font-semibold mb-4 block" style={{ color: "#5a3d2b" }}>
                Giving Frequency
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFrequency(option.value)}
                    className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                      frequency === option.value 
                        ? "text-white shadow-lg" 
                        : "bg-white hover:bg-[#FDF8F4]"
                    }`}
                    style={frequency === option.value 
                      ? { background: "linear-gradient(135deg, #D4956A, #E8B896)", borderColor: "#D4956A" } 
                      : { borderColor: "#e8ddd4" }
                    }
                  >
                    <div className={`font-bold ${frequency === option.value ? "text-white" : ""}`} style={frequency !== option.value ? { color: "#5a3d2b" } : {}}>
                      {option.label}
                    </div>
                    <div className={`text-xs mt-1 ${frequency === option.value ? "text-white/80" : ""}`} style={frequency !== option.value ? { color: "#9a8a7a" } : {}}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-lg font-semibold mb-4 block" style={{ color: "#5a3d2b" }}>
                Payment Method
              </Label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                      paymentMethod === method.value 
                        ? "shadow-lg" 
                        : "bg-white hover:bg-[#FDF8F4]"
                    }`}
                    style={paymentMethod === method.value 
                      ? { background: "linear-gradient(135deg, #FDF8F4, #FDEEE3)", borderColor: "#D4956A" } 
                      : { borderColor: "#e8ddd4" }
                    }
                  >
                    {method.icon === "paytoday" ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                        <Image 
                          src="/images/paytoday-logo.jpg" 
                          alt="PayToday" 
                          width={40} 
                          height={40}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold" style={{ color: "#5a3d2b" }}>{method.label}</div>
                      <div className="text-sm" style={{ color: "#9a8a7a" }}>{method.description}</div>
                    </div>
                    {paymentMethod === method.value && (
                      <CheckCircle2 className="ml-auto w-6 h-6" style={{ color: "#D4956A" }} />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Bank Details Preview */}
              {paymentMethod === "bank-transfer" && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: "#FDF8F4" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5" style={{ color: "#D4956A" }} />
                    <span className="font-semibold" style={{ color: "#5a3d2b" }}>Bank Details</span>
                  </div>
                  <div className="space-y-1 text-sm" style={{ color: "#7a6455" }}>
                    <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                    <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>Branch Code:</strong> {bankDetails.branchCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label className="text-lg font-semibold mb-4 block" style={{ color: "#5a3d2b" }}>
                Your Information
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" style={{ color: "#7a6455" }}>First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 rounded-xl border-2"
                    style={{ borderColor: "#e8ddd4" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" style={{ color: "#7a6455" }}>Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 rounded-xl border-2"
                    style={{ borderColor: "#e8ddd4" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "#7a6455" }}>Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2"
                  style={{ borderColor: "#e8ddd4" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: "#7a6455" }}>Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+264 81 123 4567" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl border-2"
                  style={{ borderColor: "#e8ddd4" }}
                />
              </div>

              {/* Summary */}
              {finalAmount && finalAmount > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "linear-gradient(135deg, #FDF8F4, #FDEEE3)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: "#7a6455" }}>Donation Amount:</span>
                    <span className="text-2xl font-bold" style={{ color: "#D4956A" }}>N${finalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#9a8a7a" }}>Frequency:</span>
                    <span className="font-semibold capitalize" style={{ color: "#5a3d2b" }}>{frequency.replace("-", " ")}</span>
                  </div>
                  {paymentMethod && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span style={{ color: "#9a8a7a" }}>Payment Method:</span>
                      <span className="font-semibold capitalize" style={{ color: "#5a3d2b" }}>{paymentMethod.replace("-", " ")}</span>
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting || !finalAmount || !paymentMethod}
                className="w-full h-14 text-lg font-bold rounded-xl text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #D4956A, #E8B896)" }}
              >
                {isSubmitting ? "Processing..." : "Complete Donation"}
              </Button>
            </form>

            <p className="text-xs text-center" style={{ color: "#9a8a7a" }}>
              Your donation is secure. You will receive a confirmation email with payment instructions.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function DonatePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen pt-32 pb-16" style={{ background: "linear-gradient(180deg, #FDF8F4 0%, #FDEEE3 100%)" }}>Loading...</div>}>
        <DonateContent />
      </Suspense>
      <Footer />
    </>
  )
}
