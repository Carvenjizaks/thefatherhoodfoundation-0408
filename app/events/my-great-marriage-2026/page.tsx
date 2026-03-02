"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"

type RegistrationFormData = {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  includeSpouse: boolean
  spouseName?: string
  spouseEmail?: string
  spouseCellphone?: string
}

const carouselImages = [
  {
    src: "/images/api-attachments-vkvytvuqhrdxhulzl39if.jpg",
    alt: "Wedding rings on open book",
  },
  {
    src: "/images/api-attachments-3cco1tdmna82dmr5sboox.jpg",
    alt: "Couple embracing intimately",
  },
  {
    src: "/images/api-attachments-njb52evdkx6olp7uysshr.jpg",
    alt: "Young couple in lavender field",
  },
  {
    src: "/images/api-attachments-hr15kqcd7nunfolseuz4r.jpg",
    alt: "Couple embracing outdoors",
  },
  {
    src: "/images/api-attachments-w8wb9tckkk6wmsdkfx6yn.jpg",
    alt: "African couple in elegant attire",
  },
  {
    src: "/images/api-attachments-q8pjcd7ybmklfk4bnzhra.jpg",
    alt: "African couple embracing in nature",
  },
  {
    src: "/images/api-attachments-ag04ytd9w2o61keo4b3dt.jpg",
    alt: "Couple in casual embrace",
  },
]

