"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { Heart, Calendar, MapPin, Clock, Users, Sparkles, ChevronDown, Star, MessageCircle, ArrowRight } from "lucide-react"

// MGM Brand Colors - Warm Peach/Coral theme
const mgmColors = {
  primary: "#D4956A",
  primaryDark: "#C17D4F",
  primaryLight: "#E8B896",
  accent: "#8B2B3E",
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
  { src: "/images/couples/couple-together-1.jpg", alt: "Happy couple sharing an intimate moment" },
  { src: "/images/couples/couple-1.jpg", alt: "Happy couple together" },
  { src: "/images/couples/couple-2.jpg", alt: "Couple sharing a moment" },
  { src: "/images/couples/couple-3.jpg", alt: "Loving couple" },
  { src: "/images/couples/couple-4.jpg", alt: "Couple embracing" },
  { src: "/images/couples/couple-5.jpg", alt: "Joyful couple" },
]

const marriageQuotes = [
  { quote: "Friendship, not romance, holds the marriage together.", author: "Jane Smiley" },
  { quote: "A great marriage is not when the perfect couple comes together. It is when an imperfect couple learns to enjoy their differences.", author: "Dave Meurer" },
  { quote: "The greatest marriages are built on teamwork, mutual respect, and a healthy dose of grace.", author: "Fawn Weaver" },
  { quote: "Marriage is not about finding a person you can live with, it's about finding the person you can't live without.", author: "Unknown" },
]

const conferenceHighlights = [
  { icon: MessageCircle, title: "Communication Mastery", desc: "Learn the secrets to deeper, more meaningful conversations" },
  { icon: Heart, title: "Rekindling Romance", desc: "Discover new ways to keep the spark alive in your marriage" },
  { icon: Users, title: "Community Building", desc: "Connect with other couples on the same journey" },
  { icon: Sparkles, title: "Spiritual Growth", desc: "Strengthen your marriage through shared faith and values" },
]

const testimonials = [
  { name: "John & Mary K.", text: "This conference transformed our 15-year marriage. We fell in love all over again!", years: "Married 15 years" },
  { name: "David & Sarah M.", text: "The tools we learned here saved our marriage. We're now closer than ever.", years: "Married 8 years" },
  { name: "Peter & Grace L.", text: "We came as strangers to each other and left as best friends. Truly life-changing!", years: "Married 22 years" },
]

