import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getEmailContent, MGM_EMAIL_CONTENT } from "@/lib/mgm/email-content"
import { buildWelcomeEmail, buildNurtureEmail, buildAnniversaryEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"
import { CYCLES } from "@/lib/mgm/schedule"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefatherhoodfoundation.org"

/**
 * TEST ENDPOINT: Sends all email types in sequence with delays for testing
 * 
 * JOURNEY STRUCTURE (9 months total):
 * - Cycle 1 (Months 1-3): FOUNDATION — Build your marriage on Christ
 * - 4-week pause
 * - Cycle 2 (Months 4-6): CONNECTION — Deepen intimacy and communication
 * - 4-week pause
 * - Cycle 3 (Months 7-9): GROWTH — Sustain and strengthen your marriage
 * 
 * EMAIL SEQUENCE (Per Month - 4 weeks):
 * - Week 1: COUPLES_1 - Shared encouragement (both receive)
 * - Week 2: HUSBANDS - Men's specific encouragement (husband only)
 * - Week 3: WIVES - Women's specific encouragement (wife only)
 * - Week 4: COUPLES_2 - Monthly check-in reminder (both receive)
 * 
 * TIMING: Every Tuesday at 06:00 South African Time (UTC+2 = 04:00 UTC)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, testEmail, month = 1 } = body

    // Validate admin access
    const adminSecret = request.headers.get("x-admin-secret")
    if (adminSecret !== process.env.CRON_SECRET && !testEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate month is within 1-9
    if (month < 1 || month > 9) {
      return NextResponse.json({ 
        error: "Month must be between 1 and 9",
        journeyStructure: {
          cycle1: "Months 1-3: Foundation",
          cycle2: "Months 4-6: Connection", 
          cycle3: "Months 7-9: Growth",
        }
      }, { status: 400 })
    }

    const supabase = await createClient()
    let subscription: any = null

    if (subscriptionId) {
      const { data, error } = await supabase
        .from("mgm_subscriptions")
        .select("*")
        .eq("id", subscriptionId)
        .single()
      
      if (error || !data) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }
      subscription = data
    } else if (testEmail) {
      // Find subscription by email
      const { data, error } = await supabase
        .from("mgm_subscriptions")
        .select("*")
        .or(`husband_email.eq.${testEmail.toLowerCase()},wife_email.eq.${testEmail.toLowerCase()}`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error || !data) {
        return NextResponse.json({ 
          error: "No active subscription found for this email",
          suggestion: "Sign up first at /my-great-marriage/keep-your-marriage-fresh" 
        }, { status: 404 })
      }
      subscription = data
    } else {
      return NextResponse.json({ 
        error: "Please provide subscriptionId or testEmail" 
      }, { status: 400 })
    }

    // Get content for all stream types
    const couples1Content = getEmailContent(month, "COUPLES_1")
    const husbandsContent = getEmailContent(month, "HUSBANDS")
    const wivesContent = getEmailContent(month, "WIVES")
    const couples2Content = getEmailContent(month, "COUPLES_2")

    if (!couples1Content || !husbandsContent || !wivesContent || !couples2Content) {
      return NextResponse.json({ error: `No content for month ${month}` }, { status: 400 })
    }

    const track = couples1Content.track

    const results: Array<{
      emailType: string
      week: number
      recipient: string
      scheduledTime: string
      status: string
      subject: string
      messageId?: string
      error?: string
    }> = []

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 1: WELCOME (Immediate on signup)
    // ═══════════════════════════════════════════════════════════════════════
    const welcomeEmail = buildWelcomeEmail({
      husbandFirstName: subscription.husband_first_name,
      wifeFirstName: subscription.wife_first_name,
      husbandToken: subscription.husband_preference_token,
      wifeToken: subscription.wife_preference_token,
    })
    const welcomeResult = await sendMgmEmail({ 
      to: [subscription.husband_email, subscription.wife_email], 
      ...welcomeEmail 
    })
    results.push({
      emailType: "WELCOME",
      week: 0,
      recipient: `${subscription.husband_email}, ${subscription.wife_email}`,
      scheduledTime: "Immediate (on signup)",
      status: welcomeResult.success ? "SENT" : "FAILED",
      subject: welcomeEmail.subject,
      messageId: welcomeResult.messageId,
      error: welcomeResult.error,
    })

    await delay(2000)

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 2: COUPLES_1 - Week 1 (Tuesday 06:00 SA Time)
    // ═══════════════════════════════════════════════════════════════════════
    const couples1Email = buildNurtureEmail({
      recipientName: subscription.husband_first_name,
      partnerName: subscription.wife_first_name,
      emailBlock: couples1Content.block,
      theme: track.theme,
      month: track.month,
      ctaUrl: `${SITE_URL}/my-great-marriage/check-in`,
      preferenceToken: subscription.husband_preference_token,
      recipientLabel: "couple emails",
      isCouple: true,
    })
    const couples1Result = await sendMgmEmail({ 
      to: [subscription.husband_email, subscription.wife_email], 
      ...couples1Email 
    })
    results.push({
      emailType: `COUPLES_1 (Cycle ${track.cycle}: ${track.cycleName})`,
      week: 1,
      recipient: `${subscription.husband_email}, ${subscription.wife_email}`,
      scheduledTime: "Tuesday Week 1 - 06:00 SA Time",
      status: couples1Result.success ? "SENT" : "FAILED",
      subject: couples1Email.subject,
      messageId: couples1Result.messageId,
      error: couples1Result.error,
    })

    await delay(2000)

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 3: HUSBANDS - Week 2 (Tuesday 06:00 SA Time)
    // ═══════════════════════════════════════════════════════════════════════
    const husbandsEmail = buildNurtureEmail({
      recipientName: subscription.husband_first_name,
      emailBlock: husbandsContent.block,
      theme: track.theme,
      month: track.month,
      ctaUrl: `${SITE_URL}/my-great-marriage`,
      preferenceToken: subscription.husband_preference_token,
      recipientLabel: "husband emails",
      isCouple: false,
    })
    const husbandsResult = await sendMgmEmail({ 
      to: subscription.husband_email, 
      ...husbandsEmail 
    })
    results.push({
      emailType: `HUSBANDS (Cycle ${track.cycle}: ${track.cycleName})`,
      week: 2,
      recipient: subscription.husband_email,
      scheduledTime: "Tuesday Week 2 - 06:00 SA Time",
      status: husbandsResult.success ? "SENT" : "FAILED",
      subject: husbandsEmail.subject,
      messageId: husbandsResult.messageId,
      error: husbandsResult.error,
    })

    await delay(2000)

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 4: WIVES - Week 3 (Tuesday 06:00 SA Time)
    // ═══════════════════════════════════════════════════════════════════════
    const wivesEmail = buildNurtureEmail({
      recipientName: subscription.wife_first_name,
      emailBlock: wivesContent.block,
      theme: track.theme,
      month: track.month,
      ctaUrl: `${SITE_URL}/my-great-marriage`,
      preferenceToken: subscription.wife_preference_token,
      recipientLabel: "wife emails",
      isCouple: false,
    })
    const wivesResult = await sendMgmEmail({ 
      to: subscription.wife_email, 
      ...wivesEmail 
    })
    results.push({
      emailType: `WIVES (Cycle ${track.cycle}: ${track.cycleName})`,
      week: 3,
      recipient: subscription.wife_email,
      scheduledTime: "Tuesday Week 3 - 06:00 SA Time",
      status: wivesResult.success ? "SENT" : "FAILED",
      subject: wivesEmail.subject,
      messageId: wivesResult.messageId,
      error: wivesResult.error,
    })

    await delay(2000)

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 5: COUPLES_2 - Week 4 (Tuesday 06:00 SA Time)
    // ═══════════════════════════════════════════════════════════════════════
    const couples2Email = buildNurtureEmail({
      recipientName: subscription.husband_first_name,
      partnerName: subscription.wife_first_name,
      emailBlock: couples2Content.block,
      theme: track.theme,
      month: track.month,
      ctaUrl: `${SITE_URL}/my-great-marriage/check-in`,
      preferenceToken: subscription.husband_preference_token,
      recipientLabel: "couple emails",
      isCouple: true,
    })
    const couples2Result = await sendMgmEmail({ 
      to: [subscription.husband_email, subscription.wife_email], 
      ...couples2Email 
    })
    results.push({
      emailType: `COUPLES_2 (Cycle ${track.cycle}: ${track.cycleName})`,
      week: 4,
      recipient: `${subscription.husband_email}, ${subscription.wife_email}`,
      scheduledTime: "Tuesday Week 4 - 06:00 SA Time",
      status: couples2Result.success ? "SENT" : "FAILED",
      subject: couples2Email.subject,
      messageId: couples2Result.messageId,
      error: couples2Result.error,
    })

    await delay(2000)

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL 6: ANNIVERSARY (On anniversary date)
    // ═══════════════════════════════════════════════════════════════════════
    const anniversaryEmail = buildAnniversaryEmail({
      husbandFirstName: subscription.husband_first_name,
      wifeFirstName: subscription.wife_first_name,
      yearsMarried: 5,
      anniversaryDate: subscription.anniversary_date || new Date().toISOString().split('T')[0],
      husbandToken: subscription.husband_preference_token,
      wifeToken: subscription.wife_preference_token,
    })
    const anniversaryResult = await sendMgmEmail({ 
      to: [subscription.husband_email, subscription.wife_email], 
      ...anniversaryEmail 
    })
    results.push({
      emailType: "ANNIVERSARY",
      week: 0,
      recipient: `${subscription.husband_email}, ${subscription.wife_email}`,
      scheduledTime: "On Anniversary Date - 06:00 SA Time",
      status: anniversaryResult.success ? "SENT" : "FAILED",
      subject: anniversaryEmail.subject,
      messageId: anniversaryResult.messageId,
      error: anniversaryResult.error,
    })

    const successCount = results.filter(r => r.status === "SENT").length
    const failedCount = results.filter(r => r.status === "FAILED").length

    return NextResponse.json({
      success: true,
      message: `Test complete: ${successCount} sent, ${failedCount} failed`,
      subscription: {
        id: subscription.id,
        husband: `${subscription.husband_first_name} (${subscription.husband_email})`,
        wife: `${subscription.wife_first_name} (${subscription.wife_email})`,
        currentMonth: subscription.current_month,
        currentWeek: subscription.current_week_in_cycle,
      },
      testedMonth: {
        month: track.month,
        cycle: track.cycle,
        cycleName: track.cycleName,
        theme: track.theme,
      },
      journeyStructure: {
        cycle1: "Months 1-3: FOUNDATION — Build your marriage on Christ",
        pause1: "4 weeks rest",
        cycle2: "Months 4-6: CONNECTION — Deepen intimacy and communication",
        pause2: "4 weeks rest",
        cycle3: "Months 7-9: GROWTH — Sustain and strengthen your marriage",
        complete: "Journey complete after Month 9",
      },
      emailSchedule: {
        timezone: "Africa/Johannesburg (UTC+2)",
        sendTime: "06:00 SA Time (04:00 UTC)",
        sendDay: "Every Tuesday",
        totalActiveWeeks: 36,
        totalPauseWeeks: 8,
        totalJourneyWeeks: 44,
      },
      results,
    })
  } catch (error) {
    console.error("[MGM Test Emails] Error:", error)
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

/**
 * GET: Show the email schedule documentation
 */
export async function GET() {
  return NextResponse.json({
    title: "MyGreatMarriage Email CRM System",
    timezone: "Africa/Johannesburg (UTC+2)",
    sendTime: "06:00 SA Time (04:00 UTC)",
    sendDay: "Every Tuesday",
    
    journeyStructure: {
      totalMonths: 9,
      totalActiveWeeks: 36,
      pauseWeeksBetweenCycles: 4,
      totalPauseWeeks: 8,
      totalJourneyWeeks: 44,
      cycles: CYCLES.map((c, i) => ({
        cycle: i + 1,
        months: `${c.start}-${c.end}`,
        theme: c.theme,
        description: c.description,
        followedByPause: i < 2,
      })),
    },

    emailSequence: {
      description: "9-month marriage enrichment journey across 3 cycles, with 4-week pauses between cycles",
      monthlySchedule: [
        {
          week: 1,
          type: "COUPLES_1",
          recipients: "Both husband and wife",
          purpose: "Shared encouragement and theme introduction",
          timing: "Tuesday 06:00 SA Time",
        },
        {
          week: 2,
          type: "HUSBANDS",
          recipients: "Husband only",
          purpose: "Men's specific encouragement and action",
          timing: "Tuesday 06:00 SA Time",
        },
        {
          week: 3,
          type: "WIVES",
          recipients: "Wife only", 
          purpose: "Women's specific encouragement and action",
          timing: "Tuesday 06:00 SA Time",
        },
        {
          week: 4,
          type: "COUPLES_2",
          recipients: "Both husband and wife",
          purpose: "Monthly check-in reminder and reflection",
          timing: "Tuesday 06:00 SA Time",
        },
      ],
    },

    specialEmails: {
      welcome: {
        timing: "Immediately on signup",
        recipients: "Both husband and wife",
        purpose: "Welcome to the journey + what to expect",
      },
      anniversary: {
        timing: "On wedding anniversary date at 06:00 SA Time",
        recipients: "Both husband and wife",
        purpose: "Celebrate years of marriage with blessing",
      },
    },

    monthlyContent: MGM_EMAIL_CONTENT.map((m) => ({
      month: m.month,
      cycle: m.cycle,
      cycleName: m.cycleName,
      theme: m.theme,
    })),

    testEndpoint: {
      method: "POST",
      url: "/api/mgm/test-emails",
      body: {
        testEmail: "your-email@example.com",
        month: "1-9 (defaults to 1)",
      },
      description: "Fires all 6 email types to test the complete sequence for a specific month",
    },

    cronEndpoints: {
      nurture: "/api/cron/mgm-nurture",
      anniversary: "/api/cron/mgm-anniversary",
    },
  })
}
