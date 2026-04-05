"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, ScaleIn, StaggerContainer, CountUp, Parallax } from "@/components/ui/motion"
import { Quote, Play, ArrowRight, Users, Heart, Star } from "lucide-react"

const ArrowRightIcon = () => (
  <svg className="inline-block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const testimonials = [
  {
    id: 1,
    name: "Pieter Kruger",
    role: "Program Graduate",
    program: "Table Talk for Men",
    quote: "The Fatherhood Foundation transformed my perspective on being a father. Through the mentoring program, I learned practical skills that have strengthened my relationship with my children and wife. I am now a more intentional father and husband.",
    image: "/testimonials/pieter.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Ricardo Beukes",
    role: "Community Leader",
    program: "Social Impact",
    quote: "Being part of the community development initiatives opened my eyes to the power of men supporting each other. Together, we are building a stronger community for our families.",
    image: "/testimonials/ricardo.jpg",
    featured: false,
  },
  {
    id: 3,
    name: "Johan & Mariska Van Rensburg",
    role: "Married Couple",
    program: "MyGreatMarriage",
    quote: "The marriage enrichment program gave us tools to communicate better and resolve conflicts with grace. Our marriage has never been stronger, and we are grateful for this foundation.",
    image: "/testimonials/couple1.jpg",
    featured: false,
  },
  {
    id: 4,
    name: "Brandon Van Wyk",
    role: "Young Father",
    program: "Table Talk for Men",
    quote: "As a young father, I had no role model growing up. The mentoring program connected me with experienced fathers who showed me what intentional fatherhood looks like.",
    image: "/testimonials/brandon.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Willem & Chantal Jansen",
    role: "Married 15 Years",
    program: "MyGreatMarriage",
    quote: "After 15 years of marriage, we thought we knew everything. This program showed us there is always room for growth. We learned new ways to love and support each other.",
    image: "/testimonials/couple2.jpg",
    featured: false,
  },
  {
    id: 6,
    name: "Hendrik Van Rensburg",
    role: "Mentor",
    program: "Missions for Men",
    quote: "Serving on mission trips has been life-changing. I have seen firsthand how men can make a difference when they step up and lead with purpose.",
    image: "/testimonials/hendrik.jpg",
    featured: false,
  },
]

const stats = [
  { value: 20000, suffix: "+", label: "Men Impacted" },
  { value: 95, suffix: "%", label: "Recommend to Others" },
  { value: 25, suffix: "+", label: "Years of Impact" },
  { value: 500, suffix: "+", label: "Families Strengthened" },
]

