const mongoose = require('mongoose');

const IP_RULE_TYPES = ['allow', 'deny'];
const RULE_STATUSES = ['active', 'inactive', 'expired'];

/**
 * IP Access Rule Model
 * Collection: ip_access_rules
 * Used by Admin Security Access Control at /admin/security/access-control.
 */
const ipAccessRuleSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    cidr: {
      type: String,
      trim: true,
      default: undefined,
    },
    type: {
      type: String,
      required: true,
      enum: IP_RULE_TYPES,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: RULE_STATUSES,
      default: 'active',
      index: true,
    },
    expiresAt: {
      type: Date,
      default: undefined,
    },
    createdBy: {
      type: String,
      trim: true,
      default: undefined,
    },
    location: {
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
    collection: 'ip_access_rules',
  }
);

ipAccessRuleSchema.index({ status: 1, createdAt: -1 });
ipAccessRuleSchema.index({ source: 1 });

module.exports = mongoose.model('IPAccessRule', ipAccessRuleSchema);
module.exports.IP_RULE_TYPES = IP_RULE_TYPES;
module.exports.RULE_STATUSES = RULE_STATUSES;
