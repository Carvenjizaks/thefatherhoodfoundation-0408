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
      <div ref={trackRef} className="flex gap-4 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((book, index) => (
          <a
            key={index}
            href={`#book-${index % books.length}`}
            className="flex-shrink-0 w-72 sm:w-80 lg:w-96 group cursor-pointer"
          >
            <div className="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden rounded-lg border-2 border-primary/20 hover:border-primary transition-colors duration-300">
              <Image
                src={book.image || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Title overlay */}
              <div className="absolute inset-0 flex items-end p-4 sm:p-5">
                <h3
                  className="font-black uppercase tracking-wide leading-tight text-white"
                  style={{
                    fontSize: "clamp(1.25rem, 4vw, 2rem)",
                    textShadow: "1px 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  {book.bannerTitle}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
