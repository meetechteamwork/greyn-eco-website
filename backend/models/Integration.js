const mongoose = require('mongoose');

/**
 * Integration Model
 * Stores third-party service integrations configuration
 */
const integrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['email', 'payment', 'analytics', 'storage', 'monitoring', 'sms', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'pending', 'error'],
    default: 'disconnected'
  },
  
  // Configuration data (encrypted or secure)
  config: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Connection metadata
  connectedAt: {
    type: Date
  },
  disconnectedAt: {
    type: Date
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  
  // Health check
  isHealthy: {
    type: Boolean,
    default: false
  },
  lastError: {
    type: String
  },
  
  // Display order
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Metadata
  description: {
    type: String
  },
  icon: {
    type: String // emoji or icon identifier
  }
}, {
  timestamps: true
});

// Index for quick retrieval
integrationSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Integration', integrationSchema);
