"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Building2, Handshake, Users2, Target } from "lucide-react"
import { ScrollingImageCarousel } from "@/components/scrolling-image-carousel"

const communityImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Attachment-13-P4o703bCzecPRn2XTxweMqrFwiVPBB.jpeg",
    alt: "Men gathered at outdoor community event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Attachment-23-4yRyf2gOFliphn4aFCNjLy5TgTODaP.jpeg",
    alt: "Large outdoor gathering with community members",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2878-vWbv5h5xMMzNviWuPgX7B6PRdRxE86.jpeg",
    alt: "Community outreach serving children",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0874-Fqq2iEybmNDZZuiYWArJtCT0o92K7z.jpeg",
    alt: "Men attending community seminar",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0044-ZSKV5F7rVNiE5f9ir9qwYZ9bA4ueGR.jpeg",
    alt: "Group photo of community members at event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7685-GxblfQHicLe9Iznc2UP1blYefuDBwf.jpeg",
    alt: "School assembly presentation",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0056-4k8zuQ2If9yvsmecd5ldQlIbM80kzH.jpeg",
    alt: "Indoor community meeting",
  },
]

export default function CommunityDevelopmentPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Scrolling Image Carousel */}
        <ScrollingImageCarousel images={communityImages} />
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 z-0">
            <Image
              src="/community-volunteers-working-together--service-pro.jpg"
              alt="Community service"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Social Impact
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
              Strong communities are built by engaged men who serve, lead, and make a difference. Discover how you can
              create lasting impact in your neighborhood and beyond.
            </p>
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1">
                <Image src="/men-working-on-community-project-together--teamwor.jpg" alt="Community development" fill className="object-cover" />
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Leaders Who Serve, Communities That Thrive
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our Community Development program mobilizes men to address critical needs in their neighborhoods.
                  Through organized service projects, leadership training, and collaborative partnerships, we're
                  building stronger communities one project at a time.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether it's mentoring youth, supporting local schools, serving vulnerable families, or leading
                  community initiatives, you'll find meaningful ways to make a difference.
                </p>
                <Button asChild size="lg">
                  <Link href="/get-involved">
                    Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Where We Make an Impact</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our community development initiatives focus on creating sustainable, positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Users2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Youth Mentorship</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mentor young men in schools, community centers, and through after-school programs. Help the next
                    generation develop character, skills, and vision for their future.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Neighborhood Revitalization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Participate in projects that improve local infrastructure, create community spaces, and enhance neighborhood safety and beauty. We turn community centers into multi-purpose facilities to truly serve the community — providing spaces where people can gather, grow, and thrive together.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Handshake className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Creating Authentic Communities</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Where people come together because they want to — in small groups, to support, help, and share life with one another. These are spaces built on genuine connection, mutual care, and the understanding that no one was meant to do life alone.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Leadership Development</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Train emerging community leaders through workshops, coaching, and hands-on experience in organizing
                    and leading local initiatives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Get Involved */}
        <section className="py-20 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ways to Serve</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Join a Service Project</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Participate in one of our monthly community service events. No long-term commitment required—just
                      show up and serve.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Lead an Initiative</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Have a vision for community impact? We'll help you develop and launch your own initiative with
                      training, resources, and support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Partner with Us</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      If you represent a local organization, let's collaborate to multiply our impact and serve our
                      community more effectively.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Be Part of Something Bigger
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-balance leading-relaxed">
              Your community needs your time, talents, and leadership. Join us in creating lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-involved">
                  Start Serving <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
