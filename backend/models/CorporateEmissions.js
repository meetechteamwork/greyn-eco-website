const mongoose = require('mongoose');

const corporateEmissionsSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  period: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  periodDate: {
    type: Date,
    required: true,
    index: true
  },
  emissions: {
    type: Number,
    required: true,
    default: 0
    // Note: Can be negative for waste recycling offsets (negative = offset)
  },
  unit: {
    type: String,
    default: 'tons',
    enum: ['tons', 'kg', 'metric-tons']
  },
  category: {
    type: String,
    enum: ['energy', 'transportation', 'manufacturing', 'waste', 'electricity', 'fuel', 'travel', 'waste-recycled', 'other'],
    default: 'other'
  },
  country: {
    type: String,
    trim: true
  },
  value: {
    type: String,
    trim: true
  },
  valueNumeric: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
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
corporateEmissionsSchema.index({ corporate: 1, periodDate: -1 });
corporateEmissionsSchema.index({ corporate: 1, period: 1, periodDate: -1 });

module.exports = mongoose.model('CorporateEmissions', corporateEmissionsSchema);
