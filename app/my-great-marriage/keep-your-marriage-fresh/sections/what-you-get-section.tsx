'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

const coupleImages = [
  "/images/couples/couple-african.jpg",
  "/images/couples/couple-asian.jpg",
  "/images/couples/couple-hispanic.jpg",
  "/images/couples/couple-mixed.jpg",
]

const benefits = [
  "Weekly encouragement for you and your spouse",
  "Monthly check-in template to stay connected",
  "Practical tools for real conversations",
]

export default function WhatYouGetSection() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % coupleImages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 lg:py-28 bg-[#FDF8F3] px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sliding Images */}
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1">
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
              </div>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {coupleImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-white w-6" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What You Get</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Simple tools.<br />Real results.
              </h2>
            </div>

            <p className="text-lg text-[#6b4c52] leading-relaxed">
              No fluff. No overwhelm. Just practical encouragement that meets you where you are — 
              and helps you build something lasting.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#8B2B3E]" />
                  <p className="text-[#1a0a0e] font-medium">{benefit}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#8B6B5A] italic border-l-2 border-[#D4A574] pl-4">
              &ldquo;Healing begins where honesty is met with mercy.&rdquo; — Carven Izaks
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
