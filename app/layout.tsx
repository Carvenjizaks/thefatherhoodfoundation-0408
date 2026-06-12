import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { OmegaNavbar } from "@/components/omega/navbar"
import { OmegaFooter } from "@/components/omega/footer"
import { FloatingWhatsApp } from "@/components/omega/floating-whatsapp"

export const viewport: Viewport = {
  themeColor: "#1a365d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://omegainsurance.com.na"),
  title: {
    default: "Omega Insurance | Trusted Broker in Windhoek | Colin Van Wyk",
    template: "%s | Omega Insurance Brokers",
  },
  description:
    "17 years of trusted insurance advice in Namibia. Colin Van Wyk, NAMFISA-registered insurance broker. Call or WhatsApp today.",
  keywords: [
    "insurance broker windhoek",
    "namibia insurance",
    "omega insurance brokers",
    "colin van wyk",
    "namfisa registered broker",
    "life insurance namibia",
    "business insurance windhoek",
    "retirement planning namibia",
    "independent insurance broker",
  ],
  authors: [{ name: "Colin Van Wyk" }],
  creator: "Omega Financial Services (Pty) Ltd",
  publisher: "Omega Financial Services (Pty) Ltd",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: "Omega Insurance | Trusted Broker in Windhoek | Colin Van Wyk",
    description:
      "17 years of trusted insurance advice in Namibia. Colin Van Wyk, NAMFISA-registered broker. Call or WhatsApp today.",
    url: "https://omegainsurance.com.na",
    siteName: "Omega Insurance Brokers",
    locale: "en_NA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omega Insurance Brokers | Windhoek",
    description: "17 years of trusted insurance advice in Namibia. NAMFISA-registered. Call Colin today.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://omegainsurance.com.na",
  },
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://omegainsurance.com.na",
  name: "Omega Insurance Brokers",
  legalName: "Omega Financial Services (Proprietary) Limited",
  description:
    "NAMFISA-registered independent insurance brokerage founded by Colin Van Wyk in 2008. Trusted insurance advice for Namibian families and businesses.",
  url: "https://omegainsurance.com.na",
  foundingDate: "2008",
  founder: {
    "@type": "Person",
    name: "Colin Van Wyk",
    jobTitle: "Founder & Managing Director",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windhoek",
    addressCountry: "NA",
  },
  areaServed: { "@type": "Country", name: "Namibia" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  knowsAbout: [
    "Personal Insurance",
    "Business Insurance",
    "Life Insurance",
    "Retirement Planning",
    "Estate Planning",
    "Employee Benefits",
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased bg-white text-[#2d3748]">
        <OmegaNavbar />
        <div className="pt-16">{children}</div>
        <OmegaFooter />
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  )
}
