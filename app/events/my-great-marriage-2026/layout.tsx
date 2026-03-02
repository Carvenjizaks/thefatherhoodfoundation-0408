import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyGreatMarriage Conference 2026 | The Fatherhood Foundation",
  description:
    "Register for the MyGreatMarriage Conference on June 11-12, 2026. A transformative event for couples focused on strengthening marriages and building lasting relationships.",
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return children
}
