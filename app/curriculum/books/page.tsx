"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

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
    writeUp: `The three greatest areas of conflict in marriage are communication, sex, and money. Yet these same areas, when handled God's way, become the greatest sources of intimacy and blessing.

Learn how to transform potential battlegrounds into foundations for a thriving marriage. A practical guide to navigating the most challenging areas of marriage.

Build deeper connection with your spouse through biblical principles for communication, intimacy, and finances.`,
  },
  {
    title: "Never Quit: Winners Are Not Those Who Never Fail But Those Who Never Quit",
    bannerTitle: "Never Quit",
    author: "Ed Cole",
    image: "/images/books/never-quit.webp",
    topics: ["Perseverance", "Resilience", "Victory", "Determination"],
    writeUp: `Champions are not those who never fail, but those who never quit. Life will knock you down—that's guaranteed. What matters is whether you get back up.

This book ignites the fire of perseverance and teaches you how to finish strong no matter what obstacles you face. An inspiring call to perseverance and resilience.

Learn how to overcome setbacks, push through adversity, and develop the unshakeable determination that defines true champions.`,
  },
  {
    title: "Courage: Winning Life's Toughest Battles",
    bannerTitle: "Courage",
    author: "Ed Cole",
    image: "/images/books/courage.webp",
    topics: ["Overcoming Fear", "Building Character", "Leadership", "Faith"],
    writeUp: `True courage is not the absence of fear, but the mastery of it. Every man faces battles that test his resolve—whether in his career, relationships, or personal struggles.

This book equips you with the spiritual weapons and practical wisdom to stand firm when everything around you is shaking. A powerful guide to developing the courage needed to face life's greatest challenges.

Learn how to stand firm in adversity, overcome fear, and lead with strength and conviction.`,
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

      <main className="pt-20 min-h-screen bg-[#FDF8F4]">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F] to-[#8B2B3E]" />
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/books-on-wooden-table--learning--education.jpg"
              alt="Books background"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <Link href="/curriculum" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Curriculum
            </Link>
            <BookOpen className="w-14 h-14 text-[#D4A574] mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Book Library
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
              Explore our collection of transformational books. Click on any book to read more about its content and message.
            </p>
          </div>
        </section>

        {/* Books Accordion Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="space-y-6">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e8d8c8] transition-all duration-300 hover:shadow-xl"
                >
                  {/* Book Header - Always Visible */}
                  <div className="relative">
                    {/* Faded Book Image Background */}
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover opacity-15"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative p-6 lg:p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Book Cover Thumbnail */}
                        <div className="relative w-24 h-32 lg:w-28 lg:h-36 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Book Info */}
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-widest text-[#8B2B3E] mb-2">
                            {book.author}
                          </p>
                          <h2 className="text-xl lg:text-2xl font-bold text-[#1E3A5F] mb-3">
                            {book.title}
                          </h2>
                          
                          {/* Topics */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {book.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-3 py-1 text-xs font-medium bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Read More Button */}
                        <Button
                          onClick={() => toggleBook(index)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            expandedBook === index
                              ? "bg-[#1E3A5F] hover:bg-[#152d4a] text-white"
                              : "bg-[#8B2B3E] hover:bg-[#6d2230] text-white"
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
                    <div className="px-6 lg:px-8 pb-8 pt-2">
                      <div className="border-t border-[#e8d8c8] pt-6">
                        <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">About This Book</h3>
                        <div className="prose prose-lg max-w-none">
                          {book.writeUp.split('\n\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-[#5C3D2E] leading-relaxed mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        
                        {/* Sign Up CTA */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-[#8B2B3E]/5 to-[#1E3A5F]/5 rounded-xl">
                          <p className="text-[#1E3A5F] font-semibold mb-3">
                            Ready to start this journey?
                          </p>
                          <Link href="/curriculum/sign-up">
                            <Button className="bg-[#8B2B3E] hover:bg-[#6d2230] text-white px-8 py-3 rounded-full font-semibold">
                              Sign Up for Curriculum
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-[#1E3A5F]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Start Your Transformation Today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of men who are discovering their true potential through our curriculum.
            </p>
            <Link href="/curriculum/sign-up">
              <Button size="lg" className="bg-[#D4A574] hover:bg-[#c4956a] text-[#1E3A5F] px-10 py-6 text-lg rounded-full font-bold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
