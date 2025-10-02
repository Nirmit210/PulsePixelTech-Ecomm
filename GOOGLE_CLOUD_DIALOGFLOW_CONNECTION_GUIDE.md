# 🔗 Complete Guide: Connect Dialogflow to Google Cloud

This guide provides step-by-step instructions to connect your Dialogflow chatbot to Google Cloud Platform.

## 📋 Prerequisites

- Google account (Gmail account works)
- Credit card for Google Cloud verification (free tier available)
- Your backend server code ready

## 🚀 Step 1: Create Google Cloud Account & Project

### 1.1 Sign up for Google Cloud
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept terms and conditions
4. **Important**: You'll need to verify with a credit card, but you get $300 free credits

### 1.2 Create a New Project
1. Click the project dropdown at the top
2. Click **"New Project"**
3. Enter project details:
   - **Project Name**: `PulsePixelTech Chatbot`
   - **Project ID**: `pulsepixeltech-chatbot` (must be globally unique)
   - **Organization**: Leave as default
4. Click **"Create"**
5. Wait for project creation (1-2 minutes)
6. **Important**: Note your Project ID - you'll need this later!

## 🔧 Step 2: Enable Required APIs

### 2.1 Enable Dialogflow API
1. In Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Dialogflow API"**
3. Click on **"Dialogflow API"**
4. Click **"Enable"**
5. Wait for activation (30 seconds)

### 2.2 Enable Cloud Resource Manager API (if needed)
1. Search for **"Cloud Resource Manager API"**
2. Click **"Enable"** if not already enabled

## 🔑 Step 3: Create Service Account

### 3.1 Navigate to Service Accounts
1. Go to **"IAM & Admin" > "Service Accounts"**
2. Click **"Create Service Account"**

### 3.2 Configure Service Account
1. **Service account details**:
   - **Name**: `dialogflow-chatbot`
   - **Description**: `Service account for PulsePixelTech chatbot`
   - Click **"Create and Continue"**

2. **Grant permissions**:
   - Click **"Select a role"**
   - Search for **"Dialogflow"**
   - Select **"Dialogflow API Client"**
   - Click **"Continue"**

3. **Grant users access** (optional):
   - Skip this step
   - Click **"Done"**

## 📁 Step 4: Generate Service Account Key

### 4.1 Create JSON Key
1. Find your service account in the list
2. Click on the **email address** of your service account
3. Go to the **"Keys"** tab
4. Click **"Add Key" > "Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. **Important**: The JSON file will download automatically - save it securely!

### 4.2 Secure Your Key File
1. Move the downloaded JSON file to your project folder:
   ```
   backend/
   ├── service-account-key.json  ← Place here
   ├── .env
   └── ...
   ```
2. **Never commit this file to Git!** Add to `.gitignore`:
   ```
   # Add to .gitignore
   service-account-key.json
   *.json
   ```

## 🎯 Step 5: Create Dialogflow Agent

