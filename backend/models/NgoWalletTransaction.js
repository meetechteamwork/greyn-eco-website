const mongoose = require('mongoose');

/**
 * NGO Wallet Transaction Model
 * Stores all wallet transactions for NGO organizations
 * Collection: ngo_wallet_transactions
 */
const ngoWalletTransactionSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['donation', 'withdrawal', 'project_funding', 'revenue', 'refund'],
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'pending', 'failed', 'processing'],
    default: 'completed',
    index: true
  },
  projectName: {
    type: String,
    trim: true,
    default: ''
  },
  donorName: {
    type: String,
    trim: true,
    default: ''
  },
  reference: {
    type: String,
    trim: true,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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
  collection: 'ngo_wallet_transactions'
});

// Indexes
ngoWalletTransactionSchema.index({ ngo: 1, createdAt: -1 });
ngoWalletTransactionSchema.index({ ngo: 1, type: 1 });
ngoWalletTransactionSchema.index({ ngo: 1, status: 1 });

module.exports = mongoose.model('NgoWalletTransaction', ngoWalletTransactionSchema);
