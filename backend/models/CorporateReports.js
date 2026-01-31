const mongoose = require('mongoose');

const corporateReportsSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['esg', 'sustainability', 'annual', 'quarterly', 'monthly', 'custom'],
    default: 'esg'
  },
  period: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'yearly'
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  metrics: {
    totalEmissions: {
      type: Number,
      default: 0,
      min: 0
    },
    emissionsOffset: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: 0
    },
    volunteerHours: {
      type: Number,
      default: 0,
      min: 0
    },
    activeCampaigns: {
      type: Number,
      default: 0,
      min: 0
    },
    sustainabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    environmentalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    socialScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    governanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  fileUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed'],
    default: 'draft',
    index: true
  },
  generatedAt: {
    type: Date
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
corporateReportsSchema.index({ corporate: 1, periodEnd: -1 });
corporateReportsSchema.index({ corporate: 1, reportType: 1, status: 1 });

module.exports = mongoose.model('CorporateReports', corporateReportsSchema);
