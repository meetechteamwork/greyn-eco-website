const mongoose = require('mongoose');

/**
 * Incident Model
 * Tracks system incidents and alerts
 */
const incidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  // Service affected
  service: {
    type: String,
    required: true,
    trim: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemService'
  },
  
  // Incident details
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'acknowledged', 'investigating'],
    default: 'active',
    required: true
  },
  
  // Incident information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Timestamps
  detectedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  resolvedAt: {
    type: Date
  },
  acknowledgedAt: {
    type: Date
  },
  
  // Resolution details
  resolution: {
    type: String,
    trim: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  // Impact
  impact: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  affectedUsers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
incidentSchema.index({ status: 1, detectedAt: -1 });
incidentSchema.index({ service: 1, status: 1 });
incidentSchema.index({ severity: 1, status: 1 });

// Static method to generate incident ID
incidentSchema.statics.generateIncidentId = function() {
  const year = new Date().getFullYear();
  const count = Math.floor(Math.random() * 1000) + 1;
  return `INC-${year}-${String(count).padStart(3, '0')}`;
};

// Static method to get active incidents
incidentSchema.statics.getActiveIncidents = async function() {
  return await this.find({ status: 'active' }).sort({ detectedAt: -1 });
};

// Static method to get recent incidents
incidentSchema.statics.getRecentIncidents = async function(limit = 10) {
  return await this.find().sort({ detectedAt: -1 }).limit(limit);
};

module.exports = mongoose.model('Incident', incidentSchema);
