const mongoose = require('mongoose');

/**
 * Carbon Credit Model
 * Tracks individual carbon credits through their lifecycle
 */
const carbonCreditSchema = new mongoose.Schema({
  // Credit Identification
  creditId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  // Credit Details
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'tCO₂e',
    enum: ['tCO₂e', 'kgCO₂e']
  },
  
  // Project/Origin
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Lifecycle Status
  status: {
    type: String,
    enum: ['issued', 'active', 'verified', 'retired', 'cancelled'],
    default: 'issued',
    required: true
  },
  
  // Status Timestamps
  issuedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  activatedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  retiredAt: {
    type: Date
  },
  
  // Verification Details
  verificationBody: {
    type: String,
    trim: true
  },
  verificationStandard: {
    type: String,
    trim: true // e.g., "VCS", "Gold Standard", "CAR"
  },
  verificationNumber: {
    type: String,
    trim: true
  },
  
  // Retirement Details
  retiredBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'retiredByType'
  },
  retiredByType: {
    type: String,
    enum: ['User', 'Corporate', 'NGO', 'Admin']
  },
  retirementReason: {
    type: String,
    trim: true
  },
  
  // Marketplace
  availableForSale: {
    type: Boolean,
    default: true
  },
  listedPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Metadata
  vintageYear: {
    type: Number,
    required: true
  },
  creditType: {
    type: String,
    enum: ['reduction', 'removal', 'avoidance'],
    required: true
  },
  
  // Additional metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
carbonCreditSchema.index({ status: 1, issuedAt: -1 });
carbonCreditSchema.index({ projectId: 1, status: 1 });
carbonCreditSchema.index({ retiredAt: -1 });
carbonCreditSchema.index({ availableForSale: 1, status: 1 });

// Static method to get lifecycle statistics
carbonCreditSchema.statics.getLifecycleStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' }
      }
    }
  ]);
  
  const result = {
    issued: { count: 0, quantity: 0 },
    active: { count: 0, quantity: 0 },
    verified: { count: 0, quantity: 0 },
    retired: { count: 0, quantity: 0 }
  };
  
  stats.forEach(stat => {
    if (result[stat._id]) {
      result[stat._id].count = stat.count;
      result[stat._id].quantity = stat.totalQuantity || 0;
    }
  });
  
  return result;
};

module.exports = mongoose.model('CarbonCredit', carbonCreditSchema);
