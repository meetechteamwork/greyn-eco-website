const mongoose = require('mongoose');

/**
 * NGO Portal Activity Model
 * Tracks project/funding/milestone activities from NGOs for the admin portal dashboard.
 * Collection: ngo_portal_activities
 */
const ngoPortalActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['project_launched', 'funding_received', 'milestone_completed', 'update_posted'],
    index: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
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
  collection: 'ngo_portal_activities'
});

ngoPortalActivitySchema.index({ createdAt: -1 });
ngoPortalActivitySchema.index({ ngo: 1, createdAt: -1 });

module.exports = mongoose.model('NgoPortalActivity', ngoPortalActivitySchema);
