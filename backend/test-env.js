/**
 * Quick test script to verify environment variables are loaded correctly
 */

const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env');

console.log('\n🔍 Environment Variables Test\n');
console.log('='.repeat(60));

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

console.log('✅ .env file found at:', envPath);
console.log('');

// Load environment variables
require('dotenv').config({ path: envPath });

// Check required variables
const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_CODE'];
let allValid = true;

required.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName === 'MONGODB_URI' 
      ? value.substring(0, 40) + '...' 
      : varName === 'JWT_SECRET'
      ? `[${value.length} characters]`
      : '✓';
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.error(`❌ ${varName}: NOT FOUND`);
    allValid = false;
  }
});

console.log('');
console.log('='.repeat(60));

if (allValid) {
  console.log('\n✅ All environment variables are loaded correctly!');
  console.log('✅ Your server should start without errors.\n');
  process.exit(0);
} else {
  console.error('\n❌ Some environment variables are missing!');
  console.error('💡 Please check your .env file.\n');
  process.exit(1);
}
