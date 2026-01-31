const express = require('express');
const router = express.Router();
const adminPortalsCorporateController = require('../controllers/adminPortalsCorporateController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/portals/corporate
 * @desc    Get full corporate portal dashboard (stats, entities, activities, health)
 * @access  Admin
 */
router.get('/', adminPortalsCorporateController.getDashboard);

/**
 * @route   GET /api/admin/portals/corporate/entities
 * @desc    List corporate entities (optional: ?status=active|pending|suspended&search=...)
 * @access  Admin
 */
router.get('/entities', adminPortalsCorporateController.getEntities);

/**
 * @route   GET /api/admin/portals/corporate/activities
 * @desc    List recent activities (?limit=50)
 * @access  Admin
 */
router.get('/activities', adminPortalsCorporateController.getActivities);

/**
 * @route   GET /api/admin/portals/corporate/stats
 * @desc    Aggregated portal stats
 * @access  Admin
 */
router.get('/stats', adminPortalsCorporateController.getStats);

/**
 * @route   GET /api/admin/portals/corporate/health
 * @desc    Portal health metrics
 * @access  Admin
 */
router.get('/health', adminPortalsCorporateController.getHealth);

/**
 * @route   PATCH /api/admin/portals/corporate/entities/:id/status
 * @desc    Update entity status. Body: { action: 'disable'|'approve'|'review' }
 * @access  Admin
 */
router.patch('/entities/:id/status', adminPortalsCorporateController.updateEntityStatus);

module.exports = router;
