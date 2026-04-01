"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, User, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"

type StudyType = "individual" | "group" | null

export default function CurriculumSignUpPage() {
  const [studyType, setStudyType] = useState<StudyType>(null)
  const [isOrg, setIsOrg] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-[80vh] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">You are all set!</h1>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for signing up. We will be in touch shortly with your next steps to begin the curriculum.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/curriculum">Back to Curriculum</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 pb-24 bg-muted/10 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16">
          {/* Page header */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Curriculum Sign Up</p>
            <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
              I want to Start with a Book
            </h1>
            <p className="text-muted-foreground leading-relaxed text-balance">
              Tell us a little about yourself and how you plan to engage with the curriculum.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Step 1 — Study type */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="font-semibold text-foreground text-lg">How will you be studying?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setStudyType("individual")}
                    className={`flex flex-col items-center gap-3 border-2 rounded-xl p-6 transition-all duration-200 text-center cursor-pointer ${
                      studyType === "individual"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <User className={`h-8 w-8 ${studyType === "individual" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-foreground">As an Individual</span>
                    <span className="text-sm text-muted-foreground leading-snug">
                      I will be studying on my own, at my own pace.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudyType("group")}
                    className={`flex flex-col items-center gap-3 border-2 rounded-xl p-6 transition-all duration-200 text-center cursor-pointer ${
                      studyType === "group"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <Users className={`h-8 w-8 ${studyType === "group" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-foreground">As a Group</span>
                    <span className="text-sm text-muted-foreground leading-snug">
                      I will be studying with others — a small group, church, or team.
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 — Personal details (shown once a study type is selected) */}
            {studyType && (
              <Card>
                <CardContent className="pt-6 space-y-5">
                  <h2 className="font-semibold text-foreground text-lg">Your Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                      <Input id="lastName" name="lastName" placeholder="Smith" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City / Location</Label>
                    <Input id="city" name="city" placeholder="e.g. Atlanta, GA" />
                  </div>

                  {studyType === "group" && (
                    <div className="space-y-2">
                      <Label htmlFor="groupSize">Approximate Group Size</Label>
                      <Input id="groupSize" name="groupSize" type="number" min={2} placeholder="e.g. 8" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3 — Organisation */}
            {studyType && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h2 className="font-semibold text-foreground text-lg">Are you from an organisation?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsOrg(true)}
                      className={`flex flex-col items-center gap-3 border-2 rounded-xl p-5 transition-all duration-200 text-center cursor-pointer ${
                        isOrg === true
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 bg-background"
                      }`}
                    >
                      <Building2 className={`h-7 w-7 ${isOrg === true ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-semibold text-foreground">Yes</span>
                      <span className="text-sm text-muted-foreground">I represent a church, company, or organisation.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOrg(false)}
                      className={`flex flex-col items-center gap-3 border-2 rounded-xl p-5 transition-all duration-200 text-center cursor-pointer ${
                        isOrg === false
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 bg-background"
                      }`}
                    >
                      <User className={`h-7 w-7 ${isOrg === false ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-semibold text-foreground">No</span>
                      <span className="text-sm text-muted-foreground">I am signing up as a private individual.</span>
                    </button>
                  </div>

                  {isOrg === true && (
                    <div className="space-y-5 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organisation / Company Name <span className="text-destructive">*</span></Label>
                        <Input id="orgName" name="orgName" placeholder="e.g. Grace Community Church" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgRole">Your Role</Label>
                        <Input id="orgRole" name="orgRole" placeholder="e.g. Pastor, HR Manager, Team Lead" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgWebsite">Website (optional)</Label>
                        <Input id="orgWebsite" name="orgWebsite" type="url" placeholder="https://yourorg.com" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            {studyType && isOrg !== null && (
              <Button type="submit" size="lg" className="w-full gap-2">
                Complete Sign Up
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already signed up?{" "}
            <Link href="/curriculum" className="text-primary underline underline-offset-4 hover:opacity-80">
              Back to Curriculum
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
