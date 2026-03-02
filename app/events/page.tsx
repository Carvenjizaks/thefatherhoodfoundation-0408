"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase-client"

// Event configuration with open/closed status
const events = [
  {
    id: "mgm-may-2026",
    title: "MyGreatMarriage Conference",
    subtitle: "Marriage Enrichment Event for Couples",
    dates: "1 May 2026",
    schedule: "Thursday Night: 6:00pm - 8:30pm | Friday: 6:30pm - 9:00pm | Saturday: 8:30am - 1:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/mgm-may-banner.jpg",
    registrationOpen: true,
    requiresSpouse: true,
    description: "A transformative conference designed to strengthen marriages and build lasting partnerships.",
  },
  {
    id: "goc26",
    title: "Gathering of Champions 2026",
    subtitle: "GOC26 - Annual Men's Conference",
    dates: "17-19 July 2026",
    schedule: "Friday: 6:00pm - 9:00pm | Saturday: 8:00am - 5:00pm | Sunday: 8:00am - 1:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/goc26-banner.jpg",
    registrationOpen: true,
    requiresSpouse: false,
    description: "The annual gathering for men seeking to become champions in their families and communities.",
  },
  {
    id: "mgm-sept-2026",
    title: "MyGreatMarriage Follow-Up",
    subtitle: "Marriage Enrichment Continuation",
    dates: "2 September 2026",
    schedule: "Evening Session: 6:00pm - 9:00pm",
    location: "Venue: To be Announced",
    banner: "/images/banners/mgm-sept-banner.jpg",
    registrationOpen: false,
    requiresSpouse: true,
    description: "Follow-up session for couples who attended the May conference to continue their marriage journey.",
  },
]

type FormData = {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  spouseName: string
  spouseEmail: string
  spouseCellphone: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function EventRegistrationForm({ 
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
    spouseName: "",
    spouseEmail: "",
    spouseCellphone: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
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

    // Spouse validation for marriage events
    if (event.requiresSpouse) {
      if (!formData.spouseName.trim()) newErrors.spouseName = "Spouse name is required"
      if (!formData.spouseEmail.trim()) {
        newErrors.spouseEmail = "Spouse email is required"
      } else if (!validateEmail(formData.spouseEmail)) {
        newErrors.spouseEmail = "Invalid email address"
      }
      if (!formData.spouseCellphone.trim()) {
        newErrors.spouseCellphone = "Spouse cellphone is required"
      } else if (!validatePhone(formData.spouseCellphone)) {
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
        event_id: event.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        cellphone: formData.cellphone,
        spouse_name: event.requiresSpouse ? formData.spouseName : null,
        spouse_email: event.requiresSpouse ? formData.spouseEmail : null,
        spouse_cellphone: event.requiresSpouse ? formData.spouseCellphone : null,
      }

      const { error } = await supabase.from("event_registrations").insert(registrationData)

      if (error) throw error

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
    } catch (err) {
      setSubmitError("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-4">Thank you for registering for {event.title}. We will contact you with further details.</p>
        <Button onClick={onClose} className="bg-[#8B2B3E] hover:bg-[#6B1F2E]">
          Close
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Attendee Details */}
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

      {/* Spouse Details (for marriage events) */}
      {event.requiresSpouse && (
        <div className="space-y-4 p-4 bg-[#8B2B3E]/5 rounded-lg border border-[#8B2B3E]/20">
          <h3 className="text-lg font-semibold text-[#8B2B3E]">Spouse Details</h3>
          
          <div>
            <Label htmlFor="spouseName">Name <span className="text-red-500">*</span></Label>
            <Input
              id="spouseName"
              value={formData.spouseName}
              onChange={(e) => handleInputChange("spouseName", e.target.value)}
              className="mt-1"
            />
            {errors.spouseName && <p className="text-sm text-red-500 mt-1">{errors.spouseName}</p>}
          </div>

          <div>
            <Label htmlFor="spouseEmail">Email <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="spouseCellphone">Cellphone <span className="text-red-500">*</span></Label>
            <Input
              id="spouseCellphone"
              type="tel"
              value={formData.spouseCellphone}
              onChange={(e) => handleInputChange("spouseCellphone", e.target.value)}
              placeholder="+264 81 234 5678"
              className="mt-1"
            />
            {errors.spouseCellphone && <p className="text-sm text-red-500 mt-1">{errors.spouseCellphone}</p>}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-[#8B2B3E] hover:bg-[#6B1F2E] text-white py-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Register Now"}
      </Button>
    </form>
  )
}

function EventCard({ event }: { event: typeof events[0] }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Banner Image */}
      <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px]">
        <Image
          src={event.banner}
          alt={event.title}
          fill
          className="object-cover"
        />
        {/* Registration Status Badge */}
        <div className="absolute top-4 right-4">
          {event.registrationOpen ? (
            <Badge className="bg-green-600 text-white px-3 py-1 text-sm">
              Open for Registration
            </Badge>
          ) : (
            <Badge className="bg-gray-500 text-white px-3 py-1 text-sm">
              Registration Closed
            </Badge>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-2">{event.title}</h2>
        <p className="text-lg text-gray-600 mb-4">{event.subtitle}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <svg className="w-5 h-5 text-[#8B2B3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-lg">{event.dates}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600">
            <svg className="w-5 h-5 text-[#8B2B3E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <svg className="w-5 h-5 text-[#8B2B3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{event.description}</p>

        {/* Registration Button */}
        {event.registrationOpen ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-[#8B2B3E] hover:bg-[#6B1F2E] text-white py-3 text-lg">
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#8B2B3E]">
                  Register for {event.title}
                </DialogTitle>
                <DialogDescription>
                  {event.dates} | {event.location}
                </DialogDescription>
              </DialogHeader>
              <EventRegistrationForm event={event} onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            disabled 
            className="w-full bg-gray-300 text-gray-500 py-3 text-lg cursor-not-allowed"
          >
            Registration Closed
          </Button>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
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
          <EventCard key={event.id} event={event} />
        ))}
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-4">Questions About Our Events?</h2>
          <p className="text-gray-600 mb-6">
            Contact us for more information about any of our upcoming events.
          </p>
          <a 
            href="mailto:info@fatherhoodfoundation.org" 
            className="inline-flex items-center gap-2 text-[#8B2B3E] font-semibold hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@fatherhoodfoundation.org
          </a>
        </div>
      </section>
    </main>
  )
}
