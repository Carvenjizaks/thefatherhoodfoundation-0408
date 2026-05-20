// Test the simplified friend invitation email
const BASE_URL = "https://thefatherhoodfoundation.org";

async function testSimpleInvitation() {
  console.log("🧪 Testing Simplified Friend Invitation Email");
  console.log("=".repeat(60));

  const testPayload = {
    referrerName: "Carven Izaks",
    referrerEmail: "carvenjizaks@gmail.com",
    // No personalNote - keeping it simple and authentic
    friends: [
      {
        name: "Test Friend",
        email: "carvenjizaks@gmail.com"
      }
    ]
  };

  console.log("📤 Sending invitation without personal note...");

  try {
    const response = await fetch(`${BASE_URL}/api/goc26/referral/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    console.log("📊 Response Status:", response.status);
    console.log("📦 Response:", JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log("\n✅ Simplified invitation sent successfully!");
      console.log("📧 Check your inbox for the cleaner version");
    } else {
      console.log("\n❌ Failed:", data.error);
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

testSimpleInvitation();
