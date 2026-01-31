/**
 * Payment Routes
 * Handles payment-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createPaymentIntent,
  getPaymentStatus,
  getPaymentHistory,
} = require('../controllers/paymentController');

/**
 * Create Payment Intent
 * POST /api/payment/create-payment-intent
 * Requires authentication
 */
router.post('/create-payment-intent', authenticate, createPaymentIntent);

/**
 * Get Payment Status
 * GET /api/payment/status/:paymentIntentId
 * Requires authentication
 */
router.get('/status/:paymentIntentId', authenticate, getPaymentStatus);

/**
 * Get Payment History
 * GET /api/payment/history
 * Requires authentication
 * Query params: page, limit, status
 */
router.get('/history', authenticate, getPaymentHistory);

module.exports = router;
