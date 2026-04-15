import { NextResponse } from "next/server"
import { confirmEmail, getContactByToken } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = body?.token

    if (!token || typeof token !== "string") {
      console.error("[v0] confirm-email POST - Missing or invalid token")
      return NextResponse.json(
        { success: false, error: "Confirmation token is required" },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      console.error("[v0] confirm-email POST - Invalid token format:", token)
      return NextResponse.json(
        { success: false, error: "Invalid confirmation token format" },
        { status: 400 }
      )
    }

    console.log("[v0] confirm-email POST - Confirming token:", token)
    const result = await confirmEmail(token)

    if (result.success && result.contact) {
      return NextResponse.json({
        success: true,
        firstName: result.contact.first_name,
        message: result.alreadyConfirmed 
          ? "Email was already confirmed" 
          : "Email confirmed successfully",
      })
    }

    console.error("[v0] confirm-email POST - Confirmation failed:", result.error)
    return NextResponse.json(
      { success: false, error: result.error || "Confirmation failed" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[v0] confirm-email POST - Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to confirm email. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      )
    }

    const contact = await getContactByToken(token)

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      emailConfirmed: contact.email_confirmed,
      firstName: contact.first_name,
    })
  } catch (error) {
    console.error("[v0] confirm-email GET - Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check confirmation status" },
      { status: 500 }
    )
  }
}
