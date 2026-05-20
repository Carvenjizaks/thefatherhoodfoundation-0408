// Test GOC26 Referral API Endpoints
// These tests hit the LIVE endpoints on thefatherhoodfoundation.org

const BASE_URL = "https://thefatherhoodfoundation.org";

// Test 1: Trigger the cron job (sends referral request emails to yesterday's registrants)
async function testCronJob() {
  console.log("\n" + "=".repeat(70));
  console.log("🧪 TEST 1: Trigger Cron Job - Send Referral Request Emails");
  console.log("=".repeat(70));
  console.log("Endpoint: GET /api/cron/send-referral-followup");
  console.log("This sends 'Invite 3 Men' emails to yesterday's GOC26 registrants\n");

  try {
    const response = await fetch(`${BASE_URL}/api/cron/send-referral-followup`, {
      method: "GET",
      headers: {
        // The cron job may require a secret - if so, add it here
        // "Authorization": "Bearer YOUR_CRON_SECRET"
      }
    });

    const data = await response.json();

    console.log("📊 Response Status:", response.status);
    console.log("📦 Response Data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✅ TEST 1 PASSED: Cron job executed successfully");
      if (data.sent > 0) {
        console.log(`   📧 Sent ${data.sent} referral request emails`);
      } else {
        console.log("   ℹ️ No new registrations to process (expected if no one registered yesterday)");
      }
    } else {
      console.log("\n❌ TEST 1 FAILED:", data.error || "Unknown error");
    }
  } catch (error) {
    console.error("\n❌ TEST 1 ERROR:", error.message);
  }
}

// Test 2: Send friend invitation email (simulates referrer submitting the form)
async function testFriendInvitation() {
  console.log("\n" + "=".repeat(70));
  console.log("🧪 TEST 2: Send Friend Invitation Email");
  console.log("=".repeat(70));
  console.log("Endpoint: POST /api/goc26/referral/send");
  console.log("This sends a personalized invitation from a referrer to their friend\n");

  const testPayload = {
    referrerName: "Carven Izaks",
    referrerEmail: "carvenjizaks@gmail.com",
    personalNote: "Hey bro, this event changed my life last year. I think you need to be there. It's time to step up.",
    friends: [
      {
        name: "Test Friend",
        email: "carvenjizaks@gmail.com" // Using your email for testing
      }
    ]
  };

  console.log("📤 Request Payload:");
  console.log(JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/api/goc26/referral/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    console.log("\n📊 Response Status:", response.status);
    console.log("📦 Response Data:", JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log("\n✅ TEST 2 PASSED: Friend invitation sent successfully!");
      console.log(`   📧 Sent to: ${testPayload.friends[0].email}`);
      console.log("   👤 Check your inbox (and spam folder)");
    } else {
      console.log("\n❌ TEST 2 FAILED:", data.error || "Unknown error");
    }
  } catch (error) {
    console.error("\n❌ TEST 2 ERROR:", error.message);
  }
}

// Test 3: Check if the referral form page exists
async function testReferralPage() {
  console.log("\n" + "=".repeat(70));
  console.log("🧪 TEST 3: Check Referral Form Page");
  console.log("=".repeat(70));
  console.log("Endpoint: GET /events/goc26/refer");
  console.log("This is the page where referrers invite their friends\n");

  try {
    const response = await fetch(`${BASE_URL}/events/goc26/refer`, {
      method: "GET"
    });

    console.log("📊 Response Status:", response.status);

    if (response.status === 200) {
      console.log("\n✅ TEST 3 PASSED: Referral form page exists");
    } else if (response.status === 404) {
      console.log("\n⚠️ TEST 3 WARNING: Referral form page not found (404)");
      console.log("   The page may need to be created");
    } else {
      console.log("\n⚠️ TEST 3: Unexpected status", response.status);
    }
  } catch (error) {
    console.error("\n❌ TEST 3 ERROR:", error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log("\n🚀 Testing GOC26 Referral System - Live API Endpoints");
  console.log("Target: " + BASE_URL);
  console.log("Time: " + new Date().toISOString());

  await testCronJob();
  await testFriendInvitation();
  await testReferralPage();

  console.log("\n" + "=".repeat(70));
  console.log("🏁 All API Tests Complete!");
  console.log("=".repeat(70));
  console.log("\n📋 Next Steps:");
  console.log("   1. Check your email inbox for the test messages");
  console.log("   2. Check spam folder if not in inbox");
  console.log("   3. If Test 3 failed (404), we need to create the referral form page");
}

runAllTests().catch(console.error);
