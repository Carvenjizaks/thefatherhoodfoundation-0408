"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

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

export default function CheckInClient() {
  function handlePrint() {
    window.print()
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 !important; padding: 40px !important; }
        }
      `}</style>

      <main className="pt-24 pb-20 px-6 bg-[#FDF8F3] min-h-screen no-print-bg">
        {/* Actions bar */}
        <div className="no-print max-w-3xl mx-auto flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574]">My Great Marriage</p>
            <h1 className="text-2xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>Monthly Marriage Check-In</h1>
          </div>
          <Button onClick={handlePrint} className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
        </div>

        {/* Printable card */}
        <div className="print-page max-w-3xl mx-auto bg-white rounded-2xl border border-[#e8d8c8] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#3D1520] px-10 py-8 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-[#D4A574] mb-1">The Fatherhood Foundation</p>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>Monthly Marriage Check-In</h2>
            <p className="text-white/70 text-sm">My Great Marriage</p>
          </div>

          {/* Intro */}
          <div className="px-10 py-8 border-b border-[#e8d8c8] bg-[#fdf8f3]">
            <p className="text-[#3D2314] leading-relaxed text-sm">
              Set aside 20–30 minutes once a month. Sit together, be honest, listen well, pray, and use this conversation to strengthen your marriage.
            </p>
            <p className="mt-3 text-xs text-[#8B6B5A] italic">
              &ldquo;Let all that you do be done in love.&rdquo; — 1 Corinthians 16:14
            </p>

            {/* Date field */}
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-[#8B6B5A] font-medium">Date:</span>
                <div className="border-b border-[#3D1520]/30 w-32 h-5" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#8B6B5A] font-medium">Month:</span>
                <div className="border-b border-[#3D1520]/30 w-28 h-5" />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="px-10 py-8 space-y-8">
            {questions.map((q, i) => (
              <div key={i}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <p className="text-[#1a0a0e] font-medium leading-relaxed text-sm" style={{ fontFamily: "Georgia, serif" }}>{q}</p>
                </div>
                <div className="ml-9 space-y-2">
                  <div className="border-b border-[#e8d8c8] h-5 w-full" />
                  <div className="border-b border-[#e8d8c8] h-5 w-full" />
                  <div className="border-b border-[#e8d8c8] h-5 w-4/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-10 py-6 bg-[#fdf8f3] border-t border-[#e8d8c8] text-center">
            <p className="text-sm text-[#6b4c52] italic" style={{ fontFamily: "Georgia, serif" }}>
              Great marriages are built intentionally, one honest conversation at a time.
            </p>
            <p className="mt-2 text-xs text-[#B09080]">The Fatherhood Foundation — My Great Marriage — thefatherhoodfoundation.org</p>
          </div>
        </div>

        <div className="no-print max-w-3xl mx-auto mt-8 text-center">
          <p className="text-[#6b4c52] text-sm">
            Not yet receiving the weekly encouragement?{" "}
            <a href="/my-great-marriage/keep-your-marriage-fresh" className="text-[#8B2B3E] font-semibold hover:underline">
              Sign up free
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
