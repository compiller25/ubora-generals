# AzamPay Integration Testing Guide

## 🔧 Setup for Testing

### 1. Get AzamPay Credentials
- Visit: https://developers.azampay.co.tz
- Register for sandbox access
- Get: Client ID, App Name, Vendor ID

### 2. Update Environment Variables
```bash
# backend/.env
AZAMPAY_CLIENT_ID=9b535765-8f55-437e-8fae-465de21a3e40
AZAMPAY_CLIENT_SECRET=your_client_secret_here
AZAMPAY_TOKEN=your_auth_token_here
AZAMPAY_APP_NAME=Ubora Generals
AZAMPAY_VENDOR_ID=your_vendor_id_here
AZAMPAY_BASE_URL=https://sandbox.azampay.co.tz
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

### Method 1: Frontend Test Page
1. Open http://localhost:3000/test-payment
2. Click "Test AzamPay" 
3. Should get checkout URL in response
4. Check browser console for full response

### Method 2: Full User Flow
1. Go to: http://localhost:3000/checkout
2. Fill form and select "AzamPay (All Networks)"
3. Submit order
4. Should redirect to AzamPay checkout page

### Method 3: API Testing
```bash
# Test payment initiation
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"packageId": "dagaa-starter", "quantity": 1}],
    "paymentMethod": "azampay", 
    "deliveryAddress": "Test Address"
  }'
```

## ✅ Expected Response Format

**Success Response:**
```json
{
  "order": {...},
  "payment": {
    "transactionId": "12345",
    "checkoutUrl": "https://sandbox.azampay.co.tz/checkout/...",
    "message": "Please complete payment using the provided link."
  }
}
```

## 🔍 What to Check

1. **Order Creation**: Check MongoDB for new order record
2. **Payment URL**: Should receive valid AzamPay checkout URL  
3. **Redirects**: Frontend should redirect to AzamPay
4. **Callbacks**: Test success/fail callback URLs
5. **Status Updates**: Order status should update after payment

## 🌐 AzamPay Features

- **Multi-Network**: Supports all mobile money providers
- **Cards**: Visa, Mastercard support  
- **Bank**: Direct bank payments
- **USSD**: Works on basic phones
- **Real-time**: Instant payment confirmation

## 🚨 Common Issues

1. **Invalid Vendor ID**: Check format is UUID
2. **Callback URLs**: Must be publicly accessible
3. **CORS Issues**: AzamPay needs proper CORS setup
4. **SSL Required**: Production needs HTTPS

Ready to test once you have AzamPay credentials!
