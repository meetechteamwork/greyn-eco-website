/**
 * Webhook Routes
 * Handles Stripe webhook events
 * CRITICAL: Uses raw body parser for signature verification
 */

const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhookController');

/**
 * Stripe Webhook Endpoint
 * POST /api/payment/webhook
 *
 * IMPORTANT: This route MUST use express.raw() middleware
 * for Stripe signature verification to work properly.
 * The raw body is required to verify the webhook signature.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
