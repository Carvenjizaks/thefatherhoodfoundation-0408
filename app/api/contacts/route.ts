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
    if (isNewContact && contact) {
      try {
        await sendWelcomeEmail(contact.id)
      } catch (emailError) {
        console.error("Welcome email error:", emailError)
      }
      
      // Send admin notification for new subscriptions
      try {
        await sendSubscriptionNotification({
          subscriberName: `${firstName} ${lastName}`,
          subscriberEmail: email,
          source: source,
          sourceDetails: sourceDetails,
        })
      } catch (notifError) {
        console.error("Admin notification error:", notifError)
      }
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
    console.error("Error creating contact:", err.message)
    return NextResponse.json(
      { error: "Failed to create contact", details: err.message },
      { status: 500 }
    )
  }
}
