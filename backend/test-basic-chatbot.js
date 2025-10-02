#!/usr/bin/env node

/**
 * Basic Dialogflow Chatbot Test
 * Simple test to verify chatbot is working
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/chatbot';

async function testBasicFunctionality() {
  console.log('🤖 Testing Basic Chatbot Functionality...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing API Health...');
    const response = await axios.get(`${BASE_URL}/test`);
    if (response.data.success) {
      console.log('   ✅ Chatbot API is working');
    }
  } catch (error) {
    console.log('   ❌ API test failed:', error.message);
    console.log('   Make sure your backend server is running on port 5000');
    return;
  }

  // Test 2: Dialogflow Status
  try {
    console.log('\n2. Testing Dialogflow Status...');
    const response = await axios.get(`${BASE_URL}/dialogflow-status`);
    if (response.data.success) {
      const status = response.data.data.dialogflow.status;
      if (status === 'healthy') {
        console.log('   ✅ Dialogflow is connected and working');
      } else if (status === 'disabled') {
        console.log('   ⚠️  Dialogflow is disabled - using rule-based fallback');
        console.log('   This is normal if you haven\'t configured Dialogflow credentials yet');
      } else {
        console.log('   ❌ Dialogflow error:', response.data.data.dialogflow.reason);
      }
    }
  } catch (error) {
    console.log('   ❌ Dialogflow status check failed:', error.message);
  }

  // Test 3: Basic Chat
  try {
    console.log('\n3. Testing Basic Chat...');
    const response = await axios.post(`${BASE_URL}/chat`, {
      message: 'Hello, I need help finding a laptop',
      sessionId: 'test-session-123',
      userId: 'test-user'
    });

    if (response.data.success) {
      const { intent, confidence, response: botResponse } = response.data.data;
      console.log('   ✅ Chat is working');
      console.log(`   Intent: ${intent}`);
      console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
      console.log(`   Response: "${botResponse.message}"`);
    }
  } catch (error) {
    console.log('   ❌ Chat test failed:', error.message);
  }

  // Test 4: Quick Replies
  try {
    console.log('\n4. Testing Quick Replies...');
    const response = await axios.get(`${BASE_URL}/quick-replies`);
    if (response.data.success && response.data.data.length > 0) {
      console.log('   ✅ Quick replies loaded');
      console.log(`   Categories: ${response.data.data.length}`);
    }
  } catch (error) {
    console.log('   ❌ Quick replies test failed:', error.message);
  }

  console.log('\n🎉 Basic tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. If Dialogflow is disabled, follow DIALOGFLOW_SETUP_GUIDE.md to configure it');
  console.log('2. Test the chatbot in your frontend application');
  console.log('3. Run the full test suite with: node test-dialogflow-chatbot.js');
}

// Run the test
testBasicFunctionality()
  .then(() => {
    console.log('\n✨ Your Dialogflow chatbot is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  });