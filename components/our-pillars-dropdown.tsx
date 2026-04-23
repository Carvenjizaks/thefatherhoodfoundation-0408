"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface PillarLink {
  label: string
  href: string
  isSerif?: boolean
}

const pillars: PillarLink[] = [
  { label: "Monthly Table Talk", href: "/mentoring-men" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Curriculum for Men", href: "/curriculum" },
  // { label: "ActiveParenting", href: "/active-parenting" }, // Hidden - activate later
  { label: "MGM26Conference", href: "/events/my-great-marriage-2026" },
  { label: "Missions for Men", href: "/missions-for-men" },
  { label: "Social Impact", href: "/community-development" },
  { label: "Admin", href: "/admin" },
]

export function OurPillarsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="text-sm text-foreground/80 hover:text-foreground transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Our Pillars
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-[10000]">
          {pillars.map((pillar, index) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className={`block px-4 py-3 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors ${
                index !== pillars.length - 1 ? "border-b border-border/50" : ""
              } ${pillar.isSerif ? "font-serif italic" : ""}`}
            >
              {pillar.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
