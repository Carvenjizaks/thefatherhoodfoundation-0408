import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { resolve } from "path"

export async function POST(request: Request) {
  try {
    const { referrerName, friendName, personalMessage } = await request.json()

    if (!referrerName || !friendName) {
      return NextResponse.json(
        { error: "Referrer name and friend name are required" },
        { status: 400 }
      )
    }

    // Read the invitation email template
    const templatePath = resolve(process.cwd(), "emails/goc2026-friend-invitation.html")
    let template = readFileSync(templatePath, "utf-8")

    // Get first initial of referrer name
    const referrerInitial = referrerName.charAt(0).toUpperCase()

    // Default personal message if not provided
    const message = personalMessage || "I think you'd really benefit from this event. Hope you can join me!"

    // Replace template variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thefatherhoodfoundation.org"
    const registrationUrl = `${siteUrl}/events`

    template = template
      .replace(/\{\{referrerName\}\}/g, referrerName)
      .replace(/\{\{referrerInitial\}\}/g, referrerInitial)
      .replace(/\{\{friendName\}\}/g, friendName)
      .replace(/\{\{personalMessage\}\}/g, message)
      .replace(/\{\{registrationUrl\}\}/g, registrationUrl)

    return NextResponse.json({
      referrerName,
      friendName,
      html: template,
    })
  } catch (error) {
    console.error("Preview generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    )
  }
}
