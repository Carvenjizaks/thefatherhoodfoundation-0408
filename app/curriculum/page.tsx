import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import { BooksCarousel } from "@/components/books-carousel"

export const metadata: Metadata = {
  title: "Curriculum for Men | The Fatherhood Foundation",
  description:
    "Access our comprehensive library of resources designed to help you grow as a man, father, and leader.",
}

const books = [
  {
    title: "Sexual Integrity: A Sexual Revolution Called Purity",
    bannerTitle: "Sexual Integrity",
    author: "Ed Cole",
    introduction:
      "In a culture that cheapens intimacy, men are called to a higher standard. Sexual integrity is not about suppression but about channeling God's gift of sexuality within its proper boundaries. This book provides honest, biblical guidance for men who desire purity in an impure world.",
    description:
      "A frank and practical guide to maintaining purity in thought and action. Essential reading for men committed to honoring God and their families through sexual integrity. Foreword by Nick and Christine Caine.",
    image: "/images/books/sexual-integrity.jpg",
    topics: ["Purity", "Self-Control", "Relationships", "Accountability"],
  },
  {
    title: "Power of Potential: Maximize God's Principles to Fulfill Your Dreams",
    bannerTitle: "Power of Potential",
    author: "Ed Cole",
    introduction:
      "Every man has untapped potential waiting to be released. God has placed within you the seeds of greatness, but it takes intentional effort to cultivate them. This book shows you how to maximize God's principles to fulfill your dreams and become everything you were created to be.",
    description:
      "Discover how to unlock your God-given potential and fulfill your dreams. Learn the principles that turn ordinary men into extraordinary leaders. Foreword by Stan Toler.",
    image: "/images/books/power-of-potential.webp",
    topics: ["Potential", "Dreams", "Leadership", "Growth"],
  },
  {
    title: "Communication, Sex and Money: Overcoming the Three Common Challenges in Relationships",
    bannerTitle: "Communication, Sex & Money",
    author: "Ed Cole",
    introduction:
      "The three greatest areas of conflict in marriage are communication, sex, and money. Yet these same areas, when handled God's way, become the greatest sources of intimacy and blessing. Learn how to transform potential battlegrounds into foundations for a thriving marriage.",
    description:
      "A practical guide to navigating the most challenging areas of marriage. Build deeper connection with your spouse through biblical principles for communication, intimacy, and finances. Foreword by Jack Hayford.",
    image: "/images/books/communication-sex-money.webp",
    topics: ["Marriage", "Communication", "Intimacy", "Finances"],
  },
  {
    title: "Never Quit: Winners Are Not Those Who Never Fail But Those Who Never Quit",
    bannerTitle: "Never Quit",
    author: "Ed Cole",
    introduction:
      "Champions are not those who never fail, but those who never quit. Life will knock you down—that's guaranteed. What matters is whether you get back up. This book ignites the fire of perseverance and teaches you how to finish strong no matter what obstacles you face.",
    description:
      "An inspiring call to perseverance and resilience. Learn how to overcome setbacks, push through adversity, and develop the unshakeable determination that defines true champions. Foreword by Ray Johnston.",
    image: "/images/books/never-quit.webp",
    topics: ["Perseverance", "Resilience", "Victory", "Determination"],
  },
  {
    title: "Courage: Winning Life's Toughest Battles",
    bannerTitle: "Courage",
    author: "Ed Cole",
    introduction:
      "True courage is not the absence of fear, but the mastery of it. Every man faces battles that test his resolve—whether in his career, relationships, or personal struggles. This book equips you with the spiritual weapons and practical wisdom to stand firm when everything around you is shaking.",
    description:
      "A powerful guide to developing the courage needed to face life's greatest challenges. Learn how to stand firm in adversity, overcome fear, and lead with strength and conviction. Foreword by Casey Treat.",
    image: "/images/books/courage.webp",
    topics: ["Overcoming Fear", "Building Character", "Leadership", "Faith"],
  },
]

export default function CurriculumPage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Books Carousel — top of page */}
        <section className="py-8 bg-background border-b">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">Featured Books</h2>
            <BooksCarousel books={books} />
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/books-on-wooden-table--learning--education.jpg"
              alt="Curriculum"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-16">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Curriculum for Men
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              Most men were never taught what it truly means to lead, love, and live with purpose. This curriculum
              changes that — giving you the tools, language, and mindset to step into the version of yourself your
              family, community, and future are waiting for.
            </p>
          </div>
        </section>

        {/* Books Grid — ecommerce layout */}
        <section className="py-20 lg:py-28 bg-muted/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10 border-b pb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Library</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">All Books</h2>
              </div>
              <span className="text-muted-foreground text-sm">{books.length} titles available</span>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, index) => (
                <Card
                  key={index}
                  id={`book-${index}`}
                  className="group overflow-hidden border hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Product image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  <CardContent className="flex flex-col flex-1 p-5 gap-4">
                    {/* Author */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {book.author}
                    </p>

                    {/* Title */}
                    <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2 text-pretty">
                      {book.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                      {book.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5">
                      {book.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="border-t pt-4">
                      <Button asChild size="sm" className="w-full gap-1.5">
                        <Link href="/curriculum/sign-up">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
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

        {/* Start with a Book CTA */}
        <section className="py-16 bg-background border-t">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 text-balance">
              I want to Start with a Book
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-balance">
              Whether you are studying on your own or with others, we would love to walk this journey with you.
              Sign up and let us know how you plan to engage with the curriculum.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/curriculum/sign-up">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
