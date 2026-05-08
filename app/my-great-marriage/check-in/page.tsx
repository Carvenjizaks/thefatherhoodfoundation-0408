import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import CheckInClient from "./check-in-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Monthly Marriage Check-In | My Great Marriage | The Fatherhood Foundation",
  description: "A free printable monthly marriage check-in tool to help couples reconnect, communicate honestly, and build a stronger Christ-centered marriage.",
}

export default function CheckInPage() {
  return (
    <>
      <div className="no-print">
        <Header />
      </div>
      <CheckInClient />
      <div className="no-print">
        <Footer />
      </div>
    </>
  )
}
