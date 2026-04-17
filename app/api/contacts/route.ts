import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendSubscriptionNotification, type ContactSource } from "@/lib/email-service"


export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      cellphone,
      source,
      sourceDetails,
      spouseFirstName,
      spouseEmail,
      spouseCellphone,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !source) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, source" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create contact
    const { contact, isNewContact } = await createContact({
      firstName,
      lastName,
      email,
      cellphone,
      source: source as ContactSource,
      sourceDetails,
      spouseFirstName,
      spouseEmail,
      spouseCellphone,
    })

    // Send welcome email for new contacts
    console.log("[v0] Contact result - isNewContact:", isNewContact, "contactId:", contact?.id)
    if (isNewContact && contact) {
      console.log("[v0] Sending welcome email to:", email)
      try {
        const welcomeResult = await sendWelcomeEmail(contact.id)
        console.log("[v0] Welcome email result:", welcomeResult)
      } catch (emailError) {
        console.error("[v0] Welcome email error:", emailError)
      }
      
      // Send admin notification for new subscriptions
      console.log("[v0] Sending admin subscription notification")
      try {
        const notifResult = await sendSubscriptionNotification({
          subscriberName: `${firstName} ${lastName}`,
          subscriberEmail: email,
          source: source,
          sourceDetails: sourceDetails,
        })
        console.log("[v0] Admin notification result:", notifResult)
      } catch (notifError) {
        console.error("[v0] Admin notification error:", notifError)
      }
    } else {
      console.log("[v0] Skipping emails - existing contact or no contact data")
    }

    return NextResponse.json({
      success: true,
      message: isNewContact
        ? "Contact created successfully. Welcome email sent."
        : "Registration added to existing contact.",
      contactId: contact?.id,
      isNewContact,
    })
  } catch (error: unknown) {
    const err = error as { message?: string; details?: string; hint?: string; code?: string }
    console.error("[v0] Error creating contact:", {
      message: err.message,
      details: err.details,
      hint: err.hint,
      code: err.code,
    })
    return NextResponse.json(
      { error: "Failed to create contact", details: err.message },
      { status: 500 }
    )
  }
}
