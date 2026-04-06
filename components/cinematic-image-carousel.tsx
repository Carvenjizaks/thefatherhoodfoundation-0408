"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  {
    src: "/images/hero-men-talking.jpg",
    alt: "Diverse group of men having genuine conversation at outdoor gathering",
  },
  {
    src: "/images/hero-father-son.jpg",
    alt: "Father playing catch with his son in the backyard",
  },
  {
    src: "/images/hero-community-service.jpg",
    alt: "Men volunteering together at a community building project",
  },
  {
    src: "/images/hero-father-daughter.jpg",
    alt: "Father reading with his daughter on the porch",
  },
  {
    src: "/images/hero-couple-relaxing.jpg",
    alt: "Couple walking hand-in-hand through autumn park",
  },
  {
    src: "/images/hero-family-dinner.jpg",
    alt: "Multi-generational family enjoying dinner together",
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

      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
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
