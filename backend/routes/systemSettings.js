const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controllers/systemSettingsController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/system-settings
 * @desc    Get all system settings (complete data)
 * @access  Admin
 */
router.get('/', systemSettingsController.getAllSettings);

/**
 * @route   GET /api/admin/system-settings/settings
 * @desc    Get system settings only
 * @access  Admin
 */
router.get('/settings', systemSettingsController.getSettings);

/**
 * @route   PUT /api/admin/system-settings/:section
 * @desc    Update system settings by section (general, performance, maintenance)
 * @access  Admin
 */
router.put('/:section', systemSettingsController.updateSettings);

/**
 * @route   GET /api/admin/system-settings/integrations
 * @desc    Get all integrations
 * @access  Admin
 */
router.get('/integrations', systemSettingsController.getIntegrations);

/**
 * @route   PUT /api/admin/system-settings/integrations/:id
 * @desc    Update integration status
 * @access  Admin
 */
router.put('/integrations/:id', systemSettingsController.updateIntegration);

/**
 * @route   GET /api/admin/system-settings/backups
 * @desc    Get all backups
 * @access  Admin
 */
router.get('/backups', systemSettingsController.getBackups);

/**
 * @route   POST /api/admin/system-settings/backups
 * @desc    Create a new backup
 * @access  Admin
 */
router.post('/backups', systemSettingsController.createBackup);

module.exports = router;
