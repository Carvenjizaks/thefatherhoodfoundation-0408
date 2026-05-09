'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

const coupleImages = [
  "/images/couples/couple-mixed.jpg",
  "/images/couples/couple-african.jpg",
  "/images/couples/couple-asian.jpg",
]

export default function FinalCtaSection() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % coupleImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Sliding background */}
      {coupleImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentImage ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={src}
            alt="Couple"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#3D1520]/85" />
        </div>
      ))}

      <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Your marriage is worth it.
        </h2>
        <p className="text-white/80 text-lg mb-4">
          Start with something simple. See where it leads.
        </p>
        <p className="text-[#D4A574] text-sm italic mb-8">
          &ldquo;Your marriage will be tested — but the test is not to destroy you; it is to strengthen what is real.&rdquo; — Carven Izaks
        </p>
        <Button
          asChild
          size="lg"
          className="bg-[#D4A574] hover:bg-[#c4955e] text-[#1a0a0e] rounded-full px-10 font-semibold"
        >
          <Link href="#signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  )
}
