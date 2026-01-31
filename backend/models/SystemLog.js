const mongoose = require('mongoose');

/**
 * System Log Model
 * Stores system logs and events
 */
const systemLogSchema = new mongoose.Schema({
  // Log identification
  service: {
    type: String,
    required: true,
    trim: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemService'
  },
  
  // Log content
  message: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'debug', 'critical'],
    default: 'info',
    required: true
  },
  
  // Log metadata
  category: {
    type: String,
    enum: ['system', 'security', 'performance', 'error', 'audit', 'other'],
    default: 'system'
  },
  
  // Context
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Source information
  source: {
    type: String // e.g., 'api', 'frontend', 'cron', 'worker'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType'
  },
  userType: {
    type: String,
    enum: ['User', 'Admin', 'System']
  },
  
  // IP and request info
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  
  // Error details (if applicable)
  error: {
    stack: String,
    code: String,
    name: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
systemLogSchema.index({ service: 1, createdAt: -1 });
systemLogSchema.index({ level: 1, createdAt: -1 });
systemLogSchema.index({ category: 1, createdAt: -1 });
systemLogSchema.index({ createdAt: -1 }); // For time-based queries

// TTL index for automatic cleanup (90 days default)
systemLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Static method to get recent logs
systemLogSchema.statics.getRecentLogs = async function(limit = 50, filters = {}) {
  const query = { ...filters };
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-context -error.stack'); // Exclude large fields
};

// Static method to get logs by service
systemLogSchema.statics.getLogsByService = async function(serviceName, limit = 50) {
  return await this.find({ service: serviceName })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs by level
systemLogSchema.statics.getLogsByLevel = async function(level, limit = 50) {
  return await this.find({ level })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('SystemLog', systemLogSchema);
