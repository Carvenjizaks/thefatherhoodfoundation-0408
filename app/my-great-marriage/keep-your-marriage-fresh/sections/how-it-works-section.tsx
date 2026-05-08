const steps = [
  {
    number: "01",
    title: "Sign Up as a Couple",
    body: "Both you and your spouse add join. Takes less than two minutes. You will get regular updates, advise, guidance on relationships as it pertains to marriage.",
  },
  {
    number: "02",
    title: "Get Your Free Check-In Template",
    body: "You receive the Monthly Marriage Check-In immediately in your welcome email.",
  },
  {
    number: "03",
    title: "Receive Weekly Encouragement",
    body: "Each week you receive practical, faith-grounded content tailored for husbands, wives, and couples.",
  },
  {
    number: "04",
    title: "Complete Your Monthly Marriage Check-In Together",
    body: "Once a month, sit together for 20–30 minutes, work through the questions, and grow stronger.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#3D1520] px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">How It Works</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white text-balance" style={{ fontFamily: "Georgia, serif" }}>
            Simple. Practical. Built Around Your Life.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-5">
              <span className="flex-shrink-0 text-4xl font-bold text-[#D4A574]/40" style={{ fontFamily: "Georgia, serif" }}>{step.number}</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
