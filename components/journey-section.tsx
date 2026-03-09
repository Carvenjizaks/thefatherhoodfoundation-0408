"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

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
      "There is transformative power when a father affirms a son or daughter. Many men have never been embraced or affirmed by their father. We believe this is what breaks and heals the father wound and prepares men for their destiny. Strong men create strong sons.",
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
  index,
  isVisible,
}: {
  step: (typeof steps)[0]
  index: number
  isVisible: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Animated Icon Container */}
      <div className="relative mb-8 group">
        {/* Pulsing glow effect */}
        <div
          className={`absolute inset-0 bg-[#8B2B3E]/30 rounded-full blur-2xl transition-all duration-1000 ${
            isVisible ? "scale-110 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ transitionDelay: `${index * 200 + 300}ms` }}
        />
        {/* Rotating ring */}
        <div
          className={`absolute -inset-2 rounded-full border-2 border-dashed border-[#8B2B3E]/40 transition-all duration-1000 ${
            isVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
          }`}
          style={{
            transitionDelay: `${index * 200 + 200}ms`,
            animation: isVisible ? "spin 20s linear infinite" : "none",
          }}
        />
        {/* Image container with hover effect */}
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-[#8B2B3E] shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500">
          <Image src={step.image} alt={step.alt} fill className="object-cover" />
        </div>
      </div>

      {/* Step badge with animation */}
      <div
        className={`bg-[#8B2B3E] text-white text-sm font-bold px-5 py-1.5 rounded-full mb-4 shadow-md transition-all duration-500 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: `${index * 200 + 400}ms` }}
      >
        STEP {step.step}
      </div>

      {/* Title with animation */}
      <h3
        className={`text-2xl lg:text-3xl font-bold text-[#8B2B3E] mb-6 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `${index * 200 + 500}ms` }}
      >
        {step.title}
      </h3>

      {/* Card with animation */}
      <Card
        className={`w-full h-full border-2 border-[#8B2B3E]/10 hover:border-[#8B2B3E]/30 hover:shadow-xl transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: `${index * 200 + 600}ms` }}
      >
        <CardContent className="p-6 lg:p-8">
          <p className="text-foreground/80 leading-relaxed text-pretty text-center">{step.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function JourneySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
    <section ref={sectionRef} className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
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
          {/* Animated Connection Line - Hidden on mobile */}
          <div
            className={`hidden lg:block absolute top-20 left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-[#8B2B3E] to-transparent z-0 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          />

          {/* Animated dots on the line */}
          <div className="hidden lg:flex absolute top-[76px] left-[15%] right-[15%] justify-between z-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 bg-[#8B2B3E] rounded-full transition-all duration-500 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ transitionDelay: `${800 + i * 200}ms` }}
              />
            ))}
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 relative z-10">
            {steps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} isVisible={isVisible} />
            ))}
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
