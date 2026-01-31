const mongoose = require('mongoose');

/**
 * NGO Project Model
 * Stores projects launched by NGOs
 * Collection: ngo_projects
 */
const ngoProjectSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
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
    trim: true,
    default: ''
  },
  longDescription: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Reforestation', 'Solar Energy', 'Wind Energy', 'Ocean Cleanup', 'Ocean Conservation', 'Urban Sustainability', 'Clean Transportation', 'Wildlife Protection', 'Water Conservation', 'Other'],
    default: 'Other',
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'completed', 'paused', 'cancelled', 'rejected'],
    default: 'pending',
    index: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: ''
  },
  fundingGoal: {
    type: Number,
    required: true,
    min: 0
  },
  minInvestment: {
    type: Number,
    default: 0,
    min: 0
  },
  currentFunding: {
    type: Number,
    default: 0,
    min: 0
  },
  donors: {
    type: Number,
    default: 0,
    min: 0
  },
  carbonCredits: {
    type: Number,
    default: 0,
    min: 0
  },
  carbonImpact: {
    type: String,
    trim: true,
    default: ''
  },
  carbonCreditsPerHundred: {
    type: Number,
    default: 0,
    min: 0
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  source: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'ngo_projects'
});

// Indexes
ngoProjectSchema.index({ ngo: 1, createdAt: -1 });
ngoProjectSchema.index({ ngo: 1, status: 1 });
ngoProjectSchema.index({ ngo: 1, category: 1 });
ngoProjectSchema.index({ status: 1 });

// Calculate progress before save
ngoProjectSchema.pre('save', function(next) {
  if (this.fundingGoal > 0) {
    this.progress = Math.min(100, Math.round((this.currentFunding / this.fundingGoal) * 100));
  }
  next();
});

module.exports = mongoose.model('NgoProject', ngoProjectSchema);
