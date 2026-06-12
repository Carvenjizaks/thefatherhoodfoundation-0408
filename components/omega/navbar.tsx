"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"

const PHONE_DISPLAY = "+264 61 000 0000"
const TEL_HREF = "tel:+264610000000"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

export function OmegaNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 bg-[#1a365d] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-[#c9a227] font-bold text-lg leading-none">Ω</span>
          </div>
          <div className="leading-tight">
            <div className="text-[#1a365d] font-bold text-sm">Omega Insurance</div>
            <div className="text-[#718096] text-xs">Brokers · Windhoek</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#1a365d]"
                  : "text-[#2d3748] hover:text-[#1a365d]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={TEL_HREF}
            className="flex items-center gap-2 bg-[#1a365d] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2a4a7f] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Colin
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#1a365d] rounded-lg hover:bg-gray-50"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#f7fafc] text-[#1a365d]"
                  : "text-[#2d3748] hover:bg-[#f7fafc]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={TEL_HREF}
            className="flex items-center justify-center gap-2 bg-[#1a365d] text-white px-4 py-3.5 rounded-lg font-semibold w-full mt-2"
          >
            <Phone className="w-4 h-4" />
            Call Colin: {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </nav>
  )
}
