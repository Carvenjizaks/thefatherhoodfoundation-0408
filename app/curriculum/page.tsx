import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Download, BookOpen } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Curriculum for Men | The Fatherhood Foundation",
  description: "Access our comprehensive library of resources designed to help you grow as a man, father, and leader.",
}

export default function CurriculumPage() {
  const books = [
    {
      title: "Courage: Winning Life's Toughest Battles",
      author: "Ed Cole",
      description:
        "A powerful guide to developing the courage needed to face life's greatest challenges. Learn how to stand firm in adversity, overcome fear, and lead with strength and conviction.",
      image: "/images/books/courage.jpg",
      topics: ["Overcoming Fear", "Building Character", "Leadership", "Faith"],
    },
    {
      title: "Maximized Manhood: A Guide to Family Survival",
      author: "Edwin Louis Cole",
      description:
        "The bestselling book that has helped millions of men understand their role as husband and father. Discover biblical principles for leading your family with wisdom and love.",
      image: "/images/books/maximized-manhood.jpg",
      topics: ["Marriage", "Fatherhood", "Spiritual Leadership", "Family"],
    },
    {
      title: "Sexual Integrity",
      author: "Edwin Louis Cole",
      description:
        "A frank and practical guide to maintaining purity in thought and action. Essential reading for men committed to honoring God and their families through sexual integrity.",
      image: "/images/books/sexual-integrity.png",
      topics: ["Purity", "Self-Control", "Relationships", "Accountability"],
    },
  ]

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/books-on-wooden-table--learning--education.jpg"
              alt="Curriculum"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Curriculum for Men
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              Transform your life through proven biblical principles. Our curriculum provides the foundation for
              becoming the man God created you to be.
            </p>
          </div>
        </section>

        {/* Books Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="space-y-16">
              {books.map((book, index) => (
                <Card key={index} className="overflow-hidden border-2">
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                  >
                    <div className={`relative h-96 lg:h-auto bg-muted ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <Image
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-contain p-8"
                      />
                    </div>

                    <CardContent
                      className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
                    >
                      <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                      <p className="text-muted-foreground mb-6">by {book.author}</p>
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{book.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {book.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button size="lg" className="w-full sm:w-auto">
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">How to Use This Curriculum</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Study Options</CardTitle>
                <CardDescription>
                  Choose the approach that works best for your schedule and learning style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Individual Study</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Work through the books at your own pace. We recommend setting aside 15-30 minutes daily for
                      reading and reflection.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Small Group Study</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Gather with other men weekly to discuss chapters and hold each other accountable. Discussion
                      guides available for download.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">With a Mentor</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Read alongside your mentor and discuss the principles during your regular meetings for deeper
                      understanding and application.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-balance leading-relaxed">
              Download these life-changing resources today and begin your transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-involved">Join Our Community</Link>
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
