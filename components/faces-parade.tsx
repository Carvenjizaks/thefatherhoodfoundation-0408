"use client"

import Image from "next/image"

interface FacesParadeProps {
  images: string[]
}

export function FacesParade({ images }: FacesParadeProps) {
  // Duplicate images for seamless looping
  const duplicatedImages = [...images, ...images, ...images]

  return (
    <div className="w-full overflow-hidden bg-transparent py-12">
      <div className="flex items-center gap-10 animate-scroll">
        {duplicatedImages.map((imageUrl, index) => (
          <div 
            key={`${imageUrl}-${index}`} 
            className="flex-shrink-0 group"
          >
            <div className="relative w-[280px] h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Portrait of a father"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-320px * ${images.length}));
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
