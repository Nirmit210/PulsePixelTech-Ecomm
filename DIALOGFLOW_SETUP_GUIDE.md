# 🤖 Dialogflow ES Chatbot Setup Guide

This guide will help you set up Google Dialogflow ES (Free Tier) for the PulsePixelTech chatbot system.

## 📋 Prerequisites

- Google Cloud Platform account (free tier available)
- Node.js and npm installed
- Backend server running

## 🚀 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your **Project ID** (e.g., `pulsepixeltech-chatbot`)

## 🔧 Step 2: Enable Dialogflow API

1. In Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Dialogflow API"
3. Click **Enable**

## 🔑 Step 3: Create Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name: `dialogflow-chatbot`
4. Role: **Dialogflow API Client**
5. Click **Create and Continue**
6. Click **Done**

## 📁 Step 4: Generate Service Account Key

### Option A: JSON Key File (Recommended for Development)
1. Click on your service account
2. Go to **Keys** tab
3. Click **Add Key > Create New Key**
4. Choose **JSON** format
5. Download the file
6. Save it as `service-account-key.json` in your backend folder
7. Update your `.env` file:
```env
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_PROJECT_ID=your-project-id
```

### Option B: Environment Variables (Recommended for Production)
1. Open the downloaded JSON file
2. Copy the values to your `.env` file:
```env
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## 🎯 Step 5: Create Dialogflow Agent

1. Go to [Dialogflow ES Console](https://dialogflow.cloud.google.com/)
2. Click **Create Agent**
3. Agent name: `PulsePixelTech Chatbot`
4. Select your Google Cloud project
5. Click **Create**

## 📝 Step 6: Create Intents

Create the following intents in your Dialogflow agent:

### 1. Product Search Intent
- **Intent Name**: `product.search`
- **Training Phrases**:
  - "I need a gaming laptop"
  - "Show me smartphones under 30000"
  - "Looking for wireless headphones"
  - "Best tablets for students"
  - "Gaming laptop with good graphics"
  - "Budget phones with good camera"
  - "Laptops for programming"

- **Parameters**:
  - `product-category` (Entity: @sys.any)
  - `unit-currency` (Entity: @sys.unit-currency)
  - `brand` (Entity: @sys.any)

### 2. Order Tracking Intent
- **Intent Name**: `order.track`
- **Training Phrases**:
  - "Track my order"
  - "Where is my order"
  - "Order status for #12345"
  - "Check order #ORD123"
  - "My order tracking"

- **Parameters**:
  - `order-number` (Entity: @sys.any)

### 3. FAQ Intents
Create separate intents for each FAQ category:

#### Return Policy
- **Intent Name**: `faq.return.policy`
- **Training Phrases**:
  - "What is your return policy"
  - "How to return a product"
  - "Return policy details"
  - "Can I return this item"

#### Shipping Info
- **Intent Name**: `faq.shipping`
- **Training Phrases**:
  - "How long does shipping take"
  - "Shipping charges"
  - "Free delivery"
  - "Express shipping"

#### Payment Methods
- **Intent Name**: `faq.payment`
- **Training Phrases**:
  - "Payment methods"
  - "How to pay"
  - "Cash on delivery"
  - "UPI payment"

### 4. Greeting Intent
- **Intent Name**: `greeting`
- **Training Phrases**:
  - "Hi"
  - "Hello"
  - "Hey there"
  - "Good morning"
  - "Help me"

### 5. Goodbye Intent
- **Intent Name**: `goodbye`
- **Training Phrases**:
  - "Bye"
  - "Thank you"
  - "Thanks"
  - "Goodbye"

## 🔗 Step 7: Configure Webhook (Optional)

If you want to use webhook fulfillment:

1. In Dialogflow Console, go to **Fulfillment**
2. Enable **Webhook**
3. URL: `https://your-domain.com/api/chatbot/webhook`
4. Enable webhook for specific intents

## 🧪 Step 8: Test Your Setup

### Test Dialogflow Connection
```bash
# In your backend directory
curl http://localhost:5000/api/chatbot/dialogflow-status
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a gaming laptop",
    "sessionId": "test-session-123"
  }'
```

## 🎨 Step 9: Customize Responses

### Add Rich Responses in Dialogflow
1. In each intent, go to **Responses**
2. Add **Text Response**:
   - Product Search: "Let me help you find the perfect products! 🛍️"
   - Order Tracking: "I'll help you track your order! 📦"
   - FAQ: "I'm here to answer your questions! ❓"

### Add Quick Replies
1. Click **Add Response**
2. Select **Quick Replies**
3. Add relevant options:
   - "Show more options"
   - "Compare products"
   - "Need help"

## 🔧 Step 10: Environment Configuration

Update your `.env` file with the correct values:

```env
# Google Dialogflow Configuration
GOOGLE_PROJECT_ID=pulsepixeltech-chatbot
GOOGLE_CLIENT_EMAIL=dialogflow-chatbot@pulsepixeltech-chatbot.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Alternative: Use service account file path
# GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

## 🚀 Step 11: Start Your Server

```bash
cd backend
npm start
```

Your Dialogflow-powered chatbot is now ready! 🎉

## 📊 Features Included

✅ **Product Discovery**: Natural language product search  
✅ **Order Tracking**: Track orders with order numbers  
✅ **FAQ Support**: Automated answers to common questions  
✅ **Sentiment Analysis**: Emotional intelligence in responses  
✅ **Conversation Memory**: Context-aware conversations  
✅ **Fallback System**: Rule-based backup when Dialogflow is unavailable  
✅ **Analytics**: Conversation tracking and insights  

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Error**
   - Check your service account key
   - Verify project ID is correct
   - Ensure Dialogflow API is enabled

2. **Intent Not Recognized**
   - Add more training phrases
   - Check entity parameters
   - Test in Dialogflow simulator first

3. **Webhook Timeout**
   - Check your server is running
   - Verify webhook URL is accessible
   - Check firewall settings

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 Next Steps

1. **Train Your Agent**: Add more training phrases based on user interactions
2. **Add Entities**: Create custom entities for brands, categories, etc.
3. **Implement Analytics**: Track conversation metrics
4. **Add Integrations**: Connect to other platforms (Facebook, Telegram, etc.)
5. **Optimize Performance**: Monitor response times and accuracy

## 🆓 Free Tier Limits

Dialogflow ES Free Tier includes:
- 15,000 text requests per month
- Unlimited training
- Basic analytics
- Community support

Perfect for development and small-scale production use!

---

**Need Help?** Check the [Dialogflow Documentation](https://cloud.google.com/dialogflow/es/docs) or contact support.