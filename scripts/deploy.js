#!/usr/bin/env node

/**
 * Production Deployment Script
 * Follows Next.js and Vercel best practices
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logStep = (step, message) => {
  log(`\n${colors.bright}[${step}]${colors.reset} ${colors.cyan}${message}${colors.reset}`);
};

const logSuccess = (message) => {
  log(`✅ ${message}`, 'green');
};

const logError = (message) => {
  log(`❌ ${message}`, 'red');
};

const logWarning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

function runCommand(command, description) {
  try {
    log(`Running: ${command}`, 'blue');
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${description} completed successfully`);
    return true;
  } catch (error) {
    logError(`${description} failed`);
    console.error(error.message);
    return false;
  }
}

function checkPrerequisites() {
  logStep('1', 'Checking prerequisites...');
  
  // Check if we're in a git repository
  if (!fs.existsSync('.git')) {
    logError('Not a git repository. Initialize git first.');
    return false;
  }
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    logError('package.json not found');
    return false;
  }
  
  // Check if next.config.js exists
  if (!fs.existsSync('next.config.js')) {
    logWarning('next.config.js not found - using default configuration');
  }
  
  logSuccess('Prerequisites check passed');
  return true;
}

function runTests() {
  logStep('2', 'Running type check and linting...');
  
  if (!runCommand('npm run type-check', 'TypeScript type checking')) {
    return false;
  }
  
  if (!runCommand('npm run lint', 'ESLint')) {
    return false;
  }
  
  return true;
}

function buildProject() {
  logStep('3', 'Building project...');
  
  // Clean previous build
  if (fs.existsSync('.next')) {
    log('Cleaning previous build...', 'yellow');
    fs.rmSync('.next', { recursive: true, force: true });
  }
  
  return runCommand('npm run build', 'Next.js build');
}

function deployToVercel(isProd = false) {
  logStep('4', `Deploying to Vercel ${isProd ? '(Production)' : '(Preview)'}...`);
  
  const command = isProd ? 'npm run deploy:vercel' : 'npm run deploy:preview';
  return runCommand(command, 'Vercel deployment');
}

function main() {
  const args = process.argv.slice(2);
  const isProd = args.includes('--prod') || args.includes('-p');
  const skipTests = args.includes('--skip-tests');
  
  log('\n🚀 Starting deployment process...', 'bright');
  
  if (isProd) {
    logWarning('Production deployment initiated');
  } else {
    log('Preview deployment initiated', 'cyan');
  }
  
  // Step 1: Check prerequisites
  if (!checkPrerequisites()) {
    process.exit(1);
  }
  
  // Step 2: Run tests (unless skipped)
  if (!skipTests) {
    if (!runTests()) {
      logError('Tests failed. Deployment aborted.');
      process.exit(1);
    }
  } else {
    logWarning('Skipping tests as requested');
  }
  
  // Step 3: Build project
  if (!buildProject()) {
    logError('Build failed. Deployment aborted.');
    process.exit(1);
  }
  
  // Step 4: Deploy
  if (!deployToVercel(isProd)) {
    logError('Deployment failed.');
    process.exit(1);
  }
  
  log('\n🎉 Deployment completed successfully!', 'green');
  
  if (isProd) {
    log('Production deployment is now live!', 'bright');
  } else {
    log('Preview deployment is ready for testing!', 'cyan');
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at ${promise}: ${reason}`);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = { main };
