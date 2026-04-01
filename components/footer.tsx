"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubscribing(true)
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Newsletter",
          lastName: "Subscriber",
          email,
          source: "newsletter",
          sourceDetails: "Footer Newsletter Signup",
        }),
      })
      if (response.ok) {
        setSubscribed(true)
        setEmail("")
      }
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Curriculum", href: "/curriculum" },
    { label: "Events", href: "/events" },
    { label: "Donate", href: "/donate" },
  ]

  const programs = [
    { label: "Table Talk for Men", href: "/mentoring-men" },
    // { label: "ActiveParenting", href: "/active-parenting" }, // Hidden - activate later
    { label: "MyGreatMarriage", href: "/my-great-marriage" },
    { label: "Social Impact", href: "/community-development" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/intensemennamibia/", label: "Facebook" },
  ]

  return (
    <footer className="relative bg-[#8B2B3E] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section - CTA Banner */}
        <div className="py-12 lg:py-16 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-balance">
                Join Our Mission to Transform Men, Who Will Bring Transformation to Their Families and Impact Community and the Marketplace
              </h2>
              <p className="text-white/70 text-balance">
                Subscribe to receive updates on events, resources, and ways to get involved.
              </p>
            </div>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-white bg-white/10 px-6 py-4 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 min-w-[280px]"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="h-12 bg-white text-[#8B2B3E] hover:bg-white/90 font-semibold px-8 transition-all duration-300 hover:scale-105"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section - Links Grid */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="The Fatherhood Foundation Logo"
                  width={120}
                  height={60}
                  className="h-14 w-auto object-contain bg-white rounded-lg p-1.5 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              </div>
              <span className="font-bold text-lg">The Fatherhood Foundation</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Empowering men to become better fathers, husbands, and leaders through mentorship and community support.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#8B2B3E] transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              Our Programs
            </h3>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* International */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              International
            </h3>
            <div className="space-y-3">
              <a 
                href="https://thefatherfoundation.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  The Father Foundation
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
              <p className="text-white/50 text-sm">
                Roberts Burdett leading the charge
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:info@thefatherhoodfoundation.org"
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
                >
                  <Mail className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                  <span>info@thefatherhoodfoundation.org</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+264811234567"
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
                >
                  <Phone className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                  <span>+264 81 123 4567</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Windhoek, Namibia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {currentYear} The Fatherhood Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/volunteer-application" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Volunteer
            </Link>
            <Link 
              href="/partnership" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Partnership
            </Link>
            <Link 
              href="/donate" 
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
