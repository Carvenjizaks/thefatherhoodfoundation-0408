"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

const MONTHS = [
  { month: 1, theme: "Build on Christ" },
  { month: 2, theme: "Learn to Hear Each Other" },
  { month: 3, theme: "Love Must Be Demonstrated" },
  { month: 4, theme: "Forgiveness & Grace" },
  { month: 5, theme: "Intimacy & Connection" },
  { month: 6, theme: "Financial Harmony" },
  { month: 7, theme: "Roles & Responsibilities" },
  { month: 8, theme: "Family & Extended Family" },
  { month: 9, theme: "Vision & Purpose Together" },
  { month: 10, theme: "Conflict & Repair" },
  { month: 11, theme: "Rest & Renewal" },
  { month: 12, theme: "Celebrate & Look Ahead" },
]

const QUESTIONS = [
  "What went well for us this month?",
  "What has been hard this month?",
  "How can I support you better right now?",
  "What do we need to improve together?",
  "What are we grateful for this month?",
  "When is our next intentional date?",
  "What pressure are we carrying most right now?",
  "What is one thing we want to protect in our marriage this month?",
  "What is one thing we want to grow in together?",
  "What is our Action Step before next month — diary it now.",
]

type MonthData = {
  completed: boolean
  date: string
  answers: string[]
}

type JourneyData = {
  [key: number]: MonthData
}

const emptyMonth = (): MonthData => ({
  completed: false,
  date: "",
  answers: Array(QUESTIONS.length).fill(""),
})

