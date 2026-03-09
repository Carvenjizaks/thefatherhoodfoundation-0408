"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Calendar, Clock, MapPin, Heart, Users, MessageCircle, Sparkles, Shield, ArrowLeft } from "lucide-react"

const eventDetails = {
  id: "mgm-may-2026",
  slug: "mgm-may-2026",
  title: "MyGreatMarriage Conference 2026",
  theme: "Taking Your Marriage from Good to Great",
  dates: "1 May 2026",
  time: "Thursday: 6:00pm-8:30pm | Friday: 6:30pm-9:00pm | Saturday: 8:30am-1:00pm",
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
            <h2 className="text-xl font-bold text-white">{eventDetails.title}</h2>
            <p className="text-white/80 text-sm mt-1">{eventDetails.dates} | {eventDetails.location}</p>
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
                <p><strong>Amount Due:</strong> {eventDetails.price}</p>
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
              <p className="text-2xl font-bold text-[#8B2B3E]">{eventDetails.price}</p>
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

export default function MyGreatMarriagePage() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <main className="min-h-screen pt-20 lg:pt-24 bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={eventDetails.banner}
            alt={eventDetails.title}
            fill
            priority
            className="object-cover"
          />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12 max-w-7xl mx-auto">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
            <Badge className="bg-green-600 text-white px-3 py-1 text-sm w-fit mb-4">
              Registration Open
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2">{eventDetails.title}</h1>
            <p className="text-xl lg:text-2xl text-white/90 italic">{eventDetails.theme}</p>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="bg-[#8B2B3E] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-4 text-white">
            <Users className="w-8 h-8" />
            <span className="text-lg lg:text-xl font-semibold">This event is for:</span>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">Couples</Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">Newly Weds</Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">Planning to Get Married</Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">Those Who Want to Rekindle the Fire</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Introduction */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-6">
                  Are You Ready to Elevate Your Marriage to New Heights?
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Join us at the annual MyGreatMarriage Conference, where we believe that every marriage 
                  has the potential for greatness, regardless of how many years you&apos;ve been together. 
                  This transformative event is designed to help you and your spouse build a stronger, 
                  more fulfilling relationship.
                </p>
              </div>

              {/* Key Focus Areas */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-8">Key Focus Areas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {keyFocusAreas.map((area, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-[#8B2B3E]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center">
                          <area.icon className="w-6 h-6 text-[#8B2B3E]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{area.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {area.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#8B2B3E] mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Attend */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-6">Why Attend?</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {whyAttend.map((reason, index) => (
                    <div key={index} className="flex items-center gap-3 bg-[#8B2B3E]/5 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-[#8B2B3E] flex-shrink-0" />
                      <span className="font-medium text-gray-800">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-[#8B2B3E] rounded-2xl p-8 text-center">
                <p className="text-xl lg:text-2xl text-white italic leading-relaxed">
                  &ldquo;Good marriages don&apos;t happen by accident. They are built intentionally, 
                  one day at a time. Join us and invest in the most important relationship of your life!&rdquo;
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Event Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#8B2B3E]/20">
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-6">Event Details</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#8B2B3E]" />
                      <div>
                        <p className="font-semibold">{eventDetails.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#8B2B3E] mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>Thursday: 6:00pm - 8:30pm</p>
                        <p>Friday: 6:30pm - 9:00pm</p>
                        <p>Saturday: 8:30am - 1:00pm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#8B2B3E]" />
                      <p className="text-gray-600">{eventDetails.location}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Registration Fee</p>
                    <p className="text-3xl font-bold text-[#8B2B3E]">{eventDetails.price}</p>
                  </div>

                  <Button
                    onClick={() => setShowRegistration(true)}
                    className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] py-3 h-12 text-lg"
                  >
                    Register Now
                  </Button>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-2xl p-6 border">
                  <h3 className="font-semibold text-[#8B2B3E] mb-4">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bank:</strong> FNB</p>
                    <p><strong>Account:</strong> The FATHERHOOD FOUNDATION</p>
                    <p><strong>Acc No:</strong> 64279664451</p>
                    <p><strong>Branch:</strong> 282273</p>
                    <p><strong>Reference:</strong> Name + Cellphone</p>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <a
                      href="https://site.paytoday.com.na"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Pay via PayToday
                    </a>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <h3 className="font-semibold mb-2">Questions?</h3>
                  <p className="text-sm text-gray-600 mb-2">Contact us at:</p>
                  <a href="mailto:info@thefathersfoundations.org" className="text-[#8B2B3E] font-medium hover:underline">
                    info@thefathersfoundations.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
    </main>
  )
}
