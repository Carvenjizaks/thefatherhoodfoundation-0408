"use client"

const quotes = [
  "He that wants to be the greatest must become a servant.",
  "Being a male is a matter of birth, but being a man is a matter of choice.",
  "Once you make a decision, your decision makes you.",
  "The greatest husband serves his wife well.",
  "Winners are not those who never fail, but those who never quit.",
]

export function QuotesTicker() {
  // Duplicate quotes for seamless loop
  const allQuotes = [...quotes, ...quotes]

  return (
    <div className="w-full bg-[#8B2B3E] py-4 overflow-hidden relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#8B2B3E] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#8B2B3E] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {allQuotes.map((quote, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8">
            <span className="text-[#D4A574] text-lg font-bold select-none">&ldquo;</span>
            <span className="text-white font-medium text-sm lg:text-base tracking-wide">{quote}</span>
            <span className="text-[#D4A574] text-lg font-bold select-none">&rdquo;</span>
            <span className="text-[#D4A574] mx-4 select-none">&#9670;</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