export default function CheckInClient() {
  const [journey, setJourney] = useState<JourneyData>({})
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const [printMonth, setPrintMonth] = useState<number | null>(null)

  function getMonth(m: number): MonthData {
    return journey[m] ?? emptyMonth()
  }

  function updateAnswer(month: number, index: number, value: string) {
    setJourney(prev => {
      const existing = prev[month] ?? emptyMonth()
      const answers = [...existing.answers]
      answers[index] = value
      return { ...prev, [month]: { ...existing, answers } }
    })
  }

  function updateDate(month: number, value: string) {
    setJourney(prev => {
      const existing = prev[month] ?? emptyMonth()
      return { ...prev, [month]: { ...existing, date: value } }
    })
  }

  function markComplete(month: number) {
    setJourney(prev => {
      const existing = prev[month] ?? emptyMonth()
      return { ...prev, [month]: { ...existing, completed: !existing.completed } }
    })
  }

  function handlePrint(month: number) {
    setPrintMonth(month)
    setTimeout(() => window.print(), 300)
  }

  const completedCount = Object.values(journey).filter(m => m.completed).length
  const currentMonthData = activeMonth ? getMonth(activeMonth) : null
  const currentMonthInfo = activeMonth ? MONTHS.find(m => m.month === activeMonth) : null

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-card { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Print view */}
      {printMonth && (
        <div className="print-only print-card fixed inset-0 bg-white z-50 p-10">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-[#8B6F47] mb-1">The Fatherhood Foundation</p>
            <h1 className="text-3xl font-bold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>Monthly Marriage Check-In</h1>
            <p className="text-[#8B6B5A] mt-1">Month {printMonth} — {MONTHS[printMonth - 1].theme}</p>
          </div>
          <div className="mb-6 flex gap-8 text-sm text-[#3D2314]">
            <span>Date: <span className="border-b border-[#3D1520]/30 inline-block w-32">&nbsp;</span></span>
          </div>
          {QUESTIONS.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-semibold text-[#1a0a0e] mb-2 text-sm" style={{ fontFamily: "Georgia, serif" }}>{i + 1}. {q}</p>
              <div className="space-y-1 ml-4">
                <div className="border-b border-[#e8d8c8] h-5 w-full" />
                <div className="border-b border-[#e8d8c8] h-5 w-full" />
                <div className="border-b border-[#e8d8c8] h-5 w-4/5" />
              </div>
            </div>
          ))}
          <div className="mt-8 text-center text-xs text-[#B09080]">
            The Fatherhood Foundation — My Great Marriage — thefatherhoodfoundation.org
          </div>
        </div>
      )}

      <main className="no-print pt-24 pb-20 bg-[#FDF8F3] min-h-screen">

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-[#8B6F47] mb-2">My Great Marriage</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a0a0e] mb-4 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            Your 12-Month<br />Marriage Journey
          </h1>
          <p className="text-[#6b4c52] text-lg leading-relaxed max-w-2xl">
            Each month, sit together for 20–30 minutes. Be honest, listen well, and use these questions to strengthen your marriage. Diary your action step before you close.
          </p>

          {/* Progress bar */}
          <div className="mt-8 bg-white rounded-2xl border border-[#e8d8c8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#3D2314]">Journey Progress</span>
              <span className="text-sm text-[#8B6B5A]">{completedCount} of 12 months completed</span>
            </div>
            <div className="w-full bg-[#e8d8c8] rounded-full h-2.5">
              <div
                className="bg-[#8B6F47] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 12) * 100}%` }}
              />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {MONTHS.map(({ month }) => {
                const data = journey[month]
                return (
                  <button
                    key={month}
                    onClick={() => setActiveMonth(activeMonth === month ? null : month)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      data?.completed
                        ? "bg-[#8B6F47] text-white"
                        : activeMonth === month
                          ? "bg-[#8B2B3E] text-white"
                          : "bg-[#e8d8c8] text-[#8B6B5A] hover:bg-[#d4c0b0]"
                    }`}
                  >
                    {month}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Month list */}
        <div className="max-w-4xl mx-auto px-6 space-y-3">
          {MONTHS.map(({ month, theme }) => {
            const data = getMonth(month)
            const isOpen = activeMonth === month
            const filledAnswers = data.answers.filter(a => a.trim().length > 0).length

            return (
              <div
                key={month}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isOpen ? "border-[#8B6F47]" : "border-[#e8d8c8] hover:border-[#d4c0b0]"
                }`}
              >
                {/* Month header */}
                <button
                  onClick={() => setActiveMonth(isOpen ? null : month)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      data.completed ? "bg-[#8B6F47] text-white" : "bg-[#fdf8f3] text-[#8B6F47] border border-[#e8d8c8]"
                    }`}>
                      {data.completed ? <CheckCircle2 className="w-5 h-5" /> : month}
                    </span>
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-[#8B6B5A]">Month {month}</p>
                      <p className="font-semibold text-[#1a0a0e]" style={{ fontFamily: "Georgia, serif" }}>{theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {filledAnswers > 0 && (
                      <span className="text-xs text-[#8B6B5A] hidden sm:block">{filledAnswers}/{QUESTIONS.length} answered</span>
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#8B6F47]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8B6B5A]" />
                    )}
                  </div>
                </button>

                {/* Month body */}
                {isOpen && (
                  <div className="px-6 pb-8 border-t border-[#e8d8c8]">
                    {/* Date + controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-[#8B6B5A] font-medium">Date of check-in:</label>
                        <input
                          type="date"
                          value={data.date}
                          onChange={e => updateDate(month, e.target.value)}
                          className="text-sm border border-[#e8d8c8] rounded-lg px-3 py-1.5 text-[#3D2314] bg-[#fdf8f3] focus:outline-none focus:border-[#8B6F47]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrint(month)}
                          className="flex items-center gap-2 text-sm text-[#8B6B5A] hover:text-[#8B6F47] border border-[#e8d8c8] rounded-full px-4 py-2 hover:border-[#8B6F47] transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </button>
                        <button
                          onClick={() => markComplete(month)}
                          className={`flex items-center gap-2 text-sm rounded-full px-4 py-2 transition-all ${
                            data.completed
                              ? "bg-[#8B6F47] text-white"
                              : "border border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47]/10"
                          }`}
                        >
                          {data.completed ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Completed</>
                          ) : (
                            <><Circle className="w-3.5 h-3.5" /> Mark Complete</>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="bg-[#fdf8f3] border-l-4 border-[#8B6F47] rounded-r-xl px-5 py-4 mb-8">
                      <p className="text-sm text-[#6b4c52] italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                        &ldquo;Set aside 20–30 minutes. Sit together, be honest, listen well, and lean in to focus on each other. Use this conversation to strengthen your marriage.&rdquo;
                      </p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      {QUESTIONS.map((question, i) => {
                        const isActionStep = i === QUESTIONS.length - 1
                        return (
                          <div key={i}>
                            <div className="flex items-start gap-3 mb-2">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                                isActionStep ? "bg-[#8B2B3E] text-white" : "bg-[#8B6F47]/15 text-[#8B6F47]"
                              }`}>
                                {i + 1}
                              </span>
                              <label className={`text-sm leading-relaxed font-medium ${isActionStep ? "text-[#8B2B3E]" : "text-[#1a0a0e]"}`} style={{ fontFamily: "Georgia, serif" }}>
                                {isActionStep ? `ACTION STEP — ${question}` : question}
                              </label>
                            </div>
                            <div className="ml-9">
                              <textarea
                                rows={isActionStep ? 3 : 2}
                                placeholder={isActionStep ? "Write your action step here — diary it in your calendar now..." : "Your thoughts..."}
                                value={data.answers[i]}
                                onChange={e => updateAnswer(month, i, e.target.value)}
                                className={`w-full text-sm text-[#3D2314] placeholder:text-[#c0a898] border rounded-xl px-4 py-3 focus:outline-none resize-none transition-colors ${
                                  isActionStep
                                    ? "bg-[#fff5f5] border-[#8B2B3E]/30 focus:border-[#8B2B3E]"
                                    : "bg-[#fdf8f3] border-[#e8d8c8] focus:border-[#8B6F47]"
                                }`}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bottom action */}
                    <div className="mt-8 pt-6 border-t border-[#e8d8c8] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-[#8B6B5A] italic" style={{ fontFamily: "Georgia, serif" }}>
                        Great marriages are built intentionally, one honest conversation at a time.
                      </p>
                      <Button
                        onClick={() => markComplete(month)}
                        className={`rounded-full px-6 transition-all ${
                          data.completed
                            ? "bg-[#8B6F47] hover:bg-[#6d5535] text-white"
                            : "bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
                        }`}
                      >
                        {data.completed ? "Mark as Incomplete" : "Mark Month Complete"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="bg-[#8B6F47] rounded-2xl p-8 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-2">Not yet signed up?</p>
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Receive weekly marriage encouragement
            </h3>
            <p className="text-white/80 mb-6 text-sm leading-relaxed">
              Every Tuesday we send encouragement for couples, husbands, and wives — tailored to your stage in the journey.
            </p>
            <Button asChild className="bg-white text-[#8B6F47] hover:bg-white/90 rounded-full px-8 font-semibold">
              <Link href="/my-great-marriage/keep-your-marriage-fresh">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
