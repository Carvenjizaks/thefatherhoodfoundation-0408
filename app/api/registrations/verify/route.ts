import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isValidCodeFormat } from "@/lib/registration-code"

export async function POST(request: Request) {
  try {
    const { code, action } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Registration code is required" }, { status: 400 })
    }

    const normalizedCode = code.toUpperCase().trim()

    if (!isValidCodeFormat(normalizedCode)) {
      return NextResponse.json({ 
        valid: false, 
        error: "Invalid code format" 
      }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up the registration by dynamic_code
    const { data: registration, error } = await supabase
      .from("table_talk_registrations")
      .select("*")
      .eq("dynamic_code", normalizedCode)
      .single()

    if (error || !registration) {
      return NextResponse.json({ 
        valid: false, 
        error: "Registration not found" 
      }, { status: 404 })
    }

    // If just verifying (not checking in)
    if (action !== "checkin") {
      return NextResponse.json({
        valid: true,
        registration: {
          id: registration.id,
          firstName: registration.first_name,
          lastName: registration.last_name,
          email: registration.email,
          phone: registration.phone,
          sessionDate: registration.session_date,
          paymentStatus: registration.payment_status,
          checkedIn: registration.checked_in,
          checkedInAt: registration.checked_in_at,
        }
      })
    }

    // Perform check-in
    if (registration.checked_in) {
      return NextResponse.json({
        valid: true,
        alreadyCheckedIn: true,
        checkedInAt: registration.checked_in_at,
        registration: {
          id: registration.id,
          firstName: registration.first_name,
          lastName: registration.last_name,
        }
      })
    }

    // Update check-in status
    const { error: updateError } = await supabase
      .from("table_talk_registrations")
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", registration.id)

    if (updateError) {
      console.error("[v0] Check-in update error:", updateError)
      return NextResponse.json({ error: "Failed to check in" }, { status: 500 })
    }

    // Log the check-in action
    await supabase.from("checkin_audit_log").insert({
      registration_id: registration.id,
      action: "checkin",
      performed_by: "admin",
      details: { code: normalizedCode, timestamp: new Date().toISOString() },
    })

    return NextResponse.json({
      valid: true,
      success: true,
      message: "Successfully checked in",
      registration: {
        id: registration.id,
        firstName: registration.first_name,
        lastName: registration.last_name,
        sessionDate: registration.session_date,
      }
    })

  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to lookup by code without check-in
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Code parameter required" }, { status: 400 })
  }

  const normalizedCode = code.toUpperCase().trim()

  if (!isValidCodeFormat(normalizedCode)) {
    return NextResponse.json({ valid: false, error: "Invalid code format" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: registration, error } = await supabase
    .from("table_talk_registrations")
    .select("id, first_name, last_name, email, session_date, payment_status, checked_in, checked_in_at")
    .eq("dynamic_code", normalizedCode)
    .single()

  if (error || !registration) {
    return NextResponse.json({ valid: false, error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    valid: true,
    registration: {
      id: registration.id,
      firstName: registration.first_name,
      lastName: registration.last_name,
      email: registration.email,
      sessionDate: registration.session_date,
      paymentStatus: registration.payment_status,
      checkedIn: registration.checked_in,
      checkedInAt: registration.checked_in_at,
    }
  })
}
