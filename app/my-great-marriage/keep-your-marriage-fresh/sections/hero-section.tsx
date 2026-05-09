'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"

const coupleImages = [
  "/images/couples/couple-african.jpg",
  "/images/couples/couple-asian.jpg",
  "/images/couples/couple-hispanic.jpg",
  "/images/couples/couple-mixed.jpg",
  "/images/couples/couple-1.jpg",
]

const carvenQuotes = [
  "Marriage trust breaks down when fear becomes stronger than truth",
  "Healing begins where honesty is met with mercy",
  '"I was wrong" can open a door that defensiveness keeps shut',
  "Your marriage will be tested — but the test is not to destroy you; it is to strengthen what is real",
]

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % coupleImages.length)
    }, 4000)
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % carvenQuotes.length)
    }, 5000)
    return () => {
      clearInterval(imageTimer)
      clearInterval(quoteTimer)
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background sliding images */}
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
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3D1520]/95 via-[#3D1520]/80 to-[#3D1520]/60" />
        </div>
      ))}

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[#D4A574] mb-6">
            My Great Marriage
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "Georgia, serif" }}>
            Keep Your Marriage<br />Fresh
          </h1>
          <p className="text-xl text-white/85 leading-relaxed max-w-xl mb-8">
            Practical tools. Weekly encouragement. A monthly rhythm to stay connected.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="bg-[#D4A574] hover:bg-[#c4955e] text-[#1a0a0e] rounded-full px-8 font-semibold"
            >
              <Link href="#signup">Start Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 bg-transparent"
            >
              <Link href="#how-it-works">Learn More <ArrowDown className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          {/* Rotating Quote */}
          <div className="border-l-2 border-[#D4A574] pl-4 max-w-lg">
            <p className="text-white/80 italic text-sm transition-opacity duration-500">
              &ldquo;{carvenQuotes[currentQuote]}&rdquo;
            </p>
            <p className="text-[#D4A574] text-xs mt-2 font-semibold">— Carven Izaks</p>
          </div>
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {coupleImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-white w-6" : "bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  )
}
