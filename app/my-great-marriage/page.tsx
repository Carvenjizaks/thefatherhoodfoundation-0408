import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, MessageSquare, Shield, Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyGreatMarriage | The Fatherhood Foundation",
  description:
    "Build a thriving marriage through proven principles, practical tools, and supportive community for couples.",
}

export default function MyGreatMarriagePage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#FDF8F3]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%238B2B3E" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <span className="inline-block px-4 py-2 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full text-sm font-semibold tracking-wider uppercase mb-6">
                  Two Unique Prints, One Unified Heart
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8B2B3E] mb-6 text-balance">
                  MyGreatMarriage
                </h1>
                <p className="text-lg lg:text-xl text-foreground/70 text-balance leading-relaxed mb-8">
                  A strong marriage is the foundation of a healthy family. Discover how to build lasting love, deep
                  connection, and a partnership that thrives through every season.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white" asChild>
                    <Link href="/get-involved">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/10" asChild>
                    <Link href="#overview">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right - Thumbprints Image */}
              <div className="relative order-1 lg:order-2 flex justify-center">
                <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px]">
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#8B2B3E]/20 animate-[spin_30s_linear_infinite]" />
                  {/* Glow effect */}
                  <div className="absolute inset-4 rounded-full bg-[#8B2B3E]/10 blur-2xl" />
                  {/* Main image */}
                  <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src="/images/marriage-thumbprints-banner.jpg"
                      alt="Two thumbprints forming a heart - symbolizing unique individuals united in marriage"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Floating hearts */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#D4A574] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-[#8B2B3E] rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Invest in Your Most Important Relationship
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  MyGreatMarriage provides couples with the tools, principles, and support needed to build a thriving
                  relationship. Through workshops, retreats, and couple's groups, you'll learn effective communication,
                  conflict resolution, and how to maintain romance and intimacy throughout your marriage.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether you're engaged, newlyweds, or have been married for decades, this program will help you
                  strengthen your bond and create the marriage you've always desired.
                </p>
                <Button asChild size="lg">
                  <Link href="/get-involved">
                    Strengthen Your Marriage <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image src="/couple-having-coffee-and-conversation--intimate-mo.jpg" alt="Couple connecting" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Key Focus Areas */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What You'll Learn</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Proven strategies for building a strong, lasting marriage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Communication</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Learn to listen deeply and express yourself clearly and lovingly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Conflict Resolution</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Navigate disagreements constructively and emerge stronger together.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Intimacy & Romance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Keep the spark alive and deepen emotional and physical connection.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Shared Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Align your goals and dreams to build a unified future together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Offerings */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Program Offerings</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Marriage Workshops</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    6-week courses covering essential marriage skills, from communication to finances to intimacy.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/get-involved">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Couples Retreats</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Weekend getaways designed to help you reconnect, refresh, and reignite your relationship.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/get-involved">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Small Groups</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Join other couples in ongoing groups for support, accountability, and shared growth.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/get-involved">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Build the Marriage You've Always Wanted
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-balance leading-relaxed">
              Your marriage is worth investing in. Take the next step toward a stronger, more fulfilling relationship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-involved">
                  Join MyGreatMarriage <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
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
