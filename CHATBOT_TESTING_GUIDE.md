# 🤖 Chatbot Testing Guide

## Quick Start Testing

### 1. **Backend API Testing**

First, ensure your backend server is running:
```bash
cd backend
npm run dev
```

Test the chatbot API endpoints:

#### Test Endpoint
```bash
curl http://localhost:5000/api/chatbot/test
```

#### Chat Endpoint
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a gaming laptop under 70000",
    "sessionId": "test_session_123"
  }'
```

#### Quick Replies
```bash
curl http://localhost:5000/api/chatbot/quick-replies
```

#### FAQs
```bash
curl http://localhost:5000/api/chatbot/faqs
```

### 2. **Frontend Testing**

Start the frontend development server:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and look for the chatbot button in the bottom-right corner.

## 🎯 **Test Scenarios**

### **Product Discovery Tests**
Try these messages in the chatbot:

1. **Gaming Laptop Search**
   - Input: "I need a gaming laptop under ₹70000"
   - Expected: Product recommendations with gaming laptops

2. **Phone Search**
   - Input: "Best phones under 30000"
   - Expected: Phone recommendations within budget

3. **Feature-based Search**
   - Input: "Laptop with SSD and 16GB RAM"
   - Expected: Laptops matching specifications

4. **Brand-specific Search**
   - Input: "Show me Dell laptops"
   - Expected: Dell laptop recommendations

### **Order Tracking Tests**

1. **Valid Order Number**
   - Input: "Track my order #12345"
   - Expected: Order status information

2. **Invalid Order Number**
   - Input: "Track order #99999"
   - Expected: Order not found message

3. **General Tracking Query**
   - Input: "Where is my order?"
   - Expected: Request for order number

### **FAQ Tests**

1. **Return Policy**
   - Input: "What's your return policy?"
   - Expected: Return policy information

2. **Shipping Information**
   - Input: "How long does shipping take?"
   - Expected: Shipping details

3. **Payment Methods**
   - Input: "What payment methods do you accept?"
   - Expected: Payment options list

4. **Warranty Information**
   - Input: "Do products come with warranty?"
   - Expected: Warranty details

### **Greeting Tests**

1. **Simple Greeting**
   - Input: "Hi"
   - Expected: Welcome message with quick replies

2. **Help Request**
   - Input: "I need help"
   - Expected: Support options

### **Edge Cases**

1. **Typos**
   - Input: "gamng laptap under 70000"
   - Expected: Should still understand gaming laptop

2. **Empty Message**
   - Input: ""
   - Expected: Error message

3. **Very Long Message**
   - Input: Long paragraph
   - Expected: Appropriate response or fallback

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Chatbot Button Not Appearing**
   - Check if LiveChat component is imported in layout
   - Verify no JavaScript errors in browser console

2. **API Errors**
   - Ensure backend server is running on port 5000
   - Check network tab for failed requests
   - Verify database connection

3. **No Product Recommendations**
   - Check if products exist in database
   - Run database seed: `npm run db:seed`
   - Verify product search logic

4. **Authentication Errors**
   - Admin endpoints require authentication
   - Use proper JWT token in Authorization header

### **Debug Mode**

Enable debug logging by adding this to chatbot service:
```javascript
console.log('Debug - Intent:', intent);
console.log('Debug - Entities:', entities);
console.log('Debug - Response:', response);
```

## 📊 **Expected Responses**

### **Product Search Response**
```json
{
  "success": true,
  "data": {
    "response": {
      "type": "products",
      "message": "Here are some excellent gaming laptops under ₹70,000! 💰",
      "products": [
        {
          "id": "1",
          "name": "Gaming Laptop XYZ",
          "price": 65000,
          "images": ["image1.jpg"],
          "avgRating": 4.5
        }
      ],
      "quickReplies": ["Show more options", "Filter by price"]
    },
    "intent": "product_search",
    "confidence": 0.9
  }
}
```

### **Order Tracking Response**
```json
{
  "success": true,
  "data": {
    "response": {
      "type": "order_status",
      "message": "Your order is out for delivery 🚚. Expected arrival: 2 days.",
      "order": {
        "orderNumber": "12345",
        "status": "OUT_FOR_DELIVERY",
        "totalAmount": 65000,
        "trackingNumber": "TRK123456"
      },
      "quickReplies": ["Track package", "Contact delivery partner"]
    },
    "intent": "order_tracking",
    "confidence": 0.9
  }
}
```

### **FAQ Response**
```json
{
  "success": true,
  "data": {
    "response": {
      "type": "faq",
      "message": "You can return any product within 7 days of delivery. Full refund will be processed.",
      "category": "Returns",
      "quickReplies": ["More questions", "Contact support"]
    },
    "intent": "faq",
    "confidence": 0.8
  }
}
```

## 🎨 **UI Testing**

### **Visual Elements to Check**

1. **Chatbot Button**
   - ✅ Gradient blue-to-purple design
   - ✅ Floating in bottom-right corner
   - ✅ Notification dot when closed
   - ✅ Smooth hover animations

2. **Chat Window**
   - ✅ Modern rounded design
   - ✅ Proper header with AI branding
   - ✅ Scrollable message area
   - ✅ Input field with send button

3. **Message Types**
   - ✅ User messages (right-aligned, blue)
   - ✅ Bot messages (left-aligned, gray)
   - ✅ Product cards with images
   - ✅ Quick reply buttons
   - ✅ Typing indicators

4. **Responsive Design**
   - ✅ Works on mobile devices
   - ✅ Proper touch interactions
   - ✅ Keyboard handling

## 🚀 **Performance Testing**

### **Load Testing**
Test with multiple concurrent users:
```bash
# Install artillery for load testing
npm install -g artillery

# Create test script
artillery quick --count 10 --num 5 http://localhost:5000/api/chatbot/test
```

### **Response Time Testing**
Measure API response times:
```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/chatbot/chat
```

## 📈 **Analytics Testing**

### **Admin Dashboard**
1. Visit `/admin/chatbot` (requires admin login)
2. Check analytics metrics
3. Verify FAQ categories
4. Test settings toggles

### **Conversation Tracking**
Monitor server logs for conversation analytics:
```
Chatbot conversation: {
  sessionId: 'session_123',
  userMessage: 'gaming laptop',
  intent: 'product_search',
  confidence: 0.9,
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## ✅ **Success Criteria**

The chatbot implementation is successful if:

1. **✅ API Endpoints Work**
   - All endpoints return proper JSON responses
   - Error handling works correctly
   - Authentication works for admin endpoints

2. **✅ Intent Recognition**
   - Correctly identifies product searches
   - Recognizes order tracking requests
   - Matches FAQ questions
   - Handles greetings appropriately

3. **✅ Product Recommendations**
   - Returns relevant products based on criteria
   - Respects budget constraints
   - Includes product images and details
   - Provides quick action buttons

4. **✅ User Experience**
   - Smooth chat interface
   - Quick replies work
   - Typing indicators show
   - Mobile responsive

5. **✅ Error Handling**
   - Graceful fallbacks for API failures
   - Helpful error messages
   - No crashes or blank screens

## 🎯 **Next Steps**

After successful testing:

1. **Production Deployment**
   - Deploy backend with proper environment variables
   - Configure production database
   - Set up monitoring and logging

2. **Advanced Features**
   - Add more product categories
   - Implement user preferences
   - Add conversation history
   - Integrate with analytics tools

3. **Optimization**
   - Cache frequent responses
   - Optimize database queries
   - Add response time monitoring
   - Implement rate limiting

The chatbot is now ready for production use! 🚀