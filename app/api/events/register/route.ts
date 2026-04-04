import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendRegistrationConfirmationEmail } from "@/lib/email-service"
import { generateRegistrationCode } from "@/lib/registration-code"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      eventSlug,
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      paymentAmount,
      spouseFirstName,
      spouseLastName,
      numberOfAttendees,
      specialRequirements,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !eventSlug || !eventName || !eventDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    console.log("[v0] Event registration API called for:", eventName, email)

    // Generate unique registration code
    const registrationCode = generateRegistrationCode("EVT")
    console.log("[v0] Generated registration code:", registrationCode)

    // Check for existing registration
    const { data: existingRegistration } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("email", email)
      .eq("event_id", eventSlug)
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 400 }
      )
    }

    // Build spouse name if provided
    const spouseName = spouseFirstName && spouseLastName 
      ? `${spouseFirstName} ${spouseLastName}` 
      : spouseFirstName || null

    // Insert registration (matching actual database schema)
    const insertData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      event_id: eventSlug,
      event_name: eventName,
      session_date: eventDate,
      dynamic_code: registrationCode,
      payment_amount: parseFloat(paymentAmount) || 0,
      payment_status: "pending",
      spouse_name: spouseName,
      spouse_email: null,
      spouse_phone: null,
      checked_in: false,
    }
    console.log("[v0] Inserting event registration:", JSON.stringify(insertData))

    const { data: registration, error: insertError } = await supabase
      .from("event_registrations")
      .insert(insertData)
      .select()
      .single()

    console.log("[v0] Insert result:", { registration, insertError })

    if (insertError) {
      console.error("[v0] Error inserting event registration:", insertError)
      return NextResponse.json(
        { error: "Failed to create registration", details: insertError.message },
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
        sourceDetails: `${eventName} - ${eventDate}`,
      })

      // Send welcome email for new contacts
      if (isNewContact && contact) {
        await sendWelcomeEmail(contact.id)
      }

      // Always send registration confirmation email
      console.log("[v0] Sending registration confirmation email to:", email)
      const emailSent = await sendRegistrationConfirmationEmail({
        email,
        firstName,
        lastName,
        eventName,
        sessionDate: eventDate,
        sessionTime: eventTime || "See event details",
        location: eventLocation || "See event details",
        dynamicCode: registrationCode,
        paymentAmount: paymentAmount ? `NAD ${paymentAmount}` : "Free",
      })

      console.log("[v0] Registration confirmation email result:", emailSent)
      if (emailSent) {
        console.log(`[v0] Registration confirmation email sent successfully to: ${email}`)
      } else {
        console.log(`[v0] Registration confirmation email FAILED for: ${email}`)
      }
    } catch (emailError) {
      console.error("[v0] Error sending emails:", emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      registrationCode,
      message: "Registration successful! Check your email for confirmation.",
    })
  } catch (error) {
    console.error("[v0] Event registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
