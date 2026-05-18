import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Gathering of Champions 2026 | The Fatherhood Foundation",
}

export default function Page() {
  redirect("/events?register=goc26")
}
