const express = require('express');
const router = express.Router();
const adminRateLimitsController = require('../controllers/adminRateLimitsController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/security/rate-limits
 * @desc    List rate limits with filters and stats
 * @query   search, status, category, method, enabled, page, limit, includeSeed
 * @access  Admin
 */
router.get('/', adminRateLimitsController.getList);

/**
 * @route   GET /api/admin/security/rate-limits/export
 * @desc    Export rate limits as CSV or JSON
 * @query   Same as list + format (csv|json), includeSeed
 * @access  Admin
 */
router.get('/export', adminRateLimitsController.exportLimits);

/**
 * @route   POST /api/admin/security/rate-limits
 * @desc    Create new rate limit
 * @body    endpoint, method, limit, window, description, category, createdBy
 * @access  Admin
 */
router.post('/', adminRateLimitsController.create);

/**
 * @route   POST /api/admin/security/rate-limits/:id/reset
 * @desc    Reset rate limit counter
 * @access  Admin
 */
router.post('/:id/reset', adminRateLimitsController.reset);

/**
 * @route   GET /api/admin/security/rate-limits/:id
 * @desc    Get single rate limit by ID
 * @access  Admin
 */
router.get('/:id', adminRateLimitsController.getOne);

/**
 * @route   PUT /api/admin/security/rate-limits/:id
 * @desc    Update rate limit
 * @body    endpoint, method, limit, window, description, category, enabled
 * @access  Admin
 */
router.put('/:id', adminRateLimitsController.update);

/**
 * @route   DELETE /api/admin/security/rate-limits/:id
 * @desc    Delete rate limit
 * @access  Admin
 */
router.delete('/:id', adminRateLimitsController.delete);

module.exports = router;
