import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Target, Award, MessageCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Monthly Table Talk for Men | The Fatherhood Foundation",
  description:
    "Connect with experienced mentors who provide guidance, accountability, and wisdom for your journey as a man and leader.",
}

export default function MentoringMenPage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/two-men-having-coffee-and-mentoring-conversation.jpg"
              alt="Mentoring conversation"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
Monthly Table Talk for Men
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              A gathering space for men to connect, exchange life stories, and grow by learning from those who've walked the path before.
            </p>
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Wisdom Passed Down, Lives Transformed
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  The Monthly Table Talk for Men program pairs you with a seasoned mentor who understands the challenges you face.
                  Through regular meetings, honest conversations, and practical guidance, you'll develop the character
                  and skills needed to lead your family and community well.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our mentors are carefully selected men of integrity who have demonstrated success in marriage,
                  parenting, career, and spiritual life. They're committed to investing in the next generation of
                  fathers and leaders.
                </p>
                <Button asChild size="lg">
                  <Link href="/get-involved">
                    Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image src="/mentor-and-mentee-in-discussion--professional-sett.jpg" alt="Mentorship session" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What You'll Gain</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The mentorship experience provides tangible benefits that will impact every area of your life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Personal Guidance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    One-on-one attention tailored to your specific situation and goals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Accountability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Regular check-ins to help you stay on track with your commitments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Proven Wisdom</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Learn from someone who has successfully navigated similar challenges.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Safe Space</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A confidential relationship where you can be honest and vulnerable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Start Your Mentorship Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-balance leading-relaxed">
              Don't walk alone. Connect with a mentor who can help you become the man you're called to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-involved">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
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
