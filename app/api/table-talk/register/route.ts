import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail } from "@/lib/email-service"
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

    // Create contact and send welcome/confirmation email
    try {
      const { contact, isNewContact } = await createContact({
        firstName,
        lastName,
        email,
        cellphone: phone,
        source: "event_registration",
        sourceDetails: `Table Talk for Men - ${sessionDate}`,
      })

      if (isNewContact && contact) {
        await sendWelcomeEmail(contact.id)
        console.log(`[v0] Welcome email sent to: ${email}`)
      }
    } catch (emailError) {
      console.error("[v0] Error sending welcome email:", emailError)
      // Don't fail the registration if email fails
    }

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
