"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

// Color palette for each book
const bookColors = [
  { primary: "#8B2B3E", secondary: "#D4A574", accent: "#FDF0E6" }, // Maroon/Gold
  { primary: "#1E3A5F", secondary: "#5B8FB9", accent: "#E8F0F8" }, // Navy/Blue  
  { primary: "#3D1F0F", secondary: "#8B5A2B", accent: "#F5EBE0" }, // Dark Brown/Tan
  { primary: "#2D5A4A", secondary: "#6B9B8A", accent: "#E6F2EE" }, // Forest Green/Sage
  { primary: "#5C3D6E", secondary: "#9B7BB0", accent: "#F3EBF7" }, // Purple/Lavender
]

const books = [
  {
    title: "Sexual Integrity: A Sexual Revolution Called Purity",
    bannerTitle: "Sexual Integrity",
    author: "Ed Cole",
    image: "/images/books/sexual-integrity.jpg",
    topics: ["Purity", "Self-Control", "Relationships", "Accountability"],
    writeUp: `Sexual Integrity is a bold and restorative call back to God's design for sex, purity and personal worth. Edwin Louis Cole confronts a culture that treats sex casually and virginity as disposable, and instead presents sexuality as sacred, powerful and deeply valuable.

The book addresses key issues such as dating, sex before marriage, pornography, lust, abuse, peer pressure and the meaning of virginity, not merely from a moral standpoint, but from the perspective of identity, purpose and dignity.

It is written for young men and women, singles, married couples and parents who want a biblical understanding of sexuality that is honest, practical and life-giving. Rather than using fear, shame or empty rules, Cole explains why God created sex, why it matters, and how purity protects destiny, strengthens self-respect and prepares people for healthy covenant relationships.

This is not simply a book about avoiding sexual sin; it is about recovering what a previous generation threw away and rediscovering the beauty, strength and freedom of sexual integrity. It offers hope for those who want to remain pure, and healing for those who need restoration.`,
  },
  {
    title: "Power of Potential: Maximize God's Principles to Fulfill Your Dreams",
    bannerTitle: "Power of Potential",
    author: "Ed Cole",
    image: "/images/books/power-of-potential.webp",
    topics: ["Potential", "Dreams", "Leadership", "Growth"],
    writeUp: `The Power of Potential is a faith-filled guide to discovering, developing and releasing the purpose God has placed inside you. Using the life of Joseph as a central model, Edwin Louis Cole shows that dreams are not fantasies to admire from a distance, but seeds of calling that must be nurtured through faith, character, discipline and obedience.

The book explores how God develops people through patterns and principles, not shortcuts, and how setbacks, suffering, guilt, priorities, prosperity and even delayed dreams can all become part of God's process of growth. Cole challenges readers to move beyond mere positive thinking into what he calls "reality thinking" — a life built on truth, biblical principle and wholehearted trust in God.

At its core, this book is about potential becoming reality: God-given dreams, rightly pursued, can shape lives, bless others and bring glory to God. It speaks to men and women who sense there is more in them than what is currently visible and who are ready to align vision, values and action. This is a book for builders, dreamers and leaders who want to live intentionally and finish strong.`,
  },
  {
    title: "Communication, Sex and Money: Overcoming the Three Common Challenges in Relationships",
    bannerTitle: "Communication, Sex & Money",
    author: "Ed Cole",
    image: "/images/books/communication-sex-money.webp",
    topics: ["Marriage", "Communication", "Intimacy", "Finances"],
    writeUp: `Communication, Sex and Money speaks to three of the most defining and often most difficult areas in relationships. Edwin Louis Cole addresses the practical tensions that arise when couples or families struggle to connect honestly, handle intimacy with maturity and steward finances with wisdom.

Rather than treating these topics as isolated problems, the book points to the deeper issues underneath them: trust, value, responsibility, priorities, love, respect and spiritual alignment. It is written to help readers move beyond conflict, misunderstanding and emotional distance into stronger, healthier and more honest relationships.

With Cole's direct style, the message is both confronting and constructive, challenging men in particular to grow in leadership, integrity and relational responsibility. This book is not about managing surface issues; it is about dealing with the roots that affect the home, marriage and personal life. It offers practical insight for couples, individuals preparing for marriage, and leaders who want to build families on truth rather than confusion. The result is a message that is deeply relevant for anyone seeking healthier communication, greater relational wholeness and a more God-honoring approach to love, intimacy and financial stewardship.`,
  },
  {
    title: "Never Quit: Winners Are Not Those Who Never Fail But Those Who Never Quit",
    bannerTitle: "Never Quit",
    author: "Ed Cole",
    image: "/images/books/never-quit.webp",
    topics: ["Perseverance", "Resilience", "Victory", "Determination"],
    writeUp: `Never Quit is a powerful message of endurance, faith and resilience for people walking through crisis, disappointment or personal failure. Edwin Louis Cole makes the case that crisis is a normal part of life and that the real difference between winners and losers is not the absence of failure, but the refusal to surrender.

Through biblical examples such as Elijah, David and Joseph, the book shows how God works in the middle of stress, fear, transition and loss to produce maturity, restoration and victory. It addresses themes such as handling change, overcoming despair, moving from failure to success, living with perseverance and speaking faith instead of fear.

Cole's message is deeply practical: trials are not pointless, failure does not have to be final, and success is sustained by spiritual discipline, purified character and steadfast trust in God. This is a book for anyone who feels pressure to give up, who is facing a difficult season, or who needs courage to keep going. More than motivation, Never Quit offers a biblical framework for enduring hardship without losing heart and for emerging stronger, wiser and more grounded in God's purpose.`,
  },
  {
    title: "Courage: Winning Life's Toughest Battles",
    bannerTitle: "Courage",
    author: "Ed Cole",
    image: "/images/books/courage.webp",
    topics: ["Overcoming Fear", "Building Character", "Leadership", "Faith"],
    writeUp: `Courage is a stirring call to champion-level manhood, conviction and spiritual strength. Edwin Louis Cole writes to those who are tired of weakness, passivity and compromise and who want to become the kind of men who face life's hardest battles with resolve.

The book presents courage not as mere bravado, but as visible strength rooted in character, discipline and commitment to God. It speaks especially to young men, challenging them not to waste their youth but to live with purpose, maturity and responsibility. Through themes such as warfare, temptation, work, identity, discipline, persistence and becoming a champion, Cole trains readers to think beyond comfort and to embrace the cost of real growth.

His central message is clear: champions are not born by chance; they are formed through decisions, determination and courage made visible in action. This book is both a challenge and an invitation — to reject mediocrity, resist fear of failure and rise into the manhood God intended. It is highly suited for personal growth, men's discipleship and leadership development, especially where courage, spiritual grit and purpose-driven living are needed most.`,
  },
]

