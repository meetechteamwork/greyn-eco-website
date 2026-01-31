const mongoose = require('mongoose');

/**
 * Simple User Wallet Transaction Model
 * Stores all wallet transactions for simple users
 * Collection: simple_wallet_transactions
 */
const simpleWalletTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'investment', 'return', 'fee', 'adjustment'],
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'pending', 'failed', 'processing'],
    default: 'completed',
    index: true,
  },
  reference: {
    type: String,
    trim: true,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  source: {
    type: String,
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'simple_wallet_transactions',
});

// Indexes
simpleWalletTransactionSchema.index({ user: 1, createdAt: -1 });
simpleWalletTransactionSchema.index({ user: 1, type: 1 });
simpleWalletTransactionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('SimpleWalletTransaction', simpleWalletTransactionSchema);

