import { redirect } from 'next/navigation'

export default function HomePage() {
  // Auth disabled for development - redirect directly to dashboard
  redirect('/dashboard')
}
