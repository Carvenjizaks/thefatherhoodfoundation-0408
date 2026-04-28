import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendRegistrationConfirmationEmail, sendAdminNotification } from "@/lib/email-service"
import { generateRegistrationCode, extractCodeNumber } from "@/lib/registration-code"


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

    // Get the current max registration number for this event
    const { data: existingCodes } = await supabase
      .from("event_registrations")
      .select("dynamic_code")
      .eq("event_id", eventSlug)
      .order("created_at", { ascending: false })
    
    // Find the highest number from existing codes
    let maxNumber = 0
    if (existingCodes && existingCodes.length > 0) {
      for (const record of existingCodes) {
        const num = extractCodeNumber(record.dynamic_code)
        if (num !== null && num > maxNumber) {
          maxNumber = num
        }
      }
    }

    // Generate sequential registration code (e.g., MGM-001, TT4M-102)
    const registrationCode = generateRegistrationCode(eventSlug, maxNumber)

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
    const { data: registration, error: insertError } = await supabase
      .from("event_registrations")
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create registration", details: insertError.message },
        { status: 500 }
      )
    }

    // Create contact and send emails
    try {
      console.log("[v0] ===== REGISTRATION EMAIL FLOW START =====")
      console.log("[v0] Creating contact for:", email)
      
      const { contact, isNewContact } = await createContact({
        firstName,
        lastName,
        email,
        cellphone: phone,
        source: "event_registration",
        sourceDetails: `${eventName} - ${eventDate}`,
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
        eventName,
        sessionDate: eventDate,
        sessionTime: eventTime || "See event details",
        location: eventLocation || "See event details",
        dynamicCode: registrationCode,
        paymentAmount: paymentAmount ? `NAD ${paymentAmount}` : "Free",
      })
      console.log("[v0] Registration confirmation email result:", confirmResult)

      // Send admin notification
      const spouseFullName = spouseFirstName && spouseLastName 
        ? `${spouseFirstName} ${spouseLastName}` 
        : spouseFirstName || undefined

      console.log("[v0] Sending admin notification...")
      const adminResult = await sendAdminNotification({
        eventName,
        registrantName: `${firstName} ${lastName}`,
        registrantEmail: email,
        registrantPhone: phone,
        spouseName: spouseFullName,
        paymentAmount: paymentAmount ? `NAD ${paymentAmount}` : "Free",
        registrationCode,
      })
      console.log("[v0] Admin notification result:", adminResult)
      console.log("[v0] ===== REGISTRATION EMAIL FLOW END =====")
    } catch (emailError) {
      console.error("[v0] REGISTRATION EMAIL ERROR:", emailError)
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
