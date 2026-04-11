// Send a test email directly via SMTP.com API
const SMTP_API_KEY = process.env.SMTP_API_KEY
const SMTP_CHANNEL = process.env.SMTP_CHANNEL || "default"
const FROM_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org"
const FROM_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation"
const TO_EMAIL = "carvenjizaks@gmail.com"

async function sendTestEmail() {
  console.log("Sending test email to:", TO_EMAIL)
  console.log("SMTP API Key:", SMTP_API_KEY ? "Set (" + SMTP_API_KEY.substring(0, 8) + "...)" : "NOT SET")
  console.log("Channel:", SMTP_CHANNEL)
  console.log("From:", FROM_NAME, "<" + FROM_EMAIL + ">")

  if (!SMTP_API_KEY) {
    console.error("ERROR: SMTP_API_KEY is not set")
    process.exit(1)
  }

  const body = {
    channel: SMTP_CHANNEL,
    recipients: {
      to: [{ address: TO_EMAIL, name: "Carven Jizaks" }],
    },
    originator: {
      from: {
        address: FROM_EMAIL,
        name: FROM_NAME,
      },
    },
    subject: "Test Email from The Fatherhood Foundation",
    body: {
      parts: [
        {
          type: "text/plain",
          content: "This is a test email from The Fatherhood Foundation website. If you received this, your email configuration is working correctly!",
        },
        {
          type: "text/html",
          content: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;"><div style="background:#8B2B3E;padding:20px;text-align:center;border-radius:12px 12px 0 0;"><h1 style="color:white;margin:0;">The Fatherhood Foundation</h1></div><div style="background:white;padding:30px;border:1px solid #eee;border-radius:0 0 12px 12px;"><h2 style="color:#3D1F0F;">Test Email Successful!</h2><p style="color:#5C3D2E;">This confirms that your email configuration is working correctly.</p><p style="color:#5C3D2E;">You will receive notifications for:</p><ul style="color:#5C3D2E;"><li>New event registrations (MGM, GOC)</li><li>New Table Talk registrations</li><li>New newsletter subscriptions</li></ul><p style="color:#999;font-size:12px;">Sent at: ' + new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" }) + '</p></div></div>',
        },
      ],
    },
  }

  try {
    const response = await fetch("https://api.smtp.com/v4/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + SMTP_API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()
    console.log("Response status:", response.status)
    console.log("Response:", data)

    if (response.ok) {
      console.log("SUCCESS: Test email sent to " + TO_EMAIL)
    } else {
      console.error("FAILED: Could not send email. Status:", response.status)
    }
  } catch (error) {
    console.error("ERROR:", error.message)
  }
}

sendTestEmail()
