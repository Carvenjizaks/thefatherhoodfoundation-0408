import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDown } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-[#3D1520] py-24 lg:py-36 px-6 overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23D4A574 fill-opacity=0.8%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[#D4A574] mb-6">My Great Marriage</span>
        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Keep Your Marriage Fresh
        </h1>
        <p className="text-lg lg:text-xl text-white/80 leading-relaxed text-balance max-w-2xl mx-auto mb-10">
          Get a practical Monthly Marriage Check-In template and weekly encouragement for husbands, wives, and couples — designed to help you stay connected, communicate better, and build a stronger Christ-centered marriage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button
            asChild
            size="lg"
            className="bg-[#D4A574] hover:bg-[#c4955e] text-[#1a0a0e] rounded-full px-8 font-semibold text-base shadow-lg"
          >
            <Link href="#signup">Get the Free Marriage Check-In</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 bg-transparent"
          >
            <Link href="#how-it-works">See How It Works <ArrowDown className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <p className="text-white/60 text-sm">Free. Practical. Faith-grounded. Built for real marriages.</p>
        <p className="mt-3 text-white/50 text-sm italic">
          For couples who want more than inspiration — and are ready for practical help they can use at home.
        </p>
      </div>
    </section>
  )
}
