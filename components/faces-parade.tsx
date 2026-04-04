import Image from "next/image"

interface FacesParadeProps {
  images: string[]
}

export function FacesParade({ images }: FacesParadeProps) {
  // Duplicate images once for seamless looping (animation moves 50%)
  const duplicatedImages = [...images, ...images]

  return (
    <div className="w-full overflow-hidden bg-transparent py-12">
      <div className="flex items-center gap-10 animate-faces-scroll">
        {duplicatedImages.map((imageUrl, index) => (
          <div 
            key={`face-${index}`} 
            className="flex-shrink-0 group"
          >
            <div className="relative w-[280px] h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
              <Image
                src={imageUrl}
                alt="Portrait of a father"
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
