import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { generateRegistrationCode, extractCodeNumber, isValidCodeFormat, getEventAbbreviation } from "@/lib/registration-code"
import { sendRegistrationConfirmationEmail } from "@/lib/email-service"

// Migrate all existing registration codes to new sequential format and optionally send emails
export async function POST(req: Request) {
  try {
    const { sendEmails = false, eventId } = await req.json()
    
    const supabase = await createAdminClient()
    
    // Get all registrations, optionally filtered by event
    let query = supabase
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: true })
    
    if (eventId) {
      query = query.eq("event_id", eventId)
    }
    
    const { data: registrations, error } = await query
    
    if (error) {
      console.error("[v0] Error fetching registrations:", error)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }
    
    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found", updated: 0 })
    }
    
    // Group registrations by event_id
    const byEvent: Record<string, typeof registrations> = {}
    for (const reg of registrations) {
      const eid = reg.event_id || "unknown"
      if (!byEvent[eid]) {
        byEvent[eid] = []
      }
      byEvent[eid].push(reg)
    }
    
    const results: Array<{
      id: string
      email: string
      oldCode: string
      newCode: string
      emailSent: boolean
    }> = []
    
    // Process each event's registrations
    for (const [eventSlug, eventRegs] of Object.entries(byEvent)) {
      // Sort by created_at to maintain order
      eventRegs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      
      let sequenceNumber = 0
      
      for (const reg of eventRegs) {
        const oldCode = reg.dynamic_code
        
        // Check if already in new format
        if (isValidCodeFormat(oldCode)) {
          const existingNum = extractCodeNumber(oldCode)
          const expectedPrefix = getEventAbbreviation(eventSlug)
          if (oldCode.toUpperCase().startsWith(expectedPrefix)) {
            // Already migrated, track the highest number
            if (existingNum && existingNum > sequenceNumber) {
              sequenceNumber = existingNum
            }
            continue
          }
        }
        
        // Generate new sequential code
        sequenceNumber++
        const newCode = generateRegistrationCode(eventSlug, sequenceNumber - 1)
        
        // Update the registration
        const { error: updateError } = await supabase
          .from("event_registrations")
          .update({ dynamic_code: newCode })
          .eq("id", reg.id)
        
        if (updateError) {
          console.error(`[v0] Error updating registration ${reg.id}:`, updateError)
          continue
        }
        
        let emailSent = false
        
        // Send notification email if requested
        if (sendEmails && reg.email) {
          try {
            // Get event details for the email
            const { data: event } = await supabase
              .from("events")
              .select("title, event_date, event_time, location, registration_fee")
              .eq("slug", eventSlug)
              .single()
            
            if (event) {
              emailSent = await sendRegistrationConfirmationEmail({
                email: reg.email,
                firstName: reg.first_name,
                lastName: reg.last_name,
                eventName: event.title,
                sessionDate: event.event_date || "TBA",
                sessionTime: event.event_time || "TBA",
                location: event.location || "TBA",
                dynamicCode: newCode,
                paymentAmount: event.registration_fee ? `N$${event.registration_fee}` : "Free",
              })
            }
          } catch (emailError) {
            console.error(`[v0] Error sending email to ${reg.email}:`, emailError)
          }
        }
        
        results.push({
          id: reg.id,
          email: reg.email,
          oldCode,
          newCode,
          emailSent,
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} registration codes`,
      updated: results.length,
      emailsSent: results.filter(r => r.emailSent).length,
      results,
    })
    
  } catch (error) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json({ error: "Migration failed" }, { status: 500 })
  }
}
