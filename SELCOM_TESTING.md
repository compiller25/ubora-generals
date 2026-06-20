# Selcom PesaPal Testing Guide

## 🔧 Setup for Testing

### 1. Get Selcom Test Credentials
```bash
# Visit: https://developer.selcommobile.com
# Register and get sandbox credentials:
# - API Key (for testing)  
# - API Secret (for testing)
```

### 2. Update Environment Variables
```bash
# backend/.env
SELCOM_API_KEY=your_test_api_key_here
SELCOM_API_SECRET=your_test_api_secret_here
SELCOM_BASE_URL=https://apigw.selcommobile.com/v1
```

### 3. Install and Start Services
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend  
cd ..
bun install
bun run dev
```

## 🧪 Testing Methods

### Method 1: Manual Testing via Frontend
1. Open http://localhost:3000
2. Go to checkout page
3. Fill form with test phone number: `255712345678`
4. Select M-Pesa, Airtel, or Tigo
5. Submit order
6. Check browser console and backend logs

### Method 2: Direct API Testing
```bash
# Test payment initiation
cd backend
npx ts-node src/test-selcom.ts
```

### Method 3: Postman/Thunder Client Testing
```http
POST http://localhost:4000/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [{"packageId": "dagaa-starter", "quantity": 1}],
  "paymentMethod": "mpesa",
  "deliveryAddress": "Test Address",
  "phoneNumber": "255712345678"
}
```

## 📱 Test Phone Numbers (Sandbox)

```
M-Pesa:      255712345678
Airtel:      255752345678  
Tigo:        255772345678
```

## ✅ What to Check

1. **Payment Initiation**: 
   - Order created in database
   - Selcom API called successfully
   - Transaction ID returned

2. **Payment Status**:
   - Status endpoint works: `GET /api/orders/payment/status/:orderId`
   - Frontend polls for updates
   - UI shows correct status

3. **Webhook Handling**:
   - Callback endpoint receives data: `POST /api/orders/payment/callback`
   - Order status updates correctly
   - Email sent on success

## 🔍 Debugging Steps

### Check Backend Logs
```bash
# Look for these logs
✅ Payment initiated successfully
📥 Payment response: {...}  
🔍 Checking payment status...
```

### Check Database
```javascript
// Connect to MongoDB and check:
db.orders.find().sort({createdAt: -1}).limit(5)
// Look for: status, transactionId, paymentReference
```

### Check Frontend Network Tab
- API calls to `/api/orders`
- Payment status polling calls
- Callback redirects

## 🚨 Common Issues & Fixes

1. **"Payment service temporarily unavailable"**
   - Check Selcom credentials
   - Verify API endpoint URL
   - Check network connectivity

2. **"Phone number is required"**
   - Ensure phone number field is filled
   - Check format: +255XXXXXXXXX

3. **Webhook not received**
   - Use ngrok for local testing: `ngrok http 4000`
   - Update resultUrl to ngrok URL
   - Check Selcom dashboard for webhook delivery

## 🌐 Production Testing

1. **Use Live Credentials**: Update .env with production keys
2. **Real Phone Numbers**: Test with actual mobile money accounts  
3. **HTTPS Required**: Webhooks need secure endpoints
4. **Monitor Logs**: Check both app logs and Selcom dashboard
