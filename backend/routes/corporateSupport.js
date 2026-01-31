const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const supportController = require('../controllers/supportController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   POST /api/corporate/support/contact
 * @desc    Submit a support contact form
 * @access  Corporate
 * @body    { subject, message }
 */
router.post('/contact', supportController.submitContact);

/**
 * @route   GET /api/corporate/support/contacts
 * @desc    Get support contacts for authenticated corporate user
 * @access  Corporate
 * @query   { page, limit }
 */
router.get('/contacts', supportController.getContacts);

module.exports = router;
