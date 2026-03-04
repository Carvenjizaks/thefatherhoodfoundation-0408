"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface FacesParadeProps {
  images: string[]
  scrollSpeed?: number
}

export function FacesParade({ images, scrollSpeed = 30 }: FacesParadeProps) {
  const [position, setPosition] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const lastTimeRef = useRef<number>(0)

  // Duplicate images for seamless looping
  const duplicatedImages = [...images, ...images]

  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url))
  }

  useEffect(() => {
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000
      lastTimeRef.current = currentTime

      setPosition((prevPosition) => {
        const newPosition = prevPosition + scrollSpeed * deltaTime
        const resetPoint = images.length * 340 // 300px width + 40px gap

        if (newPosition >= resetPoint) {
          return 0
        }

        return newPosition
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [images.length, scrollSpeed])

  return (
    <div className="w-full overflow-hidden bg-transparent py-12" ref={containerRef}>
      <div
        className="flex items-center gap-10"
        style={{
          transform: `translateX(-${position}px)`,
          willChange: "transform",
        }}
      >
        {duplicatedImages.map((imageUrl, index) => (
          <div 
            key={`${imageUrl}-${index}`} 
            className="flex-shrink-0 group"
          >
            {imageErrors.has(imageUrl) ? (
              <div className="w-[280px] h-[350px] rounded-2xl bg-white/20 border-4 border-white/40 flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            ) : (
              <div className="relative w-[280px] h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Portrait of a father`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(imageUrl)}
                />
                {/* Album photo effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
