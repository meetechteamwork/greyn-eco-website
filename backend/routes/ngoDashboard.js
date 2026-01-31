const express = require('express');
const router = express.Router();
const { authenticateNGO } = require('../middleware/auth');
const ngoDashboardController = require('../controllers/ngoDashboardController');

router.use(authenticateNGO);

/**
 * @route   GET /api/ngo/dashboard
 * @desc    Get NGO dashboard analytics
 * @access  NGO
 * @query   { timeframe: '6M' | '12M' | 'All' }
 */
router.get('/', ngoDashboardController.getDashboard);

module.exports = router;
