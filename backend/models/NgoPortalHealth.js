const mongoose = require('mongoose');

/**
 * NGO Portal Health Model
 * Single-document store for NGO portal operational metrics (status, uptime, etc.).
 * Collection: ngo_portal_health
 */
const ngoPortalHealthSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['operational', 'degraded', 'partial_outage', 'major_outage'],
    default: 'operational',
    index: true
  },
  uptime: {
    type: Number,
    default: 99.7,
    min: 0,
    max: 100,
    comment: 'Uptime percentage'
  },
  responseTime: {
    type: Number,
    default: 145,
    min: 0,
    comment: 'Average response time in milliseconds'
  },
  activeSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  maxSessions: {
    type: Number,
    default: 1000,
    min: 1,
    comment: 'Capacity for active sessions (used for progress bar)'
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    trim: true,
    default: null
  },
  source: {
    type: String,
    default: undefined
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'ngo_portal_health'
});

module.exports = mongoose.model('NgoPortalHealth', ngoPortalHealthSchema);
