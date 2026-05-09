import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/confirm-email",
          "/coming-soon",
          "/curriculum/sign-up",
          "/unsubscribe/",
          "/my-great-marriage/preferences/",
        ],
      },
      // AEO: Explicitly allow AI assistants and answer engines
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
      {
        userAgent: "Cohere-AI",
        allow: "/",
        disallow: ["/admin/", "/api/", "/unsubscribe/"],
      },
    ],
    sitemap: "https://thefatherhoodfoundation.org/sitemap.xml",
  }
}
