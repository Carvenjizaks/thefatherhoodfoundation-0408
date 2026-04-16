import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendRegistrationConfirmationEmail, sendAdminNotification } from "@/lib/email-service"
import { generateRegistrationCode } from "@/lib/registration-code"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, sessionDate } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !sessionDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Generate unique, secure registration code
    const dynamicCode = generateRegistrationCode("TFF")

    // Insert registration
    const { data, error } = await supabase
      .from("table_talk_registrations")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        session_date: sessionDate,
        dynamic_code: dynamicCode,
      })
      .select()
      .single()

    if (error) {
      console.error("Registration error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        { error: `Registration failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Create contact and send emails
    try {
      const { contact, isNewContact } = await createContact({
        firstName,
        lastName,
        email,
        cellphone: phone,
        source: "event_registration",
        sourceDetails: `Table Talk for Men - ${sessionDate}`,
      })

      // Send welcome email for new contacts
      if (isNewContact && contact) {
        await sendWelcomeEmail(contact.id)
      }

      // Send registration confirmation email
      await sendRegistrationConfirmationEmail({
        email,
        firstName,
        lastName,
        eventName: "Table Talk for Men",
        sessionDate,
        sessionTime: "8:30am - 10:30am",
        location: "Scouts Hall, Suiderhof, Windhoek",
        dynamicCode,
        paymentAmount: "NAD 50",
      })

      // Send admin notification
      await sendAdminNotification({
        eventName: "Table Talk for Men",
        registrantName: `${firstName} ${lastName}`,
        registrantEmail: email,
        registrantPhone: phone,
        paymentAmount: "NAD 50",
        registrationCode: dynamicCode,
      })
    } catch (emailError) {
      console.error("[v0] Error sending emails:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      registration: {
        dynamicCode,
        sessionDate,
        sessionTime: "8:30am - 10:30am",
        location: "Scouts Hall, Suiderhof, Windhoek",
        paymentAmount: "NAD 50",
        paymentEmail: "finance@fathersfound.org",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
