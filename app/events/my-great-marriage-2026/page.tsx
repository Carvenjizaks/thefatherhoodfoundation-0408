"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  MessageCircle,
  ArrowRight,
  Check,
  Clock,
  Coffee,
  BookOpen,
  Utensils,
} from "lucide-react"

type RegistrationFormData = {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  spouseName: string
  spouseEmail: string
  spouseCellphone: string
  ticketType: string
}

const carouselImages = [
  { src: "/images/couples/couple-together-1.jpg", alt: "Happy couple sharing an intimate moment" },
  { src: "/images/couples/couple-1.jpg", alt: "Happy couple together" },
  { src: "/images/couples/couple-2.jpg", alt: "Couple sharing a moment" },
]

const schedule = {
  thursday: [
    { time: "18:30 - 19:00", title: "Registration & Welcome", icon: Coffee },
    { time: "19:00 - 21:00", title: "Opening Session: Building Your Foundation", icon: BookOpen },
  ],
  friday: [
    { time: "18:30 - 19:00", title: "Arrival & Fellowship", icon: Coffee },
    { time: "19:00 - 21:00", title: "Session: Communication That Connects", icon: MessageCircle },
  ],
  saturday: [
    { time: "08:30 - 09:00", title: "Registration & Breakfast", icon: Coffee },
    { time: "09:00 - 10:30", title: "Session: Conflict Resolution", icon: BookOpen },
    { time: "10:30 - 11:00", title: "Tea Break", icon: Utensils },
    { time: "11:00 - 13:00", title: "Closing Session: Renewed Commitment", icon: Heart },
  ],
}

const conferenceHighlights = [
  { icon: MessageCircle, title: "Communication Mastery", desc: "Learn secrets to deeper conversations" },
  { icon: Heart, title: "Rekindling Romance", desc: "Keep the spark alive in your marriage" },
  { icon: Users, title: "Community Building", desc: "Connect with other couples" },
  { icon: Sparkles, title: "Spiritual Growth", desc: "Strengthen through shared values" },
]

const ticketOptions = [
  {
    id: "early-bird",
    title: "Early Bird",
    price: 400,
    priceDisplay: "N$ 400",
    features: ["Full conference access", "Conference materials", "Meals and Drinks"],
    popular: true,
  },
  {
    id: "standard",
    title: "Conference Package",
    price: 550,
    priceDisplay: "N$ 550",
    features: ["Full conference access", "Conference materials", "Meals and Drinks", "Follow-up resources"],
    popular: false,
  },
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

function SearchParamsHandler({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsOpen(true)
    }
  }, [searchParams, setIsOpen])
  
  return null
}

