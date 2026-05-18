import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createContact, sendWelcomeEmail, sendRegistrationConfirmationEmail, sendAdminNotification } from "@/lib/email-service"
import { generateRegistrationCode, extractCodeNumber } from "@/lib/registration-code"
import { verifyAdminRequest } from "@/lib/admin-auth"
import crypto from "crypto"

// Events that are closed for public registration (admin walk-in still allowed)
const CLOSED_EVENT_SLUGS = ["my-great-marriage-2026"]

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
      spouseName,
      numberOfAttendees,
    } = body

    // Validate required fields (eventDate is optional — defaults to today for walk-ins)
    if (!firstName || !lastName || !email || !eventSlug || !eventName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Determine if this is an authenticated admin request (checked once, reused below)
    const isAdmin = await verifyAdminRequest()

    // Block public registrations for closed events — admins can still register walk-ins
    if (CLOSED_EVENT_SLUGS.includes(eventSlug) && !isAdmin) {
      return NextResponse.json(
        { error: "Registration for this event is closed." },
        { status: 403 }
      )
    }

    // Use provided date or default to today for walk-in registrations
    const resolvedEventDate = eventDate || new Date().toISOString().split("T")[0]

    const supabase = createAdminClient()

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

    // Block duplicate public registrations; admins can register walk-ins regardless
    if (existingRegistration && !isAdmin) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 400 }
      )
    }

    // Build spouse name if provided — support both combined spouseName or split first/last
    const resolvedSpouseName = spouseName
      || (spouseFirstName && spouseLastName ? `${spouseFirstName} ${spouseLastName}` : spouseFirstName)
      || null

    // Build tags for event registration - always includes "Event" + the specific event slug
    const eventTags = Array.from(new Set(["Event", eventSlug].filter(Boolean))) as string[]

    // Generate referral token for GOC26 registrations
    const isGOC26 = eventSlug === "goc26"
    const referralToken = isGOC26 ? crypto.randomBytes(16).toString("hex") : null

    // Insert registration (matching actual database schema)
    const insertData: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      event_id: eventSlug,
      event_name: eventName,
      session_date: resolvedEventDate,
      dynamic_code: registrationCode,
      payment_amount: parseFloat(paymentAmount) || 0,
      payment_status: "unpaid",
      spouse_name: resolvedSpouseName,
      spouse_email: null,
      spouse_phone: null,
      checked_in: false,
      tags: eventTags,
    }
    
    // Try to add referral_token if the column exists (GOC26 only)
    if (isGOC26 && referralToken) {
      insertData.referral_token = referralToken
    }
    
    console.log("[v0] Inserting registration for event:", eventSlug, "isGOC26:", isGOC26)
    
    let registration
    let insertError
    
    // First try with referral_token (if GOC26)
    const result = await supabase
      .from("event_registrations")
      .insert(insertData)
      .select()
      .single()
    
    // If insert failed due to referral_token column not existing, retry without it
    if (result.error && result.error.message.includes("referral_token")) {
      console.log("[v0] referral_token column not found, retrying without it")
      delete insertData.referral_token
      const retryResult = await supabase
        .from("event_registrations")
        .insert(insertData)
        .select()
        .single()
      registration = retryResult.data
      insertError = retryResult.error
    } else {
      registration = result.data
      insertError = result.error
    }

    if (insertError) {
      console.log("[v0] Registration insert error:", insertError.message)
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
        sourceDetails: `${eventName} - ${resolvedEventDate}`,
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
        sessionDate: resolvedEventDate,
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
      referralToken: referralToken,
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
