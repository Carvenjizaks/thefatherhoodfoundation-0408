"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  X,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Users,
  MessageCircle,
  Sparkles,
  Shield,
  ArrowLeft,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const eventDetails = {
  id: "mgm-may-2026",
  slug: "mgm-may-2026",
  title: "MyGreatMarriage Conference 2026",
  theme: "Taking Your Marriage from Good to Great",
  dates: "7, 8 & 9 May 2026",
  time: "Thursday: 7:00pm-9:00pm | Friday: 7:00pm-9:00pm | Saturday: 8:30am-1:00pm",
  location: "Venue: To be Announced",
  banner: "/images/banners/mgm-couples-banner.jpg",
  price: "NAD 550 per couple",
  priceAmount: 550,
  registrationOpen: true,
}

const keyFocusAreas = [
  {
    icon: MessageCircle,
    title: "Strengthening Communication",
    points: [
      "Learn effective communication techniques that build trust",
      "Discover how to listen with your heart, not just your ears",
      "Master the art of constructive dialogue",
    ],
  },
  {
    icon: Heart,
    title: "Rekindling Romance",
    points: [
      "Explore creative ways to keep the spark alive",
      "Understand the importance of quality time",
      "Learn to prioritize your relationship in today's busy world",
    ],
  },
  {
    icon: Sparkles,
    title: "Building a Spiritual Foundation",
    points: [
      "Discover the power of praying together",
      "Align your values and life goals",
      "Create a shared vision for your future",
    ],
  },
  {
    icon: Shield,
    title: "Navigating Challenges Together",
    points: [
      "Develop resilience in facing life's obstacles",
      "Learn conflict resolution strategies",
      "Transform difficulties into opportunities for growth",
    ],
  },
]

const whyAttend = [
  "Expert-led sessions",
  "Interactive workshops",
  "Networking with other couples",
  "Practical tools and resources",
  "Renewed vision for your marriage",
]