export default function MyGreatMarriageEventPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeDay, setActiveDay] = useState<"thursday" | "friday" | "saturday">("thursday")
  const [selectedTicket, setSelectedTicket] = useState("early-bird")

  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    spouseName: "",
    spouseEmail: "",
    spouseCellphone: "",
    ticketType: "early-bird",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const imageInterval = setInterval(() => setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length), 5000)
    return () => clearInterval(imageInterval)
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
          sourceDetails: `MyGreatMarriage Conference 2026 - ${formData.ticketType}`,
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
      setFormData({ firstName: "", lastName: "", email: "", cellphone: "", spouseName: "", spouseEmail: "", spouseCellphone: "", ticketType: "early-bird" })
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SearchParamsHandler setIsOpen={setIsOpen} />
      </Suspense>
      
      <div className="min-h-screen">
        {/* Sticky Sub-navigation */}
        <nav className="fixed top-16 left-0 right-0 z-40 bg-[#1E3A5F] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center gap-6">
                <button onClick={() => scrollToSection("schedule")} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  SCHEDULE
                </button>
                <button onClick={() => scrollToSection("highlights")} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  HIGHLIGHTS
                </button>
                <button onClick={() => scrollToSection("tickets")} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  TICKETS
                </button>
              </div>
              <Button 
                onClick={() => setIsOpen(true)}
                size="sm" 
                className="bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] font-bold rounded-full px-6"
              >
                GET TICKETS
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section - Full Screen with Bottom Info Bar */}
        <section className="relative min-h-screen bg-[#0a0a0a] pt-28">
          {/* Background Images */}
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: idx === currentImageIndex ? 0.4 : 0 }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" priority={idx === 0} />
            </div>
          ))}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />

          {/* Logo */}
          <div className="absolute top-32 left-8 lg:left-16 z-10">
            <Image
              src="/images/mgm-logo.jpg"
              alt="My Great Marriage Logo"
              width={140}
              height={140}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain mix-blend-screen"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 min-h-screen flex flex-col justify-center px-8 lg:px-16 pb-40">
            <div className="max-w-4xl">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                My Great<br />Marriage
              </h1>
              <p className="text-xl lg:text-2xl text-white/70 max-w-xl leading-relaxed">
                A transformative conference for couples seeking deeper connection and renewed love.
              </p>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8 lg:gap-16">
                  <div>
                    <p className="text-white/50 text-xs font-medium tracking-wider uppercase mb-1">LOCATION</p>
                    <p className="text-white font-medium">Windhoek, Namibia</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium tracking-wider uppercase mb-1">DATE</p>
                    <p className="text-white font-medium">7, 8 & 9 May 2026</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium tracking-wider uppercase mb-1">EARLY BIRD</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-bold text-xl">N$ 400</span>
                      <span className="text-white/40 line-through text-sm">N$ 550</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsOpen(true)}
                  size="lg" 
                  className="bg-white text-[#0a0a0a] hover:bg-white/90 font-bold rounded-full px-8 group"
                >
                  GET TICKETS
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="py-24 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              Schedule
            </h2>

            {/* Day Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10">
              {(["thursday", "friday", "saturday"] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all ${
                    activeDay === day 
                      ? "text-white border-b-2 border-[#D4A574]" 
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {day === "thursday" ? "Day 1 - Thu" : day === "friday" ? "Day 2 - Fri" : "Day 3 - Sat"}
                </button>
              ))}
            </div>

            {/* Schedule Items */}
            <div className="space-y-1">
              {schedule[activeDay].map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-6 p-5 rounded-lg transition-colors ${
                    idx % 2 === 0 ? "bg-white/5" : ""
                  }`}
                >
                  <div className="w-40 flex-shrink-0">
                    <span className="text-white/50 text-sm font-mono">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section id="highlights" className="py-24 bg-[#FDF8F3]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What You&apos;ll Experience</span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#1a0a0e]" style={{ fontFamily: 'Georgia, serif' }}>
                Conference Highlights
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conferenceHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e8d8c8]"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B2B3E] to-[#6d2230] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a0a0e] mb-2">{item.title}</h3>
                  <p className="text-[#6b4c52] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-16 bg-[#8B2B3E]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={500} suffix="+" />
                </div>
                <p className="text-white/60 text-sm">Marriages Strengthened</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={10} suffix="+" />
                </div>
                <p className="text-white/60 text-sm">Years of Impact</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={98} suffix="%" />
                </div>
                <p className="text-white/60 text-sm">Recommend to Friends</p>
              </div>
              <div className="text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedNumber value={3} suffix="" />
                </div>
                <p className="text-white/60 text-sm">Days of Transformation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tickets Section */}
        <section id="tickets" className="py-24 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Select Your Ticket
              </h2>
              <p className="text-white/60 text-lg">
                Seating is limited. Register early to secure your spot.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {ticketOptions.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicket(ticket.id)
                    setFormData(prev => ({ ...prev, ticketType: ticket.id }))
                    setIsOpen(true)
                  }}
                  className={`relative text-left p-8 rounded-2xl border-2 transition-all duration-300 ${
                    ticket.popular
                      ? "bg-white border-[#D4A574] shadow-xl"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  {ticket.popular && (
                    <span className="absolute -top-3 left-6 bg-[#D4A574] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Best Value
                    </span>
                  )}
                  
                  <h3 className={`text-xl font-bold mb-2 ${ticket.popular ? "text-[#1a0a0e]" : "text-white"}`}>
                    {ticket.title}
                  </h3>
                  
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${ticket.popular ? "text-[#8B2B3E]" : "text-white"}`}>
                      {ticket.priceDisplay}
                    </span>
                    <span className={`text-sm ml-2 ${ticket.popular ? "text-[#6b4c52]" : "text-white/50"}`}>
                      per person
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {ticket.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-center gap-3 text-sm ${ticket.popular ? "text-[#6b4c52]" : "text-white/70"}`}>
                        <Check className={`w-4 h-4 ${ticket.popular ? "text-[#8B2B3E]" : "text-[#D4A574]"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className={`mt-6 py-3 px-6 rounded-full text-center font-bold transition-colors ${
                    ticket.popular 
                      ? "bg-[#8B2B3E] text-white" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}>
                    Select & Register
                  </div>
                </button>
              ))}
            </div>

            {/* Closing Date */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-[#D4A574]" />
                <span className="text-white/70 text-sm">Registration closes:</span>
                <span className="text-[#D4A574] font-bold">1 May 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-[#8B2B3E] to-[#6d2230]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to Transform Your Marriage?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of couples who have discovered the secret to a thriving marriage.
            </p>
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="bg-white text-[#8B2B3E] hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105 group"
            >
              <Heart className="w-5 h-5 mr-2" />
              Secure Your Spot
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">Register for MGM26 Conference</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete your registration for the MyGreatMarriage Conference 2026.
            </DialogDescription>
          </DialogHeader>
          
          {submitSuccess ? (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-[#8B2B3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Registration Successful!</h3>
              <p className="text-white/60">Confirmation details will be sent to your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Ticket Selection */}
              <div className="space-y-3">
                <Label className="text-white/70 text-xs font-medium tracking-wider uppercase">1. Select Ticket Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {ticketOptions.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => {
                        setSelectedTicket(ticket.id)
                        setFormData(prev => ({ ...prev, ticketType: ticket.id }))
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTicket === ticket.id
                          ? "border-[#D4A574] bg-[#D4A574]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium">{ticket.title}</span>
                        {ticket.popular && (
                          <span className="text-[10px] bg-[#D4A574] text-white px-2 py-0.5 rounded-full">SAVE</span>
                        )}
                      </div>
                      <span className="text-[#D4A574] font-bold">{ticket.priceDisplay}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Your Details */}
              <div className="space-y-4">
                <Label className="text-white/70 text-xs font-medium tracking-wider uppercase">2. Your Details</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white/80 text-sm">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={(e) => handleInputChange("firstName", e.target.value)} 
                      className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                    />
                    {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white/80 text-sm">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={(e) => handleInputChange("lastName", e.target.value)} 
                      className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                    />
                    {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange("email", e.target.value)} 
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="cellphone" className="text-white/80 text-sm">Cellphone</Label>
                  <Input 
                    id="cellphone" 
                    type="tel" 
                    value={formData.cellphone} 
                    onChange={(e) => handleInputChange("cellphone", e.target.value)} 
                    placeholder="+264 81 234 5678" 
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                  />
                  {errors.cellphone && <p className="text-xs text-red-400 mt-1">{errors.cellphone}</p>}
                </div>
              </div>

              {/* Spouse Details */}
              <div className="space-y-4 p-5 rounded-xl bg-white/5 border border-white/10">
                <Label className="text-white/70 text-xs font-medium tracking-wider uppercase">3. Spouse/Partner Details</Label>
                <div>
                  <Label htmlFor="spouseName" className="text-white/80 text-sm">Full Name</Label>
                  <Input 
                    id="spouseName" 
                    value={formData.spouseName} 
                    onChange={(e) => handleInputChange("spouseName", e.target.value)} 
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                  />
                  {errors.spouseName && <p className="text-xs text-red-400 mt-1">{errors.spouseName}</p>}
                </div>
                <div>
                  <Label htmlFor="spouseEmail" className="text-white/80 text-sm">Email</Label>
                  <Input 
                    id="spouseEmail" 
                    type="email" 
                    value={formData.spouseEmail} 
                    onChange={(e) => handleInputChange("spouseEmail", e.target.value)} 
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                  />
                  {errors.spouseEmail && <p className="text-xs text-red-400 mt-1">{errors.spouseEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="spouseCellphone" className="text-white/80 text-sm">Cellphone</Label>
                  <Input 
                    id="spouseCellphone" 
                    type="tel" 
                    value={formData.spouseCellphone} 
                    onChange={(e) => handleInputChange("spouseCellphone", e.target.value)} 
                    placeholder="+264 81 234 5678" 
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                  />
                  {errors.spouseCellphone && <p className="text-xs text-red-400 mt-1">{errors.spouseCellphone}</p>}
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="p-5 rounded-xl bg-[#8B2B3E]/20 border border-[#8B2B3E]/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Selected Package</span>
                  <span className="text-white font-medium">
                    {ticketOptions.find(t => t.id === selectedTicket)?.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Total (per person)</span>
                  <span className="text-[#D4A574] font-bold text-xl">
                    {ticketOptions.find(t => t.id === selectedTicket)?.priceDisplay}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] font-bold rounded-full"
                >
                  {isSubmitting ? "Processing..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  )
}
