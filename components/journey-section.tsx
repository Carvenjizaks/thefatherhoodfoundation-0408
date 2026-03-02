"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function JourneySection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-[#8B2B3E] mb-6 tracking-wide">
            IDENTITY - AFFIRMATION - PURPOSE
          </h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-[#8B2B3E] mb-4">The Journey to Authentic Manhood</h3>
          <p className="text-lg text-black max-w-3xl mx-auto text-balance font-medium">
            The fundamental solution for the fatherlessness problem can be categorized into 3 areas of a man's life
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B2B3E]/20 via-[#8B2B3E] to-[#8B2B3E]/20 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {/* Step 1: Identity */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#8B2B3E]/20 rounded-full blur-xl" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B2B3E] shadow-lg">
                  <Image
                    src="/images/step-identity.jpg"
                    alt="Identity - Self discovery"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-[#8B2B3E]/10 text-[#8B2B3E] text-sm font-bold px-4 py-1 rounded-full mb-4">STEP 1</div>
              <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4">Identity</h3>
              <Card className="w-full h-full">
                <CardContent className="p-6">
                  <p className="text-black leading-relaxed text-pretty">
                    A man must see himself accurately—through the lens of truth, not distortion. This is the foundation
                    of correct identity. To end fatherlessness, we must lead men to discover who they really are. This
                    understanding informs and empowers every responsibility a man carries in his life.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Affirmation */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#8B2B3E]/20 rounded-full blur-xl" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B2B3E] shadow-lg">
                  <Image
                    src="/images/step-affirmation.jpg"
                    alt="Affirmation - Father-son connection"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-[#8B2B3E]/10 text-[#8B2B3E] text-sm font-bold px-4 py-1 rounded-full mb-4">STEP 2</div>
              <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4">Affirmation</h3>
              <Card className="w-full h-full">
                <CardContent className="p-6">
                  <p className="text-black leading-relaxed text-pretty">
                    There is transformative power when a father affirms a son or daughter. Many men have never been
                    embraced or affirmed by their father. We believe this is what breaks and heals the father wound and
                    prepares men for their destiny. Strong men create strong sons.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 3: Purpose */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#8B2B3E]/20 rounded-full blur-xl" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B2B3E] shadow-lg">
                  <Image
                    src="/images/step-purpose.jpg"
                    alt="Purpose - Destiny and calling"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-[#8B2B3E]/10 text-[#8B2B3E] text-sm font-bold px-4 py-1 rounded-full mb-4">STEP 3</div>
              <h3 className="text-2xl font-bold text-[#8B2B3E] mb-4">Purpose</h3>
              <Card className="w-full h-full">
                <CardContent className="p-6">
                  <p className="text-black leading-relaxed text-pretty">
                    The best gift a father can give his son is to connect him to his purpose. Purpose identified
                    produces passion! Every man is meant to lead others toward something greater. We believe that once a
                    man has a clear identity and has been affirmed by a father, he must be launched into his purpose.
                    Every man was created with a purpose to fulfill. We must lead men to that purpose in order to
                    transform the world and end the plague of fatherlessness.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
