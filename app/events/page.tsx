"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Event configuration with open/closed status
const events = [
  {
    id: "mgm-may-2026",
    slug: "mgm-may-2026",
    title: "MyGreatMarriage Conference",
    subtitle: "Marriage Enrichment Event for Couples",
    dates: "30 April - 2 May 2026",
    time: "Thursday: 7:00pm-9:00pm | Friday: 7:00pm-9:00pm | Saturday: 8:30am-1:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/mgm26-banner.jpg",
    banner: "/images/mgm-banner-2026.png",
    registrationOpen: true,
    requiresSpouse: true,
    description: "A transformative conference designed to strengthen marriages and build lasting partnerships.",
    price: "NAD 550 per couple",
    priceAmount: 550,
    detailsPage: "/events/my-great-marriage-2026",
  },

  {
    id: "mgm-sept-2026",
    slug: "mgm-sept-2026",
    title: "MyGreatMarriage Follow-Up",
    subtitle: "Marriage Enrichment Continuation",
    dates: "2 September 2026",
    time: "Evening Session: 6:00pm - 9:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/mgm-sept-banner.jpg",
    registrationOpen: false,
    requiresSpouse: true,
    description: "Follow-up session for couples who attended the May conference to continue their marriage journey.",
    price: "NAD 300 per couple",
    priceAmount: 300,
  },
  {
    id: "goc26",
    slug: "goc26",
    title: "Gathering of Champions 2026",
    subtitle: "GOC26 - Annual Men's Conference",
    dates: "17-19 July 2026",
    time: "Friday: 6:00pm-9:00pm | Saturday: 8:00am-5:00pm | Sunday: 8:00am-1:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/goc26-banner.jpg",
    registrationOpen: false,
    requiresSpouse: false,
    description: "The annual gathering for men seeking to become champions in their families and communities.",
    price: "NAD 450 per person",
    priceAmount: 450,
  },
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

function EventRegistrationModal({ 
  event, 
  onClose 
}: { 
  event: typeof events[0]
  onClose: () => void 
}) {
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

    if (event.requiresSpouse) {
      if (!formData.spouseFirstName.trim()) newErrors.spouseFirstName = "Spouse first name is required"
      if (!formData.spouseLastName.trim()) newErrors.spouseLastName = "Spouse last name is required"
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
          phone: formData.cellphone,
          eventSlug: event.slug,
          eventName: event.title,
          eventDate: event.dates,
          eventTime: event.time,
          eventLocation: event.location,
          paymentAmount: event.priceAmount,
          spouseFirstName: event.requiresSpouse ? formData.spouseFirstName : undefined,
          spouseLastName: event.requiresSpouse ? formData.spouseLastName : undefined,
          specialRequirements: formData.specialRequirements,
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
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
            <p className="text-white/80 text-sm mt-1">{event.dates} | {event.location}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/80 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for registering. A confirmation email has been sent to your email address.
            </p>
            
            {/* Registration Code */}
            <div className="bg-[#8B2B3E] text-white rounded-lg p-6 mb-6">
              <p className="text-sm text-white/80 mb-2">Your Registration Code</p>
              <p className="text-3xl font-bold tracking-wider">{registrationCode}</p>
              <p className="text-xs text-white/70 mt-2">Present this code at check-in</p>
            </div>
            
            {/* Payment Instructions */}
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <h4 className="font-semibold text-[#8B2B3E] mb-4">Payment Instructions</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Amount Due:</strong> {event.price}</p>
                <div className="border-t pt-3 mt-3">
                  <p className="font-medium mb-2">Banking Details (EFT):</p>
                  <p><strong>Bank:</strong> FNB</p>
                  <p><strong>Account Name:</strong> The FATHERHOOD FOUNDATION</p>
                  <p><strong>Account Number:</strong> 64279664451</p>
                  <p><strong>Branch Code:</strong> 282273</p>
                  <p><strong>Reference:</strong> Your Name + Cellphone</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Or pay online:</p>
                <a
                  href="https://site.paytoday.com.na"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay Now via PayToday
                </a>
              </div>
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

            {/* Your Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#8B2B3E] border-b pb-2">Your Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="mt-1"
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Surname <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="cellphone">Cellphone <span className="text-red-500">*</span></Label>
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

            {/* Spouse Details */}
            {event.requiresSpouse && (
              <div className="space-y-4 p-4 bg-[#8B2B3E]/5 rounded-lg border border-[#8B2B3E]/20">
                <h3 className="text-lg font-semibold text-[#8B2B3E]">Spouse Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spouseFirstName">First Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="spouseFirstName"
                      value={formData.spouseFirstName}
                      onChange={(e) => handleInputChange("spouseFirstName", e.target.value)}
                      className="mt-1"
                    />
                    {errors.spouseFirstName && <p className="text-sm text-red-500 mt-1">{errors.spouseFirstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="spouseLastName">Surname <span className="text-red-500">*</span></Label>
                    <Input
                      id="spouseLastName"
                      value={formData.spouseLastName}
                      onChange={(e) => handleInputChange("spouseLastName", e.target.value)}
                      className="mt-1"
                    />
                    {errors.spouseLastName && <p className="text-sm text-red-500 mt-1">{errors.spouseLastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="spouseEmail">Email (Optional)</Label>
                  <Input
                    id="spouseEmail"
                    type="email"
                    value={formData.spouseEmail}
                    onChange={(e) => handleInputChange("spouseEmail", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="spouseCellphone">Cellphone (Optional)</Label>
                  <Input
                    id="spouseCellphone"
                    type="tel"
                    value={formData.spouseCellphone}
                    onChange={(e) => handleInputChange("spouseCellphone", e.target.value)}
                    placeholder="+264 81 234 5678"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Special Requirements */}
            <div>
              <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
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
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Registration Fee</h4>
              <p className="text-2xl font-bold text-[#8B2B3E]">{event.price}</p>
              <p className="text-sm text-gray-600 mt-2">
                Payment instructions will be provided after registration.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white py-3 h-12"
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

function EventCard({ event, onRegister }: { event: typeof events[0]; onRegister: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Banner Image */}
      <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px] bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E]">
        {event.banner && event.banner.length > 0 ? (
          <Image
            src={event.banner}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-6xl font-bold tracking-wider">{event.id.toUpperCase()}</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className={`${event.registrationOpen ? 'bg-green-600' : 'bg-[#8B2B3E]'} text-white px-3 py-1 text-sm`}>
            {event.registrationOpen ? 'Registration Open' : 'Registration Opening Soon'}
          </Badge>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-2">{event.title}</h2>
        <p className="text-lg text-gray-600 mb-4">{event.subtitle}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-[#8B2B3E]" />
            <span className="font-semibold text-lg">{event.dates}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-[#8B2B3E] mt-0.5" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-[#8B2B3E]" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{event.description}</p>

        {event.detailsPage && (
          <Link 
            href={event.detailsPage}
            className="inline-flex items-center gap-2 text-[#8B2B3E] font-semibold hover:underline mb-4"
          >
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        <div className="border-t pt-4 mb-6">
          <span className="text-xl font-bold text-[#8B2B3E]">{event.price}</span>
        </div>

        {event.registrationOpen ? (
          <Button
            onClick={onRegister}
            className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] py-3 text-lg"
          >
            Register Now
          </Button>
        ) : (
          <Button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-3 text-lg cursor-not-allowed"
          >
            Registration Opening Soon
          </Button>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#8B2B3E] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us for transformative events designed to strengthen men, marriages, and families.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-12">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRegister={() => setSelectedEvent(event)}
          />
        ))}
      </section>

      {/* Payment Information Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#8B2B3E] mb-8">Payment Information</h2>
          <div className="bg-gray-50 rounded-xl p-8 border-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-[#8B2B3E] mb-4 text-lg">Banking Details (EFT)</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">FNB</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">The FATHERHOOD FOUNDATION</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">64279664451</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Branch Code:</span>
                    <span className="font-medium">282273</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium">Cheque Account</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Reference:</strong> Your Name + Cellphone
                </p>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[#8B2B3E] mb-4 text-lg">Or Pay Online</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    For quick and convenient payment, use PayToday secure payment platform.
                  </p>
                </div>
                <a
                  href="https://site.paytoday.com.na"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#8B2B3E] hover:bg-[#6d2230] text-white font-semibold rounded-lg transition-colors text-center"
                >
                  Pay Now via PayToday
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-4">Questions About Our Events?</h2>
          <p className="text-gray-600 mb-6">
            Contact us for more information about any of our upcoming events.
          </p>
          <a 
            href="mailto:info@thefathersfoundations.org" 
            className="inline-flex items-center gap-2 text-[#8B2B3E] font-semibold hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@thefathersfoundations.org
          </a>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </main>
      <Footer />
    </>
  )
}