export default function TestimonialsPage() {
  const featuredTestimonial = testimonials.find(t => t.featured)
  const otherTestimonials = testimonials.filter(t => !t.featured)

  return (
    <>
      <Header />
      
      <main className="bg-white text-black min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] overflow-hidden">
          {/* Decorative Elements */}
          <Parallax speed={-0.2} className="absolute top-20 right-10 w-64 h-64 bg-[#8B2B3E]/5 rounded-full blur-3xl" />
          <Parallax speed={0.3} className="absolute bottom-10 left-10 w-80 h-80 bg-[#D4A574]/10 rounded-full blur-3xl" />
          
          {/* Decorative Quote Marks */}
          <div className="absolute top-32 left-10 lg:left-20 opacity-5">
            <Quote className="w-32 h-32 lg:w-48 lg:h-48 text-[#8B2B3E]" />
          </div>
          <div className="absolute bottom-32 right-10 lg:right-20 opacity-5 rotate-180">
            <Quote className="w-32 h-32 lg:w-48 lg:h-48 text-[#8B2B3E]" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <FadeIn direction="up" className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 bg-[#8B2B3E]/10 text-[#8B2B3E] rounded-full text-sm font-semibold mb-6">
                Success Stories
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a1a] mb-6 text-balance leading-tight">
                The Men We{" "}
                <span className="text-[#8B2B3E]">Empower</span>
              </h1>
              <p className="text-lg lg:text-xl text-black/70 leading-relaxed text-pretty">
                Real stories from real men whose lives have been transformed through our programs. 
                These testimonials represent thousands of fathers, husbands, and leaders building stronger families across Namibia.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[#8B2B3E] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B2B3E] via-[#6d2230] to-[#8B2B3E] animate-gradient-shift" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <FadeIn key={stat.label} delay={index * 0.1} direction="up">
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl font-bold text-white">
                      <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                    </p>
                    <p className="text-white/70 text-sm mt-1 font-medium">{stat.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Testimonial */}
        {featuredTestimonial && (
          <section className="py-20 lg:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <FadeIn direction="up">
                <Card className="bg-gradient-to-br from-[#FAF8F5] to-white border-2 border-[#D4A574]/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="relative h-64 lg:h-auto lg:min-h-[400px] bg-[#8B2B3E]/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-[#D4A574]/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Users className="w-16 h-16 lg:w-24 lg:h-24 text-[#8B2B3E]/40" />
                            </div>
                          </div>
                        </div>
                        {/* Decorative badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#8B2B3E] text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured Story
                        </div>
                      </div>
                      
                      {/* Content Side */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <Quote className="w-10 h-10 text-[#D4A574] mb-4" />
                        <p className="text-lg lg:text-xl text-black leading-relaxed mb-6 italic">
                          {`"${featuredTestimonial.quote}"`}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center">
                            <span className="text-[#8B2B3E] font-bold text-lg">
                              {featuredTestimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1a1a]">{featuredTestimonial.name}</p>
                            <p className="text-sm text-black/60">{featuredTestimonial.role}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#8B2B3E]/10 text-[#8B2B3E] text-xs rounded-full">
                              {featuredTestimonial.program}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Testimonials Grid */}
        <section className="py-20 lg:py-28 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-4">
                More Stories of Transformation
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Every man has a story. These are just a few of the lives changed through our programs.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {otherTestimonials.map((testimonial, index) => (
                <FadeIn key={testimonial.id} delay={index * 0.1} direction="up">
                  <Card className="group h-full bg-white border-2 border-transparent hover:border-[#8B2B3E]/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                      {/* Program Badge */}
                      <span className="inline-block self-start px-3 py-1 bg-[#8B2B3E]/10 text-[#8B2B3E] text-xs font-semibold rounded-full mb-4">
                        {testimonial.program}
                      </span>
                      
                      {/* Quote */}
                      <Quote className="w-8 h-8 text-[#D4A574]/50 mb-3 group-hover:text-[#D4A574] transition-colors" />
                      <p className="text-black/80 leading-relaxed mb-6 flex-grow italic">
                        {`"${testimonial.quote}"`}
                      </p>
                      
                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-black/10">
                        <div className="w-10 h-10 rounded-full bg-[#8B2B3E]/10 flex items-center justify-center group-hover:bg-[#8B2B3E] transition-colors">
                          <span className="text-[#8B2B3E] font-semibold group-hover:text-white transition-colors">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a1a1a] text-sm">{testimonial.name}</p>
                          <p className="text-xs text-black/60">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
          <Parallax speed={0.2} className="absolute top-0 right-0 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-4">
                Watch Their Stories
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Hear directly from the men and families whose lives have been transformed.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((video, index) => (
                <FadeIn key={video} delay={index * 0.2} direction="up">
                  <div className="group relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#333] rounded-2xl overflow-hidden cursor-pointer">
                    {/* Video thumbnail placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-[#8B2B3E] ml-1" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Video info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold mb-1">
                        {video === 1 ? "A Father's Journey" : "Marriage Transformed"}
                      </p>
                      <p className="text-white/70 text-sm">
                        {video === 1 ? "Pieter Kruger shares his transformation story" : "The Van Rensburgs share their story"}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-[#8B2B3E] relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2B3E] via-[#6d2230] to-[#8B2B3E] animate-gradient-shift" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4A574]/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-medium" />
          
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <FadeIn direction="up">
              <Heart className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 text-balance">
                Ready to Write Your Own Story?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of men who have transformed their lives, families, and communities. 
                Your journey starts with a single step.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-[#8B2B3E] hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Link href="/get-involved">
                    Get Involved <ArrowRightIcon />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white hover:text-[#8B2B3E] px-8 py-6 text-base rounded-full transition-all duration-300"
                >
                  <Link href="/contact">
                    Share Your Story
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
