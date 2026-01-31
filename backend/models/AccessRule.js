const mongoose = require('mongoose');

const ACCESS_RULE_TYPES = ['ip_whitelist', 'ip_blacklist', 'role_based', 'time_based', 'geographic', 'device_fingerprint'];
const RULE_STATUSES = ['active', 'inactive', 'expired'];

/**
 * Access Rule Model (Policies)
 * Collection: access_rules
 * Used by Admin Security Access Control at /admin/security/access-control.
 */
const accessRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ACCESS_RULE_TYPES,
      index: true,
    },
    description: {
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
    priority: {
      type: Number,
      default: 1,
      min: 1,
    },
    conditions: {
      type: [String],
      default: [],
    },
    affectedUsers: {
      type: Number,
      default: undefined,
    },
    affectedIPs: {
      type: [String],
      default: undefined,
    },
    createdBy: {
      type: String,
      trim: true,
      default: undefined,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
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
    collection: 'access_rules',
  }
);

accessRuleSchema.index({ status: 1, lastModified: -1 });
accessRuleSchema.index({ source: 1 });

module.exports = mongoose.model('AccessRule', accessRuleSchema);
module.exports.ACCESS_RULE_TYPES = ACCESS_RULE_TYPES;
module.exports.RULE_STATUSES = RULE_STATUSES;
