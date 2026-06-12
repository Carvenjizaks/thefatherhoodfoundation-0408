import type { Metadata } from "next"
import Link from "next/link"
import { Phone, MessageCircle, Mail, Shield, Star, Users, Award } from "lucide-react"
import { TrustBar } from "@/components/omega/trust-bar"

const PHONE_DISPLAY = "+264 61 000 0000"
const TEL_HREF = "tel:+264610000000"
const WHATSAPP_HREF = "https://wa.me/264610000000"
const EMAIL = "colin@omegainsurance.com.na"

export const metadata: Metadata = {
  title: "Omega Insurance | Trusted Broker in Windhoek | Colin Van Wyk",
  description:
    "17 years of trusted insurance advice in Namibia. Colin Van Wyk, NAMFISA-registered broker. Call or WhatsApp today.",
  alternates: { canonical: "https://omegainsurance.com.na" },
}

const testimonials = [
  {
    quote:
      "Colin didn't just sell us insurance — he made sure we understood exactly what we were buying. For the first time, we feel truly protected.",
    name: "Sarah M.",
    location: "Windhoek",
  },
  {
    quote:
      "I've been with Colin for over 10 years. He always picks up the phone and gives honest advice. Never once tried to upsell me.",
    name: "Johan P.",
    location: "Klein Windhoek",
  },
  {
    quote:
      "When my business had a claim, Colin handled everything personally. That's the difference between an advisor and a salesman.",
    name: "David N.",
    location: "Windhoek",
  },
]

const services = [
  {
    icon: Shield,
    title: "Personal Insurance",
    desc: "Life, health, home, and vehicle insurance for you and your family.",
  },
  {
    icon: Award,
    title: "Business Insurance",
    desc: "Commercial, liability, and employee benefits for businesses of all sizes.",
  },
  {
    icon: Star,
    title: "Retirement Planning",
    desc: "Retirement annuities, pension planning, and estate planning.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* Trust Bar — sticky below navbar on mobile */}
      <TrustBar />

      {/* Hero */}
      <section className="bg-[#1a365d] py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-[family-name:var(--font-inter)] text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
              Trusted Insurance Advice for Namibian Families &amp; Businesses
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
              For 17 years, Colin Van Wyk and the Omega team have helped Namibians protect what matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={TEL_HREF}
                className="flex items-center justify-center gap-2.5 bg-white text-[#1a365d] px-6 py-4 rounded-xl font-bold text-base hover:bg-gray-50 transition-colors min-h-[48px] flex-1 sm:flex-none"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                Call Colin: {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 border-2 border-[#c9a227] text-[#c9a227] px-6 py-4 rounded-xl font-bold text-base hover:bg-[#c9a227] hover:text-[#1a365d] transition-colors min-h-[48px] flex-1 sm:flex-none"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                WhatsApp Colin
              </a>
            </div>
          </div>

          {/* Colin photo placeholder */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/10 border-4 border-[#c9a227] flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center gap-2 text-white/60">
                  <Users className="w-16 h-16 md:w-20 md:h-20" />
                  <span className="text-sm font-medium">Colin Van Wyk</span>
                  <span className="text-xs opacity-70">Photo coming soon</span>
                </div>
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-2 -right-2 md:bottom-4 md:-right-6 bg-[#c9a227] text-[#1a365d] rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="font-bold text-2xl leading-none">17</span>
                <span className="text-xs font-semibold leading-tight">Years</span>
                <span className="text-xs font-semibold leading-tight">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Colin */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">Meet Your Advisor</p>
          <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-bold text-[#1a365d] mb-6">
            Meet Colin &amp; The Team
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8 text-left bg-[#f7fafc] rounded-2xl p-8 mt-8">
            <div className="w-28 h-28 rounded-full bg-[#1a365d] flex items-center justify-center flex-shrink-0 border-4 border-[#c9a227]">
              <span className="text-white font-bold text-3xl">CV</span>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#1a365d] mb-1">
                Colin Van Wyk
              </h3>
              <p className="text-[#c9a227] font-semibold text-sm mb-3">Founder &amp; Managing Director</p>
              <p className="text-[#2d3748] leading-relaxed">
                Colin Van Wyk founded Omega in 2008 with a simple belief: Namibians deserve insurance advice they can
                trust. 17 years later, that belief hasn&apos;t changed. Colin is just a phone call away — always.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#1a365d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a4a7f] transition-colors"
            >
              Get to Know Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#f7fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">Social Proof</p>
            <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-bold text-[#1a365d]">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#c9a227] text-[#c9a227]" />
                  ))}
                </div>
                <blockquote className="text-[#2d3748] leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1a365d] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a365d]">{t.name}</p>
                    <p className="text-xs text-[#718096]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">What We Do</p>
            <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-bold text-[#1a365d]">
              How We Can Help
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="bg-[#f7fafc] rounded-2xl p-8 border border-gray-100 hover:border-[#c9a227] transition-colors"
              >
                <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#c9a227]" />
                </div>
                <h3 className="font-[family-name:var(--font-inter)] text-lg font-bold text-[#1a365d] mb-2">
                  {title}
                </h3>
                <p className="text-[#718096] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-[#1a365d]">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Talk?
          </h2>
          <p className="text-white/70 text-lg mb-8">Colin is just a call or message away.</p>
          <div className="flex flex-col gap-3">
            <a
              href={TEL_HREF}
              className="flex items-center justify-center gap-2.5 bg-white text-[#1a365d] px-6 py-4 rounded-xl font-bold text-base hover:bg-gray-50 transition-colors min-h-[48px]"
            >
              <Phone className="w-5 h-5" />
              Call Colin Now
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 border-2 border-[#c9a227] text-[#c9a227] px-6 py-4 rounded-xl font-bold text-base hover:bg-[#c9a227] hover:text-[#1a365d] transition-colors min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Colin
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors py-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              {EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
