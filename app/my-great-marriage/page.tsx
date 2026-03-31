import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageSquare, Shield, Heart, Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyGreatMarriage | The Fatherhood Foundation",
  description:
    "Build a thriving marriage through proven principles, practical tools, and supportive community for couples.",
}

const focusAreas = [
  {
    icon: MessageSquare,
    title: "Communication",
    desc: "Learn to listen deeply and express yourself clearly and lovingly.",
  },
  {
    icon: Shield,
    title: "Conflict Resolution",
    desc: "Navigate disagreements constructively and emerge stronger together.",
  },
  {
    icon: Heart,
    title: "Intimacy & Romance",
    desc: "Keep the spark alive and deepen emotional and physical connection.",
  },
  {
    icon: Sparkles,
    title: "Shared Vision",
    desc: "Align your goals and dreams to build a unified future together.",
  },
]

const offerings = [
  {
    title: "Marriage Workshops",
    desc: "6-week courses covering essential marriage skills, from communication to finances to intimacy.",
  },
  {
    title: "Couples Retreats",
    desc: "Weekend getaways designed to help you reconnect, refresh, and reignite your relationship.",
  },
  {
    title: "Small Groups",
    desc: "Join other couples in ongoing groups for support, accountability, and shared growth.",
  },
]

export default function MyGreatMarriagePage() {
  return (
    <>
      <Header />

      <main className="pt-20">

        {/* Hero */}
        <section className="bg-[#FDF8F3] border-b border-[#e8d8c8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-7">
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#8B2B3E] border border-[#8B2B3E]/30 px-4 py-2 rounded-full">
                  Two Unique Prints, One Heart
                </span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1a0a0e] leading-tight text-balance">
                  Build the Marriage You&apos;ve Always Dreamed Of
                </h1>
                <p className="text-lg text-[#6b4c52] leading-relaxed">
                  Through proven principles, expert guidance, and a supportive community, discover how to strengthen your bond and thrive together.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#4a2830]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8B2B3E] inline-block" />
                    Expert Guidance
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4A574] inline-block" />
                    Proven Results
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8B2B3E] inline-block" />
                    Community Support
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    size="lg"
                    className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8 font-semibold"
                    asChild
                  >
                    <Link href="/get-involved" className="flex items-center gap-2">
                      Register Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full px-8 font-semibold bg-transparent"
                    asChild
                  >
                    <Link href="#overview">Learn More</Link>
                  </Button>
                </div>
              </div>

              <div className="relative h-[460px] lg:h-[520px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/couples/couple-together-1.jpg"
                  alt="Happy couple"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section id="overview" className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                <Image
                  src="/images/couples/couple-together-1.jpg"
                  alt="Couple connecting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">The Programme</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1a0a0e] leading-snug text-balance">
                  Invest in Your Most Important Relationship
                </h2>
                <p className="text-[#6b4c52] leading-relaxed">
                  MyGreatMarriage provides couples with the tools, principles, and support needed to build a thriving
                  relationship. Through workshops, retreats, and couple&apos;s groups, you&apos;ll learn effective communication,
                  conflict resolution, and how to maintain romance and intimacy throughout your marriage.
                </p>
                <p className="text-[#6b4c52] leading-relaxed">
                  Whether you&apos;re engaged, newlyweds, or have been married for decades, this program will help you
                  strengthen your bond and create the marriage you&apos;ve always desired.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8"
                >
                  <Link href="/get-involved" className="flex items-center gap-2">
                    Strengthen Your Marriage <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Focus Areas */}
        <section className="py-20 lg:py-28 bg-[#FDF8F3]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">What You&apos;ll Learn</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">Proven Strategies for a Strong Marriage</h2>
              <p className="mt-4 text-[#6b4c52] max-w-xl mx-auto">
                Practical tools and timeless principles that work at every stage of your marriage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {focusAreas.map((area) => (
                <div
                  key={area.title}
                  className="bg-white border border-[#e8d8c8] rounded-2xl p-8 flex flex-col items-start gap-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                    <area.icon className="w-6 h-6 text-[#8B2B3E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a0a0e] mb-2">{area.title}</h3>
                    <p className="text-[#6b4c52] text-sm leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider quote */}
        <section className="bg-[#8B2B3E] py-14">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-xl lg:text-2xl italic text-white/90 leading-relaxed text-balance">
              &ldquo;Good marriages don&apos;t happen by accident. They are built intentionally, one day at a time.&rdquo;
            </p>
          </div>
        </section>

        {/* Program Offerings */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">How We Help</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1a0a0e]">Programme Offerings</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {offerings.map((item) => (
                <div
                  key={item.title}
                  className="border-t-2 border-[#8B2B3E] pt-8 space-y-4"
                >
                  <h3 className="text-xl font-bold text-[#1a0a0e]">{item.title}</h3>
                  <p className="text-[#6b4c52] leading-relaxed">{item.desc}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full mt-2 bg-transparent"
                  >
                    <Link href="/get-involved">Learn More</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-[#FDF8F3] border-t border-[#e8d8c8]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Get Started</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a0a0e] text-balance">
              Build the Marriage You&apos;ve Always Wanted
            </h2>
            <p className="text-[#6b4c52] leading-relaxed text-balance">
              Your marriage is worth investing in. Take the next step toward a stronger, more fulfilling relationship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white rounded-full px-8 font-semibold"
              >
                <Link href="/get-involved" className="flex items-center gap-2">
                  Join MyGreatMarriage <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/5 rounded-full px-8 bg-transparent"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
