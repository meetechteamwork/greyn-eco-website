/**
 * Seed Audit Logs
 * Populates audit_logs for Admin Security Audit Logs at /admin/security/audit-logs.
 * Run: npm run seed:audit-logs
 * Uses MONGODB_URI from backend/.env (MongoDB Atlas).
 * Seed records have source: 'seed' and are excluded by default (use ?includeSeed=1 to include).
 * Integrity hashes are computed so verify works on seed data.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const AuditLog = require('../models/AuditLog');
const { computeIntegrityHash } = require('../controllers/adminAuditLogsController');
const connectDB = require('../config/database');

const AUDIT_LOGS_SEED = [
  { timestamp: '2024-03-25T14:30:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'permission_change', resource: 'User: sarah.johnson@example.com', details: 'Changed role from Simple User to Corporate Admin', severity: 'high', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T14:25:00Z', actor: 'security@greyn-eco.com', actorRole: 'Security System', action: 'security_event', resource: 'IP: 203.0.113.45', details: 'Blocked IP due to suspicious activity - Multiple failed login attempts', severity: 'critical', status: 'success', ipAddress: '203.0.113.45', userAgent: 'Unknown', location: 'Unknown' },
  { timestamp: '2024-03-25T14:20:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'create', resource: 'Transaction: TXN-2024-001234', details: 'Created new transaction record for carbon credit purchase', severity: 'low', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T14:15:00Z', actor: 'user@example.com', actorRole: 'User', action: 'login', resource: 'Authentication', details: 'Failed login attempt - Invalid credentials', severity: 'medium', status: 'failed', ipAddress: '198.51.100.23', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', location: 'San Francisco, USA' },
  { timestamp: '2024-03-25T14:10:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'update', resource: 'Role: Security Admin', details: 'Updated permissions for Security Admin role - Added audit log access', severity: 'high', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T14:05:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'access', resource: '/admin/security', details: 'Accessed security operations page', severity: 'low', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T14:00:00Z', actor: 'corporate@example.com', actorRole: 'Corporate Admin', action: 'data_export', resource: 'Export: User List', details: 'Exported user list data to CSV', severity: 'medium', status: 'success', ipAddress: '172.16.0.50', userAgent: 'Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36', location: 'London, UK', sessionId: 'sess_def456uvw' },
  { timestamp: '2024-03-25T13:55:00Z', actor: 'user@example.com', actorRole: 'User', action: 'password_change', resource: 'Account: user@example.com', details: 'Password changed successfully', severity: 'medium', status: 'success', ipAddress: '198.51.100.23', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', location: 'San Francisco, USA', sessionId: 'sess_ghi789rst' },
  { timestamp: '2024-03-25T13:50:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'role_change', resource: 'User: michael.chen@example.com', details: 'Changed user role from Carbon Buyer to Verifier', severity: 'high', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T13:45:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'suspension', resource: 'User: david.brown@example.com', details: 'Suspended user account due to policy violation', severity: 'critical', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T13:40:00Z', actor: 'unknown@example.com', actorRole: 'Unknown', action: 'login', resource: 'Authentication', details: 'Failed login attempt - Account does not exist', severity: 'medium', status: 'failed', ipAddress: '203.0.113.45', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', location: 'Unknown' },
  { timestamp: '2024-03-25T13:35:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'delete', resource: 'Invitation: INV-2024-006', details: 'Deleted expired invitation', severity: 'low', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_abc123xyz' },
  { timestamp: '2024-03-25T13:30:00Z', actor: 'verifier@certification.org', actorRole: 'Verifier', action: 'update', resource: 'Project: Amazon Reforestation', details: 'Updated project verification status to Verified', severity: 'high', status: 'success', ipAddress: '10.0.0.25', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'Berlin, Germany', sessionId: 'sess_jkl012mno' },
  { timestamp: '2024-03-25T13:25:00Z', actor: 'admin@greyn-eco.com', actorRole: 'Admin', action: 'logout', resource: 'Session: sess_xyz789abc', details: 'User logged out successfully', severity: 'low', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', location: 'New York, USA', sessionId: 'sess_xyz789abc' },
  { timestamp: '2024-03-25T13:20:00Z', actor: 'security@greyn-eco.com', actorRole: 'Security System', action: 'security_event', resource: 'Rate Limit', details: 'Rate limit exceeded for IP 198.51.100.23 - Temporary block applied', severity: 'high', status: 'warning', ipAddress: '198.51.100.23', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', location: 'San Francisco, USA' },
];

async function seedAuditLogs() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB Atlas');

    // Remove existing seed data so re-run replaces it
    const deleted = await AuditLog.deleteMany({ source: 'seed' });
    if (deleted.deletedCount > 0) {
      console.log(`- Removed ${deleted.deletedCount} existing seed audit logs`);
    }

    console.log('\n📋 Seeding Audit Logs...');
    let created = 0;
    for (const s of AUDIT_LOGS_SEED) {
      const doc = {
        timestamp: new Date(s.timestamp),
        actor: s.actor,
        actorRole: s.actorRole,
        action: s.action,
        resource: s.resource,
        details: s.details,
        severity: s.severity,
        status: s.status,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent || '',
        location: s.location,
        sessionId: s.sessionId,
        source: 'seed',
      };
      doc.hash = computeIntegrityHash(doc);
      await AuditLog.create(doc);
      created++;
      console.log(`✓ Created: ${s.action} by ${s.actor} (${s.severity})`);
    }

    console.log(`\n✅ Audit logs seeding completed. Created: ${created}`);
    console.log('   Note: Seed records have source="seed" and are excluded by default. Use ?includeSeed=1 to include them.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding audit logs:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAuditLogs();
}

module.exports = seedAuditLogs;
