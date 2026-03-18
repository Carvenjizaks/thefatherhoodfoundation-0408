import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendRegistrationConfirmationEmail } from "@/lib/email-service"
import { generateRegistrationCode } from "@/lib/registration-code"
import { syncTableTalkRegistration } from "@/lib/globalcontrol"

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

    // Log the Supabase URL for debugging
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const fixedUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`
    console.log("[v0] Supabase URL:", fixedUrl)

    const supabase = await createClient()
    
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
        console.log(`[v0] Welcome email sent to: ${email}`)
      }

      // Always send registration confirmation email with event details and code
      const emailSent = await sendRegistrationConfirmationEmail({
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
      
      if (emailSent) {
        console.log(`[v0] Registration confirmation email sent to: ${email}`)
      } else {
        console.error(`[v0] Failed to send registration confirmation email to: ${email}`)
      }
    } catch (emailError) {
      console.error("[v0] Error sending emails:", emailError)
      // Don't fail the registration if email fails
    }

    // Sync to GlobalControl CRM (non-blocking)
    syncTableTalkRegistration({
      firstName,
      lastName,
      email,
      phone,
      sessionDate,
    }).catch((err) => console.error("[GlobalControl] Sync error:", err))

    console.log(`[v0] New Table Talk Registration:
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Session: ${sessionDate}
      Dynamic Code: ${dynamicCode}
    `)

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
