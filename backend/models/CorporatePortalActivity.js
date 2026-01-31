const mongoose = require('mongoose');

/**
 * Corporate Portal Activity Model
 * Tracks ESG-related activities from corporate entities for the admin portal dashboard
 */
const corporatePortalActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['campaign_created', 'emission_reported', 'volunteer_event', 'report_generated'],
    index: true
  },
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    index: true
  },
  entityName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  source: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'corporate_portal_activities'
});

// Compound index for efficient listing by portal and time
corporatePortalActivitySchema.index({ createdAt: -1 });
corporatePortalActivitySchema.index({ corporate: 1, createdAt: -1 });

module.exports = mongoose.model('CorporatePortalActivity', corporatePortalActivitySchema);
