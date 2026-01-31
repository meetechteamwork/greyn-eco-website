const express = require('express');
const router = express.Router();
const systemHealthController = require('../controllers/systemHealthController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/system
 * @desc    Get all system health data (services, incidents, logs)
 * @access  Admin
 */
router.get('/', systemHealthController.getSystemHealth);

/**
 * @route   GET /api/admin/system/services
 * @desc    Get all services
 * @access  Admin
 */
router.get('/services', systemHealthController.getServices);

/**
 * @route   GET /api/admin/system/incidents
 * @desc    Get incidents
 * @access  Admin
 */
router.get('/incidents', systemHealthController.getIncidents);

/**
 * @route   GET /api/admin/system/logs
 * @desc    Get system logs
 * @access  Admin
 */
router.get('/logs', systemHealthController.getLogs);

/**
 * @route   PUT /api/admin/system/services/:serviceName
 * @desc    Update service health
 * @access  Admin
 */
router.put('/services/:serviceName', systemHealthController.updateServiceHealth);

module.exports = router;
