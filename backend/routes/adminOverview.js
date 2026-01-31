const express = require('express');
const router = express.Router();
const adminOverviewController = require('../controllers/adminOverviewController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/overview
 * @desc    Get complete overview data (all metrics)
 * @access  Admin
 */
router.get('/', adminOverviewController.getOverview);

/**
 * @route   GET /api/admin/overview/kpis
 * @desc    Get KPI statistics
 * @access  Admin
 */
router.get('/kpis', adminOverviewController.getKPIs);

/**
 * @route   GET /api/admin/overview/credits-lifecycle
 * @desc    Get credits lifecycle funnel data
 * @access  Admin
 */
router.get('/credits-lifecycle', adminOverviewController.getCreditsLifecycle);

/**
 * @route   GET /api/admin/overview/usage-trend
 * @desc    Get platform usage trend data
 * @access  Admin
 */
router.get('/usage-trend', adminOverviewController.getUsageTrend);

/**
 * @route   GET /api/admin/overview/portal-activity
 * @desc    Get portal activity heatmap data
 * @access  Admin
 */
router.get('/portal-activity', adminOverviewController.getPortalActivity);

module.exports = router;
