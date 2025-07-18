#!/usr/bin/env node

/**
 * Clean up Tailwind CSS log files
 * Run with: node scripts/cleanup-logs.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function cleanupLogs() {
  try {
    const files = fs.readdirSync(projectRoot);
    const logFiles = files.filter(file => file.match(/^tailwindcss-\d+\.log$/));
    
    if (logFiles.length === 0) {
      console.log('✅ No Tailwind log files found to clean up');
      return;
    }
    
    console.log(`🧹 Found ${logFiles.length} Tailwind log files to clean up:`);
    
    logFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      fs.unlinkSync(filePath);
      console.log(`   🗑️  Deleted: ${file}`);
    });
    
    console.log(`✅ Cleaned up ${logFiles.length} log files`);
  } catch (error) {
    console.error('❌ Error cleaning up log files:', error.message);
  }
}

if (require.main === module) {
  cleanupLogs();
}

module.exports = { cleanupLogs };
