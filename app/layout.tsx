import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NewsletterPopup } from "@/components/newsletter-popup"

// Updated font to Inter for Apple-like aesthetic
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "The Fatherhood Foundation | Empowering Men, Strengthening Families",
  description:
    "The Fatherhood Foundation provides resources, mentorship, and community support to help men become better fathers, husbands, and leaders.",
  keywords: ["fatherhood", "parenting", "marriage", "mentoring", "community development", "family"],
  openGraph: {
    title: "The Fatherhood Foundation",
    description:
      "Empowering men to become better fathers, husbands, and leaders through mentorship and community support.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fatherhood Foundation",
    description: "Empowering men to become better fathers, husbands, and leaders.",
  },
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
      </body>
    </html>
  )
}
