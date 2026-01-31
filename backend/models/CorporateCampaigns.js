const mongoose = require('mongoose');

const corporateCampaignsSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ngoName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['environmental', 'social', 'education', 'health', 'governance', 'sustainability', 'other'],
    default: 'sustainability'
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'paused', 'cancelled', 'upcoming'],
    default: 'active',
    index: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  targetGoal: {
    type: String,
    trim: true
  },
  targetAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  raisedAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  currentProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  budget: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  metrics: {
    emissionsReduced: {
      type: Number,
      default: 0,
      min: 0
    },
    donationsRaised: {
      type: Number,
      default: 0,
      min: 0
    },
    volunteersEngaged: {
      type: Number,
      default: 0,
      min: 0
    },
    peopleImpacted: {
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
  timestamps: true
});

// Index for efficient queries
corporateCampaignsSchema.index({ corporate: 1, status: 1 });
corporateCampaignsSchema.index({ corporate: 1, startDate: -1 });

module.exports = mongoose.model('CorporateCampaigns', corporateCampaignsSchema);
