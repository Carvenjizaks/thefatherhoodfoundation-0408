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

    // Generate unique registration code
    const registrationCode = generateRegistrationCode("EVT")

    // Check for existing registration
    const { data: existingRegistration } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("email", email)
      .eq("event_slug", eventSlug)
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 400 }
      )
    }

    // Insert registration
    const { data: registration, error: insertError } = await supabase
      .from("event_registrations")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        event_slug: eventSlug,
        event_name: eventName,
        event_date: eventDate,
        event_time: eventTime || "TBA",
        event_location: eventLocation || "TBA",
        registration_code: registrationCode,
        payment_amount: parseFloat(paymentAmount) || 0,
        payment_status: "pending",
        spouse_first_name: spouseFirstName || null,
        spouse_last_name: spouseLastName || null,
        number_of_attendees: numberOfAttendees || 1,
        special_requirements: specialRequirements || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error inserting event registration:", insertError)
      return NextResponse.json(
        { error: "Failed to create registration" },
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

      if (emailSent) {
        console.log(`[v0] Registration confirmation email sent to: ${email}`)
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
