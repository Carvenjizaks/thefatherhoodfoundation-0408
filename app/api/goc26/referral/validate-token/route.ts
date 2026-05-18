import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Validate a referral token and return the referrer information
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Find the registration with this referral token
    const { data: registration, error } = await supabase
      .from("event_registrations")
      .select("id, first_name, last_name, email, dynamic_code, referral_token")
      .eq("referral_token", token)
      .eq("event_id", "goc26")
      .single()

    if (error || !registration) {
      console.log("[Referral] Invalid token attempted:", token)
      return NextResponse.json(
        { valid: false, error: "Invalid or expired token" },
        { status: 404 }
      )
    }

    // Return referrer info (without exposing sensitive data)
    return NextResponse.json({
      valid: true,
      referrer: {
        id: registration.id,
        firstName: registration.first_name,
        lastName: registration.last_name,
        email: registration.email,
        registrationCode: registration.dynamic_code,
      }
    })

  } catch (error) {
    console.error("[Referral] Token validation error:", error)
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
