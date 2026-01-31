/**
 * Payment Model
 * Tracks Stripe payment transactions and associated carbon credits
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // Stripe Payment Intent ID (unique identifier)
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // User who made the payment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SimpleUser',
      required: true,
      index: true,
    },

    // Optional product reference
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },

    // Product details (stored for record keeping)
    productName: {
      type: String,
      required: true,
    },

    // Payment amount in USD
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment status
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled'],
      default: 'pending',
      index: true,
    },

    // Carbon credits calculation (1 USD = 10 CO2 units)
    carbonUnits: {
      type: Number,
      required: true,
      min: 0,
    },

    // Carbon credits (for future use with project association)
    carbonCreditsGenerated: {
      type: Number,
      default: 0,
    },

    // Link to wallet transaction (created on successful payment)
    walletTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SimpleWalletTransaction',
      required: false,
    },

    // Link to finance transaction (platform tracking)
    financeTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinanceTransaction',
      required: false,
    },

    // Webhook processing flag (idempotency)
    webhookProcessed: {
      type: Boolean,
      default: false,
    },

    // Payment method details
    paymentMethod: {
      type: String,
      required: false,
    },

    last4: {
      type: String,
      required: false,
    },

    brand: {
      type: String,
      required: false,
    },

    // Error details (if payment failed)
    errorMessage: {
      type: String,
      required: false,
    },

    // Metadata for additional information
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

/**
 * Static method to calculate carbon credits from payment amount
 * Formula: 1 USD = 10 CO2 units
 *
 * @param {Number} amountInUSD - Payment amount in USD
 * @returns {Object} - { carbonUnits, carbonCredits }
 */
paymentSchema.statics.calculateCarbonCredits = function(amountInUSD) {
  const carbonUnits = amountInUSD * 10; // 1 USD = 10 CO2 units
  const carbonCredits = carbonUnits / 100; // Example ratio for future use

  return {
    carbonUnits: Math.round(carbonUnits * 100) / 100, // Round to 2 decimal places
    carbonCredits: Math.round(carbonCredits * 100) / 100,
  };
};

/**
 * Instance method to update payment status
 *
 * @param {String} newStatus - New payment status
 * @param {Object} additionalData - Additional data to update
 */
paymentSchema.methods.updateStatus = async function(newStatus, additionalData = {}) {
  this.status = newStatus;
  Object.assign(this, additionalData);
  return await this.save();
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
