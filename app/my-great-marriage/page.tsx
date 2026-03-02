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
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/happy-couple-walking-together--sunset--romantic.jpg"
              alt="Happy couple"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              MyGreatMarriage
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              A strong marriage is the foundation of a healthy family. Discover how to build lasting love, deep
              connection, and a partnership that thrives through every season.
            </p>
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
