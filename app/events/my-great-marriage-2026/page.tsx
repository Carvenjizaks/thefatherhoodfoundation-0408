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
import {
  Heart,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Star,
  MessageCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react"

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

const stats = [
  { value: 500, suffix: "+", label: "Marriages Strengthened" },
  { value: 10, suffix: "+", label: "Years of Impact" },
  { value: 98, suffix: "%", label: "Recommend to Friends" },
  { value: 3, suffix: "", label: "Days of Transformation" },
]

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
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
    const imageInterval = setInterval(() => setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length), 4000)
    const quoteInterval = setInterval(() => setCurrentQuoteIndex((prev) => (prev + 1) % marriageQuotes.length), 6000)
    const testimonialInterval = setInterval(() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length), 5000)
    return () => { clearInterval(imageInterval); clearInterval(quoteInterval); clearInterval(testimonialInterval) }
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
      <div className="min-h-screen pt-16">

        {/* Hero — full-screen photo crossfade */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a0a0e]">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: idx === currentImageIndex ? 1 : 0 }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" priority={idx === 0} />
            </div>
          ))}
          {/* Strong dark overlay for legibility */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <Image
                src="/images/mgm-banner-2026.jpg"
                alt="MyGreatMarriage Conference 2026"
                width={400}
                height={400}
                className="mx-auto drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-lg text-balance">
              Transform Your Marriage
            </h1>
            <p className="text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of couples for a transformative weekend of connection, growth, and renewed love.
            </p>

            {/* Event info pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/25 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                7, 8 &amp; 9 May 2026
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/25 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Windhoek, Namibia
              </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-10 py-6 text-lg font-bold shadow-2xl transition-all hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-[#8B2B3E]">MyGreatMarriage Conference Registration</DialogTitle>
                  <DialogDescription>Register for the conference on 7, 8 &amp; 9 May 2026.</DialogDescription>
                </DialogHeader>
                {submitSuccess ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-[#8B2B3E]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#8B2B3E]">Registration Successful!</h3>
                    <p className="text-[#6b4c52]">We will send confirmation details to your email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-[#8B2B3E] border-b border-[#e8d8c8] pb-2">Your Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="mt-1" />
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="mt-1" />
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="mt-1" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cellphone">Cellphone <span className="text-red-500">*</span></Label>
                        <Input id="cellphone" type="tel" value={formData.cellphone} onChange={(e) => handleInputChange("cellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
                        {errors.cellphone && <p className="text-xs text-red-500 mt-1">{errors.cellphone}</p>}
                      </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl bg-[#FDF8F3] border border-[#e8d8c8]">
                      <h3 className="text-sm font-semibold text-[#8B2B3E]">Spouse/Partner Details</h3>
                      <div>
                        <Label htmlFor="spouseName">Name <span className="text-red-500">*</span></Label>
                        <Input id="spouseName" value={formData.spouseName} onChange={(e) => handleInputChange("spouseName", e.target.value)} className="mt-1" />
                        {errors.spouseName && <p className="text-xs text-red-500 mt-1">{errors.spouseName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="spouseEmail">Email <span className="text-red-500">*</span></Label>
                        <Input id="spouseEmail" type="email" value={formData.spouseEmail} onChange={(e) => handleInputChange("spouseEmail", e.target.value)} className="mt-1" />
                        {errors.spouseEmail && <p className="text-xs text-red-500 mt-1">{errors.spouseEmail}</p>}
                      </div>
                      <div>
                        <Label htmlFor="spouseCellphone">Cellphone <span className="text-red-500">*</span></Label>
                        <Input id="spouseCellphone" type="tel" value={formData.spouseCellphone} onChange={(e) => handleInputChange("spouseCellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
                        {errors.spouseCellphone && <p className="text-xs text-red-500 mt-1">{errors.spouseCellphone}</p>}
                      </div>
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{submitError}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-full">Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full">
                        {isSubmitting ? "Submitting..." : "Complete Registration"}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-7 h-7 text-white/50" />
            </div>
          </div>
        </section>

        {/* Rotating Quote */}
        <section className="py-20 bg-[#8B2B3E]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="text-6xl text-white/15 font-serif leading-none mb-2">&ldquo;</div>
            <div className="min-h-[130px] flex items-center justify-center">
              <div key={currentQuoteIndex} className="animate-fade-in">
                <p className="text-2xl lg:text-3xl text-white italic leading-relaxed mb-5 text-balance">
                  {marriageQuotes[currentQuoteIndex].quote}
                </p>
                <p className="text-white/60 font-medium text-sm tracking-wide">
                  — {marriageQuotes[currentQuoteIndex].author}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {marriageQuotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuoteIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${idx === currentQuoteIndex ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/30"}`}
                  aria-label={`Quote ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Communication Formula */}
        <section className="py-24 bg-[#FDF8F3]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Formula</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#8B2B3E] leading-tight mb-10 text-balance">
              The formula for a successful marriage is:
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {["communication", "communication", "communication"].map((word, idx) => (
                <span
                  key={idx}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold px-8 py-4 rounded-full text-white bg-[#8B2B3E] hover:scale-105 transition-transform shadow-md"
                  style={{ opacity: 0.65 + idx * 0.17 }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Conference Highlights */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Conference Highlights</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">What You&apos;ll Experience</h2>
              <p className="mt-3 text-[#6b4c52] max-w-xl mx-auto">
                Three days of transformative sessions designed to strengthen every aspect of your marriage.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {conferenceHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDF8F3] border border-[#e8d8c8] rounded-2xl p-7 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-[#8B2B3E] rounded-full flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-[#1a0a0e] mb-2">{item.title}</h3>
                  <p className="text-[#6b4c52] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#FDF8F3]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Success Stories</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">Couples Like You</h2>
            </div>
            <div className="min-h-[220px] flex items-center justify-center">
              <div key={currentTestimonialIndex} className="text-center animate-fade-in">
                <div className="flex justify-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#D4A574] text-[#D4A574]" />
                  ))}
                </div>
                <p className="text-xl lg:text-2xl italic text-[#4a2830] mb-5 leading-relaxed text-balance">
                  &ldquo;{testimonials[currentTestimonialIndex].text}&rdquo;
                </p>
                <p className="font-bold text-[#8B2B3E]">{testimonials[currentTestimonialIndex].name}</p>
                <p className="text-sm text-[#6b4c52]">{testimonials[currentTestimonialIndex].years}</p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonialIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${idx === currentTestimonialIndex ? "w-7 h-2 bg-[#8B2B3E]" : "w-2 h-2 bg-[#8B2B3E]/25"}`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-[#8B2B3E]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="text-white">
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/65 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-[#1a0a0e]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Don&apos;t Miss Out</span>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-white mb-5 text-balance">
              Ready to Transform Your Marriage?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Don&apos;t miss this opportunity to invest in the most important relationship of your life.
            </p>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-10 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Secure Your Spot Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </DialogTrigger>
            </Dialog>

            <p className="text-white/40 mt-6 text-sm">Limited spaces available. Register early to avoid disappointment.</p>
          </div>
        </section>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

      <Footer />
    </>
  )
}
