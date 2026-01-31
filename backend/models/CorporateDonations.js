const mongoose = require('mongoose');

const corporateDonationsSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  recipient: {
    type: String,
    required: true,
    trim: true
  },
  recipientType: {
    type: String,
    enum: ['NGO', 'Charity', 'Foundation', 'Project', 'Other'],
    default: 'NGO'
  },
  category: {
    type: String,
    enum: ['environmental', 'social', 'education', 'health', 'disaster-relief', 'other'],
    default: 'environmental'
  },
  description: {
    type: String,
    trim: true
  },
  receiptNumber: {
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
corporateDonationsSchema.index({ corporate: 1, donationDate: -1 });
corporateDonationsSchema.index({ corporate: 1, category: 1 });

module.exports = mongoose.model('CorporateDonations', corporateDonationsSchema);
