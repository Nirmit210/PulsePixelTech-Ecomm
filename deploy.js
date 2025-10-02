#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * Automates the deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    runCommand('npm install -g vercel', 'Vercel CLI installation');
  }
  
  // Check if user is logged in
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ User is logged in to Vercel');
  } catch (error) {
    console.log('🔐 Please log in to Vercel:');
    runCommand('vercel login', 'Vercel login');
  }
}

function validateEnvironment() {
  console.log('🔍 Validating environment...');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SAMBANOVA_API_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('⚠️ Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n📝 Please set these in your Vercel project settings.');
    console.log('   Visit: https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
  } else {
    console.log('✅ All required environment variables are set');
  }
}

function buildProject() {
  console.log('🏗️ Building project...');
  
  // Install dependencies
  runCommand('npm install', 'Root dependencies installation');
  runCommand('cd frontend && npm install', 'Frontend dependencies installation');
  runCommand('cd backend && npm install', 'Backend dependencies installation');
  
  // Build frontend
  runCommand('cd frontend && npm run build', 'Frontend build');
  
  console.log('✅ Project built successfully');
}

function deployToVercel() {
  console.log('🚀 Deploying to Vercel...');
  
  const isProduction = process.argv.includes('--prod');
  const command = isProduction ? 'vercel --prod' : 'vercel';
  
  runCommand(command, `Vercel deployment ${isProduction ? '(Production)' : '(Preview)'}`);
}

function showPostDeploymentInfo() {
  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Visit your Vercel dashboard to see the deployment');
  console.log('2. Configure environment variables if not done already');
  console.log('3. Set up your custom domain (optional)');
  console.log('4. Test all functionality on the live site');
  console.log('\n🔗 Useful links:');
  console.log('   - Vercel Dashboard: https://vercel.com/dashboard');
  console.log('   - Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables');
  console.log('   - Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains');
}

async function main() {
  console.log('🚀 PulsePixelTech Vercel Deployment\n');
  
  try {
    checkPrerequisites();
    validateEnvironment();
    buildProject();
    deployToVercel();
    showPostDeploymentInfo();
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  main();
}

module.exports = { main };