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
        payment_status: "unpaid",
        tags: ["TT4Men"],
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
      console.log("[v0] ===== TABLE TALK REGISTRATION EMAIL FLOW START =====")
      console.log("[v0] Creating contact for:", email)
      
      const { contact, isNewContact } = await createContact({
        firstName,
        lastName,
        email,
        cellphone: phone,
        source: "event_registration",
        sourceDetails: `Table Talk for Men - ${sessionDate}`,
      })

      console.log("[v0] Contact created:", contact?.id, "isNew:", isNewContact)

      // Send welcome email for new contacts
      if (isNewContact && contact) {
        console.log("[v0] Sending welcome email to new contact...")
        const welcomeResult = await sendWelcomeEmail(contact.id)
        console.log("[v0] Welcome email result:", welcomeResult)
      }

      // Send registration confirmation email
      console.log("[v0] Sending registration confirmation email to:", email)
      const confirmResult = await sendRegistrationConfirmationEmail({
        email,
        firstName,
        lastName,
        eventName: "Table Talk for Men",
        sessionDate,
        sessionTime: "8:30am - 10:30am",
        location: "Scouts Hall, Suiderhof, Windhoek",
        dynamicCode,
        paymentAmount: "NAD 65",
      })
      console.log("[v0] Registration confirmation email result:", confirmResult)

      // Send admin notification
      console.log("[v0] Sending admin notification...")
      const adminResult = await sendAdminNotification({
        eventName: "Table Talk for Men",
        registrantName: `${firstName} ${lastName}`,
        registrantEmail: email,
        registrantPhone: phone,
        paymentAmount: "NAD 65",
        registrationCode: dynamicCode,
      })
      console.log("[v0] Admin notification result:", adminResult)
      console.log("[v0] ===== TABLE TALK REGISTRATION EMAIL FLOW END =====")
    } catch (emailError) {
      console.error("[v0] TABLE TALK EMAIL ERROR:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      registration: {
        dynamicCode,
        sessionDate,
        sessionTime: "8:30am - 10:30am",
        location: "Scouts Hall, Suiderhof, Windhoek",
        paymentAmount: "NAD 65",
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
