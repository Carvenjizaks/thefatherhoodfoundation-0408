import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Fatherhood Foundation",
    short_name: "Fatherhood Foundation",
    description:
      "Empowering men to become intentional fathers, committed husbands, and impactful leaders through mentorship, marriage enrichment, and community development.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#8B2B3E",
    icons: [
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
