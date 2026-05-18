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
import Link from "next/link"
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
import { FadeIn, Parallax } from "@/components/ui/motion"

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

type EnquiryFormData = {
  name: string
  email: string
  phone: string
  message: string
}

const carouselImages = [
  { src: "/images/couples/couple-together-1.jpg", alt: "Happy couple sharing an intimate moment" },
  { src: "/images/couples/couple-1.jpg", alt: "Happy couple together" },
  { src: "/images/couples/couple-2.jpg", alt: "Couple sharing a moment" },
]

const schedule = {
  thursday: [
    { time: "18:30 - 19:00", title: "Registration & Welcome", icon: Coffee },
    { time: "19:00 - 21:00", title: "Session 1", icon: BookOpen },
  ],
  friday: [
    { time: "18:30 - 19:00", title: "Arrival & Fellowship", icon: Coffee },
    { time: "19:00 - 21:00", title: "Session 2", icon: MessageCircle },
  ],
  saturday: [
    { time: "08:00 - 08:30", title: "Registration & Breakfast", icon: Coffee },
    { time: "08:30 - 09:30", title: "Session 3", icon: BookOpen },
    { time: "09:30 - 10:00", title: "Tea Break", icon: Utensils },
    { time: "10:00 - 11:00", title: "Session 4", icon: MessageCircle },
    { time: "11:00 - 11:30", title: "Tea Break", icon: Utensils },
    { time: "11:30 - 12:30", title: "Session 5", icon: BookOpen },
    { time: "12:30 - 13:00", title: "Session 6", icon: Heart },
  ],
}

const conferenceHighlights = [
  { icon: MessageCircle, title: "Communication Mastery", desc: "Learn secrets to deeper conversations" },
  { icon: Heart, title: "Rekindling Romance", desc: "Keep the spark alive in your marriage" },
  { icon: Users, title: "Community Building", desc: "Connect with other couples" },
  { icon: Sparkles, title: "Spiritual Growth", desc: "Strengthen through shared values" },
]

// Early Bird ends on 24 April 2026 (disappears on 25 April)
const EARLY_BIRD_END_DATE = new Date("2026-04-25T00:00:00")

// Registration is now closed
const REGISTRATION_CLOSED = true

