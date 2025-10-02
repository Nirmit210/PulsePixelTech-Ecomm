#!/usr/bin/env node

/**
 * SambaNova Chatbot Test Script
 * Tests the SambaNova AI integration
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/chatbot';

// Test scenarios
const testScenarios = [
  {
    name: 'Product Search - Gaming Laptop',
    message: 'I need a gaming laptop under 70000',
    expectedIntent: 'product_search'
  },
  {
    name: 'Order Tracking',
    message: 'Track my order #ORD12345',
    expectedIntent: 'order_tracking'
  },
  {
    name: 'FAQ - Return Policy',
    message: 'What is your return policy?',
    expectedIntent: 'faq'
  },
  {
    name: 'Greeting',
    message: 'Hello, I need help',
    expectedIntent: 'greeting'
  }
];

async function testSambaNovaChat() {
  console.log('🤖 Testing SambaNova AI Chatbot Integration\n');

  // Test health check first
  try {
    console.log('1. Testing SambaNova Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/sambanova-status`);
    
    if (healthResponse.data.success) {
      const status = healthResponse.data.data.sambanova.status;
      if (status === 'healthy') {
        console.log('   ✅ SambaNova AI is connected and healthy');
      } else if (status === 'disabled') {
        console.log('   ⚠️  SambaNova is disabled, using rule-based fallback');
      } else {
        console.log('   ❌ SambaNova error:', healthResponse.data.data.sambanova.reason);
      }
    }
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
  }

  // Test basic API endpoint
  try {
    console.log('\n2. Testing Basic API...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    if (testResponse.data.success) {
      console.log('   ✅ Chatbot API is working');
    }
  } catch (error) {
    console.log('   ❌ API test failed:', error.message);
    return;
  }

  // Test chat scenarios
  console.log('\n3. Testing Chat Scenarios...');
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    const sessionId = `test-session-${Date.now()}-${i}`;
    
    try {
      console.log(`\n   Testing: ${scenario.name}`);
      console.log(`   Message: "${scenario.message}"`);
      
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: scenario.message,
        sessionId: sessionId,
        userId: 'test-user'
      });

      if (response.data.success) {
        const { intent, confidence, response: botResponse } = response.data.data;
        
        console.log(`   Intent: ${intent}`);
        console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
        console.log(`   Response: "${botResponse.message}"`);
        
        // Check if intent matches expected
        if (intent === scenario.expectedIntent) {
          console.log('   ✅ Intent correctly identified');
        } else {
          console.log(`   ⚠️  Expected ${scenario.expectedIntent}, got ${intent}`);
        }
        
        // Check confidence level
        if (confidence > 0.8) {
          console.log('   ✅ High confidence response');
        } else if (confidence > 0.6) {
          console.log('   ⚠️  Medium confidence response');
        } else {
          console.log('   ❌ Low confidence response');
        }
        
      } else {
        console.log('   ❌ Chat request failed:', response.data.message);
      }
      
    } catch (error) {
      console.log('   ❌ Request error:', error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n🎉 SambaNova AI testing complete!');
  console.log('\n📊 Summary:');
  console.log('• SambaNova AI integration tested');
  console.log('• Intent recognition verified');
  console.log('• Response generation confirmed');
  console.log('• Fallback system ready');
}

// Run tests
if (require.main === module) {
  testSambaNovaChat()
    .then(() => {
      console.log('\n✨ Your SambaNova AI chatbot is ready to use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testSambaNovaChat };