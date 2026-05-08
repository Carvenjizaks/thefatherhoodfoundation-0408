import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FinalCtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FDF8F3] border-t border-[#e8d8c8] px-6">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Get Started</span>
        <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance" style={{ fontFamily: "Georgia, serif" }}>
          Build a Stronger Marriage, One Intentional Step at a Time
        </h2>
        <p className="mt-4 text-[#6b4c52] leading-relaxed text-balance">
          Your marriage is worth investing in. Sign up today and receive your free Monthly Marriage Check-In template.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-10 font-semibold text-base shadow-lg"
          >
            <Link href="#signup">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
