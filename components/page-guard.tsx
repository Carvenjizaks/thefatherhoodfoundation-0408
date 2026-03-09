import { createAdminClient } from "@/lib/supabase/server"
import { Header } from "./header"
import { Footer } from "./footer"

interface PageGuardProps {
  slug: string
  children: React.ReactNode
}

export async function PageGuard({ slug, children }: PageGuardProps) {
  const supabase = createAdminClient()
  
  const { data: settings } = await supabase
    .from("page_settings")
    .select("is_active, hidden_message")
    .eq("slug", slug)
    .single()

  // If no settings found or page is active, show the page
  if (!settings || settings.is_active) {
    return <>{children}</>
  }

  // Page is hidden - show maintenance message
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V7a4 4 0 00-8 0v4h8zM6 11V7a6 6 0 1112 0v4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Page Temporarily Unavailable
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {settings.hidden_message || "This page is currently under maintenance. Please check back later."}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Return Home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