export default function BooksPage() {
  const [expandedBook, setExpandedBook] = useState<number | null>(null)

  const toggleBook = (index: number) => {
    setExpandedBook(expandedBook === index ? null : index)
  }

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-[#FDF8F4] to-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2D4A6F] to-[#8B2B3E]" />
          <div className="absolute inset-0 opacity-15">
            <Image
              src="/books-on-wooden-table--learning--education.jpg"
              alt="Books background"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#D4A574]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#8B2B3E]/20 blur-3xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <Link href="/curriculum" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Curriculum
            </Link>
            <div className="w-20 h-20 rounded-2xl bg-[#D4A574]/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-[#D4A574]/30">
              <BookOpen className="w-10 h-10 text-[#D4A574]" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Book Library
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Explore our collection of transformational books by Edwin Louis Cole. Click on any book to discover its powerful message.
            </p>
            
            {/* Book count badge */}
            <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-[#D4A574] font-bold text-2xl">{books.length}</span>
              <span className="text-white/80">Books Available</span>
            </div>
          </div>
        </section>

        {/* Books Accordion Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4A574]">Our Collection</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#1E3A5F]">Discover Each Book</h2>
              <p className="mt-4 text-[#5C3D2E] max-w-2xl mx-auto">
                Each book offers unique insights for personal growth, leadership and spiritual development. Expand any book below to learn more.
              </p>
            </div>
            
            <div className="space-y-6">
              {books.map((book, index) => {
                const colors = bookColors[index % bookColors.length]
                return (
                <div
                  key={index}
                  id={`book-${index}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{ borderLeft: `6px solid ${colors.primary}` }}
                >
                  {/* Book Header - Always Visible */}
                  <div className="relative min-h-[180px]">
                    {/* Colored Top Bar */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-2 z-10"
                      style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                    />
                    {/* Background Color */}
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: colors.accent }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 lg:p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Book Cover Thumbnail */}
                        <div className="relative w-28 h-36 lg:w-32 lg:h-44 rounded-xl overflow-hidden shadow-xl flex-shrink-0 border-4 border-white">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Book Info */}
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-xs font-bold uppercase tracking-widest mb-2"
                            style={{ color: colors.primary }}
                          >
                            {book.author}
                          </p>
                          <h2 className="text-xl lg:text-2xl font-bold mb-3 text-[#1a0a0e]">
                            {book.title}
                          </h2>
                          
                          {/* Topics */}
                          <div className="flex flex-wrap gap-2">
                            {book.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm"
                                style={{ 
                                  backgroundColor: colors.primary,
                                  color: "white" 
                                }}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Read More Button */}
                        <Button
                          onClick={() => toggleBook(index)}
                          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-xl ${
                            expandedBook === index 
                              ? "bg-[#1E3A5F] text-white" 
                              : "bg-[#8B2B3E] text-white hover:bg-[#6d2230]"
                          }`}
                        >
                          {expandedBook === index ? (
                            <>
                              Close
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Read More
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedBook === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 lg:px-8 pb-8 pt-4 bg-white">
                      <div className="border-t-2 border-[#e8d8c8] pt-6">
                        <h3 className="text-xl font-bold mb-4 text-[#1E3A5F]">
                          About This Book
                        </h3>
                        <div className="prose prose-lg max-w-none">
                          {book.writeUp.split('\n\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-[#5C3D2E] leading-relaxed mb-4 text-base">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        
                        {/* Sign Up CTA */}
                        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#8B2B3E]/5 to-[#1E3A5F]/5 border border-[#e8d8c8]">
                          <p className="font-bold mb-3 text-[#1E3A5F]">
                            Ready to start this journey?
                          </p>
                          <Link href="/curriculum/sign-up">
                            <Button className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg">
                              Sign Up for Curriculum
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2D4A6F] to-[#8B2B3E]" />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#D4A574]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#8B2B3E]/20 blur-3xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <BookOpen className="w-8 h-8 text-[#D4A574]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Start Your Transformation Today
            </h2>
            <p className="text-white/80 text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of men who are discovering their true potential through our curriculum. Take the first step towards becoming the man God created you to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/curriculum/sign-up">
                <Button size="lg" className="bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] px-10 py-6 text-lg rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
                  Sign Up for Curriculum
                </Button>
              </Link>
              <Link href="/curriculum">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full font-bold">
                  View All Books
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