const getTicketOptions = () => {
  const now = new Date()
  const isEarlyBirdActive = now < EARLY_BIRD_END_DATE
  
  const options = []
  
  if (isEarlyBirdActive) {
    options.push({
      id: "early-bird",
      title: "Early Bird",
      price: 400,
      priceDisplay: "NAD 400",
      perCouple: true,
      features: ["Full conference access", "Conference materials", "Meals and Drinks", "Follow-up resources"],
      popular: true,
    })
  }
  
  options.push({
    id: "standard",
    title: "Conference Package",
    price: 550,
    priceDisplay: "NAD 550",
    perCouple: true,
    features: ["Full conference access", "Conference materials", "Meals and Drinks"],
    popular: !isEarlyBirdActive,
  })
  
  return options
}

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
  const [registrationCode, setRegistrationCode] = useState<string | null>(null)
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

  // Enquiry form state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [enquirySubmitting, setEnquirySubmitting] = useState(false)
  const [enquirySuccess, setEnquirySuccess] = useState(false)
  const [enquiryData, setEnquiryData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "I would like to enquire about ticket availability for the MyGreatMarriage Conference 2026.",
  })
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({})

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
      const selectedOption = getTicketOptions().find(t => t.id === selectedTicket)
      const spouseNameParts = formData.spouseName?.trim().split(" ") || []
      
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.cellphone,
          eventSlug: "my-great-marriage-2026",
          eventName: "MyGreatMarriage Conference 2026",
          eventDate: "7, 8 & 9 May 2026",
          eventTime: "Thu & Fri: 18:30 - 21:00, Sat: 08:00 - 13:00",
          eventLocation: "WHS (Windhoek High School)",
          paymentAmount: selectedOption?.price?.toString() || "0",
          spouseFirstName: spouseNameParts[0] || "",
          spouseLastName: spouseNameParts.slice(1).join(" ") || "",
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }
      const data = await response.json()
      setRegistrationCode(data.registrationCode)
      setSubmitSuccess(true)
      setFormData({ firstName: "", lastName: "", email: "", cellphone: "", spouseName: "", spouseEmail: "", spouseCellphone: "", ticketType: "early-bird" })
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

  const handleEnquiryInputChange = (field: string, value: string) => {
    setEnquiryData((prev) => ({ ...prev, [field]: value }))
    if (enquiryErrors[field]) setEnquiryErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateEnquiryForm = () => {
    const newErrors: Record<string, string> = {}
    if (!enquiryData.name.trim()) newErrors.name = "Name is required"
    if (!enquiryData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(enquiryData.email)) newErrors.email = "Invalid email address"
    if (!enquiryData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!validatePhone(enquiryData.phone)) newErrors.phone = "Invalid phone number"
    setEnquiryErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEnquiryForm()) return
    setEnquirySubmitting(true)
    
    console.log("[v0] Submitting enquiry form...")
    
    try {
      const payload = {
        name: enquiryData.name,
        email: enquiryData.email,
        phone: enquiryData.phone,
        message: enquiryData.message,
        eventName: "MyGreatMarriage Conference 2026",
      }
      
      console.log("[v0] Request payload:", payload)
      
      const response = await fetch("/api/events/ticket-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to send enquiry")
      }

      console.log("[v0] Enquiry sent successfully!")
      setEnquirySuccess(true)
    } catch (error) {
      console.error("[v0] Enquiry submission error:", error)
      alert("Failed to send enquiry. Please try again or contact us directly at rodgerbeukes73@gmail.com")
    } finally {
      setEnquirySubmitting(false)
    }
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
              {REGISTRATION_CLOSED ? (
                <span className="text-white/70 text-sm font-medium bg-white/10 rounded-full px-6 py-2">
                  Registration Closed
                </span>
              ) : (
                <Button 
                  onClick={() => setIsOpen(true)}
                  size="sm" 
                  className="bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] font-bold rounded-full px-6"
                >
                  GET TICKETS
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section - Full Screen with Bottom Info Bar */}
        <section className="relative min-h-screen bg-[#D4B896] pt-28">
          {/* Background Images - Full clarity, no dark overlay */}
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: idx === currentImageIndex ? 1 : 0 }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" priority={idx === 0} />
            </div>
          ))}
          
          {/* Subtle gradient only at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#D4B896]/50 via-transparent to-transparent" />
          
          {/* Cinematic floating elements */}
          <Parallax speed={0.3} className="absolute top-40 right-20 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl" />
          <Parallax speed={0.5} className="absolute bottom-40 left-20 w-96 h-96 bg-[#8B2B3E]/10 rounded-full blur-3xl" />

          {/* Main Content - Positioned at bottom */}
          <div className="relative z-10 min-h-screen flex flex-col justify-end px-8 lg:px-16 pb-32">
            <div className="max-w-4xl mb-24">
              <FadeIn direction="up" delay={0.2}>
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-medium text-[#1E3A5F] leading-[0.95] tracking-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  My Great<br />Marriage
                </h1>
              </FadeIn>
              <FadeIn direction="up" delay={0.3}>
                <p className="text-xl lg:text-2xl text-[#1E3A5F]/80 max-w-xl leading-relaxed">
                  Thank you to all couples who attended our May 2026 conference! Join us for the next MyGreatMarriage Conference in September 2026.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#D4B896]/95 backdrop-blur-sm border-t border-[#8B2B3E]/20">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8 lg:gap-16">
                  <div>
                    <p className="text-[#3D2314]/60 text-xs font-medium tracking-wider uppercase mb-1">LOCATION</p>
                    <p className="text-[#3D2314] font-medium">WHS (Windhoek High School)</p>
                  </div>
                  <div>
                    <p className="text-[#3D2314]/60 text-xs font-medium tracking-wider uppercase mb-1">EVENT DATE</p>
                    <p className="text-[#3D2314] font-medium">7, 8 & 9 May 2026 (Completed)</p>
                  </div>
                  {new Date() < EARLY_BIRD_END_DATE ? (
                    <div>
                      <p className="text-[#3D2314]/60 text-xs font-medium tracking-wider uppercase mb-1">EARLY BIRD (per couple)</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#8B2B3E] font-bold text-xl">NAD 400</span>
                        <span className="text-[#3D2314]/40 line-through text-sm">NAD 550</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#3D2314]/60 text-xs font-medium tracking-wider uppercase mb-1">PRICE (per couple)</p>
                      <span className="text-[#8B2B3E] font-bold text-xl">NAD 550</span>
                    </div>
                  )}
                </div>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] font-bold rounded-full px-8 group"
                >
                  <Link href="/events">
                    View Upcoming Events
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="py-24 bg-[#D4B896]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#3D2314] mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              Schedule
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Schedule Content */}
              <div>
                {/* Day Tabs */}
                <div className="flex gap-2 mb-8 border-b border-[#8B2B3E]/20">
                  {(["thursday", "friday", "saturday"] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all ${
                        activeDay === day 
                          ? "text-[#3D2314] border-b-2 border-[#8B2B3E]" 
                          : "text-[#3D2314]/50 hover:text-[#3D2314]/80"
                      }`}
                    >
                      {day === "thursday" ? "Thu Evening" : day === "friday" ? "Fri Evening" : "Sat (Closes 1pm)"}
                    </button>
                  ))}
                </div>

                {/* Schedule Items */}
                <div className="space-y-1">
                  {schedule[activeDay].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-6 p-5 rounded-lg transition-colors ${
                        idx % 2 === 0 ? "bg-white/30" : ""
                      }`}
                    >
                      <div className="w-40 flex-shrink-0">
                        <span className="text-[#3D2314]/60 text-sm font-mono">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#8B2B3E]" />
                        </div>
                        <span className="text-[#3D2314] font-medium">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers Image */}
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/mgm-speakers.jpeg"
                    alt="MyGreatMarriage Conference Speakers: Carven Izaks, Mokgethoa De Almeida, and Bruce Hansen"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
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
        <section id="tickets" className="py-24 bg-[#D4B896]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {REGISTRATION_CLOSED ? (
              <div className="text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Registration Closed
                </h2>
                <p className="text-[#3D2314]/70 text-lg mb-4">
                  Registration for MyGreatMarriage Conference 2026 is now closed.
                </p>
                <p className="text-[#3D2314]/80 text-base mb-6">
                  To enquire about ticket availability:
                </p>
                <button 
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold rounded-full px-6 py-3 transition-colors mb-8"
                >
                  Request Ticket
                </button>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 border border-[#8B2B3E]/20">
                  <Clock className="w-4 h-4 text-[#8B2B3E]" />
                  <span className="text-[#3D2314]/70 text-sm">Thank you for your interest!</span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    Select Your Ticket
                  </h2>
                  <p className="text-[#3D2314]/70 text-lg">
                    Seating is limited. Register early to secure your spot.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {getTicketOptions().map((ticket) => (
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
                          : "bg-white/60 border-[#8B2B3E]/20 hover:border-[#8B2B3E]/40"
                      }`}
                    >
                      {ticket.popular && (
                        <span className="absolute -top-3 left-6 bg-[#D4A574] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                          Best Value
                        </span>
                      )}
                      
                      <h3 className={`text-xl font-bold mb-2 ${ticket.popular ? "text-[#1a0a0e]" : "text-[#3D2314]"}`}>
                        {ticket.title}
                      </h3>
                      
                      <div className="mb-6">
                        <span className={`text-4xl font-bold ${ticket.popular ? "text-[#8B2B3E]" : "text-[#3D2314]"}`}>
                          {ticket.priceDisplay}
                        </span>
                        <span className={`text-sm ml-2 ${ticket.popular ? "text-[#6b4c52]" : "text-[#3D2314]/60"}`}>
                          per couple
                        </span>
                      </div>
                      
                      <ul className="space-y-3">
                        {ticket.features.map((feature, idx) => (
                          <li key={idx} className={`flex items-center gap-3 text-sm ${ticket.popular ? "text-[#6b4c52]" : "text-[#3D2314]/70"}`}>
                            <Check className={`w-4 h-4 ${ticket.popular ? "text-[#8B2B3E]" : "text-[#D4A574]"}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className={`mt-6 py-3 px-6 rounded-full text-center font-bold transition-colors ${
                        ticket.popular 
                          ? "bg-[#8B2B3E] text-white" 
                          : "bg-[#8B2B3E]/20 text-[#3D2314] hover:bg-[#8B2B3E]/30"
                      }`}>
                        Select & Register
                      </div>
                    </button>
                  ))}
                </div>

                {/* Closing Date */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 border border-[#8B2B3E]/20">
                    <Clock className="w-4 h-4 text-[#8B2B3E]" />
                    <span className="text-[#3D2314]/70 text-sm">Registration closes:</span>
                    <span className="text-[#8B2B3E] font-bold">1 May 2026</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-[#8B2B3E] to-[#6d2230]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            {REGISTRATION_CLOSED ? (
              <>
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Registration Has Closed
                </h2>
                <p className="text-white/70 text-lg mb-4 max-w-xl mx-auto">
                  Thank you for your interest in MyGreatMarriage Conference 2026. We look forward to seeing registered couples at the event!
                </p>
                <p className="text-white/80 text-base mb-6 max-w-xl mx-auto">
                  To enquire about ticket availability:
                </p>
                <button 
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#8B2B3E] font-semibold rounded-full px-6 py-3 transition-colors mb-10"
                >
                  Request Ticket
                </button>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-8 py-4 text-lg font-medium">
                  <Heart className="w-5 h-5" />
                  See you at the conference!
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5EDE4] border-[#8B2B3E]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#3D2314]">Register for MGM26 Conference</DialogTitle>
            <DialogDescription className="text-[#3D2314]/70">
              Complete your registration for the MyGreatMarriage Conference 2026.
            </DialogDescription>
          </DialogHeader>
          
          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-[#8B2B3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#3D2314]">Registration Successful!</h3>
              <p className="text-[#3D2314]/70 mb-6">Confirmation details have been sent to your email.</p>
              
              {registrationCode && (
                <div className="bg-[#f5f0eb] border-2 border-dashed border-[#8B2B3E]/40 rounded-xl p-6 mx-auto max-w-xs">
                  <p className="text-xs text-[#3D2314]/60 font-medium tracking-wider uppercase mb-2">Your Check-In Reference Code</p>
                  <p className="text-3xl font-bold text-[#8B2B3E] tracking-widest font-mono">{registrationCode}</p>
                  <p className="text-xs text-[#3D2314]/50 mt-3">Present this code at the check-in desk</p>
                </div>
              )}

              <Button
                onClick={() => { setIsOpen(false); setSubmitSuccess(false); setRegistrationCode(null) }}
                className="mt-6 bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Ticket Selection */}
              <div className="space-y-3">
                <Label className="text-[#1E3A5F]/70 text-xs font-medium tracking-wider uppercase">1. Select Ticket Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {getTicketOptions().map((ticket) => (
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
                          : "border-[#1E3A5F]/20 hover:border-[#1E3A5F]/40"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[#1E3A5F] font-medium">{ticket.title}</span>
                        {ticket.popular && (
                          <span className="text-[10px] bg-[#D4A574] text-white px-2 py-0.5 rounded-full">SAVE</span>
                        )}
                      </div>
                      <span className="text-[#D4A574] font-bold">{ticket.priceDisplay}</span>
                      <span className="text-[#1E3A5F]/60 text-xs ml-1">per couple</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Your Details */}
              <div className="space-y-4">
                <Label className="text-[#1E3A5F]/70 text-xs font-medium tracking-wider uppercase">2. Your Details</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#1E3A5F]/80 text-sm">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={(e) => handleInputChange("firstName", e.target.value)} 
                      className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                    />
                    {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#1E3A5F]/80 text-sm">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={(e) => handleInputChange("lastName", e.target.value)} 
                      className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                    />
                    {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#1E3A5F]/80 text-sm">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange("email", e.target.value)} 
                    className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="cellphone" className="text-[#1E3A5F]/80 text-sm">Cellphone</Label>
                  <Input 
                    id="cellphone" 
                    type="tel" 
                    value={formData.cellphone} 
                    onChange={(e) => handleInputChange("cellphone", e.target.value)} 
                    placeholder="+264 81 234 5678" 
                    className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                  />
                  {errors.cellphone && <p className="text-xs text-red-400 mt-1">{errors.cellphone}</p>}
                </div>
              </div>

              {/* Spouse Details */}
              <div className="space-y-4 p-5 rounded-xl bg-[#1E3A5F]/5 border border-[#1E3A5F]/10">
                <Label className="text-[#1E3A5F]/70 text-xs font-medium tracking-wider uppercase">3. Spouse/Partner Details</Label>
                <div>
                  <Label htmlFor="spouseName" className="text-[#1E3A5F]/80 text-sm">Full Name</Label>
                  <Input 
                    id="spouseName" 
                    value={formData.spouseName} 
                    onChange={(e) => handleInputChange("spouseName", e.target.value)} 
                    className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                  />
                  {errors.spouseName && <p className="text-xs text-red-400 mt-1">{errors.spouseName}</p>}
                </div>
                <div>
                  <Label htmlFor="spouseEmail" className="text-[#1E3A5F]/80 text-sm">Email</Label>
                  <Input 
                    id="spouseEmail" 
                    type="email" 
                    value={formData.spouseEmail} 
                    onChange={(e) => handleInputChange("spouseEmail", e.target.value)} 
                    className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                  />
                  {errors.spouseEmail && <p className="text-xs text-red-400 mt-1">{errors.spouseEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="spouseCellphone" className="text-[#1E3A5F]/80 text-sm">Cellphone</Label>
                  <Input 
                    id="spouseCellphone" 
                    type="tel" 
                    value={formData.spouseCellphone} 
                    onChange={(e) => handleInputChange("spouseCellphone", e.target.value)} 
                    placeholder="+264 81 234 5678" 
                    className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
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
              <div className="p-5 rounded-xl bg-[#8B2B3E]/10 border border-[#8B2B3E]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1E3A5F]/70 text-sm">Selected Package</span>
                  <span className="text-[#1E3A5F] font-medium">
                    {getTicketOptions().find(t => t.id === selectedTicket)?.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1E3A5F]/70 text-sm">Total (per couple)</span>
                  <span className="text-[#D4A574] font-bold text-xl">
                    {getTicketOptions().find(t => t.id === selectedTicket)?.priceDisplay}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 rounded-full border-[#1E3A5F]/30 text-[#1E3A5F] hover:bg-[#1E3A5F]/10"
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

      {/* Ticket Enquiry Dialog */}
      <Dialog open={isEnquiryOpen} onOpenChange={(open) => {
        setIsEnquiryOpen(open)
        if (!open) {
          setEnquirySuccess(false)
          setEnquiryData({
            name: "",
            email: "",
            phone: "",
            message: "I would like to enquire about ticket availability for the MyGreatMarriage Conference 2026.",
          })
          setEnquiryErrors({})
        }
      }}>
        <DialogContent className="sm:max-w-md bg-[#FDF8F3] border-[#D4A574]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1E3A5F]" style={{ fontFamily: 'Georgia, serif' }}>
              Request Tickets
            </DialogTitle>
            <DialogDescription className="text-[#1E3A5F]/60">
              Fill in your details and we&apos;ll get back to you about ticket availability.
            </DialogDescription>
          </DialogHeader>
          
          {enquirySuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Enquiry Sent!</h3>
              <p className="text-[#1E3A5F]/70 mb-6">
                Thank you for your enquiry. Rodger will get back to you shortly about ticket availability.
              </p>
              <Button
                onClick={() => setIsEnquiryOpen(false)}
                className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="enquiry-name" className="text-[#1E3A5F]/80 text-sm">Your Name</Label>
                <Input 
                  id="enquiry-name" 
                  value={enquiryData.name} 
                  onChange={(e) => handleEnquiryInputChange("name", e.target.value)} 
                  placeholder="John Doe"
                  className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                />
                {enquiryErrors.name && <p className="text-xs text-red-400 mt-1">{enquiryErrors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="enquiry-email" className="text-[#1E3A5F]/80 text-sm">Email</Label>
                <Input 
                  id="enquiry-email" 
                  type="email" 
                  value={enquiryData.email} 
                  onChange={(e) => handleEnquiryInputChange("email", e.target.value)} 
                  placeholder="john@example.com"
                  className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                />
                {enquiryErrors.email && <p className="text-xs text-red-400 mt-1">{enquiryErrors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="enquiry-phone" className="text-[#1E3A5F]/80 text-sm">Phone Number</Label>
                <Input 
                  id="enquiry-phone" 
                  type="tel" 
                  value={enquiryData.phone} 
                  onChange={(e) => handleEnquiryInputChange("phone", e.target.value)} 
                  placeholder="+264 81 234 5678"
                  className="mt-1 bg-white border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40" 
                />
                {enquiryErrors.phone && <p className="text-xs text-red-400 mt-1">{enquiryErrors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="enquiry-message" className="text-[#1E3A5F]/80 text-sm">Message (Optional)</Label>
                <textarea 
                  id="enquiry-message" 
                  value={enquiryData.message} 
                  onChange={(e) => handleEnquiryInputChange("message", e.target.value)} 
                  rows={3}
                  className="mt-1 w-full rounded-md bg-white border border-[#1E3A5F]/20 text-[#1E3A5F] placeholder:text-[#1E3A5F]/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]" 
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEnquiryOpen(false)} 
                  className="flex-1 rounded-full border-[#1E3A5F]/30 text-[#1E3A5F] hover:bg-[#1E3A5F]/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={enquirySubmitting} 
                  className="flex-1 bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-bold rounded-full"
                >
                  {enquirySubmitting ? "Sending..." : "Send Enquiry"}
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
