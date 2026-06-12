const items = [
  { label: "NAMFISA Registered" },
  { label: "17 Years Experience" },
  { label: "24+ Yrs Team Expertise" },
  { label: "Independent Broker" },
]

export function TrustBar() {
  return (
    <div className="sticky top-16 z-40 bg-[#1a365d] text-white md:static md:top-auto">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-shrink-0 text-xs md:text-sm">
            <span className="text-[#c9a227] font-bold">✓</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
