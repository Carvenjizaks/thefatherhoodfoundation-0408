import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendSubscriptionNotification } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      studyType,
      groupSize,
      isOrg,
      orgName,
      orgRole,
      orgWebsite,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !studyType) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, studyType" },
        { status: 400 }
      )
    }

    // Build source details
    const sourceDetails = [
      `Curriculum Sign Up - ${studyType === "individual" ? "Individual Study" : `Group Study${groupSize ? ` (${groupSize} people)` : ""}`}`,
      city ? `Location: ${city}` : null,
      isOrg && orgName ? `Organization: ${orgName}${orgRole ? ` - ${orgRole}` : ""}` : null,
    ].filter(Boolean).join(" | ")

    // Create contact
    const { contact, isNewContact } = await createContact({
      firstName,
      lastName,
      email,
      cellphone: phone,
      source: "newsletter", // Using newsletter as curriculum is informational
      sourceDetails,
    })

    // Send welcome email for new contacts
    if (isNewContact && contact) {
      try {
        await sendWelcomeEmail(contact.id)
      } catch (emailError) {
        console.error("[v0] Welcome email error:", emailError)
      }
      
      // Send admin notification
      try {
        await sendSubscriptionNotification({
          subscriberName: `${firstName} ${lastName}`,
          subscriberEmail: email,
          source: "curriculum_signup",
          sourceDetails,
        })
      } catch (notifError) {
        console.error("[v0] Admin notification error:", notifError)
      }
    }

    return NextResponse.json({
      success: true,
      message: isNewContact
        ? "Curriculum sign-up successful. Welcome email sent."
        : "Curriculum sign-up recorded for existing contact.",
      contactId: contact?.id,
      isNewContact,
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error("[v0] Error in curriculum sign-up:", err.message)
    return NextResponse.json(
      { error: "Failed to process sign-up", details: err.message },
      { status: 500 }
    )
  }
}
