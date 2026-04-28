// Email diagnostics test script
// Run with: node scripts/test-email-diagnostics.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function runDiagnostics() {
  console.log('========================================')
  console.log('EMAIL DIAGNOSTICS TEST')
  console.log('========================================\n')

  // Step 1: Check email configuration
  console.log('Step 1: Checking email configuration...\n')
  
  try {
    const configResponse = await fetch(`${BASE_URL}/api/email-diagnostics`)
    const configData = await configResponse.json()
    
    console.log('Email Configuration Status:')
    console.log('---------------------------')
    console.log('SMTP API Key configured:', configData.config.smtp_api_key_set ? 'YES' : 'NO')
    console.log('SMTP Channel:', configData.config.smtp_channel || 'NOT SET')
    console.log('Sender Email:', configData.config.from_email || 'NOT SET')
    console.log('Sender Name:', configData.config.from_name || 'NOT SET')
    console.log('Admin Email:', configData.config.admin_email || 'NOT SET')
    console.log('\nOverall Status:', configData.status)
    
    if (configData.missing_vars && configData.missing_vars.length > 0) {
      console.log('\n⚠️  Missing environment variables:')
      configData.missing_vars.forEach(v => console.log(`   - ${v}`))
    }
    
    if (configData.warnings && configData.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      configData.warnings.forEach(w => console.log(`   - ${w}`))
    }
    
  } catch (error) {
    console.error('Failed to check configuration:', error.message)
  }

  // Step 2: Send test email
  console.log('\n\n========================================')
  console.log('Step 2: Sending test email...')
  console.log('========================================\n')

  const testEmail = process.argv[2] || 'test@example.com'
  console.log('Test recipient:', testEmail)
  
  try {
    const sendResponse = await fetch(`${BASE_URL}/api/email-diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testEmail,
        testType: 'registration' 
      })
    })
    
    const sendData = await sendResponse.json()
    
    console.log('\nTest Email Result:')
    console.log('------------------')
    console.log('Success:', sendData.success ? 'YES' : 'NO')
    console.log('Message:', sendData.message)
    
    if (sendData.details) {
      console.log('\nDetails:')
      console.log('  - To:', sendData.details.to)
      console.log('  - Subject:', sendData.details.subject)
      console.log('  - Timestamp:', sendData.details.timestamp)
    }
    
    if (sendData.error) {
      console.log('\n❌ Error:', sendData.error)
    }
    
  } catch (error) {
    console.error('Failed to send test email:', error.message)
  }

  console.log('\n========================================')
  console.log('DIAGNOSTICS COMPLETE')
  console.log('========================================')
  console.log('\nCheck the server logs for detailed [v0] debug output.')
}

runDiagnostics()
