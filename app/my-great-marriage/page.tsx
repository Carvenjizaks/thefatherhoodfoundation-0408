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
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-white to-[#F5E6DC]">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-[#D4A574]/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#8B2B3E]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left - Thumbprints Image */}
              <div className="relative order-1 flex justify-center lg:justify-start">
                <div className="relative w-72 h-96 lg:w-[400px] lg:h-[500px]">
                  {/* Animated border rings */}
                  <div className="absolute -inset-8 rounded-3xl border-2 border-dashed border-[#8B2B3E]/30 animate-[spin_40s_linear_infinite]" />
                  <div className="absolute -inset-4 rounded-3xl border border-[#D4A574]/40" />
                  
                  {/* Main image with shadow */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white hover:shadow-3xl transition-all duration-500 bg-white">
                    <Image
                      src="/images/marriage-conference-banner.jpg"
                      alt="My Great Marriage Conference banner"
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B2B3E]/10 via-transparent to-transparent" />
                  </div>
                  
                  {/* Floating accent circles */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#D4A574] rounded-full shadow-lg animate-bounce flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-[#8B2B3E] rounded-full shadow-lg animate-bounce flex items-center justify-center" style={{ animationDelay: '0.3s' }}>
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div className="absolute top-1/2 -right-8 w-12 h-12 bg-white rounded-full shadow-lg animate-pulse border-2 border-[#D4A574]" />
                </div>
              </div>

              {/* Right - Content */}
              <div className="text-center lg:text-left order-2 space-y-6">
                <div className="inline-block lg:block">
                  <span className="inline-block px-5 py-2 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full text-sm font-bold tracking-widest uppercase mb-6">
                    ✓ Two Unique Prints, One Heart
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A1A1A] text-balance leading-tight">
                  My<span className="text-[#8B2B3E]">Great</span>
                  <span className="block">Marriage</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-foreground/70 text-balance leading-relaxed max-w-lg">
                  Build the marriage you've always dreamed of. Through proven principles, expert guidance, and a supportive community, discover how to strengthen your bond and thrive together.
                </p>

                {/* Stats or highlights */}
                <div className="flex flex-col sm:flex-row gap-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#8B2B3E] rounded-full" />
                    <span>Expert Guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#D4A574] rounded-full" />
                    <span>Proven Results</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#8B2B3E] rounded-full" />
                    <span>Community Support</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                    <Link href="/get-involved" className="flex items-center gap-2">
                      Register Now <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-[#8B2B3E] text-[#8B2B3E] hover:bg-[#8B2B3E]/10 font-semibold" asChild>
                    <Link href="#overview">Learn More</Link>
                  </Button>
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
