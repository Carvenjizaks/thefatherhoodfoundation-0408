import type { Metadata } from "next"
import { Phone, MessageCircle, Shield, Briefcase, TrendingUp, CheckCircle } from "lucide-react"
import { TrustBar } from "@/components/omega/trust-bar"

const TEL_HREF = "tel:+264610000000"
const PHONE_DISPLAY = "+264 61 000 0000"
const WHATSAPP_HREF = "https://wa.me/264610000000"

export const metadata: Metadata = {
  title: "Services | Omega Insurance Brokers",
  description:
    "Personal insurance, business insurance, and retirement planning in Namibia. NAMFISA-registered broker Colin Van Wyk. Call today.",
  alternates: { canonical: "https://omegainsurance.com.na/services" },
}

const services = [
  {
    icon: Shield,
    title: "Personal Insurance",
    subtitle: "Life, health, home, and vehicle insurance for you and your family.",
    items: ["Life Cover", "Short-Term Insurance", "Home & Contents", "Vehicle Insurance", "Medical Aid Advice"],
  },
  {
    icon: Briefcase,
    title: "Business Insurance",
    subtitle: "Commercial, liability, and employee benefits for businesses of all sizes.",
    items: [
      "Commercial Insurance",
      "Public Liability",
      "Professional Indemnity",
      "Employee Benefits",
      "Business Continuity",
    ],
  },
  {
    icon: TrendingUp,
    title: "Retirement & Estate Planning",
    subtitle: "Retirement annuities, pension planning, and estate planning.",
    items: ["Retirement Annuities", "Pension Funds", "Estate Planning", "Legacy Planning", "Preservation Funds"],
  },
]

export default function ServicesPage() {
  return (
    <>
      <TrustBar />

      {/* Page Hero */}
      <section className="bg-[#1a365d] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">What We Do</p>
          <h1 className="font-[family-name:var(--font-inter)] text-3xl md:text-5xl font-bold text-white mb-5">
            How Omega Can Help You
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Colin doesn&apos;t just sell insurance — Colin finds the right cover for your situation and makes sure you
            understand what you&apos;re buying.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, subtitle, items }, i) => (
              <div key={i} className="bg-[#f7fafc] rounded-2xl p-8 border border-gray-100">
                <div className="w-14 h-14 bg-[#1a365d] rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#c9a227]" />
                </div>
                <h2 className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#1a365d] mb-2">
                  {title}
                </h2>
                <p className="text-[#718096] text-sm leading-relaxed mb-6">{subtitle}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#2d3748]">
                      <CheckCircle className="w-4 h-4 text-[#c9a227] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Colin */}
      <section className="py-16 px-4 bg-[#f7fafc]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-inter)] text-2xl md:text-3xl font-bold text-[#1a365d] mb-4">
            Why an Independent Broker?
          </h2>
          <p className="text-[#2d3748] leading-relaxed mb-2">
            Colin is independent — he works for you, not for any one insurer. That means Colin compares the full
            market to find the right cover at the right price.
          </p>
          <p className="text-[#718096] text-sm">No bias. No quotas. Just honest advice.</p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-[#1a365d]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-[family-name:var(--font-inter)] text-2xl font-bold text-white mb-2">
            Not Sure What You Need?
          </h2>
          <p className="text-white/70 mb-6">Call Colin. One conversation is all it takes.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={TEL_HREF}
              className="flex items-center justify-center gap-2 bg-white text-[#1a365d] px-6 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex-1 min-h-[48px]"
            >
              <Phone className="w-4 h-4" />
              Call Colin: {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-[#c9a227] text-[#c9a227] px-6 py-3.5 rounded-xl font-bold hover:bg-[#c9a227] hover:text-[#1a365d] transition-colors flex-1 min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
