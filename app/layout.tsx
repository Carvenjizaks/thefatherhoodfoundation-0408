import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { Analytics } from "@vercel/analytics/next"

// Cache bust v8 - Force complete rebuild and clear invalid URL cache
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL("https://thefatherhoodfoundation.org"),
  title: {
    default: "The Fatherhood Foundation | Empowering Men, Strengthening Families",
    template: "%s | The Fatherhood Foundation",
  },
  description:
    "The Fatherhood Foundation empowers men to become intentional fathers, committed husbands, and impactful leaders through mentorship programs, marriage enrichment, and community development initiatives.",
  keywords: [
    "fatherhood programs",
    "men's mentorship",
    "marriage enrichment",
    "father training",
    "community development",
    "family strengthening",
    "intentional fatherhood",
    "husband leadership",
    "men's ministry",
    "parenting resources",
    "father mentoring",
    "healthy marriages",
  ],
  authors: [{ name: "The Fatherhood Foundation" }],
  creator: "The Fatherhood Foundation",
  publisher: "The Fatherhood Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "The Fatherhood Foundation | Empowering Men, Strengthening Families",
    description:
      "Empowering men to become intentional fathers, committed husbands, and impactful leaders through mentorship and community support.",
    url: "https://thefatherhoodfoundation.org",
    siteName: "The Fatherhood Foundation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Fatherhood Foundation - Empowering Men, Strengthening Families",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fatherhood Foundation",
    description: "Empowering men to become intentional fathers, committed husbands, and impactful leaders.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thefatherhoodfoundation.org",
  },
  category: "nonprofit",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <NewsletterPopup />
        <Analytics />
      </body>
    </html>
  )
}
