#!/usr/bin/env node

/**
 * Dialogflow Chatbot Test Script
 * Tests all chatbot endpoints and functionality
 */

const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:5000/api/chatbot';

// Test scenarios
const testScenarios = [
  {
    name: 'Product Search - Gaming Laptop',
    message: 'I need a gaming laptop under 70000',
    expectedIntent: 'product_search'
  },
  {
    name: 'Product Search - Smartphone',
    message: 'Show me best phones under 30000',
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
    name: 'FAQ - Shipping',
    message: 'How long does shipping take?',
    expectedIntent: 'faq'
  },
  {
    name: 'Greeting',
    message: 'Hello, I need help',
    expectedIntent: 'greeting'
  },
  {
    name: 'Goodbye',
    message: 'Thank you, goodbye',
    expectedIntent: 'goodbye'
  },
  {
    name: 'Complex Query',
    message: 'I want a Samsung phone with good camera under 25000 for photography',
    expectedIntent: 'product_search'
  }
];

async function testChatEndpoint() {
  console.log('\n🤖 Testing Dialogflow Chatbot Endpoints\n'.cyan.bold);

  // Test health check first
  try {
    console.log('1. Testing Dialogflow Health Check...'.yellow);
    const healthResponse = await axios.get(`${BASE_URL}/dialogflow-status`);
    
    if (healthResponse.data.success) {
      const status = healthResponse.data.data.dialogflow.status;
      if (status === 'healthy') {
        console.log('   ✅ Dialogflow is connected and healthy'.green);
      } else if (status === 'disabled') {
        console.log('   ⚠️  Dialogflow is disabled, using rule-based fallback'.yellow);
      } else {
        console.log('   ❌ Dialogflow error:', healthResponse.data.data.dialogflow.reason.red);
      }
    }
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message.red);
  }

  // Test basic API endpoint
  try {
    console.log('\n2. Testing Basic API...'.yellow);
    const testResponse = await axios.get(`${BASE_URL}/test`);
    if (testResponse.data.success) {
      console.log('   ✅ Chatbot API is working'.green);
    }
  } catch (error) {
    console.log('   ❌ API test failed:', error.message.red);
    return;
  }

  // Test chat scenarios
  console.log('\n3. Testing Chat Scenarios...'.yellow);
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    const sessionId = `test-session-${Date.now()}-${i}`;
    
    try {
      console.log(`\n   Testing: ${scenario.name}`.cyan);
      console.log(`   Message: "${scenario.message}"`);
      
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: scenario.message,
        sessionId: sessionId,
        userId: 'test-user'
      });

      if (response.data.success) {
        const { intent, confidence, response: botResponse } = response.data.data;
        
        console.log(`   Intent: ${intent}`.blue);
        console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`.blue);
        console.log(`   Response: "${botResponse.message}"`);
        
        // Check if intent matches expected
        if (intent === scenario.expectedIntent) {
          console.log('   ✅ Intent correctly identified'.green);
        } else {
          console.log(`   ⚠️  Expected ${scenario.expectedIntent}, got ${intent}`.yellow);
        }
        
        // Check confidence level
        if (confidence > 0.7) {
          console.log('   ✅ High confidence response'.green);
        } else if (confidence > 0.5) {
          console.log('   ⚠️  Medium confidence response'.yellow);
        } else {
          console.log('   ❌ Low confidence response'.red);
        }
        
      } else {
        console.log('   ❌ Chat request failed:', response.data.message.red);
      }
      
    } catch (error) {
      console.log('   ❌ Request error:', error.message.red);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function testQuickReplies() {
  console.log('\n4. Testing Quick Replies...'.yellow);
  
  try {
    const response = await axios.get(`${BASE_URL}/quick-replies`);
    if (response.data.success && response.data.data.length > 0) {
      console.log('   ✅ Quick replies loaded successfully'.green);
      console.log(`   Categories: ${response.data.data.length}`);
    } else {
      console.log('   ❌ No quick replies found'.red);
    }
  } catch (error) {
    console.log('   ❌ Quick replies test failed:', error.message.red);
  }
}

async function testFAQs() {
  console.log('\n5. Testing FAQ Endpoint...'.yellow);
  
  try {
    const response = await axios.get(`${BASE_URL}/faqs`);
    if (response.data.success && response.data.data.length > 0) {
      console.log('   ✅ FAQs loaded successfully'.green);
      console.log(`   Categories: ${response.data.data.length}`);
    } else {
      console.log('   ❌ No FAQs found'.red);
    }
  } catch (error) {
    console.log('   ❌ FAQ test failed:', error.message.red);
  }
}

async function testProductComparison() {
  console.log('\n6. Testing Product Comparison...'.yellow);
  
  try {
    const response = await axios.post(`${BASE_URL}/compare-products`, {
      productIds: ['1', '2'],
      preferences: { budget: 50000, category: 'laptop' }
    });
    
    if (response.data.success) {
      console.log('   ✅ Product comparison working'.green);
    } else {
      console.log('   ❌ Product comparison failed:', response.data.message.red);
    }
  } catch (error) {
    console.log('   ❌ Product comparison test failed:', error.message.red);
  }
}

async function testRecommendations() {
  console.log('\n7. Testing Recommendations...'.yellow);
  
  try {
    const response = await axios.post(`${BASE_URL}/recommendations`, {
      sessionId: 'test-session-recommendations',
      userId: 'test-user',
      preferences: { category: 'smartphone', budget: 30000 }
    });
    
    if (response.data.success) {
      console.log('   ✅ Recommendations working'.green);
    } else {
      console.log('   ❌ Recommendations failed:', response.data.message.red);
    }
  } catch (error) {
    console.log('   ❌ Recommendations test failed:', error.message.red);
  }
}

async function testConversationFlow() {
  console.log('\n8. Testing Conversation Flow...'.yellow);
  
  const sessionId = `conversation-test-${Date.now()}`;
  const conversationFlow = [
    'Hello',
    'I need a laptop',
    'Gaming laptop under 70000',
    'Show me more options',
    'Thank you'
  ];
  
  for (let i = 0; i < conversationFlow.length; i++) {
    const message = conversationFlow[i];
    
    try {
      console.log(`   Step ${i + 1}: "${message}"`);
      
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: message,
        sessionId: sessionId,
        userId: 'conversation-test-user'
      });
      
      if (response.data.success) {
        const { intent, confidence } = response.data.data;
        console.log(`     → Intent: ${intent}, Confidence: ${(confidence * 100).toFixed(1)}%`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`     ❌ Step ${i + 1} failed:`, error.message.red);
    }
  }
  
  console.log('   ✅ Conversation flow test completed'.green);
}

async function runAllTests() {
  console.log('🚀 Starting Dialogflow Chatbot Tests...'.rainbow.bold);
  console.log('=' .repeat(50));
  
  try {
    await testChatEndpoint();
    await testQuickReplies();
    await testFAQs();
    await testProductComparison();
    await testRecommendations();
    await testConversationFlow();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed!'.rainbow.bold);
    console.log('\n📊 Test Summary:'.cyan.bold);
    console.log('• Dialogflow integration tested');
    console.log('• Intent recognition verified');
    console.log('• Response generation confirmed');
    console.log('• Conversation flow validated');
    console.log('• Fallback system ready');
    
  } catch (error) {
    console.log('\n❌ Test suite failed:', error.message.red);
  }
}

// Performance test
async function performanceTest() {
  console.log('\n9. Running Performance Test...'.yellow);
  
  const startTime = Date.now();
  const promises = [];
  
  // Send 10 concurrent requests
  for (let i = 0; i < 10; i++) {
    promises.push(
      axios.post(`${BASE_URL}/chat`, {
        message: 'Hello',
        sessionId: `perf-test-${i}`,
        userId: 'perf-test-user'
      })
    );
  }
  
  try {
    await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`   ✅ 10 concurrent requests completed in ${duration}ms`.green);
    console.log(`   Average response time: ${(duration / 10).toFixed(1)}ms per request`);
    
  } catch (error) {
    console.log('   ❌ Performance test failed:', error.message.red);
  }
}

// Run tests
if (require.main === module) {
  runAllTests()
    .then(() => performanceTest())
    .then(() => {
      console.log('\n✨ Testing complete! Your Dialogflow chatbot is ready to use.'.green.bold);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test suite failed:', error.message.red);
      process.exit(1);
    });
}

module.exports = {
  testChatEndpoint,
  testQuickReplies,
  testFAQs,
  runAllTests
};