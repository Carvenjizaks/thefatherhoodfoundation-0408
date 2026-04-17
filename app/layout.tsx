import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { Analytics } from "@vercel/analytics/next"

// Cache bust v9 - Added serif font for cinematic hero
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B2B3E" },
    { media: "(prefers-color-scheme: dark)", color: "#3D2314" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

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

import { WebsiteSchema } from "@/components/structured-data"

// Organization structured data for SEO - single source of truth
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NonprofitOrganization",
  name: "The Fatherhood Foundation",
  alternateName: "Fatherhood Foundation",
  url: "https://thefatherhoodfoundation.org",
  logo: "https://thefatherhoodfoundation.org/logo.png",
  image: "https://thefatherhoodfoundation.org/og-image.jpg",
  description:
    "The Fatherhood Foundation empowers men to become intentional fathers, committed husbands, and impactful leaders through mentorship programs, marriage enrichment, and community development initiatives.",
  foundingDate: "2014",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windhoek",
    addressCountry: "NA",
  },
  sameAs: [
    "https://www.facebook.com/thefatherhoodfoundation",
    "https://www.instagram.com/thefatherhoodfoundation",
    "https://www.linkedin.com/company/thefatherhoodfoundation",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "admin@fathersfound.org",
  },
  areaServed: {
    "@type": "Country",
    name: "Namibia",
  },
  knowsAbout: [
    "Fatherhood programs",
    "Marriage enrichment",
    "Men's mentorship",
    "Community development",
    "Family strengthening",
    "Active parenting",
    "Table Talk for Men",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <WebsiteSchema />
      </head>
      <body className={`${inter.className} ${playfair.variable} font-sans antialiased`}>
        {children}
        <NewsletterPopup />
        <Analytics />
      </body>
    </html>
  )
}
