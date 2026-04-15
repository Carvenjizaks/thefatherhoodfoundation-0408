"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OurPillarsDropdown } from "./our-pillars-dropdown"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/impact", label: "Our Impact" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/events", label: "Events" },
    { href: "/curriculum", label: "Curriculum for Men" },
    { href: "/partnership", label: "Partnership" },
    { href: "/get-involved", label: "Get Involved" },
  ]

  const mobilePillarLinks = [
    { href: "/mentoring-men", label: "Monthly Table Talk for Men" },
    // { href: "/active-parenting", label: "ActiveParenting" }, // Hidden - activate later
    { href: "/events/my-great-marriage-2026", label: "MGM26Conference" },
    { href: "/community-development", label: "Social Impact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled ? "bg-background border-b border-border shadow-sm" : "bg-background/95 backdrop-blur-md"
      }`}
      style={{ pointerEvents: "auto" }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="The Fatherhood Foundation Logo"
              width={50}
              height={50}
              loading="eager"
              priority
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white"
            />
            <span className="text-sm lg:text-base font-semibold text-foreground sr-only lg:not-sr-only">
              The Fatherhood Foundation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm whitespace-nowrap transition-colors px-2.5 xl:px-3 py-2 rounded-md group ${
                    isActive 
                      ? "text-[#8B2B3E] font-medium bg-[#8B2B3E]/5" 
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-[#8B2B3E] transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              )
            })}
            <OurPillarsDropdown />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden border-t border-border bg-background transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
          }`}
          style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
        >
          <div className="py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-base transition-colors ${
                    isActive 
                      ? "text-[#8B2B3E] font-medium bg-[#8B2B3E]/5 border-l-4 border-[#8B2B3E]" 
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-4 py-2 text-sm font-semibold text-foreground/60">Our Pillars</div>
              {mobilePillarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 text-base transition-colors ${
                      isActive 
                        ? "text-[#8B2B3E] font-medium bg-[#8B2B3E]/5 border-l-4 border-[#8B2B3E]" 
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
