import { Heart, MessageSquare, Cross, Home } from "lucide-react"

const cards = [
  {
    icon: Heart,
    title: "Stay Connected",
    body: "Strong marriages do not stay strong by accident. They grow through intentional rhythms.",
  },
  {
    icon: MessageSquare,
    title: "Strengthen Communication",
    body: "Learn to talk honestly, listen well, and support each other under pressure.",
  },
  {
    icon: Cross,
    title: "Grow Spiritually",
    body: "Keep Jesus at the center of your home, not only your Sunday life.",
  },
  {
    icon: Home,
    title: "Build Real Habits",
    body: "Use practical tools that help your marriage at home, not just during events.",
  },
]

export default function WhySection() {
  return (
    <section className="py-20 lg:py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Why It Matters</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance" style={{ fontFamily: "Georgia, serif" }}>
            A Strong Marriage Takes Intentional Investment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-[#FDF8F3] rounded-2xl p-8 border border-[#e8d8c8] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#8B2B3E]/10 rounded-full flex items-center justify-center mb-5">
                <card.icon className="w-5 h-5 text-[#8B2B3E]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a0a0e] mb-3">{card.title}</h3>
              <p className="text-sm text-[#6b4c52] leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