type FormData = {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  spouseFirstName: string
  spouseLastName: string
  spouseEmail: string
  spouseCellphone: string
  specialRequirements: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    spouseFirstName: "",
    spouseLastName: "",
    spouseEmail: "",
    spouseCellphone: "",
    specialRequirements: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [registrationCode, setRegistrationCode] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^[\d\s+()-]{10,}$/.test(phone)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.cellphone.trim()) {
      newErrors.cellphone = "Cellphone is required"
    } else if (!validatePhone(formData.cellphone)) {
      newErrors.cellphone = "Invalid phone number"
    }
    if (!formData.spouseFirstName.trim()) newErrors.spouseFirstName = "Spouse first name is required"
    if (!formData.spouseLastName.trim()) newErrors.spouseLastName = "Spouse last name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.cellphone,
          eventSlug: eventDetails.slug,
          eventName: eventDetails.title,
          eventDate: eventDetails.dates,
          eventTime: eventDetails.time,
          eventLocation: eventDetails.location,
          paymentAmount: eventDetails.priceAmount,
          spouseFirstName: formData.spouseFirstName,
          spouseLastName: formData.spouseLastName,
          specialRequirements: formData.specialRequirements,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Registration failed")
      setRegistrationCode(data.registrationCode)
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#8B2B3E] px-6 py-5 flex justify-between items-start z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">{eventDetails.title}</h2>
            <p className="text-white/75 text-sm mt-0.5">{eventDetails.dates} &bull; {eventDetails.location}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a0a0e] mb-3">Registration Successful!</h3>
            <p className="text-[#6b4c52] mb-8">
              Thank you for registering. A confirmation email has been sent to your email address.
            </p>

            <div className="bg-[#8B2B3E] text-white rounded-xl p-6 mb-6">
              <p className="text-sm text-white/70 mb-2">Your Registration Code</p>
              <p className="text-3xl font-bold tracking-widest">{registrationCode}</p>
              <p className="text-xs text-white/60 mt-2">Present this code at check-in</p>
            </div>

            <div className="bg-[#FDF8F3] border border-[#e8d8c8] rounded-xl p-6 text-left mb-6">
              <h4 className="font-semibold text-[#8B2B3E] mb-4">Payment Instructions</h4>
              <div className="space-y-1.5 text-sm text-[#4a2830]">
                <p><strong>Amount Due:</strong> {eventDetails.price}</p>
                <div className="border-t border-[#e8d8c8] pt-3 mt-3 space-y-1.5">
                  <p className="font-semibold mb-1">Banking Details (EFT):</p>
                  <p><strong>Bank:</strong> FNB</p>
                  <p><strong>Account Name:</strong> The FATHERHOOD FOUNDATION</p>
                  <p><strong>Account Number:</strong> 64279664451</p>
                  <p><strong>Branch Code:</strong> 282273</p>
                  <p><strong>Reference:</strong> MGM26-Name + Cellphone</p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-[#e8d8c8]">
                <p className="text-sm text-[#6b4c52] mb-3">Or pay online:</p>
                <a
                  href="https://site.paytoday.com.na"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Pay Now via PayToday
                </a>
              </div>
            </div>

            <Button onClick={onClose} className="bg-[#8B2B3E] hover:bg-[#6d2230] rounded-full px-8">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {submitError}
              </div>
            )}

            {/* Your Details */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#8B2B3E] border-b border-[#e8d8c8] pb-2">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-[#1a0a0e]">First Name <span className="text-red-500">*</span></Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="mt-1" />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-[#1a0a0e]">Surname <span className="text-red-500">*</span></Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="mt-1" />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#1a0a0e]">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="mt-1" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="cellphone" className="text-sm font-medium text-[#1a0a0e]">Cellphone <span className="text-red-500">*</span></Label>
                <Input id="cellphone" type="tel" value={formData.cellphone} onChange={(e) => handleInputChange("cellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
                {errors.cellphone && <p className="text-xs text-red-500 mt-1">{errors.cellphone}</p>}
              </div>
            </div>

            {/* Spouse Details */}
            <div className="space-y-4 p-4 bg-[#FDF8F3] rounded-xl border border-[#e8d8c8]">
              <h3 className="text-base font-semibold text-[#8B2B3E]">Spouse Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="spouseFirstName" className="text-sm font-medium text-[#1a0a0e]">First Name <span className="text-red-500">*</span></Label>
                  <Input id="spouseFirstName" value={formData.spouseFirstName} onChange={(e) => handleInputChange("spouseFirstName", e.target.value)} className="mt-1" />
                  {errors.spouseFirstName && <p className="text-xs text-red-500 mt-1">{errors.spouseFirstName}</p>}
                </div>
                <div>
                  <Label htmlFor="spouseLastName" className="text-sm font-medium text-[#1a0a0e]">Surname <span className="text-red-500">*</span></Label>
                  <Input id="spouseLastName" value={formData.spouseLastName} onChange={(e) => handleInputChange("spouseLastName", e.target.value)} className="mt-1" />
                  {errors.spouseLastName && <p className="text-xs text-red-500 mt-1">{errors.spouseLastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="spouseEmail" className="text-sm font-medium text-[#1a0a0e]">Email (Optional)</Label>
                <Input id="spouseEmail" type="email" value={formData.spouseEmail} onChange={(e) => handleInputChange("spouseEmail", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="spouseCellphone" className="text-sm font-medium text-[#1a0a0e]">Cellphone (Optional)</Label>
                <Input id="spouseCellphone" type="tel" value={formData.spouseCellphone} onChange={(e) => handleInputChange("spouseCellphone", e.target.value)} placeholder="+264 81 234 5678" className="mt-1" />
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <Label htmlFor="specialRequirements" className="text-sm font-medium text-[#1a0a0e]">Special Requirements (Optional)</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                placeholder="Dietary requirements, accessibility needs, etc."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Registration Fee */}
            <div className="bg-[#FDF8F3] border border-[#e8d8c8] rounded-xl p-4">
              <p className="text-sm text-[#6b4c52] mb-1">Registration Fee</p>
              <p className="text-2xl font-bold text-[#8B2B3E]">{eventDetails.price}</p>
              <p className="text-xs text-[#6b4c52] mt-1">Payment instructions will be provided after registration.</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function MyGreatMarriagePage() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24 bg-[#FDF8F3]">

        {/* Hero */}
        <section className="bg-[#8B2B3E]">
          <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
            {/* Sliding couple images */}
            <div className="absolute inset-0 flex items-center">
              <div className="flex gap-4 animate-slide-hero">
                {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((num, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 h-[420px] md:h-[520px] overflow-hidden">
                    <img
                      src={`/images/couples/couple-${num}.jpg`}
                      alt={`Happy couple ${num}`}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B2B3E] via-[#8B2B3E]/80 to-[#8B2B3E]" />

            {/* Hero text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <Link
                href="/events"
                className="inline-flex items-center text-white/70 hover:text-white mb-6 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Events
              </Link>
              <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 px-3 py-1 text-xs font-semibold tracking-wide mb-5">
                Registration Open
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3 text-balance">{eventDetails.title}</h1>
              <p className="text-xl text-white/80 italic mb-2">{eventDetails.theme}</p>
              <p className="text-white/70 font-medium">{eventDetails.dates}</p>
            </div>
          </div>

          {/* Who is this for */}
          <div className="border-t border-white/10 py-5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-3 text-white">
                <span className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Users className="w-4 h-4" /> This event is for:
                </span>
                {["Couples", "Newly Weds", "Planning to Get Married", "Those Who Want to Rekindle the Fire"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">

              {/* Left: main content */}
              <div className="lg:col-span-2 space-y-10">

                {/* Introduction */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8c8]">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-4">
                    Are You Ready to Elevate Your Marriage to New Heights?
                  </h2>
                  <p className="text-[#6b4c52] leading-relaxed text-lg">
                    Join us at the annual MyGreatMarriage Conference, where we believe that every marriage
                    has the potential for greatness, regardless of how many years you&apos;ve been together.
                    This transformative event is designed to help you and your spouse build a stronger,
                    more fulfilling relationship.
                  </p>
                </div>

                {/* Key Focus Areas */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8c8]">
                  <h2 className="text-2xl font-bold text-[#8B2B3E] mb-7">Key Focus Areas</h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {keyFocusAreas.map((area, index) => (
                      <div
                        key={index}
                        className="border border-[#e8d8c8] rounded-xl p-5 hover:border-[#8B2B3E]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <area.icon className="w-5 h-5 text-[#8B2B3E]" />
                          </div>
                          <h3 className="text-base font-bold text-[#1a0a0e]">{area.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {area.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[#6b4c52] text-sm leading-relaxed">
                              <CheckCircle className="w-4 h-4 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marquee banner */}
                <div className="bg-[#8B2B3E] rounded-2xl py-5 overflow-hidden">
                  <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="flex items-center gap-8 px-8">
                        <span className="text-white/30 text-2xl">&#9670;</span>
                        <p className="text-white text-base font-medium italic">
                          Every relationship is unique and special, and it deserves your full attention
                        </p>
                        <span className="text-white/30 text-2xl">&#9670;</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Attend */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8c8]">
                  <h2 className="text-2xl font-bold text-[#8B2B3E] mb-7">Why Attend?</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {whyAttend.map((reason, index) => (
                      <div key={index} className="flex items-center gap-3 bg-[#FDF8F3] border border-[#e8d8c8] rounded-xl px-5 py-4">
                        <CheckCircle className="w-5 h-5 text-[#8B2B3E] flex-shrink-0" />
                        <span className="font-medium text-[#1a0a0e] text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-[#8B2B3E] rounded-2xl px-8 py-10 text-center">
                  <p className="text-lg lg:text-xl text-white italic leading-relaxed text-balance">
                    &ldquo;Good marriages don&apos;t happen by accident. They are built intentionally, one day at a time.
                    Join us and invest in the most important relationship of your life!&rdquo;
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-5">

                  {/* Event Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#8B2B3E]/20">
                    <h3 className="text-lg font-bold text-[#8B2B3E] mb-5">Event Details</h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
                        <p className="font-semibold text-[#1a0a0e]">{eventDetails.dates}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-[#6b4c52] space-y-0.5">
                          <p>Thursday: 7:00pm – 9:00pm</p>
                          <p>Friday: 7:00pm – 9:00pm</p>
                          <p>Saturday: 8:30am – 1:00pm</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#6b4c52]">{eventDetails.location}</p>
                      </div>
                    </div>
                    <div className="border-t border-[#e8d8c8] pt-4 mb-5">
                      <p className="text-xs text-[#6b4c52] mb-1">Registration Fee</p>
                      <p className="text-3xl font-bold text-[#8B2B3E]">{eventDetails.price}</p>
                    </div>
                    <Button
                      onClick={() => setShowRegistration(true)}
                      className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full h-12 font-semibold"
                    >
                      Register Now
                    </Button>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-[#FDF8F3] rounded-2xl p-5 border border-[#e8d8c8]">
                    <h3 className="font-semibold text-[#8B2B3E] mb-4 text-sm">Payment Information</h3>
                    <div className="space-y-1.5 text-sm text-[#4a2830]">
                      <p><strong>Bank:</strong> FNB</p>
                      <p><strong>Account:</strong> The FATHERHOOD FOUNDATION</p>
                      <p><strong>Acc No:</strong> 64279664451</p>
                      <p><strong>Branch:</strong> 282273</p>
                      <p><strong>Reference:</strong> MGM26-Name + Cellphone</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e8d8c8]">
                      <a
                        href="https://site.paytoday.com.na"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        Pay via PayToday
                      </a>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8d8c8] text-center">
                    <h3 className="font-semibold text-[#1a0a0e] mb-2 text-sm">Questions?</h3>
                    <p className="text-xs text-[#6b4c52] mb-2">Contact us at:</p>
                    <a
                      href="mailto:info@thefathersfoundations.org"
                      className="text-[#8B2B3E] font-medium hover:underline text-sm"
                    >
                      info@thefathersfoundations.org
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
      </main>

      <style>{`
        @keyframes slide-hero {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-slide-hero {
          animation: slide-hero 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      <Footer />
    </>
  )
}
