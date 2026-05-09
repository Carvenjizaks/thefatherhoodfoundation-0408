"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  // Contact form state
  const [contactOpen, setContactOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactError, setContactError] = useState("")

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMessage) return

    setIsSubmitting(true)
    setContactError("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage,
        }),
      })
      if (response.ok) {
        setContactSuccess(true)
        setContactName("")
        setContactEmail("")
        setContactPhone("")
        setContactSubject("")
        setContactMessage("")
      } else {
        const data = await response.json()
        setContactError(data.error || "Failed to send message. Please try again.")
      }
    } catch (err) {
      console.error("Contact form error:", err)
      setContactError("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetContactForm = () => {
    setContactSuccess(false)
    setContactError("")
    setContactOpen(false)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    
    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || "Subscriber"
    
    setIsSubscribing(true)
    setError("")
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          source: "newsletter",
          sourceDetails: "Footer Newsletter Signup",
        }),
      })
      if (response.ok) {
        setSubscribed(true)
        setName("")
        setEmail("")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (err) {
      console.error("Subscription error:", err)
      setError("Connection error. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const links = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Programs", href: "/curriculum" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "FAQ", href: "/faq" },
    { label: "Donate", href: "/donate" },
  ]

  return (
    <footer className="bg-[#8B2B3E] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Main Content - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand & Contact */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="The Fatherhood Foundation"
                width={100}
                height={50}
                className="h-10 w-auto object-contain bg-white rounded p-1"
              />
            </Link>
            <p className="text-white/70 text-sm mb-4">
              Empowering men to become better fathers, husbands, and leaders.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:admin@fathersfound.org" className="text-white/70 hover:text-white flex items-center gap-2 transition-all duration-200 hover:translate-x-1 group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" /> admin@fathersfound.org
              </a>
              <a href="https://www.facebook.com/intensemennamibia/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white flex items-center gap-2 transition-all duration-200 hover:translate-x-1 group">
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" /> Facebook
              </a>
              <span className="text-white/70 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Windhoek, Namibia
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-all duration-200 hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            {subscribed ? (
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-sm">You are Now Subscribed!</p>
                <p className="text-white/70 text-xs mt-1">Check your email to confirm.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm focus:bg-white/15 focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm focus:bg-white/15 focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="h-10 bg-white text-[#8B2B3E] hover:bg-[#D4A574] hover:text-white font-medium text-sm transition-all duration-300 hover:scale-[1.02]"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
                {error && (
                  <p className="text-red-300 text-xs mt-1">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/60">
          <p>© {currentYear} The Fatherhood Foundation</p>
          <div className="flex items-center gap-4">
            <Link href="/partnership" className="hover:text-white">Partnership</Link>
            <Link href="/volunteer-application" className="hover:text-white">Volunteer</Link>
            
            {/* Contact Us Button with Popup */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#8B2B3E] transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact Us
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-[#8B2B3E] text-xl">Contact Us - Request Info</DialogTitle>
                  <DialogDescription>
                    Fill in your details and we will get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                
                {contactSuccess ? (
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-4">Thank you for reaching out. We will get back to you soon.</p>
                    <Button onClick={resetContactForm} className="bg-[#8B6F47] hover:bg-[#6B5737]">
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          required
                          className="border-gray-300 focus:border-[#8B6F47] focus:ring-[#8B6F47]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                        <Input
                          type="email"
                          placeholder="Your email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                          className="border-gray-300 focus:border-[#8B6F47] focus:ring-[#8B6F47]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                        <Input
                          type="tel"
                          placeholder="Your phone (optional)"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="border-gray-300 focus:border-[#8B6F47] focus:ring-[#8B6F47]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                        <Input
                          type="text"
                          placeholder="Subject (optional)"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="border-gray-300 focus:border-[#8B6F47] focus:ring-[#8B6F47]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                      <Textarea
                        placeholder="How can we help you?"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        rows={4}
                        className="border-gray-300 focus:border-[#8B6F47] focus:ring-[#8B6F47] resize-none"
                      />
                    </div>
                    
                    {contactError && (
                      <p className="text-red-600 text-sm">{contactError}</p>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#8B6F47] hover:bg-[#6B5737] text-white transition-all duration-200"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
