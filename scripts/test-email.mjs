// Test script to send a notification email via the welcome-email API
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const payload = {
  email: 'Rodgerbeukes73@gmail.com',
  firstName: 'Rodger',
  lastName: 'Beukes',
  serviceArea: 'Worship & Music',
  organizationId: '00000000-0000-0000-0000-000000000000',
}

console.log('Sending test email to:', payload.email)
console.log('Using API at:', `${BASE_URL}/api/dreamteam/welcome-email`)

try {
  const res = await fetch(`${BASE_URL}/api/dreamteam/welcome-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  console.log('Response status:', res.status)
  console.log('Response body:', text)

  if (res.ok) {
    console.log('Test email sent successfully! Check inbox at Rodgerbeukes73@gmail.com')
  } else {
    console.error('Email API returned an error. Check RESEND_API_KEY and RESEND_FROM_EMAIL env vars.')
  }
} catch (err) {
  console.error('Failed to reach the API:', err.message)
  console.log('Make sure the dev server is running at', BASE_URL)
}
