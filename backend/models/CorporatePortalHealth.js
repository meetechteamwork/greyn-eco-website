const mongoose = require('mongoose');

/**
 * Corporate Portal Health Model
 * Single-document store for corporate portal operational metrics (status, uptime, etc.)
 */
const corporatePortalHealthSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['operational', 'degraded', 'partial_outage', 'major_outage'],
    default: 'operational',
    index: true
  },
  uptime: {
    type: Number,
    default: 99.9,
    min: 0,
    max: 100,
    comment: 'Uptime percentage'
  },
  responseTime: {
    type: Number,
    default: 120,
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
    default: 5000,
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
  collection: 'corporate_portal_health'
});

module.exports = mongoose.model('CorporatePortalHealth', corporatePortalHealthSchema);
