"use client"

import Image from "next/image"

interface ScrollingImageCarouselProps {
  images: {
    src: string
    alt: string
  }[]
}

export function ScrollingImageCarousel({ images }: ScrollingImageCarouselProps) {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images]

  return (
    <div className="relative w-full overflow-hidden bg-black/90 py-4">
      <div className="flex animate-scroll gap-4">
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 h-[250px] w-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>
        ))}
      </div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/90 to-transparent z-10 pointer-events-none" />
    </div>
  )
}
