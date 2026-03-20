"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock } from "lucide-react"

function ComingSoonContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8B2B3E]/10 border-2 border-[#8B2B3E]/20 mb-8">
          <Clock className="w-10 h-10 text-[#8B2B3E]" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
          Coming Soon
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-[#8B2B3E]/40" />
          <span className="text-[#8B2B3E] font-semibold text-sm uppercase tracking-widest">
            We are working on it
          </span>
          <span className="h-px w-12 bg-[#8B2B3E]/40" />
        </div>

        {/* Custom or default message */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-balance">
          {message ||
            "This page is currently being prepared and will be available shortly. Thank you for your patience."}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#8B2B3E] hover:bg-[#6B1B2E]">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/get-involved">Get Involved</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={<div className="flex-1" />}>
        <ComingSoonContent />
      </Suspense>
      <Footer />
    </div>
  )
}
