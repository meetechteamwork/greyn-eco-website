/**
 * Get Current IP Address Script
 * Helps users find their IP address for MongoDB Atlas whitelisting
 */

const https = require('https');
const http = require('http');

console.log('\n🔍 Getting your current IP address...\n');

// Try multiple IP checking services
const ipServices = [
  { name: 'ipify', url: 'https://api.ipify.org?format=json' },
  { name: 'ip-api', url: 'http://ip-api.com/json' }
];

let attempts = 0;
const maxAttempts = ipServices.length;

function tryGetIP(serviceIndex = 0) {
  if (serviceIndex >= ipServices.length) {
    console.error('❌ Could not determine your IP address automatically.');
    console.log('\n💡 You can manually check your IP at: https://www.whatismyip.com/');
    process.exit(1);
  }

  const service = ipServices[serviceIndex];
  const isHttps = service.url.startsWith('https');
  const client = isHttps ? https : http;

  console.log(`Trying ${service.name}...`);

  client.get(service.url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const ip = json.ip || json.query;

        if (ip) {
          console.log('\n✅ Your current IP address is:');
          console.log(`   ${ip}\n`);
          console.log('📋 Next steps:');
          console.log('   1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
          console.log('   2. Navigate to "Network Access" → "Add IP Address"');
          console.log(`   3. Add this IP: ${ip}`);
          console.log('   4. Or click "Add Current IP Address" button\n');
          console.log('💡 For development, you can also use: 0.0.0.0/0 (allows all IPs)\n');
          process.exit(0);
        } else {
          tryGetIP(serviceIndex + 1);
        }
      } catch (error) {
        tryGetIP(serviceIndex + 1);
      }
    });
  }).on('error', (error) => {
    tryGetIP(serviceIndex + 1);
  });
}

tryGetIP();
