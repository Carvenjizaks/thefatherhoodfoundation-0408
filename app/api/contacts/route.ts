import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendSubscriptionNotification, type ContactSource } from "@/lib/email-service"


export async function POST(request: Request) {
  try {
    console.log("[v0] Contacts API called - SUPABASE_URL exists:", !!process.env.SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL, "SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify({ firstName: body.firstName, lastName: body.lastName, email: body.email, source: body.source }))

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
      
      // Send admin notification for new subscriptions
      await sendSubscriptionNotification({
        subscriberName: `${firstName} ${lastName}`,
        subscriberEmail: email,
        source: source,
        sourceDetails: sourceDetails,
      })
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
