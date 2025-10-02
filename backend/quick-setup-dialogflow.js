#!/usr/bin/env node

/**
 * Quick Setup Script for Dialogflow Chatbot
 * Helps users configure and test their Dialogflow integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupDialogflow() {
  console.log('🚀 Dialogflow Chatbot Quick Setup\n'.cyan);
  console.log('This script will help you configure Dialogflow for your chatbot.\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Please create one first.');
    process.exit(1);
  }

  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');

  console.log('📋 Setup Options:');
  console.log('1. Skip Dialogflow setup (use rule-based chatbot only)');
  console.log('2. Configure Dialogflow with service account JSON file');
  console.log('3. Configure Dialogflow with environment variables');
  console.log('4. Test current configuration\n');

  const choice = await question('Choose an option (1-4): ');

  switch (choice) {
    case '1':
      await skipDialogflowSetup();
      break;
    case '2':
      await setupWithJsonFile();
      break;
    case '3':
      await setupWithEnvVars();
      break;
    case '4':
      await testCurrentConfig();
      break;
    default:
      console.log('Invalid choice. Exiting.');
      process.exit(1);
  }

  rl.close();
}

async function skipDialogflowSetup() {
  console.log('\n✅ Skipping Dialogflow setup.');
  console.log('Your chatbot will use rule-based responses only.');
  console.log('This is perfect for testing and development!');
  
  await testBasicChatbot();
}

async function setupWithJsonFile() {
  console.log('\n📁 Setting up with JSON service account file...');
  
  const projectId = await question('Enter your Google Cloud Project ID: ');
  const jsonPath = await question('Enter path to your service account JSON file (e.g., ./service-account-key.json): ');
  
  // Check if JSON file exists
  const fullJsonPath = path.resolve(__dirname, jsonPath);
  if (!fs.existsSync(fullJsonPath)) {
    console.log(`❌ JSON file not found at: ${fullJsonPath}`);
    console.log('Please download your service account key from Google Cloud Console.');
    return;
  }

  // Update .env file
  let envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  
  // Remove existing Dialogflow config
  envContent = envContent.replace(/# Google Dialogflow Configuration[\s\S]*?(?=\n\n|\n#|$)/g, '');
  
  // Add new config
  const newConfig = `
# Google Dialogflow Configuration
GOOGLE_PROJECT_ID=${projectId}
GOOGLE_APPLICATION_CREDENTIALS=${jsonPath}
`;

  envContent += newConfig;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  
  console.log('✅ Configuration saved to .env file');
  await testCurrentConfig();
}

async function setupWithEnvVars() {
  console.log('\n🔑 Setting up with environment variables...');
  
  const projectId = await question('Enter your Google Cloud Project ID: ');
  const clientEmail = await question('Enter your service account email: ');
  
  console.log('\nFor the private key, paste the entire key including the BEGIN and END lines:');
  const privateKey = await question('Private key: ');
  
  // Update .env file
  let envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  
  // Remove existing Dialogflow config
  envContent = envContent.replace(/# Google Dialogflow Configuration[\s\S]*?(?=\n\n|\n#|$)/g, '');
  
  // Add new config
  const newConfig = `
# Google Dialogflow Configuration
GOOGLE_PROJECT_ID=${projectId}
GOOGLE_CLIENT_EMAIL=${clientEmail}
GOOGLE_PRIVATE_KEY="${privateKey}"
`;

  envContent += newConfig;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  
  console.log('✅ Configuration saved to .env file');
  await testCurrentConfig();
}

async function testCurrentConfig() {
  console.log('\n🧪 Testing current configuration...');
  
  try {
    // Test basic server
    const axios = require('axios');
    
    console.log('Starting test server...');
    const { spawn } = require('child_process');
    
    // Start server in background
    const server = spawn('node', ['server.js'], { 
      stdio: 'pipe',
      detached: false 
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      // Test API
      const response = await axios.get('http://localhost:5000/api/chatbot/test');
      if (response.data.success) {
        console.log('✅ Server is running');
      }
      
      // Test Dialogflow status
      const dfResponse = await axios.get('http://localhost:5000/api/chatbot/dialogflow-status');
      if (dfResponse.data.success) {
        const status = dfResponse.data.data.dialogflow.status;
        if (status === 'healthy') {
          console.log('✅ Dialogflow is connected and working');
        } else if (status === 'disabled') {
          console.log('⚠️  Dialogflow is disabled - using rule-based fallback');
        } else {
          console.log('❌ Dialogflow error:', dfResponse.data.data.dialogflow.reason);
        }
      }
      
      // Test chat
      const chatResponse = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: 'Hello, I need help',
        sessionId: 'test-session'
      });
      
      if (chatResponse.data.success) {
        console.log('✅ Chat functionality is working');
        console.log(`Response: "${chatResponse.data.data.response.message}"`);
      }
      
    } catch (error) {
      console.log('❌ Server test failed:', error.message);
      console.log('Make sure your server is running with: npm start');
    }
    
    // Clean up
    server.kill();
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

async function testBasicChatbot() {
  console.log('\n🧪 Testing basic chatbot functionality...');
  
  try {
    const chatbotService = require('./services/chatbotService');
    
    // Test intent analysis
    const intent = await chatbotService.analyzeIntent('I need a gaming laptop');
    console.log(`✅ Intent analysis working: ${intent.intent} (${(intent.confidence * 100).toFixed(1)}%)`);
    
    // Test response generation
    const response = await chatbotService.generateResponse(intent, intent.entities);
    console.log(`✅ Response generation working: "${response.message}"`);
    
    console.log('\n🎉 Basic chatbot is working perfectly!');
    
  } catch (error) {
    console.log('❌ Basic test failed:', error.message);
  }
}

// Add colors to console output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

Object.keys(colors).forEach(color => {
  String.prototype.__defineGetter__(color, function() {
    return colors[color] + this + colors.reset;
  });
});

// Run setup
if (require.main === module) {
  setupDialogflow()
    .then(() => {
      console.log('\n✨ Setup complete! Your chatbot is ready to use.'.green);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error.message.red);
      process.exit(1);
    });
}

module.exports = { setupDialogflow };