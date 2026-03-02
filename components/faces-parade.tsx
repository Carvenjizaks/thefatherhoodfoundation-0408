"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface FacesParadeProps {
  images: string[]
  scrollSpeed?: number
  enlargedIndices?: number[] // Added prop to specify which images should be enlarged
}

export function FacesParade({ images, scrollSpeed = 50, enlargedIndices = [] }: FacesParadeProps) {
  const [position, setPosition] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  // Duplicate images for seamless looping
  const duplicatedImages = [...images, ...images]

  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url))
  }

  const isEnlarged = (index: number) => {
    const originalIndex = index % images.length
    return enlargedIndices.includes(originalIndex)
  }

  const getImageSize = (index: number) => {
    return isEnlarged(index) ? 92 : 80
  }

  useEffect(() => {
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000 // Convert to seconds
      lastTimeRef.current = currentTime

      setPosition((prevPosition) => {
        const newPosition = prevPosition + scrollSpeed * deltaTime
        const resetPoint = images.length * 100 // 80px width + 20px margin

        // Reset position when first set of images completely scrolls off
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
    <div className="w-full overflow-hidden bg-transparent py-8" ref={containerRef}>
      <div
        className="flex items-center"
        style={{
          transform: `translateX(-${position}px)`,
          willChange: "transform",
        }}
      >
        {duplicatedImages.map((imageUrl, index) => {
          const size = getImageSize(index)
          return (
            <div key={`${imageUrl}-${index}`} className="flex-shrink-0 mr-4">
              {imageErrors.has(imageUrl) ? (
                <div
                  className="rounded-full bg-gray-200 flex items-center justify-center"
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              ) : (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Portrait of a man ${Math.floor(index / 2) + 1}`}
                  width={size}
                  height={size}
                  className="rounded-full object-cover border-2 border-gray-200"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  onError={() => handleImageError(imageUrl)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
