import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, type ContactSource } from "@/lib/email-service"

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
    if (isNewContact && contact) {
      await sendWelcomeEmail(contact.id)
    }

    return NextResponse.json({
      success: true,
      message: isNewContact
        ? "Contact created successfully. Welcome email sent."
        : "Registration added to existing contact.",
      contactId: contact?.id,
      isNewContact,
    })
  } catch (error) {
    console.error("[v0] Error creating contact:", error)
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    )
  }
}
