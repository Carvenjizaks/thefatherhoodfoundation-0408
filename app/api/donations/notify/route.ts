import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, amount, frequency, paymentMethod } = body

    // Log the donation for now (in production, you would send an email)
    console.log("=== NEW DONATION RECEIVED ===")
    console.log(`Donor: ${firstName} ${lastName}`)
    console.log(`Email: ${email}`)
    console.log(`Phone: ${phone || "Not provided"}`)
    console.log(`Amount: N$${amount}`)
    console.log(`Frequency: ${frequency}`)
    console.log(`Payment Method: ${paymentMethod}`)
    console.log("=============================")

    // TODO: Add email notification here using your preferred email service
    // Example with Resend, SendGrid, or other email provider:
    // await sendEmail({
    //   to: "admin@fatherhoodfoundation.org",
    //   subject: `New Donation: N$${amount} from ${firstName} ${lastName}`,
    //   body: `...`
    // })

    return NextResponse.json({ success: true, message: "Notification sent" })
  } catch (error) {
    console.error("Error sending donation notification:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send notification" },
      { status: 500 }
    )
  }
}
