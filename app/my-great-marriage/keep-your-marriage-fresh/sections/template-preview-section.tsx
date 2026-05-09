'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

const previewQuestions = [
  "What went well for us this month?",
  "What has been hard?",
  "How can I support you better?",
  "What is one action step we will take together?",
]

const cssStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-content {
    display: inline-block;
    animation: marquee 35s linear infinite;
  }
`

const carvenQuotes = [
  "Nothing is more devastating than having your pain used as a weapon against you",
  "Marriage trust breaks down when fear becomes stronger than truth",
  "Healing begins where honesty is met with mercy",
  '"I was wrong" can open a door that defensiveness keeps shut',
]

export default function TemplatePreviewSection() {
  return (
    <>
      {/* Scrolling Quote Banner */}
      <section className="bg-[#8B2B3E] py-4 overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
        <div className="overflow-hidden whitespace-nowrap">
          <div className="marquee-content">
            {[...carvenQuotes, ...carvenQuotes].map((quote, i) => (
              <span key={i} className="inline-flex items-center mx-10">
                <span className="text-white/90 text-sm italic">&ldquo;{quote}&rdquo;</span>
                <span className="ml-3 text-[#D4A574] text-xs font-semibold">— Carven Izaks</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Tool</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>
              Monthly Check-In
            </h2>
            <p className="mt-4 text-[#6b4c52] max-w-xl mx-auto">
              20 minutes. Once a month. Honest conversation. That&apos;s it.
            </p>
          </div>

          {/* Minimal Preview Card */}
          <div className="bg-[#FDF8F3] rounded-2xl border border-[#e8d8c8] overflow-hidden max-w-2xl mx-auto shadow-sm">
            <div className="bg-[#3D1520] px-6 py-5 text-center">
              <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574]">Monthly Marriage Check-In</p>
            </div>

            <div className="p-8 space-y-6">
              {previewQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[#1a0a0e] font-medium" style={{ fontFamily: "Georgia, serif" }}>{q}</p>
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-[#8B6B5A] pt-2 italic">
                + more questions on the full template
              </p>
            </div>

            <div className="bg-[#f0e8e0] px-6 py-4 text-center border-t border-[#e8d8c8]">
              <p className="text-sm text-[#6b4c52] italic">
                Great marriages are built one honest conversation at a time.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              asChild 
              className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8"
            >
              <Link href="#signup">Get the Free Template</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
