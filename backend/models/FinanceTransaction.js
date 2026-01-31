const mongoose = require('mongoose');

const TRANSACTION_TYPES = ['purchase', 'sale', 'refund', 'fee', 'commission', 'withdrawal', 'deposit'];
const TRANSACTION_STATUSES = ['completed', 'pending', 'failed', 'refunded', 'processing'];
const PAYMENT_METHODS = ['credit_card', 'bank_transfer', 'crypto', 'wallet', 'other'];

/**
 * Finance Transaction Model
 * Platform financial transactions: purchases, sales, fees, commissions, withdrawals, deposits.
 * Collection: finance_transactions
 */
const financeTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: TRANSACTION_STATUSES,
      index: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: undefined,
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      default: undefined,
    },
    invoiceId: {
      type: String,
      trim: true,
      default: undefined,
    },
    source: {
      type: String,
      default: undefined,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
    collection: 'finance_transactions',
  }
);

financeTransactionSchema.index({ timestamp: -1 });
financeTransactionSchema.index({ status: 1, timestamp: -1 });
financeTransactionSchema.index({ type: 1, timestamp: -1 });
financeTransactionSchema.index({ entity: 1, timestamp: -1 });
financeTransactionSchema.index({ source: 1 });

module.exports = mongoose.model('FinanceTransaction', financeTransactionSchema);
module.exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
module.exports.TRANSACTION_STATUSES = TRANSACTION_STATUSES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
