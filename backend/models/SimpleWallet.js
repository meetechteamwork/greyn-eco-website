const mongoose = require('mongoose');

/**
 * Simple User Wallet Model
 * Stores wallet balance and summary information for individual investors (simple users)
 * Collection: simple_wallets
 */
const simpleWalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
    min: 0,
  },
  pendingWithdrawals: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalDeposited: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalInvested: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalReturns: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'simple_wallets',
});

// Indexes
simpleWalletSchema.index({ user: 1 });
simpleWalletSchema.index({ balance: -1 });

module.exports = mongoose.model('SimpleWallet', simpleWalletSchema);

