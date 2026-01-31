const mongoose = require('mongoose');

/**
 * Rate Limit Model
 * Production-ready rate limiting configuration for API endpoints
 * Collection: rate_limits
 */

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL'];
const WINDOWS = ['15 minutes', '1 hour', '24 hours', '1 week'];
const STATUSES = ['normal', 'warning', 'critical', 'exceeded'];
const CATEGORIES = ['authentication', 'api', 'admin', 'data', 'payment', 'other'];

const rateLimitSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      trim: true,
      index: true,
      description: 'API endpoint path (e.g., /api/auth/login)',
    },
    method: {
      type: String,
      required: true,
      enum: METHODS,
      default: 'ALL',
      description: 'HTTP method or ALL for all methods',
    },
    limit: {
      type: Number,
      required: true,
      min: 1,
      description: 'Maximum number of requests allowed in the window',
    },
    window: {
      type: String,
      required: true,
      enum: WINDOWS,
      default: '1 hour',
      description: 'Time window for rate limiting',
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Current request count in the window',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'normal',
      index: true,
      description: 'Current status based on usage threshold',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      description: 'Description of this rate limit rule',
    },
    lastReset: {
      type: Date,
      default: Date.now,
      description: 'Last time the counter was reset',
    },
    nextReset: {
      type: Date,
      required: true,
      description: 'Next scheduled reset time',
    },
    blockedRequests: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of requests blocked by this limit',
    },
    averageResponseTime: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Average response time in milliseconds',
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      default: 'other',
      index: true,
      description: 'Category of the endpoint',
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
      description: 'Email or ID of the admin who created this limit',
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
      description: 'Whether this rate limit is active',
    },
    source: {
      type: String,
      enum: ['seed', 'manual'],
      default: 'manual',
      description: 'Source of this rate limit (seed or manual)',
    },
  },
  {
    timestamps: true,
    collection: 'rate_limits',
  }
);

// Compound index for efficient queries
rateLimitSchema.index({ endpoint: 1, method: 1 }, { unique: true });
rateLimitSchema.index({ status: 1, enabled: 1 });
rateLimitSchema.index({ category: 1, status: 1 });
rateLimitSchema.index({ nextReset: 1 });

// Virtual field for last modified
rateLimitSchema.virtual('lastModified').get(function() {
  return this.updatedAt;
});

// Method to calculate status based on current usage
rateLimitSchema.methods.calculateStatus = function() {
  const percentage = (this.current / this.limit) * 100;
  
  if (this.current >= this.limit) {
    this.status = 'exceeded';
  } else if (percentage >= 90) {
    this.status = 'critical';
  } else if (percentage >= 70) {
    this.status = 'warning';
  } else {
    this.status = 'normal';
  }
  
  return this.status;
};

// Method to reset counter
rateLimitSchema.methods.resetCounter = function() {
  this.current = 0;
  this.lastReset = new Date();
  this.nextReset = this.calculateNextReset();
  this.calculateStatus();
};

// Method to calculate next reset time
rateLimitSchema.methods.calculateNextReset = function() {
  const now = new Date();
  let nextReset = new Date(now);
  
  switch (this.window) {
    case '15 minutes':
      nextReset.setMinutes(nextReset.getMinutes() + 15);
      break;
    case '1 hour':
      nextReset.setHours(nextReset.getHours() + 1);
      break;
    case '24 hours':
      nextReset.setDate(nextReset.getDate() + 1);
      break;
    case '1 week':
      nextReset.setDate(nextReset.getDate() + 7);
      break;
  }
  
  return nextReset;
};

// Method to increment counter
rateLimitSchema.methods.incrementCounter = function() {
  this.current += 1;
  
  // Check if we need to reset
  if (new Date() >= this.nextReset) {
    this.resetCounter();
  } else {
    this.calculateStatus();
  }
};

// Pre-save hook to ensure nextReset is set
rateLimitSchema.pre('save', function(next) {
  if (this.isNew && !this.nextReset) {
    this.nextReset = this.calculateNextReset();
  }
  this.calculateStatus();
  next();
});

// Export model and constants
module.exports = mongoose.model('RateLimit', rateLimitSchema);
module.exports.METHODS = METHODS;
module.exports.WINDOWS = WINDOWS;
module.exports.STATUSES = STATUSES;
module.exports.CATEGORIES = CATEGORIES;
