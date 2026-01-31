const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateDashboardController = require('../controllers/corporateDashboardController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/dashboard
 * @desc    Get corporate dashboard data (KPIs, charts, scores)
 * @access  Corporate
 * @query   period: 'This Month' | 'This Quarter' | 'This Year' | 'All Time'
 */
router.get('/dashboard', corporateDashboardController.getDashboard);

module.exports = router;
