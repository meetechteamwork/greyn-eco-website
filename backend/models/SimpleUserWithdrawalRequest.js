const mongoose = require('mongoose');

/**
 * Simple User Withdrawal Request Model
 * Stores withdrawal requests with approval workflow for individual investors
 * Collection: simple_withdrawal_requests
 */
const simpleUserWithdrawalRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  bankAccount: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending_approval', 'approved', 'processing', 'completed', 'rejected'],
    default: 'pending_approval',
    index: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  availableAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  rejectedReason: {
    type: String,
    trim: true,
    default: '',
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SimpleWalletTransaction',
    default: null,
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
  collection: 'simple_withdrawal_requests',
});

// Indexes
simpleUserWithdrawalRequestSchema.index({ user: 1, createdAt: -1 });
simpleUserWithdrawalRequestSchema.index({ user: 1, status: 1 });
simpleUserWithdrawalRequestSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model('SimpleUserWithdrawalRequest', simpleUserWithdrawalRequestSchema);