// Animated counter component
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function MyGreatMarriageEventPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)

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
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)

    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % marriageQuotes.length)
    }, 6000)

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => {
      clearInterval(imageInterval)
      clearInterval(quoteInterval)
      clearInterval(testimonialInterval)
    }
  }, [])

  const validateEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
  const validatePhone = (phone: string) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.cellphone.trim()) newErrors.cellphone = "Cellphone is required"
    else if (!validatePhone(formData.cellphone)) newErrors.cellphone = "Invalid phone number"
    if (!formData.spouseName?.trim()) newErrors.spouseName = "Spouse name is required"
    if (!formData.spouseEmail?.trim()) newErrors.spouseEmail = "Spouse email is required"
    else if (!validateEmail(formData.spouseEmail)) newErrors.spouseEmail = "Invalid email address"
    if (!formData.spouseCellphone?.trim()) newErrors.spouseCellphone = "Spouse cellphone is required"
    else if (!validatePhone(formData.spouseCellphone)) newErrors.spouseCellphone = "Invalid phone number"
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
      setFormData({ firstName: "", lastName: "", email: "", cellphone: "", spouseName: "", spouseEmail: "", spouseCellphone: "" })
      setTimeout(() => { setIsOpen(false); setSubmitSuccess(false) }, 2000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit registration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 overflow-hidden">
        
        {/* Hero Section - Full Screen with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Images - Sliding */}
          <div className="absolute inset-0">
            {carouselImages.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: idx === currentImageIndex ? 1 : 0 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                  priority={idx === 0}
                />
              </div>
            ))}
            {/* Warm overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${mgmColors.accent}40, transparent, ${mgmColors.primary}30)` }} />
          </div>
          
          {/* Floating hearts animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-white/20 animate-float"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  width: `${20 + i * 5}px`,
                  height: `${20 + i * 5}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i}s`,
                }}
              />
            ))}
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Logo */}
            <div className="mb-8 animate-fade-in-up">
              <Image
                src="/images/mgm-banner-2026.png"
                alt="MyGreatMarriage Conference 2026"
                width={450}
                height={450}
                className="mx-auto drop-shadow-2xl"
                priority
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200 drop-shadow-lg">
              Transform Your Marriage
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400 leading-relaxed">
              Join hundreds of couples for a transformative weekend of connection, growth, and renewed love.
            </p>
            
            {/* Event Info Pills */}
            <div className="flex flex-wrap gap-4 justify-center mb-10 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">7, 8 & 9 May 2026</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Windhoek, Namibia</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="animate-fade-in-up animation-delay-800">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="text-xl px-12 py-8 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 animate-pulse-subtle"
                    style={{ background: `linear-gradient(135deg, ${mgmColors.primary}, ${mgmColors.primaryDark})` }}
                  >
                    <Heart className="w-6 h-6 mr-3 animate-heartbeat" />
                    Register Now
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl" style={{ color: mgmColors.primary }}>
                      MyGreatMarriage Conference Registration
                    </DialogTitle>
                    <DialogDescription>
                      Register for the conference on 7, 8 & 9 May 2026.
                    </DialogDescription>
                  </DialogHeader>

                  {submitSuccess ? (
                    <div className="py-8 text-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{ backgroundColor: `${mgmColors.primary}20` }}>
                        <Heart className="w-10 h-10" style={{ color: mgmColors.primary }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: mgmColors.primary }}>Registration Successful!</h3>
                      <p className="text-gray-600">We will send confirmation details to your email.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold" style={{ color: mgmColors.primary }}>Your Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                            <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="mt-1" />
                            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                            <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="mt-1" />
                            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="mt-1" />
                          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cellphone">Cellphone <span className="text-red-500">*</span></Label>
                          <Input id="cellphone" type="tel" value={formData.cellphone} onChange={(e) => handleInputChange("cellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
                          {errors.cellphone && <p className="text-sm text-red-500 mt-1">{errors.cellphone}</p>}
                        </div>
                      </div>

                      <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: `${mgmColors.primary}10`, borderColor: `${mgmColors.primary}30` }}>
                        <h3 className="text-lg font-semibold" style={{ color: mgmColors.primary }}>Spouse/Partner Details</h3>
                        <div>
                          <Label htmlFor="spouseName">Name <span className="text-red-500">*</span></Label>
                          <Input id="spouseName" value={formData.spouseName} onChange={(e) => handleInputChange("spouseName", e.target.value)} className="mt-1" />
                          {errors.spouseName && <p className="text-sm text-red-500 mt-1">{errors.spouseName}</p>}
                        </div>
                        <div>
                          <Label htmlFor="spouseEmail">Email <span className="text-red-500">*</span></Label>
                          <Input id="spouseEmail" type="email" value={formData.spouseEmail} onChange={(e) => handleInputChange("spouseEmail", e.target.value)} className="mt-1" />
                          {errors.spouseEmail && <p className="text-sm text-red-500 mt-1">{errors.spouseEmail}</p>}
                        </div>
                        <div>
                          <Label htmlFor="spouseCellphone">Cellphone <span className="text-red-500">*</span></Label>
                          <Input id="spouseCellphone" type="tel" value={formData.spouseCellphone} onChange={(e) => handleInputChange("spouseCellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
                          {errors.spouseCellphone && <p className="text-sm text-red-500 mt-1">{errors.spouseCellphone}</p>}
                        </div>
                      </div>

                      {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{submitError}</p>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 text-white" style={{ backgroundColor: mgmColors.primary }}>
                          {isSubmitting ? "Submitting..." : "Complete Registration"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </section>

        {/* Rotating Quote Section */}
        <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: mgmColors.accent }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="text-8xl text-white/20 font-serif mb-4">"</div>
            <div className="min-h-[150px] flex items-center justify-center">
              <div key={currentQuoteIndex} className="animate-fade-in">
                <p className="text-2xl lg:text-3xl text-white italic leading-relaxed mb-6">
                  {marriageQuotes[currentQuoteIndex].quote}
                </p>
                <p className="text-white/70 font-medium">— {marriageQuotes[currentQuoteIndex].author}</p>
              </div>
            </div>
            
            {/* Quote indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {marriageQuotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuoteIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${idx === currentQuoteIndex ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
                  aria-label={`Quote ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Communication Quote - Big & Bold */}
        <section className="py-24 lg:py-32 px-4 relative" style={{ background: `linear-gradient(135deg, ${mgmColors.cream} 0%, ${mgmColors.warmWhite} 100%)` }}>
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-30" style={{ backgroundColor: mgmColors.primary, transform: "translate(-50%, -50%)" }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: mgmColors.primaryLight, transform: "translate(50%, 50%)" }} />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8" style={{ color: mgmColors.accent }}>
              The formula for a successful marriage is:
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
              {["communication", "communication", "communication"].map((word, idx) => (
                <span
                  key={idx}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold px-8 py-4 rounded-full text-white transform hover:scale-105 transition-transform shadow-lg"
                  style={{ 
                    backgroundColor: mgmColors.primary,
                    opacity: 0.7 + idx * 0.15,
                    animationDelay: `${idx * 0.2}s`
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What You'll Experience */}
        <section className="py-20 px-4" style={{ backgroundColor: mgmColors.warmWhite }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: mgmColors.primary }}>
                Conference Highlights
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: mgmColors.accent }}>
                What You'll Experience
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7a6455" }}>
                Three days of transformative sessions designed to strengthen every aspect of your marriage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conferenceHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl text-center group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ backgroundColor: mgmColors.cream }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${mgmColors.primary}, ${mgmColors.primaryLight})` }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: mgmColors.accent }}>{item.title}</h3>
                  <p style={{ color: "#7a6455" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: mgmColors.cream }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: mgmColors.primary }}>
                Success Stories
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: mgmColors.accent }}>
                Couples Like You
              </h2>
            </div>
            
            <div className="relative">
              <div className="min-h-[250px] flex items-center justify-center">
                <div key={currentTestimonialIndex} className="text-center animate-fade-in">
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" style={{ color: mgmColors.primary }} />
                    ))}
                  </div>
                  <p className="text-xl lg:text-2xl italic mb-6 leading-relaxed" style={{ color: "#5a3d2b" }}>
                    "{testimonials[currentTestimonialIndex].text}"
                  </p>
                  <p className="font-bold text-lg" style={{ color: mgmColors.primary }}>
                    {testimonials[currentTestimonialIndex].name}
                  </p>
                  <p className="text-sm" style={{ color: "#9a8a7a" }}>
                    {testimonials[currentTestimonialIndex].years}
                  </p>
                </div>
              </div>
              
              {/* Testimonial indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${idx === currentTestimonialIndex ? "w-8 h-2" : "w-2 h-2"}`}
                    style={{ backgroundColor: idx === currentTestimonialIndex ? mgmColors.primary : `${mgmColors.primary}40` }}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4" style={{ backgroundColor: mgmColors.accent }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={500} suffix="+" />
                </div>
                <p className="text-white/70">Marriages Strengthened</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={10} suffix="+" />
                </div>
                <p className="text-white/70">Years of Impact</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={98} suffix="%" />
                </div>
                <p className="text-white/70">Recommend to Friends</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={3} />
                </div>
                <p className="text-white/70">Days of Transformation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${mgmColors.primary} 0%, ${mgmColors.primaryDark} 100%)` }}>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-white/10 animate-float"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  width: `${30 + i * 8}px`,
                  height: `${30 + i * 8}px`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Marriage?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Don't miss this opportunity to invest in the most important relationship of your life.
            </p>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                  style={{ backgroundColor: "white", color: mgmColors.primary }}
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Secure Your Spot Today
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <p className="text-white/70 mt-6 text-sm">Limited spaces available. Register early to avoid disappointment.</p>
          </div>
        </section>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes pulse-subtle {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212, 149, 106, 0.4); }
            50% { box-shadow: 0 0 0 15px rgba(212, 149, 106, 0); }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
            opacity: 0;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
            opacity: 0;
          }
          
          .animation-delay-600 {
            animation-delay: 0.6s;
            opacity: 0;
          }
          
          .animation-delay-800 {
            animation-delay: 0.8s;
            opacity: 0;
          }
        `}</style>
      </div>
      <Footer />
    </>
  )
}
