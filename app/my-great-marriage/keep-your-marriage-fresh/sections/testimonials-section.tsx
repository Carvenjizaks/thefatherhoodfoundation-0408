const testimonials = [
  {
    quote: "The marriage enrichment program gave us tools to communicate better. Our marriage has never been stronger.",
    author: "Couple from Windhoek, Namibia",
  },
  {
    quote: "We learned new ways to love and support each other. The weekly emails have kept us consistent.",
    author: "Couple from Cape Town, South Africa",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#f0e8e0] px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-bold tracking-[0.2em] uppercase text-[#8B6B5A] mb-8">Practical tools. Biblical truth. A stronger marriage at home.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="bg-white rounded-2xl p-8 border border-[#e8d8c8] shadow-sm">
              <p className="text-[#3D2314] leading-relaxed italic mb-4" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="text-sm text-[#8B6B5A] font-medium">— {t.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
