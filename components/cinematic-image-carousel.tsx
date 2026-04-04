"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  {
    src: "/images/hero-men-talking.jpg",
    alt: "Men in meaningful conversation together",
  },
  {
    src: "/images/hero-father-son.jpg",
    alt: "Father and son walking together",
  },
  {
    src: "/images/hero-father-daughter.jpg",
    alt: "Father playing with daughter",
  },
  {
    src: "/images/hero-couple-relaxing.jpg",
    alt: "Couple relaxing together",
  },
]

export function CinematicImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(heroImages.length - 1)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex)
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* All images stacked with Ken Burns effect */}
      {heroImages.map((image, index) => {
        const isActive = index === currentIndex
        const isPrev = index === prevIndex
        
        return (
          <div
            key={image.src}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              isActive 
                ? "opacity-100 z-20 scale-100" 
                : isPrev 
                  ? "opacity-0 z-10 scale-110" 
                  : "opacity-0 z-0 scale-100"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                isActive ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        )
      })}

      {/* Layered gradient overlays for cinematic effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B2B3E]/40 via-transparent to-transparent z-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-30" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 z-30" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
      }} />

      {/* Floating overlay particles for depth */}
      <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-[#D4A574]/30 rounded-full animate-float-slow" />
        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-white/20 rounded-full animate-float-medium" />
        <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-[#D4A574]/40 rounded-full animate-float-fast" />
        <div className="absolute top-[60%] right-[25%] w-2 h-2 bg-white/15 rounded-full animate-float-slow" />
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPrevIndex(currentIndex)
              setCurrentIndex(index)
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? "w-8 bg-white" 
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
