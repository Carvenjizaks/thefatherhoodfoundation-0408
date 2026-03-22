"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Identity",
    image: "/images/step-identity.jpg",
    alt: "Identity - Self discovery",
    description:
      "A man must see himself accurately—through the lens of truth, not distortion. This is the foundation of correct identity. To end fatherlessness, we must lead men to discover who they really are. This understanding informs and empowers every responsibility a man carries in his life.",
  },
  {
    step: 2,
    title: "Affirmation",
    image: "/images/step-affirmation.jpg",
    alt: "Affirmation - Father-son connection",
    description:
      "There is transformative power when a father affirms a son or daughter. Many men have never been embraced or affirmed by their father. We believe this is what breaks and heals the father wound and prepares men for their destiny. Men secure in their manhood, create strong sons.",
  },
  {
    step: 3,
    title: "Purpose",
    image: "/images/step-purpose.jpg",
    alt: "Purpose - Destiny and calling",
    description:
      "The best gift a father can give his son is to connect him to his purpose. Purpose identified produces passion! Every man is meant to lead others toward something greater. We believe that once a man has a clear identity and has been affirmed by a father, he must be launched into his purpose.",
  },
]

function StepCard({
  step,
  isActive,
  isVisible,
  onClick,
}: {
  step: (typeof steps)[0]
  isActive: boolean
  isVisible: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer transition-all duration-700 ease-out ${
        isActive ? "scale-100 opacity-100" : "scale-90 opacity-60"
      } ${isVisible ? "translate-y-0" : "translate-y-12 opacity-0"}`}
    >
      {/* Animated Icon Container */}
      <div className="relative mb-8 group">
        {/* Pulsing glow effect */}
        <div
          className={`absolute inset-0 bg-[#8B2B3E]/30 rounded-full blur-2xl transition-all duration-1000 ${
            isActive && isVisible ? "scale-125 opacity-100" : "scale-75 opacity-0"
          }`}
        />
        {/* Rotating ring */}
        <div
          className={`absolute -inset-2 rounded-full border-2 border-dashed border-[#8B2B3E]/40 transition-all duration-1000 ${
            isActive && isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            animation: isActive && isVisible ? "spin 20s linear infinite" : "none",
          }}
        />
        {/* Image container with hover effect */}
        <div className={`relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 shadow-xl transition-all duration-500 ${
          isActive ? "border-[#8B2B3E] scale-110 shadow-2xl" : "border-[#8B2B3E]/40"
        }`}>
          <Image src={step.image} alt={step.alt} fill className="object-cover" />
        </div>
      </div>

      {/* Step badge with animation */}
      <div
        className={`text-white text-sm font-bold px-5 py-1.5 rounded-full mb-4 shadow-md transition-all duration-500 ${
          isActive ? "bg-[#8B2B3E] scale-110" : "bg-[#8B2B3E]/60 scale-100"
        }`}
      >
        STEP {step.step}
      </div>

      {/* Title with animation */}
      <h3
        className={`text-2xl lg:text-3xl font-bold mb-6 transition-all duration-500 ${
          isActive ? "text-[#8B2B3E]" : "text-[#8B2B3E]/60"
        }`}
      >
        {step.title}
      </h3>
    </div>
  )
}

export function JourneySection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % steps.length)
  }, [])

  const prevStep = useCallback(() => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)
  }, [])

  // Auto-slide effect
  useEffect(() => {
    if (isVisible && !isPaused) {
      intervalRef.current = setInterval(() => {
        nextStep()
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, isPaused, nextStep])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header with staggered animation */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            className={`text-xl lg:text-2xl font-bold text-[#8B2B3E]/80 mb-4 tracking-[0.3em] uppercase transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            Identity &bull; Affirmation &bull; Purpose
          </h2>
          <h3
            className={`text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            The Journey to Authentic Manhood
          </h3>
          <p
            className={`text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto text-balance transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            The fundamental solution for the fatherlessness problem can be categorized into 3 areas of a man&apos;s life
          </p>
        </div>

        <div className="relative">
          {/* Progress Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="h-1 bg-[#8B2B3E]/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8B2B3E] transition-all duration-500 ease-out"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    i <= activeStep ? "text-[#8B2B3E]" : "text-[#8B2B3E]/40"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevStep}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-6 h-6 text-[#8B2B3E]" />
          </button>
          <button
            onClick={nextStep}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Next step"
          >
            <ChevronRight className="w-6 h-6 text-[#8B2B3E]" />
          </button>

          {/* Step Cards - Carousel on mobile, Grid on desktop */}
          <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-16 relative z-10">
            {steps.map((step, index) => (
              <StepCard 
                key={step.step} 
                step={step} 
                isActive={index === activeStep}
                isVisible={isVisible}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeStep * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div key={step.step} className="w-full flex-shrink-0 px-4">
                  <StepCard 
                    step={step} 
                    isActive={index === activeStep}
                    isVisible={isVisible}
                    onClick={() => setActiveStep(index)}
                  />
                </div>
              ))}
            </div>
            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === activeStep ? "bg-[#8B2B3E] scale-125" : "bg-[#8B2B3E]/30"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Active Step Description Card */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card
              className={`border-2 border-[#8B2B3E]/20 shadow-xl transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#8B2B3E] text-white text-sm font-bold px-4 py-1 rounded-full">
                    STEP {steps[activeStep].step}
                  </span>
                  <h4 className="text-2xl font-bold text-[#8B2B3E]">{steps[activeStep].title}</h4>
                </div>
                <p className="text-foreground/80 leading-relaxed text-pretty text-lg">
                  {steps[activeStep].description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CSS Animation for rotating ring */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
