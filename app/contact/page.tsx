import type { Metadata } from "next"
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react"
import { TrustBar } from "@/components/omega/trust-bar"

const PHONE_DISPLAY = "+264 61 000 0000"
const TEL_HREF = "tel:+264610000000"
const WHATSAPP_HREF = "https://wa.me/264610000000"
const EMAIL = "colin@omegainsurance.com.na"

export const metadata: Metadata = {
  title: "Contact Colin | Omega Insurance Brokers",
  description:
    "Call or WhatsApp Colin Van Wyk directly. NAMFISA-registered insurance broker in Windhoek, Namibia. No forms — just real conversations.",
  alternates: { canonical: "https://omegainsurance.com.na/contact" },
}

export default function ContactPage() {
  return (
    <>
      <TrustBar />

      {/* Page Hero */}
      <section className="bg-[#1a365d] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider mb-3">Get In Touch</p>
          <h1 className="font-[family-name:var(--font-inter)] text-3xl md:text-5xl font-bold text-white mb-5">
            Talk to Colin Directly
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            No contact forms. No waiting room. Colin picks up the phone — or replies on WhatsApp.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Phone */}
          <a
            href={TEL_HREF}
            className="flex items-center gap-5 bg-[#1a365d] text-white p-6 rounded-2xl hover:bg-[#2a4a7f] transition-colors group"
          >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium mb-0.5">Call Colin directly</p>
              <p className="font-[family-name:var(--font-inter)] text-xl font-bold">{PHONE_DISPLAY}</p>
              <p className="text-white/60 text-xs mt-1">Tap to call now</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 bg-[#25D366] text-white p-6 rounded-2xl hover:bg-[#20b958] transition-colors group"
          >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-0.5">WhatsApp Colin</p>
              <p className="font-[family-name:var(--font-inter)] text-xl font-bold">{PHONE_DISPLAY}</p>
              <p className="text-white/70 text-xs mt-1">Opens WhatsApp — no download needed on desktop</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-5 bg-[#f7fafc] border border-gray-100 text-[#2d3748] p-6 rounded-2xl hover:border-[#c9a227] transition-colors group"
          >
            <div className="w-14 h-14 bg-[#1a365d] rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-7 h-7 text-[#c9a227]" />
            </div>
            <div>
              <p className="text-[#718096] text-sm font-medium mb-0.5">Email Colin</p>
              <p className="font-[family-name:var(--font-inter)] text-lg font-bold text-[#1a365d]">{EMAIL}</p>
              <p className="text-[#718096] text-xs mt-1">For formal inquiries — Colin responds same day</p>
            </div>
          </a>
        </div>

        {/* Office info */}
        <div className="max-w-2xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-[#f7fafc] p-5 rounded-xl border border-gray-100">
            <MapPin className="w-5 h-5 text-[#c9a227] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1a365d] text-sm mb-0.5">Office</p>
              <p className="text-[#718096] text-sm">Windhoek, Namibia</p>
              <p className="text-[#718096] text-xs mt-1">(Full address on request)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-[#f7fafc] p-5 rounded-xl border border-gray-100">
            <Clock className="w-5 h-5 text-[#c9a227] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1a365d] text-sm mb-0.5">Office Hours</p>
              <p className="text-[#718096] text-sm">Monday – Friday</p>
              <p className="text-[#718096] text-sm">08:00 – 17:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <section className="py-12 px-4 bg-[#f7fafc] border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#1a365d] font-[family-name:var(--font-inter)] font-semibold text-lg mb-2">
            No forms. No waiting. No robots.
          </p>
          <p className="text-[#718096] text-sm">
            Colin answers personally. In Namibia, insurance is built on relationships — and that starts with a real
            conversation.
          </p>
        </div>
      </section>
    </>
  )
}
