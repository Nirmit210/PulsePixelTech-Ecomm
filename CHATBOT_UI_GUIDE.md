# 🤖 Chatbot UI Location Guide

## Where to Find the Chatbot

### 🎯 **Chatbot Button Location**
The AI Shopping Assistant chatbot appears as a **floating button** in the **bottom-right corner** of every page.

```
┌─────────────────────────────────────────┐
│                                         │
│  Website Content                        │
│                                         │
│                                         │
│                                         │
│                                         │
│                                    🤖   │ ← Chatbot Button
└─────────────────────────────────────────┘
```

### 🎨 **Visual Appearance**
- **Shape**: Circular floating button
- **Colors**: Beautiful gradient (blue to purple)
- **Size**: 56px diameter
- **Position**: Fixed bottom-right (24px from edges)
- **Icon**: Chat bubble icon
- **Animation**: Smooth hover effects and rotation on open/close

### 🔴 **Notification Indicator**
When closed, the chatbot shows a small **red notification dot** to indicate it's available:
```
    🤖
   ●    ← Red notification dot
```

## 🖱️ **How to Use**

### **Step 1: Click the Chatbot Button**
- Look for the gradient blue-purple button in bottom-right corner
- Click it to open the chat window

### **Step 2: Chat Window Opens**
```
┌─────────────────────────────────────────┐
│ 🤖 Shopping Assistant                   │
│    AI-powered support              ✕    │
├─────────────────────────────────────────┤
│                                         │
│ Hi! I'm your AI shopping assistant.     │
│ I can help you:                         │
│                                         │
│ 🛍️ Find products    📦 Track orders    │
│ ❓ Answer FAQs      ✨ Get support      │
│                                         │
├─────────────────────────────────────────┤
│ Gaming laptops under ₹70000             │
│ Track my order                          │
│ Return policy                           │
│ Best phones                             │
├─────────────────────────────────────────┤
│ Ask me anything...              [Send]  │
└─────────────────────────────────────────┘
```

### **Step 3: Start Chatting**
- Type your message or click quick action buttons
- Get instant AI-powered responses
- Receive product recommendations, order tracking, FAQ answers

## 📱 **Mobile Experience**

On mobile devices, the chatbot:
- ✅ Remains in bottom-right corner
- ✅ Adapts to smaller screen size
- ✅ Touch-friendly interactions
- ✅ Responsive chat window

## 🎯 **Test Examples**

Try these messages to test the chatbot:

### **Product Search**
```
"I need a gaming laptop under ₹70000"
"Best phones under ₹30000"
"Show me wireless headphones"
```

### **Order Tracking**
```
"Track my order #12345"
"Where is my order?"
"Order status"
```

### **FAQ Questions**
```
"What's your return policy?"
"How long does shipping take?"
"What payment methods do you accept?"
```

### **General Help**
```
"Hi"
"Help me"
"I need assistance"
```

## 🔧 **Troubleshooting**

### **If Chatbot Doesn't Appear:**

1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for JavaScript errors

2. **Verify Page Load**
   - Refresh the page (Ctrl+F5)
   - Wait for complete page load

3. **Check Network**
   - Ensure frontend server is running on port 3000
   - Ensure backend server is running on port 5000

4. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

### **If Chatbot Appears But Doesn't Respond:**

1. **Check Backend Connection**
   - Verify backend server is running
   - Check API endpoints: `http://localhost:5000/api/chatbot/test`

2. **Check Network Tab**
   - Press F12 → Network tab
   - Look for failed API requests

3. **Verify Environment Variables**
   - Check `NEXT_PUBLIC_API_URL` in frontend/.env.local
   - Should be: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## ✅ **Success Indicators**

The chatbot is working correctly when you see:

1. **✅ Button Appears** - Gradient button in bottom-right
2. **✅ Window Opens** - Chat window opens when clicked
3. **✅ Welcome Message** - AI assistant greeting appears
4. **✅ Quick Actions** - Action buttons are clickable
5. **✅ Responses Work** - Bot responds to your messages
6. **✅ Typing Indicator** - Shows when bot is thinking
7. **✅ Product Cards** - Shows product recommendations with images

## 🎨 **Customization**

The chatbot appearance can be customized in:
- `frontend/components/chat/LiveChat.jsx` - Main component
- Colors, gradients, and styling
- Button position and size
- Chat window dimensions

## 📊 **Admin Features**

Admins can access chatbot analytics at:
- URL: `/admin/chatbot`
- Requires admin login
- Shows conversation metrics, popular questions, settings

---

**The chatbot is now live and ready to help customers! 🚀**