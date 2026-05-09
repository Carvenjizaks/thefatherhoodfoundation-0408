export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    name: "The Fatherhood Foundation",
    alternateName: "Fatherhood Foundation",
    url: "https://thefatherhoodfoundation.org",
    logo: "https://thefatherhoodfoundation.org/logo.png",
    description:
      "The Fatherhood Foundation empowers men to become intentional fathers, committed husbands, and impactful leaders through mentorship programs, marriage enrichment, and community development initiatives.",
    foundingDate: "2014",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Windhoek",
      addressCountry: "NA",
    },
    sameAs: [
      "https://www.facebook.com/thefatherhoodfoundation",
      "https://www.instagram.com/thefatherhoodfoundation",
      "https://www.linkedin.com/company/thefatherhoodfoundation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "admin@fathersfound.org",
    },
    knowsAbout: [
      "Fatherhood",
      "Marriage Enrichment",
      "Men's Mentorship",
      "Community Development",
      "Family Strengthening",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Fatherhood Foundation",
    url: "https://thefatherhoodfoundation.org",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://thefatherhoodfoundation.org/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
}: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    location: {
      "@type": "Place",
      name: location,
    },
    organizer: {
      "@type": "Organization",
      name: "The Fatherhood Foundation",
      url: "https://thefatherhoodfoundation.org",
    },
    url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// AEO: Speakable Schema for Voice Assistants (Google Assistant, Alexa, Siri)
export function SpeakableSchema({
  headline,
  summary,
  url,
}: {
  headline: string
  summary: string
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: headline,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable-headline", ".speakable-summary"],
    },
    url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// AEO: HowTo Schema for instructional content
export function HowToSchema({
  name,
  description,
  steps,
}: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// AEO: Service Schema for programs
export function ServiceSchema({
  name,
  description,
  provider,
  areaServed,
  audience,
}: {
  name: string
  description: string
  provider?: string
  areaServed?: string
  audience?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider || "The Fatherhood Foundation",
      url: "https://thefatherhoodfoundation.org",
    },
    areaServed: {
      "@type": "Country",
      name: areaServed || "Namibia",
    },
    audience: {
      "@type": "Audience",
      audienceType: audience || "Married Couples",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// AEO: Course Schema for programs/curriculum
export function CourseSchema({
  name,
  description,
  provider,
  duration,
}: {
  name: string
  description: string
  provider?: string
  duration?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider || "The Fatherhood Foundation",
      url: "https://thefatherhoodfoundation.org",
    },
    ...(duration && { timeRequired: duration }),
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// AEO: Person Schema for author/founder quotes
export function PersonSchema({
  name,
  jobTitle,
  affiliation,
  image,
}: {
  name: string
  jobTitle?: string
  affiliation?: string
  image?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: jobTitle || "Founder",
    affiliation: {
      "@type": "Organization",
      name: affiliation || "The Fatherhood Foundation",
    },
    ...(image && { image }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
