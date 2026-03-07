"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"

interface Book {
  title: string
  bannerTitle: string
  image: string
}

interface BooksCarouselProps {
  books: Book[]
}

export function BooksCarousel({ books }: BooksCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const positionRef = useRef<number>(0)
  const isPausedRef = useRef<boolean>(false)

  // Duplicate books for seamless infinite loop
  const doubled = [...books, ...books]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const speed = 0.6 // px per frame

    const animate = () => {
      if (!isPausedRef.current) {
        positionRef.current += speed
        // Reset once we've scrolled through the first set
        const halfWidth = track.scrollWidth / 2
        if (positionRef.current >= halfWidth) {
          positionRef.current = 0
        }
        track.style.transform = `translateX(-${positionRef.current}px)`
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => (isPausedRef.current = true)}
      onMouseLeave={() => (isPausedRef.current = false)}
    >
      <div ref={trackRef} className="flex gap-8 will-change-transform py-4" style={{ width: "max-content" }}>
        {doubled.map((book, index) => (
          <a
            key={index}
            href={`#book-${index % books.length}`}
            className="flex-shrink-0 group cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            {/* 3D Book Container */}
            <div
              className="relative w-44 sm:w-52 lg:w-60 h-60 sm:h-72 lg:h-80 transition-transform duration-500 group-hover:scale-105"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-15deg)",
              }}
            >
              {/* Book Cover (Front) */}
              <div
                className="absolute inset-0 overflow-hidden rounded-r-sm"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: "6px 6px 18px rgba(0,0,0,0.4), 2px 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 240px"
                  className="object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Title overlay */}
                <div className="absolute inset-0 flex items-end p-4">
                  <h3
                    className="font-black uppercase tracking-wide leading-tight text-white"
                    style={{
                      fontSize: "clamp(1rem, 3vw, 1.5rem)",
                      textShadow: "1px 2px 6px rgba(0,0,0,0.9)",
                    }}
                  >
                    {book.bannerTitle}
                  </h3>
                </div>
              </div>

              {/* Book Spine (Left Edge) */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700"
                style={{
                  width: "20px",
                  transform: "rotateY(90deg) translateZ(10px) translateX(-10px)",
                  boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5)",
                }}
              />

              {/* Book Pages (Right Edge - Dark) */}
              <div
                className="absolute top-1 right-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900"
                style={{
                  width: "18px",
                  height: "calc(100% - 8px)",
                  transform: "translateX(8px)",
                  boxShadow: "inset -2px 0 6px rgba(0,0,0,0.6), inset 1px 0 2px rgba(255,255,255,0.05)",
                  backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px)",
                }}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
