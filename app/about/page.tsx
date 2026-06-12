import type { Metadata } from "next"
import { Phone, MessageCircle, Shield, Award, Users } from "lucide-react"
import { TrustBar } from "@/components/omega/trust-bar"

const TEL_HREF = "tel:+264610000000"
const WHATSAPP_HREF = "https://wa.me/264610000000"

export const metadata: Metadata = {
  title: "About Colin Van Wyk | Omega Insurance Brokers",
  description:
    "Meet Colin Van Wyk, founder of Omega Insurance Brokers. 17 years of trusted, NAMFISA-registered insurance advice in Namibia.",
  alternates: { canonical: "https://omegainsurance.com.na/about" },
}

const team = [
  {
    initials: "CV",
    name: "Colin Van Wyk",
    role: "Founder & Managing Director",
    bio: "17+ years in insurance. Founded Omega in 2008.",
  },
  {
    initials: "TM",
    name: "Team Member",
    role: "Senior Insurance Broker",
    bio: "8+ years of client advisory experience.",
  },
  {
    initials: "CS",
    name: "Team Member",
    role: "Client Services",
    bio: "Ensuring every client gets the support they need.",
  },
]

const partners = ["Old Mutual", "Hollard", "Alexander Forbes", "Momentum", "Liberty"]

export default function AboutPage() {
  return (
    <>
      <TrustBar />

      {/* Page Hero */}
      <section className="bg-[#1a365d] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
          <h1 className="font-[family-name:var(--font-inter)] text-3xl md:text-5xl font-bold text-white mb-5">
            Real People. Real Advice.
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            Omega Insurance Brokers was built on a single belief: Namibians deserve insurance advice from someone they
            can trust — and call.
          </p>
        </div>
      </section>

      {/* Colin's Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">The Founder</p>
              <h2 className="font-[family-name:var(--font-inter)] text-3xl font-bold text-[#1a365d] mb-5">
                Colin&apos;s Story
              </h2>
              <div className="space-y-4 text-[#2d3748] leading-relaxed">
                <p>
                  In 2008, Colin founded Omega with a simple belief: Namibians deserve insurance advice they can trust.
                  17 years later, that belief hasn&apos;t changed.
                </p>
                <p>
                  Colin is an independent broker — which means he works for you, not for any one insurance company.
                  Colin compares the market, explains your options plainly, and makes sure you only pay for cover that
                  actually protects you.
                </p>
                <p>
                  Colin is just a call away. Always. That&apos;s not a tagline — it&apos;s how he&apos;s built 17 years
                  of trusted relationships across Windhoek.
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <div className="text-center">
                  <p className="font-[family-name:var(--font-inter)] text-3xl font-bold text-[#1a365d]">17+</p>
                  <p className="text-sm text-[#718096]">Years Experience</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="font-[family-name:var(--font-inter)] text-3xl font-bold text-[#1a365d]">24+</p>
                  <p className="text-sm text-[#718096]">Yrs Team Expertise</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="font-[family-name:var(--font-inter)] text-3xl font-bold text-[#1a365d]">2008</p>
                  <p className="text-sm text-[#718096]">Est. in Namibia</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-2xl bg-[#f7fafc] border-4 border-[#c9a227] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[#1a365d] flex items-center justify-center mx-auto mb-3 border-4 border-[#c9a227]">
                    <span className="text-white font-bold text-3xl">CV</span>
                  </div>
                  <p className="font-bold text-[#1a365d]">Colin Van Wyk</p>
                  <p className="text-sm text-[#c9a227] font-semibold">Founder, 2008</p>
                  <p className="text-xs text-[#718096] mt-1">Photo coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 bg-[#f7fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">The Team</p>
            <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-bold text-[#1a365d]">
              Meet The Team
            </h2>
            <p className="text-[#718096] mt-3">24+ years of collective insurance expertise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-[#1a365d] flex items-center justify-center mx-auto mb-4 border-3 border-[#c9a227]">
                  <span className="text-white font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="font-[family-name:var(--font-inter)] font-bold text-[#1a365d] mb-1">{member.name}</h3>
                <p className="text-[#c9a227] text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-[#718096] text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials & Partners */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">Credentials</p>
          <h2 className="font-[family-name:var(--font-inter)] text-3xl font-bold text-[#1a365d] mb-12">
            Registered &amp; Trusted
          </h2>

          {/* NAMFISA badge */}
          <div className="inline-flex items-center gap-3 bg-[#1a365d] text-white px-6 py-4 rounded-xl mb-12">
            <Shield className="w-6 h-6 text-[#c9a227]" />
            <div className="text-left">
              <p className="font-bold">NAMFISA Registered</p>
              <p className="text-white/70 text-sm">Namibia Financial Institutions Supervisory Authority</p>
            </div>
          </div>

          {/* Partners */}
          <div>
            <p className="text-[#718096] text-sm font-semibold uppercase tracking-wider mb-6">
              We Work With Leading Insurers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map((p) => (
                <div
                  key={p}
                  className="bg-[#f7fafc] border border-gray-100 px-5 py-3 rounded-xl font-semibold text-[#1a365d] text-sm"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-[#1a365d]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-[family-name:var(--font-inter)] text-2xl font-bold text-white mb-2">
            Ready to Speak to Colin?
          </h2>
          <p className="text-white/70 mb-6">One call is all it takes.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={TEL_HREF}
              className="flex items-center justify-center gap-2 bg-white text-[#1a365d] px-6 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex-1 min-h-[48px]"
            >
              <Phone className="w-4 h-4" /> Call Colin
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
