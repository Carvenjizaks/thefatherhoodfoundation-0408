"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, CheckCircle, Loader2, Gift, Share2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, Parallax, ScaleIn, BlurIn } from "@/components/ui/motion"
import { useSearchParams } from "next/navigation"

// Event data
const eventData = {
  id: "goc26",
  title: "Gathering of Champions 2026",
  subtitle: "GOC26 - Annual Men's Conference",
  dates: "17-18 July 2026",
  time: "Friday: 6:00pm-9:00pm | Saturday: 8:00am-5:00pm",
  location: "Windhoek, Namibia",
  venue: "To be announced",
  price: "NAD 250 per man",
  priceAmount: 250,
  registrationOpen: true,
  description: "The flagship annual conference for men ready to step up as champions in their homes, workplaces, and communities. Powerful teaching, brotherhood, and life-changing encounters.",
  longDescription: `Join hundreds of men from across Namibia and beyond for an unforgettable weekend of transformation. The Gathering of Champions is not just another conference—it's a divine appointment for men who are serious about becoming the leaders God designed them to be.

Through powerful keynote sessions, interactive workshops, and authentic brotherhood connections, you'll gain practical tools to:
• Lead your family with confidence and grace
• Excel in your workplace with integrity
• Build lasting relationships with other men
• Discover your unique purpose and calling
• Overcome personal battles and strongholds`,
  banner: "/images/goc/goc26-poster.jpeg",
  gallery: [
    "/images/hero/men-gathering.jpg",
    "/images/goc/goc-training-1.jpg",
    "/images/goc/goc-group-beach.jpg",
    "/images/goc/goc-men-learning.jpg",
    "/images/goc/goc-speaker.jpg",
  ],
  highlights: [
    {
      title: "Powerful Teaching",
      description: "Life-changing messages from seasoned speakers and leaders",
      icon: Star,
    },
    {
      title: "Authentic Brotherhood",
      description: "Connect with men who are on the same journey",
      icon: Users,
    },
    {
      title: "Practical Workshops",
      description: "Hands-on sessions for immediate application",
      icon: CheckCircle,
    },
    {
      title: "Worship & Prayer",
      description: "Encounter God in powerful worship experiences",
      icon: Gift,
    },
  ],
  schedule: [
    {
      day: "Friday, 17 July",
      events: [
        { time: "5:00 PM", activity: "Doors Open & Registration" },
        { time: "6:00 PM", activity: "Opening Session & Worship" },
        { time: "7:30 PM", activity: "Keynote: The Heart of a Champion" },
        { time: "9:00 PM", activity: "Evening Close" },
      ],
    },
    {
      day: "Saturday, 18 July",
      events: [
        { time: "7:00 AM", activity: "Doors Open" },
        { time: "8:00 AM", activity: "Morning Worship" },
        { time: "9:00 AM", activity: "Keynote Session" },
        { time: "10:30 AM", activity: "Breakout Workshops" },
        { time: "12:30 PM", activity: "Lunch Break" },
        { time: "2:00 PM", activity: "Afternoon Session" },
        { time: "4:00 PM", activity: "Panel Discussion" },
        { time: "5:00 PM", activity: "Closing & Commissioning" },
      ],
    },
  ],
  faqs: [
    {
      question: "What should I bring?",
      answer: "Bring your Bible, notebook, pen, and an open heart. Meals are included in your registration.",
    },
    {
      question: "Is accommodation provided?",
      answer: "Accommodation is not included. We recommend booking early as July is peak season in Windhoek.",
    },
    {
      question: "Can I invite friends?",
      answer: "Absolutely! After you register, you'll receive a referral link to invite friends. The more, the merrier!",
    },
    {
      question: "What's the refund policy?",
      answer: "Full refunds available up to 30 days before the event. After that, credit toward future events.",
    },
  ],
}

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [registrationCode, setRegistrationCode] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref")
  const invitedEmail = searchParams.get("invited")

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^[\d\s+()-]{10,}$/.test(phone)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number"
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
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          eventSlug: "goc26",
          eventName: eventData.title,
          eventDate: "2026-07-17",
          eventTime: eventData.time,
          eventLocation: eventData.location,
          paymentAmount: eventData.priceAmount,
          referralCode: refCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setRegistrationCode(data.registrationCode)
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-[#8B2B3E] p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-xl font-bold text-white">{eventData.title}</h2>
            <p className="text-white/80 text-sm mt-1">Registration</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/80 p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for registering for {eventData.title}. A confirmation email has been sent to your email address.
            </p>
            
            {/* Registration Code */}
            <div className="bg-[#8B2B3E] text-white rounded-lg p-6 mb-6">
              <p className="text-sm text-white/80 mb-2">Your Registration Code</p>
              <p className="text-3xl font-bold tracking-wider">{registrationCode}</p>
              <p className="text-xs text-white/70 mt-2">Present this code at check-in</p>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <h4 className="font-semibold text-[#8B2B3E] mb-4">Event Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {eventData.dates}</p>
                <p><strong>Time:</strong> {eventData.time}</p>
                <p><strong>Location:</strong> {eventData.location}</p>
                <p><strong>Amount Due:</strong> {eventData.price}</p>
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="font-medium mb-2">Banking Details (EFT):</p>
                <p><strong>Bank:</strong> FNB</p>
                <p><strong>Account Name:</strong> The FATHERHOOD FOUNDATION</p>
                <p><strong>Account Number:</strong> 64279664451</p>
                <p><strong>Branch Code:</strong> 282273</p>
                <p><strong>Reference:</strong> Your Name + {registrationCode}</p>
              </div>
            </div>

            {/* Refer Friends */}
            <div className="bg-[#3D2314] text-white rounded-lg p-6 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Invite Your Friends
              </h4>
              <p className="text-sm text-white/80 mb-4">
                Know someone who would benefit from GOC26? Send them a personal invitation!
              </p>
              <Link href={`/events/goc26/refer?code=${registrationCode}`}>
                <Button className="bg-[#D4A574] hover:bg-[#b8935f] text-[#3D2314] font-semibold">
                  Refer Friends
                </Button>
              </Link>
            </div>
            
            <Button onClick={onClose} className="bg-[#8B2B3E] hover:bg-[#6d2230]">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}

            {refCode && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <p className="font-medium">You were invited by a friend!</p>
                <p className="text-sm">Referral code: {refCode}</p>
              </div>
            )}

            {/* Your Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#8B2B3E] border-b pb-2">Your Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B2B3E] focus:border-transparent"
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Surname <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B2B3E] focus:border-transparent"
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B2B3E] focus:border-transparent"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cellphone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+264 81 234 5678"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B2B3E] focus:border-transparent"
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Registration Fee */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Registration Fee</h4>
              <p className="text-2xl font-bold text-[#8B2B3E]">{eventData.price}</p>
              <p className="text-sm text-gray-600 mt-2">
                Payment instructions will be provided after registration.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white py-3 h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

function GOC26PageContent() {
  const [showRegistration, setShowRegistration] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref")
  const invitedEmail = searchParams.get("invited")

  useEffect(() => {
    // Auto-scroll to registration if coming from referral
    if (refCode && invitedEmail) {
      setTimeout(() => {
        setShowRegistration(true)
      }, 1000)
    }
  }, [refCode, invitedEmail])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % eventData.gallery.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {/* Background Image Carousel */}
          <div className="absolute inset-0">
            {eventData.gallery.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img}
                  alt={`GOC26 ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <BlurIn delay={0.1}>
                  <Badge className="bg-[#D4A574] text-[#3D2314] mb-4 text-sm px-4 py-1">
                    Annual Men's Conference
                  </Badge>
                </BlurIn>
                <BlurIn delay={0.2}>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {eventData.title}
                  </h1>
                </BlurIn>
                <FadeIn direction="up" delay={0.3}>
                  <p className="text-xl text-white/90 mb-6">{eventData.subtitle}</p>
                </FadeIn>
                <FadeIn direction="up" delay={0.4}>
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-5 h-5" />
                      <span>{eventData.dates}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-5 h-5" />
                      <span>{eventData.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-5 h-5" />
                      <span>{eventData.location}</span>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn direction="up" delay={0.5}>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => setShowRegistration(true)}
                      className="bg-[#D4A574] hover:bg-[#b8935f] text-[#3D2314] font-semibold px-8 py-6 text-lg"
                    >
                      Register Now <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Link href="/events/goc26/refer">
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Refer Friends
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {eventData.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeImage ? "bg-[#D4A574] w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-8 text-center">
                Step Into Your Destiny
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                {eventData.longDescription}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-4">
                What to Expect
              </h2>
              <p className="text-gray-600 text-lg">
                An experience designed to transform every area of your life
              </p>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventData.highlights.map((highlight, index) => (
                <ScaleIn key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                    <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <highlight.icon className="w-8 h-8 text-[#8B2B3E]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B2B3E] mb-2">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="py-16 lg:py-24 bg-[#3D2314] text-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Event Schedule</h2>
              <p className="text-white/80 text-lg">
                Two power-packed days of transformation
              </p>
            </FadeIn>
            <div className="space-y-8">
              {eventData.schedule.map((day, dayIndex) => (
                <FadeIn key={dayIndex} direction="up" delay={dayIndex * 0.1}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold text-[#D4A574] mb-4">{day.day}</h3>
                    <div className="space-y-3">
                      {day.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex gap-4 py-2 border-b border-white/10 last:border-0"
                        >
                          <span className="text-[#D4A574] font-semibold w-20 shrink-0">
                            {event.time}
                          </span>
                          <span className="text-white/90">{event.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#8B2B3E] mb-4">
                Frequently Asked Questions
              </h2>
            </FadeIn>
            <div className="space-y-4">
              {eventData.faqs.map((faq, index) => (
                <FadeIn key={index} direction="up" delay={index * 0.05}>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#8B2B3E] mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Become a Champion?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join hundreds of men who are stepping into their destiny. Register now and secure your spot.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => setShowRegistration(true)}
                  className="bg-[#D4A574] hover:bg-[#b8935f] text-[#3D2314] font-semibold px-8 py-6 text-lg"
                >
                  Register for GOC26 <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Link href="/events/goc26/refer">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Invite Friends
                  </Button>
                </Link>
              </div>
              <p className="text-white/60 mt-6">
                {eventData.price} • {eventData.dates} • {eventData.location}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Registration Modal */}
        {showRegistration && (
          <RegistrationModal onClose={() => setShowRegistration(false)} />
        )}
      </main>
      <Footer />
    </>
  )
}

export default function GOC26Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GOC26PageContent />
    </Suspense>
  )
}
