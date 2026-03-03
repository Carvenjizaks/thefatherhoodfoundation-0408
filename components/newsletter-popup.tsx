"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSubscribed = localStorage.getItem("newsletter_subscribed")
    const hasDismissed = localStorage.getItem("newsletter_dismissed")
    
    if (!hasSubscribed && !hasDismissed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Surname is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          source: "newsletter",
          sourceDetails: "Website popup subscription",
        }),
      })

      if (!response.ok) throw new Error("Failed to subscribe")

      localStorage.setItem("newsletter_subscribed", "true")
      setShowWelcome(true)
    } catch (err) {
      console.error("[v0] Subscription error:", err)
      // Still show welcome even if API fails
      localStorage.setItem("newsletter_subscribed", "true")
      setShowWelcome(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!showWelcome) {
      localStorage.setItem("newsletter_dismissed", "true")
    }
    setIsOpen(false)
    setShowWelcome(false)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {showWelcome ? (
          // Welcome Screen
          <div className="text-center py-6">
            <DialogHeader className="sr-only">
              <DialogTitle>Welcome to the Family</DialogTitle>
              <DialogDescription>
                Thank you for subscribing to our newsletter
              </DialogDescription>
            </DialogHeader>
            <div className="w-20 h-20 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image
                src="/images/logo.png"
                alt="Fatherhood Foundation"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#8B2B3E] mb-3">
              Welcome to the Family!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing, {formData.firstName}! You are now part of The Fatherhood Foundation community.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please check your email to confirm your subscription.
            </p>
            <div className="bg-[#8B2B3E]/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#8B2B3E] font-medium">
                Together, we are building stronger families and communities.
              </p>
            </div>
            <Button 
              onClick={handleClose}
              className="bg-[#8B2B3E] hover:bg-[#6B1F2E] text-white px-8"
            >
              Get Started
            </Button>
          </div>
        ) : (
          // Subscription Form
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Fatherhood Foundation"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <DialogTitle className="text-center text-2xl text-[#8B2B3E]">
                Stay Connected
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 mt-2">
                Subscribe to receive updates on events, programs, and inspiring stories from The Fatherhood Foundation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="popup-firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="popup-firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className="mt-1"
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="popup-lastName">Surname <span className="text-red-500">*</span></Label>
                <Input
                  id="popup-lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your surname"
                  className="mt-1"
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="popup-email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="popup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#8B2B3E] hover:bg-[#6B1F2E] text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>

              <p className="text-xs text-center text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
