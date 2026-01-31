const express = require('express');
const router = express.Router();
const adminPortalsNgoController = require('../controllers/adminPortalsNgoController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/portals/ngo
 * @desc    Full NGO portal dashboard (stats, entities, activities, health)
 * @access  Admin
 */
router.get('/', adminPortalsNgoController.getDashboard);

/**
 * @route   GET /api/admin/portals/ngo/entities
 * @desc    List NGOs. Query: ?status=active|pending|suspended&search=
 * @access  Admin
 */
router.get('/entities', adminPortalsNgoController.getEntities);

/**
 * @route   GET /api/admin/portals/ngo/activities
 * @desc    Recent activities. Query: ?limit=50
 * @access  Admin
 */
router.get('/activities', adminPortalsNgoController.getActivities);

/**
 * @route   GET /api/admin/portals/ngo/stats
 * @desc    Aggregated portal stats
 * @access  Admin
 */
router.get('/stats', adminPortalsNgoController.getStats);

/**
 * @route   GET /api/admin/portals/ngo/health
 * @desc    Portal health metrics
 * @access  Admin
 */
router.get('/health', adminPortalsNgoController.getHealth);

/**
 * @route   PATCH /api/admin/portals/ngo/entities/:id/status
 * @desc    Update status. Body: { action: 'disable'|'approve'|'review' }
 * @access  Admin
 */
router.patch('/entities/:id/status', adminPortalsNgoController.updateEntityStatus);

module.exports = router;
