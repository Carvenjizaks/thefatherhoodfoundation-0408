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
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Calendar, MapPin, Clock, Users, Sparkles } from "lucide-react"

// MGM Brand Colors - Peach/Coral theme
const mgmColors = {
  primary: "#D4956A", // Warm peach/coral from logo
  primaryDark: "#C17D4F",
  primaryLight: "#E8B896",
  accent: "#8B2B3E", // Keep accent for contrast
  cream: "#FDF8F4",
  warmWhite: "#FFFBF7",
}

type RegistrationFormData = {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  spouseName: string
  spouseEmail: string
  spouseCellphone: string
}

const carouselImages = [
  {
    src: "/images/couples/couple-together-1.jpg",
    alt: "Happy couple sharing an intimate moment on the couch",
  },
  {
    src: "/images/couples/couple-1.jpg",
    alt: "Happy couple together",
  },
  {
    src: "/images/couples/couple-2.jpg",
    alt: "Couple sharing a moment",
  },
  {
    src: "/images/couples/couple-3.jpg",
    alt: "Loving couple",
  },
  {
    src: "/images/couples/couple-4.jpg",
    alt: "Couple embracing",
  },
  {
    src: "/images/couples/couple-5.jpg",
    alt: "Joyful couple",
  },
]

export default function MyGreatMarriageEventPage() {
  console.log("[v0] MyGreatMarriage 2026 page loaded with new peach/coral design")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    spouseName: "",
    spouseEmail: "",
    spouseCellphone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)

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

    if (!formData.spouseName?.trim()) {
      newErrors.spouseName = "Spouse name is required"
    }
    if (!formData.spouseEmail?.trim()) {
      newErrors.spouseEmail = "Spouse email is required"
    } else if (!validateEmail(formData.spouseEmail)) {
      newErrors.spouseEmail = "Invalid email address"
    }
    if (!formData.spouseCellphone?.trim()) {
      newErrors.spouseCellphone = "Spouse cellphone is required"
    } else if (!validatePhone(formData.spouseCellphone)) {
      newErrors.spouseCellphone = "Invalid phone number"
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
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          cellphone: formData.cellphone,
          source: "event_registration",
          sourceDetails: "MyGreatMarriage Conference 2026",
          spouseFirstName: formData.spouseName,
          spouseEmail: formData.spouseEmail,
          spouseCellphone: formData.spouseCellphone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      setSubmitSuccess(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        cellphone: "",
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
    <>
      <Header />
      <div className="min-h-screen pt-20" style={{ backgroundColor: mgmColors.warmWhite }}>
        
        {/* Hero Section - Warm & Inviting */}
        <section className="relative overflow-hidden" style={{ backgroundColor: mgmColors.cream }}>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20" style={{ backgroundColor: mgmColors.primary, transform: "translate(-50%, -50%)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15" style={{ backgroundColor: mgmColors.primaryLight, transform: "translate(30%, 30%)" }} />
          
          <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Logo & Info */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <Image
                    src="/images/mgm-banner-2026.png"
                    alt="MyGreatMarriage Conference 2026"
                    width={500}
                    height={500}
                    className="w-full max-w-md mx-auto lg:mx-0"
                    priority
                  />
                </div>
                
                <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
                  A transformative experience for couples ready to deepen their connection and build a marriage that lasts.
                </p>
                
                {/* Event Quick Info */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                    <Calendar className="w-5 h-5" style={{ color: mgmColors.primary }} />
                    <span className="font-medium text-gray-700">30 April - 2 May 2026</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                    <MapPin className="w-5 h-5" style={{ color: mgmColors.primary }} />
                    <span className="font-medium text-gray-700">Venue TBA</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="text-xl px-12 py-7 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      style={{ backgroundColor: mgmColors.primary }}
                    >
                      <Heart className="w-6 h-6 mr-2" />
                      Register Your Couple
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl" style={{ color: mgmColors.primary }}>
                        MyGreatMarriage Conference Registration
                      </DialogTitle>
                      <DialogDescription>
                        Register for the conference on 30 April - 2 May 2026. All fields marked with * are required.
                      </DialogDescription>
                    </DialogHeader>

                    {submitSuccess ? (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                          <Heart className="w-8 h-8" style={{ color: mgmColors.primary }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: mgmColors.primary }}>Registration Successful!</h3>
                        <p className="text-gray-600">
                          Thank you for registering. We will send confirmation details to your email.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold" style={{ color: mgmColors.primary }}>Your Details</h3>

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

                        <div className="space-y-4 p-4 rounded-lg border" style={{ backgroundColor: `${mgmColors.primary}10`, borderColor: `${mgmColors.primary}30` }}>
                          <h3 className="text-lg font-semibold" style={{ color: mgmColors.primary }}>Spouse/Partner Details</h3>

                          <div>
                            <Label htmlFor="spouseName">
                              Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="spouseName"
                              value={formData.spouseName}
                              onChange={(e) => handleInputChange("spouseName", e.target.value)}
                              className="mt-1"
                            />
                            {errors.spouseName && <p className="text-sm text-red-500 mt-1">{errors.spouseName}</p>}
                          </div>

                          <div>
                            <Label htmlFor="spouseEmail">
                              Email <span className="text-red-500">*</span>
                            </Label>
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
                            <Label htmlFor="spouseCellphone">
                              Cellphone <span className="text-red-500">*</span>
                            </Label>
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

                        {submitError && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{submitError}</p>
                          </div>
                        )}

                        <div className="flex gap-4 pt-4">
                          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-1 text-white"
                            style={{ backgroundColor: mgmColors.primary }}
                          >
                            {isSubmitting ? "Submitting..." : "Complete Registration"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Right: Featured Couple Image */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main image with circular frame */}
                  <div className="relative w-[450px] h-[450px] mx-auto rounded-full overflow-hidden border-8" style={{ borderColor: mgmColors.primary }}>
                    <Image
                      src={carouselImages[currentIndex].src}
                      alt={carouselImages[currentIndex].alt}
                      fill
                      className="object-cover transition-all duration-1000"
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 w-[470px] h-[470px] mx-auto rounded-full border-4 -translate-x-[10px] -translate-y-[10px]" style={{ borderColor: `${mgmColors.primaryLight}60` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Schedule Cards */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Conference Schedule</h2>
              <p className="text-lg text-gray-600">Three days of connection, growth, and transformation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Day 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 hover:shadow-xl transition-shadow" style={{ borderTopColor: mgmColors.primary }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                  <Clock className="w-7 h-7" style={{ color: mgmColors.primary }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thursday Evening</h3>
                <p className="text-gray-500 text-sm mb-3">30 April 2026</p>
                <p className="text-2xl font-semibold mb-4" style={{ color: mgmColors.primary }}>6:00 PM - 8:30 PM</p>
                <p className="text-gray-600">Opening session and welcome dinner for all couples</p>
              </div>
              
              {/* Day 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 hover:shadow-xl transition-shadow" style={{ borderTopColor: mgmColors.primaryDark }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                  <Sparkles className="w-7 h-7" style={{ color: mgmColors.primary }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Friday Evening</h3>
                <p className="text-gray-500 text-sm mb-3">1 May 2026</p>
                <p className="text-2xl font-semibold mb-4" style={{ color: mgmColors.primary }}>6:30 PM - 9:00 PM</p>
                <p className="text-gray-600">Main event with keynote speakers and workshops</p>
              </div>
              
              {/* Day 3 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 hover:shadow-xl transition-shadow" style={{ borderTopColor: mgmColors.primary }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                  <Users className="w-7 h-7" style={{ color: mgmColors.primary }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Saturday Morning</h3>
                <p className="text-gray-500 text-sm mb-3">2 May 2026</p>
                <p className="text-2xl font-semibold mb-4" style={{ color: mgmColors.primary }}>8:30 AM - 1:00 PM</p>
                <p className="text-gray-600">Interactive sessions and couple activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Couples Gallery - Horizontal Scroll */}
        <section className="py-16 overflow-hidden" style={{ backgroundColor: mgmColors.cream }}>
          <div className="max-w-7xl mx-auto px-4 mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-4">
              Celebrating Love & Commitment
            </h2>
            <p className="text-center text-gray-600 text-lg">Join couples who are investing in their marriage</p>
          </div>
          
          {/* Infinite scrolling gallery */}
          <div className="relative">
            <div className="flex gap-6 animate-scroll-gallery">
              {[...carouselImages, ...carouselImages].map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={288}
                    height={384}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes scroll-gallery {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-gallery {
              animation: scroll-gallery 30s linear infinite;
            }
          `}</style>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Image Side */}
              <div className="relative order-2 lg:order-1">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/couples/couple-together-1.jpg"
                    alt="Happy couple"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${mgmColors.primary}40, transparent)` }} />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6" style={{ color: mgmColors.primary }} />
                    <span className="font-bold text-gray-800">Follow-Up Session</span>
                  </div>
                  <p className="text-gray-600 text-sm">2 September 2026 - Continue your journey together</p>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                  What to Expect
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Join us for a transformative experience focused on strengthening marriages and building lasting relationships.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: "Inspiring Speakers", desc: "Learn from relationship experts and experienced couples" },
                    { title: "Interactive Workshops", desc: "Practical sessions designed for real-life application" },
                    { title: "Connect with Couples", desc: "Build friendships with like-minded couples" },
                    { title: "Tools & Resources", desc: "Take home resources to continue growing together" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                        <Heart className="w-5 h-5" style={{ color: mgmColors.primary }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4" style={{ backgroundColor: mgmColors.primary }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Invest in Your Marriage?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join us for an unforgettable experience that will strengthen your bond and deepen your connection.
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-xl px-12 py-7 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  style={{ backgroundColor: "white", color: mgmColors.primary }}
                >
                  <Heart className="w-6 h-6 mr-2" />
                  Register Now
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
