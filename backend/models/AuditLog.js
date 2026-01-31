const mongoose = require('mongoose');

const ACTION_TYPES = [
  'login', 'logout', 'create', 'update', 'delete', 'access',
  'permission_change', 'security_event', 'data_export', 'password_change',
  'role_change', 'suspension',
];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['success', 'failed', 'warning'];

/**
 * Audit Log Model
 * Security audit trail for Admin Audit Logs at /admin/security/audit-logs.
 * Collection: audit_logs
 */
const auditLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    actor: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    actorRole: {
      type: String,
      trim: true,
      default: undefined,
    },
    action: {
      type: String,
      required: true,
      enum: ACTION_TYPES,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      required: true,
      enum: SEVERITIES,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: STATUSES,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: undefined,
    },
    hash: {
      type: String,
      trim: true,
      default: undefined,
    },
    sessionId: {
      type: String,
      trim: true,
      default: undefined,
    },
    source: {
      type: String,
      default: undefined,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
    collection: 'audit_logs',
  }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });
auditLogSchema.index({ source: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
module.exports.ACTION_TYPES = ACTION_TYPES;
module.exports.SEVERITIES = SEVERITIES;
module.exports.STATUSES = STATUSES;
