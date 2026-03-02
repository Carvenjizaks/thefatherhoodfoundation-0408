import { NextResponse } from "next/server"
import { confirmEmail, getContactByToken } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Confirmation token is required" },
        { status: 400 }
      )
    }

    const result = await confirmEmail(token)

    if (result.success && result.contact) {
      return NextResponse.json({
        success: true,
        firstName: result.contact.first_name,
        message: "Email confirmed successfully",
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || "Confirmation failed" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[v0] Error confirming email:", error)
    return NextResponse.json(
      { success: false, error: "Failed to confirm email" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
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
}
