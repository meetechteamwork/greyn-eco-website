const mongoose = require('mongoose');

/**
 * NGO Details Model
 * Extended information for NGO organizations including mission, certifications, impact metrics, etc.
 * Collection: ngo_details
 */
const ngoDetailsSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
    unique: true,
    index: true
  },
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    trim: true
  },
  establishedDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  contactPhone: {
    type: String,
    trim: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  mission: {
    type: String,
    trim: true,
    default: ''
  },
  focusAreas: [{
    type: String,
    trim: true
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  teamSize: {
    type: Number,
    default: 0,
    min: 0
  },
  annualBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  // Impact metrics
  impactMetrics: {
    treesPlanted: {
      type: Number,
      default: 0,
      min: 0
    },
    carbonOffset: {
      type: Number,
      default: 0,
      min: 0
    },
    communitiesImpacted: {
      type: Number,
      default: 0,
      min: 0
    },
    hectaresRestored: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  source: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'ngo_details'
});

// Indexes
ngoDetailsSchema.index({ ngo: 1 });
ngoDetailsSchema.index({ organizationName: 1 });
ngoDetailsSchema.index({ registrationNumber: 1 });

module.exports = mongoose.model('NgoDetails', ngoDetailsSchema);
