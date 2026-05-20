import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Look up the registration by referral token
    const { data: registration, error } = await supabase
      .from("event_registrations")
      .select("id, first_name, last_name, email, referral_token, referral_email_sent")
      .eq("referral_token", token)
      .eq("event_id", "goc26")
      .single()

    if (error || !registration) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired token" },
        { status: 404 }
      )
    }

    // Token is valid
    return NextResponse.json({
      valid: true,
      referrerName: `${registration.first_name} ${registration.last_name}`,
      referrerEmail: registration.email,
      referralEmailSent: registration.referral_email_sent
    })

  } catch (error) {
    console.error("[Validate Token] Error:", error)
    return NextResponse.json(
      { valid: false, error: "Failed to validate token" },
      { status: 500 }
    )
  }
}