export default function MyGreatMarriageEventPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    includeSpouse: false,
    spouseName: "",
    spouseEmail: "",
    spouseCellphone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.cellphone.trim()) {
      newErrors.cellphone = "Cellphone number is required"
    } else if (!validatePhone(formData.cellphone)) {
      newErrors.cellphone = "Invalid phone number"
    }

    if (formData.includeSpouse) {
      if (formData.spouseEmail && !validateEmail(formData.spouseEmail)) {
        newErrors.spouseEmail = "Invalid email address"
      }
      if (formData.spouseCellphone && !validatePhone(formData.spouseCellphone)) {
        newErrors.spouseCellphone = "Invalid phone number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const supabase = createClient()

      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        cellphone: formData.cellphone,
        spouse_name: formData.includeSpouse ? formData.spouseName || null : null,
        spouse_email: formData.includeSpouse ? formData.spouseEmail || null : null,
        spouse_cellphone: formData.includeSpouse ? formData.spouseCellphone || null : null,
      }

      const { error } = await supabase.from("marriage_registrations").insert([registrationData])

      if (error) {
        throw new Error(error.message)
      }

      setSubmitSuccess(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        cellphone: "",
        includeSpouse: false,
        spouseName: "",
        spouseEmail: "",
        spouseCellphone: "",
      })

      setTimeout(() => {
        setIsOpen(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? `Failed to submit registration: ${error.message}`
          : "Failed to submit registration. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Event Hero Section - Full Width Banner */}
      <section className="relative">
        {/* Full-width banner image */}
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
          <Image
            src="/images/mygreatmarriage-banner.jpg"
            alt="MyGreatMarriage Conference 2026 - 11 June & 12 June 2026"
            fill
            className="object-contain bg-white"
            priority
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center px-4 py-12">
          {/* Event Dates */}
          <div className="mb-8">
            <div className="inline-block bg-[#8B2B3E] text-white px-6 py-3 rounded-full mb-6">
              <p className="text-lg md:text-xl font-semibold">Main Event: 1 May 2026</p>
            </div>
            <div className="inline-block bg-[#8B2B3E]/80 text-white px-6 py-3 rounded-full mb-6 ml-4">
              <p className="text-lg md:text-xl font-semibold">Follow-Up: 2 September 2026</p>
            </div>
            <div className="mt-6">
              <p className="text-xl md:text-2xl text-gray-700 mb-2">Thursday Night 6pm - 8:30pm</p>
              <p className="text-xl md:text-2xl text-gray-700 mb-2">Friday 6:30pm - 9pm</p>
              <p className="text-xl md:text-2xl text-gray-700 mb-2">Saturday 8:30am - 1pm</p>
              <p className="text-lg md:text-xl text-gray-600 italic mt-4">Venue: To be Announced</p>
            </div>
          </div>

          {/* CTA Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="text-2xl px-16 py-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 animate-pulse"
              >
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">MyGreatMarriage Conference Registration</DialogTitle>
                <DialogDescription>
                  Register for the conference on 1 May 2026 (with follow-up on 2 September 2026). All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>

              {submitSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Registration Successful!</h3>
                  <p className="text-gray-600">
                    Thank you for registering. We'll send confirmation details to your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Registrant Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Your Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="mt-1"
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="mt-1"
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cellphone">
                        Cellphone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cellphone"
                        type="tel"
                        value={formData.cellphone}
                        onChange={(e) => handleInputChange("cellphone", e.target.value)}
                        placeholder="+264 81 234 5678"
                        className="mt-1"
                      />
                      {errors.cellphone && <p className="text-sm text-red-500 mt-1">{errors.cellphone}</p>}
                    </div>
                  </div>

                  {/* Include Spouse/Partner Checkbox */}
                  <div className="flex items-center space-x-2 py-4 border-t">
                    <Checkbox
                      id="includeSpouse"
                      checked={formData.includeSpouse}
                      onCheckedChange={(checked) => handleInputChange("includeSpouse", checked as boolean)}
                    />
                    <Label htmlFor="includeSpouse" className="cursor-pointer">
                      Register with spouse/partner
                    </Label>
                  </div>

                  {/* Spouse/Partner Details (Conditional) */}
                  {formData.includeSpouse && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <h3 className="text-lg font-semibold text-primary">Spouse/Partner Details (Optional)</h3>

                      <div>
                        <Label htmlFor="spouseName">Name of Spouse/Partner</Label>
                        <Input
                          id="spouseName"
                          value={formData.spouseName}
                          onChange={(e) => handleInputChange("spouseName", e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="spouseEmail">Email of Spouse/Partner</Label>
                        <Input
                          id="spouseEmail"
                          type="email"
                          value={formData.spouseEmail}
                          onChange={(e) => handleInputChange("spouseEmail", e.target.value)}
                          className="mt-1"
                        />
                        {errors.spouseEmail && <p className="text-sm text-red-500 mt-1">{errors.spouseEmail}</p>}
                      </div>

                      <div>
                        <Label htmlFor="spouseCellphone">Cellphone of Spouse/Partner</Label>
                        <Input
                          id="spouseCellphone"
                          type="tel"
                          value={formData.spouseCellphone}
                          onChange={(e) => handleInputChange("spouseCellphone", e.target.value)}
                          placeholder="+264 81 234 5678"
                          className="mt-1"
                        />
                        {errors.spouseCellphone && (
                          <p className="text-sm text-red-500 mt-1">{errors.spouseCellphone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                      {isSubmitting ? "Submitting..." : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Celebrating Love & Commitment
          </h2>
          <div className="relative h-[500px] md:h-[600px]">
            <div className="flex items-center justify-center gap-8 absolute left-0 right-0">
              {carouselImages.map((image, index) => {
                const position = (index - currentIndex + carouselImages.length) % carouselImages.length
                const isCentered = position === Math.floor(carouselImages.length / 2)

                let scale = 0.7
                let opacity = 0.4
                let zIndex = 1
                let translateX = (position - Math.floor(carouselImages.length / 2)) * 400

                if (isCentered) {
                  scale = 1.15
                  opacity = 1
                  zIndex = 10
                  translateX = 0
                } else if (Math.abs(position - Math.floor(carouselImages.length / 2)) === 1) {
                  scale = 0.85
                  opacity = 0.7
                  zIndex = 5
                }

                return (
                  <div
                    key={index}
                    className="absolute transition-all duration-700 ease-in-out"
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                  >
                    <div className="relative w-[350px] h-[450px] md:w-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 350px, 400px"
                      />
                      {isCentered && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">About the Conference</h2>
          <div className="prose prose-lg max-w-none text-black">
            <p>
              Join us for a transformative experience focused on strengthening marriages and building lasting
              relationships. The MyGreatMarriage Conference brings together couples from all walks of life to learn,
              grow, and connect.
            </p>
            <h3 className="text-xl font-semibold text-primary mt-8 mb-4">What to Expect</h3>
            <ul className="space-y-2 text-black">
              <li>Inspiring keynote speakers and relationship experts</li>
              <li>Interactive workshops and practical sessions</li>
              <li>Opportunities to connect with other couples</li>
              <li>Tools and resources for building a great marriage</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
