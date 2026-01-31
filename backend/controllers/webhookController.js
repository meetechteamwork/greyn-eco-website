/**
 * Webhook Controller
 * Handles Stripe webhook events for payment processing
 */

const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const SimpleWallet = require('../models/SimpleWallet');
const SimpleWalletTransaction = require('../models/SimpleWalletTransaction');
const FinanceTransaction = require('../models/FinanceTransaction');
const mongoose = require('mongoose');

/**
 * Generate unique transaction ID
 */
const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Handle Stripe Webhook Events
 * POST /api/payment/webhook
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};

/**
 * Handle Payment Success
 * Updates wallet, creates transactions with MongoDB transaction for atomicity
 */
const handlePaymentSuccess = async (paymentIntent) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    }).session(session);

    if (!payment) {
      console.error('Payment record not found:', paymentIntent.id);
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Check idempotency - prevent duplicate processing
    if (payment.webhookProcessed) {
      console.log('Webhook already processed for payment:', paymentIntent.id);
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Extract payment method details
    let paymentMethodDetails = {};
    if (paymentIntent.charges?.data?.[0]?.payment_method_details) {
      const pmDetails = paymentIntent.charges.data[0].payment_method_details;
      if (pmDetails.card) {
        paymentMethodDetails = {
          paymentMethod: 'card',
          last4: pmDetails.card.last4,
          brand: pmDetails.card.brand,
        };
      }
    }

    // Update payment status
    payment.status = 'succeeded';
    payment.webhookProcessed = true;
    Object.assign(payment, paymentMethodDetails);

    // Find or create wallet
    let wallet = await SimpleWallet.findOne({ user: payment.userId }).session(session);

    if (!wallet) {
      wallet = new SimpleWallet({
        user: payment.userId,
        balance: 0,
        availableBalance: 0,
        totalDeposited: 0,
      });
    }

    // Update wallet balances
    wallet.balance += payment.amount;
    wallet.availableBalance += payment.amount;
    wallet.totalDeposited += payment.amount;
    wallet.lastUpdated = new Date();

    // Create wallet transaction
    const walletTransaction = new SimpleWalletTransaction({
      user: payment.userId,
      type: 'deposit',
      amount: payment.amount,
      description: `Payment for ${payment.productName}`,
      status: 'completed',
      reference: paymentIntent.id,
      metadata: {
        carbonUnits: payment.carbonUnits,
        carbonCredits: payment.carbonCreditsGenerated,
        paymentIntentId: paymentIntent.id,
        productName: payment.productName,
      },
    });

    // Create finance transaction (platform tracking)
    const financeTransaction = new FinanceTransaction({
      transactionId: generateTransactionId(),
      timestamp: new Date(),
      type: 'purchase',
      amount: payment.amount,
      currency: 'USD',
      entity: payment.userId.toString(),
      description: `Product purchase: ${payment.productName}`,
      status: 'completed',
      reference: paymentIntent.id,
      paymentMethod: 'credit_card',
      metadata: {
        carbonUnits: payment.carbonUnits,
        carbonCredits: payment.carbonCreditsGenerated,
        stripePaymentIntentId: paymentIntent.id,
        productName: payment.productName,
      },
    });

    // Save all records
    await wallet.save({ session });
    await walletTransaction.save({ session });
    await financeTransaction.save({ session });

    // Link transactions to payment
    payment.walletTransactionId = walletTransaction._id;
    payment.financeTransactionId = financeTransaction._id;
    await payment.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log('Payment processed successfully:', paymentIntent.id);
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    console.error('Payment success handling error:', error);
    throw error;
  }
};

/**
 * Handle Payment Failed
 */
const handlePaymentFailed = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      console.error('Payment record not found:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'failed';
    payment.errorMessage = paymentIntent.last_payment_error?.message || 'Payment failed';
    payment.webhookProcessed = true;

    await payment.save();

    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Payment failed handling error:', error);
    throw error;
  }
};

/**
 * Handle Payment Canceled
 */
const handlePaymentCanceled = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      console.error('Payment record not found:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'canceled';
    payment.webhookProcessed = true;

    await payment.save();

    console.log('Payment canceled:', paymentIntent.id);
  } catch (error) {
    console.error('Payment canceled handling error:', error);
    throw error;
  }
};

module.exports = {
  handleWebhook,
};
