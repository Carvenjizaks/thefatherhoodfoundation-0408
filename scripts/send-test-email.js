// Send a test email via the test-email API endpoint
const BASE_URL = "http://localhost:3000"

async function sendTestEmail() {
  console.log("Sending test email to carvenjizaks@gmail.com...")

  try {
    // Check config first
    const configRes = await fetch(`${BASE_URL}/api/test-email`)
    const config = await configRes.json()
    console.log("Email config:", JSON.stringify(config, null, 2))

    // Send test email
    const res = await fetch(`${BASE_URL}/api/test-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "carvenjizaks@gmail.com" }),
    })

    const result = await res.json()
    console.log("Status:", res.status)
    console.log("Test email result:", JSON.stringify(result, null, 2))
  } catch (err) {
    console.error("Error:", err.message)
  }
}

sendTestEmail()
