import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Download, BookOpen } from "lucide-react"
import type { Metadata } from "next"
import { BooksCarousel } from "@/components/books-carousel"

export const metadata: Metadata = {
  title: "Curriculum for Men | The Fatherhood Foundation",
  description: "Access our comprehensive library of resources designed to help you grow as a man, father, and leader.",
}

export default function CurriculumPage() {
  const books = [
    {
      title: "Courage: Winning Life's Toughest Battles",
      bannerTitle: "Courage",
      author: "Ed Cole",
      introduction:
        "True courage is not the absence of fear, but the mastery of it. Every man faces battles that test his resolve—whether in his career, relationships, or personal struggles. This book equips you with the spiritual weapons and practical wisdom to stand firm when everything around you is shaking.",
      description:
        "A powerful guide to developing the courage needed to face life's greatest challenges. Learn how to stand firm in adversity, overcome fear, and lead with strength and conviction.",
      image: "/images/books/courage.jpg",
      topics: ["Overcoming Fear", "Building Character", "Leadership", "Faith"],
    },
    {
      title: "Maximized Manhood: A Guide to Family Survival",
      bannerTitle: "Maximized Manhood",
      author: "Edwin Louis Cole",
      introduction:
        "Manhood is not automatic—it must be developed, nurtured, and intentionally pursued. In a world that has lost its definition of masculinity, this timeless classic calls men back to their God-given purpose as protectors, providers, and spiritual leaders of their homes.",
      description:
        "The bestselling book that has helped millions of men understand their role as husband and father. Discover biblical principles for leading your family with wisdom and love.",
      image: "/images/books/maximized-manhood.jpg",
      topics: ["Marriage", "Fatherhood", "Spiritual Leadership", "Family"],
    },
    {
      title: "Sexual Integrity",
      bannerTitle: "Sexual Integrity",
      author: "Edwin Louis Cole",
      introduction:
        "In a culture that cheapens intimacy, men are called to a higher standard. Sexual integrity is not about suppression but about channeling God's gift of sexuality within its proper boundaries. This book provides honest, biblical guidance for men who desire purity in an impure world.",
      description:
        "A frank and practical guide to maintaining purity in thought and action. Essential reading for men committed to honoring God and their families through sexual integrity.",
      image: "/images/books/sexual-integrity.jpg",
      topics: ["Purity", "Self-Control", "Relationships", "Accountability"],
    },
    {
      title: "Real Man",
      bannerTitle: "Real Man",
      author: "Edwin Louis Cole",
      introduction:
        "What does it mean to be a real man in today's world? Society offers countless counterfeits, but God's standard remains unchanged. A real man takes responsibility, keeps his word, and lives with integrity regardless of the cost. This book challenges you to rise above mediocrity and embrace authentic masculinity.",
      description:
        "Discover what it truly means to be a man of God. This powerful book strips away cultural confusion and reveals the timeless principles that define genuine manhood.",
      image: "/images/books/real-man.jpg",
      topics: ["Authenticity", "Responsibility", "Integrity", "Identity"],
    },
    {
      title: "Communication, Sex and Money",
      bannerTitle: "Communication, Sex & Money",
      author: "Edwin Louis Cole",
      introduction:
        "The three greatest areas of conflict in marriage are communication, sex, and money. Yet these same areas, when handled God's way, become the greatest sources of intimacy and blessing. Learn how to transform potential battlegrounds into foundations for a thriving marriage.",
      description:
        "A practical guide to navigating the most challenging areas of marriage. Build deeper connection with your spouse through biblical principles for communication, intimacy, and finances.",
      image: "/images/books/communication-sex-money.jpg",
      topics: ["Marriage", "Communication", "Intimacy", "Finances"],
    },
    {
      title: "Never Quit",
      bannerTitle: "Never Quit",
      author: "Edwin Louis Cole",
      introduction:
        "Champions are not those who never fail, but those who never quit. Life will knock you down—that's guaranteed. What matters is whether you get back up. This book ignites the fire of perseverance and teaches you how to finish strong no matter what obstacles you face.",
      description:
        "An inspiring call to perseverance and resilience. Learn how to overcome setbacks, push through adversity, and develop the unshakeable determination that defines true champions.",
      image: "/images/books/never-quit.jpg",
      topics: ["Perseverance", "Resilience", "Victory", "Determination"],
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

        {/* Books Carousel Section */}
        <section className="py-8 bg-background border-b">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">Featured Books</h2>
            <BooksCarousel books={books} />
          </div>


        </section>

        {/* Books Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="space-y-16">
              {books.map((book, index) => (
                <Card key={index} className="overflow-hidden border-2" id={`book-${index}`}>
                  {/* Full-width banner image with title overlay */}
                  <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden group">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {/* Dynamic title text */}
                    <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-10">
                      <h2
                        className="font-black uppercase tracking-widest leading-none text-white drop-shadow-2xl"
                        style={{
                          fontSize: "clamp(2rem, 6vw, 5rem)",
                          textShadow: "2px 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {book.bannerTitle}
                      </h2>
                    </div>
                  </div>

                  <CardContent className="p-8 lg:p-12">
                    <p className="text-lg text-foreground mb-6 leading-relaxed italic border-l-4 border-primary pl-4">
                      {book.introduction}
                    </p>
                    <CardTitle className="text-3xl mb-4">{book.title}</CardTitle>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{book.description}</p>

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
