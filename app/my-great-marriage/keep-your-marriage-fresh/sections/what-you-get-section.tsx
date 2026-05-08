import { CheckCircle2 } from "lucide-react"

const items = [
  { label: "Free Monthly Marriage Check-In Template", desc: "A printable and downloadable tool for your monthly conversation." },
  { label: "Weekly Couples Email", desc: "Encouragement and a practical action for both of you together." },
  { label: "Weekly Husband Encouragement", desc: "Tailored content sent directly to the husband." },
  { label: "Weekly Wife Encouragement", desc: "Tailored content sent directly to the wife." },
  { label: "Monthly Reminder to Review and Reconnect", desc: "A gentle nudge to complete your check-in each month." },
  { label: "Practical Faith-Based Marriage Tools", desc: "Biblically grounded, practically useful guidance for real life." },
  { label: "Short Prayer Prompts", desc: "Simple prayers you can use together or individually." },
  { label: "Date Night and Reflection Prompts", desc: "Ideas to help you stay connected and enjoy each other." },
]

export default function WhatYouGetSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FDF8F3] px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What You Get</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance" style={{ fontFamily: "Georgia, serif" }}>
            Everything You Need to Keep Your Marriage Alive
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-4 bg-white rounded-xl p-6 border border-[#e8d8c8] hover:shadow-sm transition-shadow">
              <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-[#8B2B3E] mt-0.5" />
              <div>
                <p className="font-semibold text-[#1a0a0e] mb-1">{item.label}</p>
                <p className="text-sm text-[#6b4c52] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
