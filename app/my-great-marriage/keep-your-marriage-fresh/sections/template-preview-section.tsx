import { Button } from "@/components/ui/button"
import Link from "next/link"

const questions = [
  "What went well for us this month?",
  "What has been hard this month?",
  "How can I support you better right now?",
  "What do we need to improve?",
  "What are we grateful for?",
  "When is our next date night?",
  "What pressure are we feeling most right now?",
  "What is one thing we want to protect in our marriage this month?",
  "What is one prayer request we are carrying together?",
  "What is one action step we will take before next month?",
]

export default function TemplatePreviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Tool</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance" style={{ fontFamily: "Georgia, serif" }}>
            Monthly Marriage Check-In
          </h2>
          <p className="mt-4 text-[#6b4c52] max-w-xl mx-auto">
            Set aside 20–30 minutes once a month or go sit at a quiet place. Sit together, be honest, listen well, lean in to focus on each other, and use this conversation to strengthen your marriage.
          </p>
        </div>

        {/* Preview card */}
        <div className="bg-[#FDF8F3] rounded-2xl border border-[#e8d8c8] overflow-hidden shadow-sm max-w-3xl mx-auto">
          <div className="bg-[#3D1520] px-8 py-6 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574] mb-1">The Fatherhood Foundation</p>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Monthly Marriage Check-In</h3>
          </div>

          <div className="p-8">
            <p className="text-xs italic text-[#8B6B5A] mb-6 text-center">&ldquo;Let all that you do be done in love and out of love - It&apos;s a decision&rdquo;.</p>
            <div className="space-y-5">
              {questions.slice(0, 5).map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a0a0e] mb-2" style={{ fontFamily: "Georgia, serif" }}>{q}</p>
                    <div className="border-b border-[#d8c8b8] h-4 w-full" />
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-[#8B6B5A] pt-2">+ 5 more questions on the full template</p>
            </div>
          </div>

          <div className="bg-[#f0e8e0] px-8 py-5 border-t border-[#e8d8c8] text-center">
            <p className="text-sm text-[#6b4c52] italic" style={{ fontFamily: "Georgia, serif" }}>
              Great marriages are built intentionally, one honest conversation at a time.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline" className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full px-8 bg-transparent">
            <Link href="#signup">Sign Up for Weekly Emails</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