### 5.1 Access Dialogflow Console
1. Go to [Dialogflow ES Console](https://dialogflow.cloud.google.com/)
2. Sign in with the same Google account
3. Accept terms of service

### 5.2 Create New Agent
1. Click **"Create Agent"**
2. Fill in agent details:
   - **Agent name**: `PulsePixelTech Chatbot`
   - **Default language**: `English`
   - **Default time zone**: `Your timezone`
   - **Google Project**: Select your project (`pulsepixeltech-chatbot`)
3. Click **"Create"**

### 5.3 Verify Connection
1. You should see your agent dashboard
2. Note the project ID matches your Google Cloud project

## ⚙️ Step 6: Configure Environment Variables

### 6.1 Extract Credentials from JSON
Open your downloaded JSON file and find these values:
```json
{
  "type": "service_account",
  "project_id": "pulsepixeltech-chatbot",
  "client_email": "dialogflow-chatbot@pulsepixeltech-chatbot.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### 6.2 Update Your .env File
Choose **Option A** (recommended) or **Option B**:

#### Option A: Environment Variables (Recommended for Production)
```env
# Google Dialogflow Configuration
GOOGLE_PROJECT_ID=pulsepixeltech-chatbot
GOOGLE_CLIENT_EMAIL=dialogflow-chatbot@pulsepixeltech-chatbot.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

#### Option B: Service Account File Path
```env
# Google Dialogflow Configuration
GOOGLE_PROJECT_ID=pulsepixeltech-chatbot
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

**Important Notes:**
- Replace values with your actual credentials
- For `GOOGLE_PRIVATE_KEY`, keep the quotes and `\n` characters
- Don't remove the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts

## 🎨 Step 7: Create Intents in Dialogflow

### 7.1 Product Search Intent
1. In Dialogflow Console, click **"Intents"**
2. Click **"Create Intent"**
3. **Intent name**: `product.search`
4. **Training phrases** - Add these:
   ```
   I need a gaming laptop
   Show me smartphones under 30000
   Looking for wireless headphones
   Best tablets for students
   Gaming laptop with good graphics
   Budget phones with good camera
   Laptops for programming
   I want to buy a phone
   Show me laptops under 70000
   Need a good camera phone
   ```
5. **Parameters** - Add these:
   - Parameter: `product-category`, Entity: `@sys.any`, Value: `$product-category`
   - Parameter: `unit-currency`, Entity: `@sys.unit-currency`, Value: `$unit-currency`
   - Parameter: `brand`, Entity: `@sys.any`, Value: `$brand`
6. **Response**: `Let me help you find the perfect products! 🛍️`
7. Click **"Save"**

### 7.2 Order Tracking Intent
1. Click **"Create Intent"**
2. **Intent name**: `order.track`
3. **Training phrases**:
   ```
   Track my order
   Where is my order
   Order status for #12345
   Check order #ORD123
   My order tracking
   When will my order arrive
   ```
4. **Parameters**:
   - Parameter: `order-number`, Entity: `@sys.any`, Value: `$order-number`
5. **Response**: `I'll help you track your order! 📦`
6. Click **"Save"**

### 7.3 FAQ Intents
Create separate intents for each FAQ category:

#### Return Policy Intent
- **Intent name**: `faq.return.policy`
- **Training phrases**:
  ```
  What is your return policy
  How to return a product
  Return policy details
  Can I return this item
  Refund policy
  ```
- **Response**: `You can return any product within 7 days of delivery in original condition.`

#### Shipping Intent
- **Intent name**: `faq.shipping`
- **Training phrases**:
  ```
  How long does shipping take
  Shipping charges
  Free delivery
  Express shipping
  Delivery time
  ```
- **Response**: `Standard delivery takes 3-5 business days. Free shipping on orders above ₹500!`

#### Payment Intent
- **Intent name**: `faq.payment`
- **Training phrases**:
  ```
  Payment methods
  How to pay
  Cash on delivery
  UPI payment
  Credit card payment
  ```
- **Response**: `We accept Credit/Debit Cards, UPI, Net Banking, Wallets, and Cash on Delivery.`

### 7.4 Greeting & Goodbye Intents
These are usually pre-created, but verify they exist:

#### Greeting Intent
- **Training phrases**: `Hi`, `Hello`, `Hey there`, `Good morning`, `Help me`
- **Response**: `Hi there! 👋 I'm your shopping assistant. How can I help you today?`

#### Goodbye Intent
- **Training phrases**: `Bye`, `Thank you`, `Thanks`, `Goodbye`, `See you later`
- **Response**: `Thank you for chatting! Have a great day! 👋`

## 🧪 Step 8: Test Your Setup

### 8.1 Test in Dialogflow Console
1. Use the **simulator** on the right side of Dialogflow Console
2. Try these test phrases:
   - "I need a gaming laptop"
   - "Track my order #123"
   - "What's your return policy?"
3. Verify intents are recognized correctly

### 8.2 Test Your Backend Connection
1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Run the basic test:
   ```bash
   node test-basic-chatbot.js
   ```

3. You should see:
   ```
   ✅ Dialogflow is connected and working
   ```

### 8.3 Test API Endpoints
```bash
# Test Dialogflow status
curl http://localhost:5000/api/chatbot/dialogflow-status

# Test chat functionality
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a gaming laptop", "sessionId": "test-123"}'
```

## 🔗 Step 9: Configure Webhook (Optional)

### 9.1 Enable Webhook in Dialogflow
1. In Dialogflow Console, go to **"Fulfillment"**
2. Enable **"Webhook"**
3. **URL**: `https://your-domain.com/api/chatbot/webhook`
   - For local testing: Use ngrok or similar tunneling service
4. Click **"Save"**

### 9.2 Enable Webhook for Specific Intents
1. Go to each intent you want to enhance
2. Scroll down to **"Fulfillment"**
3. Enable **"Enable webhook call for this intent"**
4. Click **"Save"**

## 🔍 Step 10: Troubleshooting

### Common Issues & Solutions

#### 1. "Authentication Error"
```
Error: Could not load the default credentials
```
**Solution**:
- Check your `.env` file has correct credentials
- Verify the JSON file path is correct
- Ensure the service account has proper permissions

#### 2. "Project Not Found"
```
Error: Project pulsepixeltech-chatbot not found
```
**Solution**:
- Verify the project ID in your `.env` file
- Check the project exists in Google Cloud Console
- Ensure you're using the correct Google account

#### 3. "Dialogflow API Not Enabled"
```
Error: Dialogflow API has not been used
```
**Solution**:
- Go to Google Cloud Console > APIs & Services > Library
- Search for "Dialogflow API" and enable it
- Wait a few minutes for activation

#### 4. "Permission Denied"
```
Error: The caller does not have permission
```
**Solution**:
- Check service account has "Dialogflow API Client" role
- Regenerate service account key if needed
- Verify you're using the correct project

### Debug Steps
1. **Check credentials**:
   ```bash
   # Test if credentials are loaded
   node -e "console.log(process.env.GOOGLE_PROJECT_ID)"
   ```

2. **Verify API is enabled**:
   - Go to Google Cloud Console > APIs & Services > Dashboard
   - Look for "Dialogflow API" in enabled APIs

3. **Test with simple request**:
   ```bash
   node test-basic-chatbot.js
   ```

## 🎉 Success Checklist

- ✅ Google Cloud project created
- ✅ Dialogflow API enabled
- ✅ Service account created with proper permissions
- ✅ Service account key downloaded and configured
- ✅ Dialogflow agent created and linked to project
- ✅ Intents created with training phrases
- ✅ Environment variables configured
- ✅ Backend connection tested successfully
- ✅ Chat functionality working

## 📊 Free Tier Limits

Your setup includes these free resources:
- **Dialogflow ES**: 15,000 text requests/month
- **Google Cloud**: $300 credit for new accounts
- **API Calls**: Generous free quotas for most APIs

Perfect for development and small-scale production use!

## 🚀 Next Steps

1. **Test thoroughly**: Use the test scripts to verify everything works
2. **Add more intents**: Expand your chatbot's capabilities
3. **Monitor usage**: Check Google Cloud Console for API usage
4. **Deploy**: Your chatbot is ready for production!

## 📞 Need Help?

- **Google Cloud Support**: [Cloud Console Support](https://console.cloud.google.com/support)
- **Dialogflow Documentation**: [Official Docs](https://cloud.google.com/dialogflow/es/docs)
- **Community**: [Stack Overflow](https://stackoverflow.com/questions/tagged/dialogflow)

---

**🎉 Congratulations!** Your Dialogflow chatbot is now connected to Google Cloud and ready to help customers discover products, track orders, and answer questions with advanced AI capabilities!