"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { submitMgmSignup, type SignupFormData } from "../actions"

const initialForm: SignupFormData = {
  husbandFirstName: "",
  husbandLastName: "",
  husbandEmail: "",
  wifeFirstName: "",
  wifeLastName: "",
  wifeEmail: "",
  country: "Namibia",
  city: "",
  anniversaryDate: undefined,
  receiveCoupleEmails: true,
  receiveHusbandEmails: true,
  receiveWifeEmails: true,
}

export default function SignupSection() {
  const [form, setForm] = useState<SignupFormData>(initialForm)
  const [consent1, setConsent1] = useState(false)
  const [consent2, setConsent2] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; alreadyExists?: boolean } | null>(null)
  const [serverError, setServerError] = useState("")

  function set(field: keyof SignupFormData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.husbandFirstName.trim()) e.husbandFirstName = "Required"
    if (!form.husbandLastName.trim()) e.husbandLastName = "Required"
    if (!form.husbandEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.husbandEmail)) e.husbandEmail = "Valid email required"
    if (!form.wifeFirstName.trim()) e.wifeFirstName = "Required"
    if (!form.wifeLastName.trim()) e.wifeLastName = "Required"
    if (!form.wifeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.wifeEmail)) e.wifeEmail = "Valid email required"
    if (!form.country) e.country = "Required"
    if (!consent1) e.consent1 = "Required"
    if (!consent2) e.consent2 = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setServerError("")
    try {
      const res = await submitMgmSignup(form)
      if (res.success) {
        setResult(res)
      } else {
        setServerError(res.error)
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (result?.success) {
    return (
      <section id="signup" className="py-20 lg:py-28 bg-[#FDF8F3] px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl border border-[#e8d8c8] p-12 shadow-sm">
            <div className="w-16 h-16 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#8B2B3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1a0a0e] mb-3" style={{ fontFamily: "Georgia, serif" }}>
              {result.alreadyExists ? "Welcome Back" : "You're In"}
            </h2>
            <p className="text-[#6b4c52] leading-relaxed">
              {result.alreadyExists
                ? "We found your subscription and have resent the welcome email with your Marriage Check-In template."
                : "Your first resource is on its way to your inbox. Each week, we'll send simple encouragement and practical next steps to help keep your marriage fresh and alive."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="signup" className="py-20 lg:py-28 bg-[#FDF8F3] px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Sign Up Free</span>
          <h2 className="mt-3 text-3xl font-bold text-[#1a0a0e] text-balance" style={{ fontFamily: "Georgia, serif" }}>
            Join the My Great Marriage Journey
          </h2>
          <p className="mt-4 text-[#6b4c52]">
            Sign up to receive tools, tips and guidance for Marriage, plus practical weekly or monthly encouragement for husbands, wives, and couples.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8d8c8] p-8 shadow-sm space-y-8" noValidate>
          {/* Husband */}
          <fieldset>
            <legend className="text-xs font-bold tracking-[0.15em] uppercase text-[#D4A574] mb-4">Husband</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="husbandFirstName" className="block text-sm font-semibold text-[#1a0a0e] mb-1">First Name <span aria-hidden>*</span></label>
                <input id="husbandFirstName" type="text" value={form.husbandFirstName} onChange={(e) => set("husbandFirstName", e.target.value)} autoComplete="given-name" className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.husbandFirstName ? "border-red-400" : "border-[#e8d8c8]"}`} />
                {errors.husbandFirstName && <p className="text-xs text-red-500 mt-1">{errors.husbandFirstName}</p>}
              </div>
              <div>
                <label htmlFor="husbandLastName" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Last Name <span aria-hidden>*</span></label>
                <input id="husbandLastName" type="text" value={form.husbandLastName} onChange={(e) => set("husbandLastName", e.target.value)} autoComplete="family-name" className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.husbandLastName ? "border-red-400" : "border-[#e8d8c8]"}`} />
                {errors.husbandLastName && <p className="text-xs text-red-500 mt-1">{errors.husbandLastName}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="husbandEmail" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Email Address <span aria-hidden>*</span></label>
              <input id="husbandEmail" type="email" value={form.husbandEmail} onChange={(e) => set("husbandEmail", e.target.value)} autoComplete="email" className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.husbandEmail ? "border-red-400" : "border-[#e8d8c8]"}`} />
              {errors.husbandEmail && <p className="text-xs text-red-500 mt-1">{errors.husbandEmail}</p>}
            </div>
          </fieldset>

          <div className="border-t border-[#e8d8c8]" />

          {/* Wife */}
          <fieldset>
            <legend className="text-xs font-bold tracking-[0.15em] uppercase text-[#D4A574] mb-4">Wife</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="wifeFirstName" className="block text-sm font-semibold text-[#1a0a0e] mb-1">First Name <span aria-hidden>*</span></label>
                <input id="wifeFirstName" type="text" value={form.wifeFirstName} onChange={(e) => set("wifeFirstName", e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.wifeFirstName ? "border-red-400" : "border-[#e8d8c8]"}`} />
                {errors.wifeFirstName && <p className="text-xs text-red-500 mt-1">{errors.wifeFirstName}</p>}
              </div>
              <div>
                <label htmlFor="wifeLastName" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Last Name <span aria-hidden>*</span></label>
                <input id="wifeLastName" type="text" value={form.wifeLastName} onChange={(e) => set("wifeLastName", e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.wifeLastName ? "border-red-400" : "border-[#e8d8c8]"}`} />
                {errors.wifeLastName && <p className="text-xs text-red-500 mt-1">{errors.wifeLastName}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="wifeEmail" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Email Address <span aria-hidden>*</span></label>
              <input id="wifeEmail" type="email" value={form.wifeEmail} onChange={(e) => set("wifeEmail", e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.wifeEmail ? "border-red-400" : "border-[#e8d8c8]"}`} />
              {errors.wifeEmail && <p className="text-xs text-red-500 mt-1">{errors.wifeEmail}</p>}
            </div>
          </fieldset>

          <div className="border-t border-[#e8d8c8]" />

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Country <span aria-hidden>*</span></label>
              <select id="country" value={form.country} onChange={(e) => set("country", e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40 ${errors.country ? "border-red-400" : "border-[#e8d8c8]"}`}>
                <option value="Namibia">Namibia</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-[#1a0a0e] mb-1">City / Town <span className="text-[#8B6B5A] font-normal">(optional)</span></label>
              <input id="city" type="text" value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40" />
            </div>
          </div>

          <div>
            <label htmlFor="anniversaryDate" className="block text-sm font-semibold text-[#1a0a0e] mb-1">Anniversary Date <span className="text-[#8B6B5A] font-normal">(optional)</span></label>
            <input 
              id="anniversaryDate" 
              type="date" 
              value={form.anniversaryDate ?? ""} 
              onChange={(e) => set("anniversaryDate", e.target.value || undefined)} 
              className="w-full border border-[#e8d8c8] rounded-lg px-4 py-2.5 text-sm text-[#1a0a0e] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2B3E]/40"
            />
            <p className="text-xs text-[#8B6B5A] mt-1">We&apos;ll send you a special congratulations on your anniversary</p>
          </div>

          <div className="border-t border-[#e8d8c8]" />

          {/* Preferences */}
          <fieldset>
            <legend className="text-sm font-bold text-[#1a0a0e] mb-4">Email Preferences</legend>
            <div className="space-y-3">
              {[
                { id: "pref-couple", label: "Send shared couple emails to both of us", checked: form.receiveCoupleEmails, field: "receiveCoupleEmails" as const },
                { id: "pref-husband", label: "Send husband encouragement to husband email", checked: form.receiveHusbandEmails, field: "receiveHusbandEmails" as const },
                { id: "pref-wife", label: "Send wife encouragement to wife email", checked: form.receiveWifeEmails, field: "receiveWifeEmails" as const },
              ].map(({ id, label, checked, field }) => (
                <label key={id} htmlFor={id} className="flex items-center gap-3 cursor-pointer">
                  <input id={id} type="checkbox" checked={checked} onChange={(e) => set(field, e.target.checked)} className="w-4 h-4 accent-[#8B2B3E] rounded" />
                  <span className="text-sm text-[#3D2314]">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="border-t border-[#e8d8c8]" />

          {/* Consent */}
          <fieldset>
            <legend className="text-sm font-bold text-[#1a0a0e] mb-4">Consent</legend>
            <div className="space-y-3">
              <label htmlFor="consent1" className="flex items-start gap-3 cursor-pointer">
                <input id="consent1" type="checkbox" checked={consent1} onChange={(e) => { setConsent1(e.target.checked); if (errors.consent1) setErrors((er) => { const n = {...er}; delete n.consent1; return n }) }} className="mt-0.5 w-4 h-4 accent-[#8B2B3E]" />
                <span className="text-sm text-[#3D2314]">I confirm that both email addresses have given permission to receive these emails.</span>
              </label>
              {errors.consent1 && <p className="text-xs text-red-500 ml-7">{errors.consent1}</p>}

              <label htmlFor="consent2" className="flex items-start gap-3 cursor-pointer">
                <input id="consent2" type="checkbox" checked={consent2} onChange={(e) => { setConsent2(e.target.checked); if (errors.consent2) setErrors((er) => { const n = {...er}; delete n.consent2; return n }) }} className="mt-0.5 w-4 h-4 accent-[#8B2B3E]" />
                <span className="text-sm text-[#3D2314]">I agree to receive marriage encouragement emails and understand I can unsubscribe at any time.</span>
              </label>
              {errors.consent2 && <p className="text-xs text-red-500 ml-7">{errors.consent2}</p>}
            </div>
          </fieldset>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full py-3 font-semibold text-base disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Us the Free Marriage Check-In"}
          </Button>
        </form>
      </div>
    </section>
  )
}
