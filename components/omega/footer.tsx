import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

const PHONE_DISPLAY = "+264 61 000 0000"
const TEL_HREF = "tel:+264610000000"
const WHATSAPP_HREF = "https://wa.me/264610000000"
const EMAIL = "colin@omegainsurance.com.na"

export function OmegaFooter() {
  return (
    <footer className="bg-[#1a365d] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#c9a227] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#1a365d] font-bold text-lg leading-none">Ω</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm">Omega Insurance Brokers</div>
                <div className="text-white/60 text-xs">Est. 2008 · Windhoek</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Trusted insurance advice for Namibian families and businesses. NAMFISA registered. 17+ years of experience.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-[#c9a227]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Colin</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-[#c9a227]">Contact Colin</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={TEL_HREF} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-white/70">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Windhoek, Namibia<br />Mon–Fri · 08:00–17:00</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Omega Financial Services (Proprietary) Limited. All rights reserved.</p>
          <p className="font-medium text-white/70">NAMFISA Registered Insurance Broker</p>
        </div>
      </div>
    </footer>
  )
}
