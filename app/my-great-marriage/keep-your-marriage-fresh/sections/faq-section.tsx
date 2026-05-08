"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Is this only for married couples?",
    a: "It is designed primarily for married couples, but engaged couples preparing for covenant can also benefit from the content.",
  },
  {
    q: "Will husbands and wives get the same emails?",
    a: "No. Some emails are shared as a couple, and others are sent separately to husbands and wives so each person receives content tailored to their role.",
  },
  {
    q: "How often will we receive emails?",
    a: "Weekly, following a simple four-week cycle per month. Week one and four are for both of you as a couple. Week two is for the husband. Week three is for the wife.",
  },
  {
    q: "Can we unsubscribe?",
    a: "Yes. Each spouse can manage their preferences individually or unsubscribe at any time using the links in every email.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-28 bg-white px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Questions</span>
          <h2 className="mt-3 text-3xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>Common Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#e8d8c8] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#FDF8F3] transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-[#1a0a0e] text-sm">{faq.q}</span>
                <ChevronDown className={`flex-shrink-0 w-4 h-4 text-[#8B2B3E] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#6b4c52] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
