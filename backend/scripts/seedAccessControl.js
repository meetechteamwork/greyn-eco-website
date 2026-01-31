/**
 * Seed Access Control
 * Populates access_rules, ip_access_rules, and role_access_config for Admin Security Access Control.
 * Run: npm run seed:access-control
 * Uses MONGODB_URI from backend/.env (MongoDB Atlas).
 * Access rules and IP rules with source: 'seed' are excluded by default (use ?includeSeed=1 to include).
 * Role access configs are always shown.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const AccessRule = require('../models/AccessRule');
const IPAccessRule = require('../models/IPAccessRule');
const RoleAccessConfig = require('../models/RoleAccessConfig');
const connectDB = require('../config/database');

const ACCESS_RULES_SEED = [
  { name: 'Corporate Office Access', type: 'ip_whitelist', description: 'Allow access from corporate office IP range', status: 'active', priority: 1, createdBy: 'admin@greyn-eco.com', conditions: ['IP Range: 192.168.1.0/24', 'Requires 2FA', 'Business hours only'], affectedIPs: ['192.168.1.0/24'] },
  { name: 'Admin Portal Restriction', type: 'role_based', description: 'Restrict admin portal access to admin role only', status: 'active', priority: 2, createdBy: 'admin@greyn-eco.com', conditions: ['Role: Admin', 'Requires MFA', 'Audit logging enabled'], affectedUsers: 5 },
  { name: 'Suspicious IP Block', type: 'ip_blacklist', description: 'Block known malicious IP addresses', status: 'active', priority: 1, createdBy: 'security@greyn-eco.com', conditions: ['IP: 203.0.113.45', 'Auto-blocked', 'Permanent'], affectedIPs: ['203.0.113.45', '198.51.100.23'] },
  { name: 'Business Hours Access', type: 'time_based', description: 'Restrict access to business hours (9 AM - 6 PM EST)', status: 'active', priority: 3, createdBy: 'admin@greyn-eco.com', conditions: ['Time: 09:00-18:00 EST', 'Monday-Friday', 'Exceptions: Admins'], affectedUsers: 45 },
  { name: 'Geographic Restriction', type: 'geographic', description: 'Block access from restricted countries', status: 'active', priority: 2, createdBy: 'admin@greyn-eco.com', conditions: ['Blocked: CN, RU, KP', 'Requires VPN verification', 'Admin override available'], affectedUsers: 12 },
  { name: 'Device Fingerprint Validation', type: 'device_fingerprint', description: 'Require device fingerprint verification for sensitive operations', status: 'active', priority: 4, createdBy: 'admin@greyn-eco.com', conditions: ['Device registration required', 'Biometric verification', 'Trusted devices only'], affectedUsers: 8 },
];

const IP_RULES_SEED = [
  { ipAddress: '192.168.1.100', type: 'allow', reason: 'Corporate office IP', status: 'active', createdBy: 'admin@greyn-eco.com', location: 'New York, USA' },
  { ipAddress: '203.0.113.45', type: 'deny', reason: 'Suspicious activity detected', status: 'active', createdBy: 'security@greyn-eco.com', location: 'Unknown' },
  { ipAddress: '198.51.100.23', type: 'deny', reason: 'Brute force attempt', status: 'active', createdBy: 'Auto-Block', location: 'San Francisco, USA' },
  { ipAddress: '10.0.0.0', cidr: '/24', type: 'allow', reason: 'VPN gateway range', status: 'active', createdBy: 'admin@greyn-eco.com', location: 'Corporate VPN' },
  { ipAddress: '172.16.0.50', type: 'allow', reason: 'Development server', status: 'active', createdBy: 'admin@greyn-eco.com', location: 'London, UK', expiresAt: '2024-12-31' },
];

const ROLE_ACCESS_SEED = [
  { role: 'Admin', permissions: ['read', 'write', 'delete', 'admin', 'export', 'approve'], resources: ['All Resources'], restrictions: ['None'] },
  { role: 'Corporate Admin', permissions: ['read', 'write', 'approve'], resources: ['Corporate Portal', 'Projects', 'Transactions'], restrictions: ['No user management', 'No system settings'] },
  { role: 'NGO Admin', permissions: ['read', 'write'], resources: ['NGO Portal', 'Projects', 'Verification'], restrictions: ['No financial access', 'No user management'] },
  { role: 'Verifier', permissions: ['read', 'approve'], resources: ['Verification Portal', 'Project Details'], restrictions: ['Read-only except verification', 'No financial data'] },
  { role: 'Investor', permissions: ['read', 'export'], resources: ['Carbon Marketplace', 'Projects', 'Certificates'], restrictions: ['No write access', 'No admin functions'] },
];

async function seedAccessControl() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB Atlas');

    // 1) Access Rules
    console.log('\n📋 Seeding Access Rules...');
    let arCreated = 0, arUpdated = 0;
    for (const r of ACCESS_RULES_SEED) {
      const existing = await AccessRule.findOne({ name: r.name, source: 'seed' });
      const doc = {
        ...r,
        lastModified: new Date(),
        source: 'seed',
      };
      if (existing) {
        await AccessRule.updateOne({ _id: existing._id }, { $set: doc });
        arUpdated++;
        console.log(`- Updated: ${r.name}`);
      } else {
        await AccessRule.create(doc);
        arCreated++;
        console.log(`✓ Created: ${r.name}`);
      }
    }

    // 2) IP Access Rules
    console.log('\n📋 Seeding IP Access Rules...');
    let ipCreated = 0, ipUpdated = 0;
    for (const r of IP_RULES_SEED) {
      const existing = await IPAccessRule.findOne({ ipAddress: r.ipAddress, type: r.type, source: 'seed' });
      const doc = {
        ...r,
        expiresAt: r.expiresAt ? new Date(r.expiresAt) : undefined,
        source: 'seed',
      };
      if (existing) {
        await IPAccessRule.updateOne({ _id: existing._id }, { $set: doc });
        ipUpdated++;
        console.log(`- Updated: ${r.ipAddress} (${r.type})`);
      } else {
        await IPAccessRule.create(doc);
        ipCreated++;
        console.log(`✓ Created: ${r.ipAddress} (${r.type})`);
      }
    }

    // 3) Role Access Config (upsert by role)
    console.log('\n📋 Seeding Role Access Config...');
    let roleCreated = 0, roleUpdated = 0;
    for (const r of ROLE_ACCESS_SEED) {
      const existing = await RoleAccessConfig.findOne({ role: r.role });
      const doc = { ...r, source: 'seed' };
      if (existing) {
        await RoleAccessConfig.updateOne({ role: r.role }, { $set: doc });
        roleUpdated++;
        console.log(`- Updated: ${r.role}`);
      } else {
        await RoleAccessConfig.create(doc);
        roleCreated++;
        console.log(`✓ Created: ${r.role}`);
      }
    }

    console.log('\n✅ Access Control seeding completed.');
    console.log(`   Access rules: ${arCreated} created, ${arUpdated} updated.`);
    console.log(`   IP rules: ${ipCreated} created, ${ipUpdated} updated.`);
    console.log(`   Role access: ${roleCreated} created, ${roleUpdated} updated.`);
    console.log('   Note: Access rules and IP rules with source="seed" are excluded by default. Use ?includeSeed=1 to include.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding access control:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAccessControl();
}

module.exports = seedAccessControl;
