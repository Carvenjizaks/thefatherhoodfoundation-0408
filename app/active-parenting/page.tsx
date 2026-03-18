import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ActiveParenting | The Fatherhood Foundation",
  description:
    "Learn practical skills and strategies to become an engaged, present, and effective father to your children.",
}

export default function ActiveParentingPage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/father-playing-with-children-in-park--active-paren.jpg"
              alt="Active parenting"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              ActiveParenting
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              Being a great father isn't about perfection—it's about presence. Learn how to be actively engaged in your
              children's lives and build lasting relationships.
            </p>
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Present, Engaged, and Intentional
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  ActiveParenting equips you with practical strategies and tools to be the father your children need.
                  Through workshops, resources, and peer support, you'll learn age-appropriate parenting techniques,
                  effective communication skills, and how to create meaningful moments with your kids.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether you're a new dad or have teenagers, this program will help you build stronger connections and
                  leave a lasting legacy in your children's lives.
                </p>
                <Button asChild size="lg">
                  <Link href="/get-involved">
                    Join the Program <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* Program Components */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Program Components</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive approach to becoming an active and effective father.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Parenting Workshops</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Interactive sessions covering discipline strategies, communication techniques, and developmental
                    stages from infancy through adolescence.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Support Groups</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with other dads facing similar challenges. Share experiences, gain insights, and build
                    lasting friendships in a supportive environment.
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
              Become the Dad Your Kids Need
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-balance leading-relaxed">
              Your children need you present and engaged. Start building stronger relationships today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-involved">
                  Join ActiveParenting <ArrowRight className="ml-2 h-5 w-5" />
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
