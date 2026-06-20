const { apigwClient } = require("selcom-apigw-client");

// Test configuration - use Selcom sandbox
const testConfig = {
  apiKey: process.env.SELCOM_API_KEY || "SELCOM_API_KEY_TEST",
  apiSecret: process.env.SELCOM_API_SECRET || "SELCOM_API_SECRET_TEST", 
  baseUrl: process.env.SELCOM_BASE_URL || "https://apigw.selcommobile.com/v1"
};

const client = new apigwClient(testConfig.baseUrl, testConfig.apiKey, testConfig.apiSecret);

async function testPaymentInitiation() {
  console.log("🧪 Testing Selcom Payment Initiation with Official SDK...");
  
  try {
    const testPayment = {
      vendor: testConfig.apiKey,
      order_id: `TEST-${Date.now()}`,
      buyer_email: "",
      buyer_name: "",
      buyer_phone: "255712345678",
      amount: 1000,
      currency: "TZS",
      buyer_userid: `TEST-USER-${Date.now()}`,
      operator: "TIGO",
      channel: "ussd",
      msisdn: "255712345678",
      billing_address: {
        email: "",
        phone_number: "255712345678",
        country_code: "TZ",
        first_name: "",
        last_name: "",
        address_1: "",
        city: "",
        state_or_region: "",
        zip_or_postal_code: "",
      },
      no_redirection: "0",
      cancel_url: "http://localhost:3000/checkout?cancelled=true",
      return_url: "http://localhost:3000/payment/callback",
      webhook_url: "http://localhost:3000/payment/callback",
    };

    console.log("📤 Sending payment request:", testPayment);
    
    const result = await client.postFunc("/checkout/create-order", testPayment);
    
    console.log("📥 Payment response:", result);
    
    if (result.resultcode === "000") {
      console.log("✅ Payment initiated successfully!");
      console.log(`Transaction ID: ${result.transid}`);
      console.log(`Reference: ${result.reference}`);
      
      // Test status check
      setTimeout(async () => {
        console.log("\n🔍 Checking payment status...");
        const statusPayload = {
          vendor: testConfig.apiKey,
          transid: result.transid,
        };
        const status = await client.postFunc("/checkout/order-status", statusPayload);
        console.log("📊 Status result:", status);
      }, 2000);
      
    } else {
      console.log("❌ Payment failed:", result.result);
    }
    
  } catch (error) {
    console.error("🚨 Test failed:", error);
  }
}

// Run the test
testPaymentInitiation();
