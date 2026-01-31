/**
 * Payment Controller
 * Handles Stripe payment operations and carbon credit calculations
 */

const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const Product = require('../models/Product');

/**
 * Create Payment Intent
 * POST /api/payment/create-payment-intent
 * Creates a Stripe Payment Intent and stores payment record
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { productId, amount, productName } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!amount || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Amount and product name are required',
      });
    }

    // Validate amount
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    // Validate product if productId is provided
    let product = null;
    if (productId) {
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
    }

    // Calculate carbon credits
    const { carbonUnits, carbonCredits } = Payment.calculateCarbonCredits(paymentAmount);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(paymentAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        productId: productId || 'none',
        productName,
        carbonUnits: carbonUnits.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create Payment record in database
    const payment = new Payment({
      stripePaymentIntentId: paymentIntent.id,
      userId,
      productId: productId || null,
      productName,
      amount: paymentAmount,
      status: 'pending',
      carbonUnits,
      carbonCreditsGenerated: carbonCredits,
      metadata: {
        stripeClientSecret: paymentIntent.client_secret,
      },
    });

    await payment.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentAmount,
        carbonUnits,
        carbonCredits,
      },
    });
  } catch (error) {
    console.error('Create Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

/**
 * Get Payment Status
 * GET /api/payment/status/:paymentIntentId
 * Retrieves payment status and syncs with Stripe
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const userId = req.user.userId;

    // Find payment in database
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId,
    }).populate('walletTransactionId financeTransactionId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Sync status with Stripe
    try {
      const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Update local status if different
      if (payment.status !== stripePaymentIntent.status) {
        payment.status = stripePaymentIntent.status;

        // Update payment method details if available
        if (stripePaymentIntent.charges?.data?.[0]?.payment_method_details) {
          const pmDetails = stripePaymentIntent.charges.data[0].payment_method_details;
          if (pmDetails.card) {
            payment.paymentMethod = 'card';
            payment.last4 = pmDetails.card.last4;
            payment.brand = pmDetails.card.brand;
          }
        }

        await payment.save();
      }
    } catch (stripeError) {
      console.error('Stripe sync error:', stripeError);
      // Continue with database status if Stripe sync fails
    }

    res.status(200).json({
      success: true,
      data: {
        paymentIntentId: payment.stripePaymentIntentId,
        status: payment.status,
        amount: payment.amount,
        productName: payment.productName,
        carbonUnits: payment.carbonUnits,
        carbonCredits: payment.carbonCreditsGenerated,
        paymentMethod: payment.paymentMethod,
        last4: payment.last4,
        brand: payment.brand,
        createdAt: payment.createdAt,
        walletTransaction: payment.walletTransactionId,
        financeTransaction: payment.financeTransactionId,
      },
    });
  } catch (error) {
    console.error('Get Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment status',
      error: error.message,
    });
  }
};

/**
 * Get Payment History
 * GET /api/payment/history
 * Lists user's payment history with pagination
 */
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch payments with pagination
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-metadata -__v'),
      Payment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get Payment History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment history',
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  getPaymentStatus,
  getPaymentHistory,
};
