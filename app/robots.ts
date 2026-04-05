import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/confirm-email",
          "/coming-soon",
          "/curriculum/sign-up",
        ],
      },
    ],
    sitemap: "https://thefatherhoodfoundation.org/sitemap.xml",
  }
}
