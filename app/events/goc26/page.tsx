"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, CheckCircle, Loader2, Gift, Share2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, ScaleIn } from "@/components/ui/motion"
import { useSearchParams } from "next/navigation"

const eventData = {
  id: "goc26",
  title: "Gathering of Champions 2026",
  subtitle: "GOC26 - Annual Men's Conference",
  dates: "17-18 July 2026",
  time: "Friday: 6:00pm-9:00pm | Saturday: 8:00am-5:00pm",
  location: "Windhoek, Namibia",
  price: "NAD 250 per man",
  priceAmount: 250,
  description: "Join hundreds of men from across Namibia for an unforgettable weekend of transformation.",
  gallery: ["/images/hero/men-gathering.jpg", "/images/goc/goc-training-1.jpg", "/images/goc/goc-group-beach.jpg"],
  highlights: [
    { title: "Powerful Teaching", description: "Life-changing messages from seasoned speakers", icon: Star },
    { title: "Authentic Brotherhood", description: "Connect with men on the same journey", icon: Users },
    { title: "Practical Workshops", description: "Hands-on sessions for immediate application", icon: CheckCircle },
    { title: "Worship & Prayer", description: "Encounter God in powerful worship", icon: Gift },
  ],
}

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [registrationCode, setRegistrationCode] = useState("")
  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
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
      if (!response.ok) throw new Error(data.error)
      setRegistrationCode(data.registrationCode)
      setSubmitSuccess(true)
    } catch (err) {
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#8B2B3E] p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Register for GOC26</h2>
          <button onClick={onClose} className="text-white hover:text-white/80">✕</button>
        </div>
        {submitSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
            <div className="bg-[#8B2B3E] text-white rounded-lg p-6 mb-6">
              <p className="text-sm text-white/80">Your Registration Code</p>
              <p className="text-3xl font-bold">{registrationCode}</p>
            </div>
            <Link href={`/events/goc26/refer?code=${registrationCode}`}>
              <Button className="bg-[#D4A574] text-[#3D2314] font-semibold mb-4">Refer Friends</Button>
            </Link>
            <br />
            <Button onClick={onClose} className="bg-[#8B2B3E]">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {refCode && <div className="bg-blue-50 text-blue-700 p-3 rounded">You were invited by a friend! Code: {refCode}</div>}
            <input type="text" placeholder="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input type="tel" placeholder="Phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <Button type="submit" className="w-full bg-[#8B2B3E] text-white py-3" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Complete Registration"}
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

  useEffect(() => {
    if (refCode) setTimeout(() => setShowRegistration(true), 500)
  }, [refCode])

  useEffect(() => {
    const interval = setInterval(() => setActiveImage((prev) => (prev + 1) % eventData.gallery.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            {eventData.gallery.map((img, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === activeImage ? "opacity-100" : "opacity-0"}`}>
                <Image src={img} alt={`GOC26 ${index + 1}`} fill className="object-cover" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              </div>
            ))}
          </div>
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <Badge className="bg-[#D4A574] text-[#3D2314] mb-4">Annual Men's Conference</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{eventData.title}</h1>
                <p className="text-xl text-white/90 mb-6">{eventData.subtitle}</p>
                <div className="flex flex-wrap gap-4 mb-8 text-white/80">
                  <span className="flex items-center gap-2"><Calendar className="w-5 h-5" />{eventData.dates}</span>
                  <span className="flex items-center gap-2"><Clock className="w-5 h-5" />{eventData.time}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-5 h-5" />{eventData.location}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setShowRegistration(true)} className="bg-[#D4A574] hover:bg-[#b8935f] text-[#3D2314] font-semibold px-8 py-6 text-lg">
                    Register Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/events/goc26/refer">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                      <Share2 className="w-5 h-5 mr-2" />Refer Friends
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#8B2B3E] mb-8">Step Into Your Destiny</h2>
            <p className="text-lg text-gray-700">Join hundreds of men from across Namibia for an unforgettable weekend of transformation. The Gathering of Champions is a divine appointment for men serious about becoming the leaders God designed them to be.</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#8B2B3E] mb-12 text-center">What to Expect</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {eventData.highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <h.icon className="w-8 h-8 text-[#8B2B3E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B2B3E] mb-2">{h.title}</h3>
                  <p className="text-gray-600">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-[#8B2B3E] to-[#6B1B2E] text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Become a Champion?</h2>
            <p className="text-white/80 mb-8">Register now and secure your spot at GOC26.</p>
            <Button onClick={() => setShowRegistration(true)} className="bg-[#D4A574] hover:bg-[#b8935f] text-[#3D2314] font-semibold px-8 py-6 text-lg">
              Register for GOC26 <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-white/60 mt-6">{eventData.price} • {eventData.dates}</p>
          </div>
        </section>

        {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
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
