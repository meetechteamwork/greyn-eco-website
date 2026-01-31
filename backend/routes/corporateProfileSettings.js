const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateProfileSettingsController = require('../controllers/corporateProfileSettingsController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/profile-settings
 * @desc    Get profile settings for authenticated corporate user
 * @access  Corporate
 */
router.get('/', corporateProfileSettingsController.getProfileSettings);

/**
 * @route   PUT /api/corporate/profile-settings/profile
 * @desc    Update profile information
 * @access  Corporate
 * @body    { name, email, phone, department, title, bio, location, timezone, employeeId }
 */
router.put('/profile', corporateProfileSettingsController.updateProfile);

/**
 * @route   PUT /api/corporate/profile-settings/security
 * @desc    Update security settings
 * @access  Corporate
 * @body    { twoFactorEnabled, sessionTimeout, loginAlerts, suspiciousActivity }
 */
router.put('/security', corporateProfileSettingsController.updateSecurity);

/**
 * @route   PUT /api/corporate/profile-settings/preferences
 * @desc    Update application preferences
 * @access  Corporate
 * @body    { theme, language, dateFormat, timeFormat, itemsPerPage }
 */
router.put('/preferences', corporateProfileSettingsController.updatePreferences);

/**
 * @route   PUT /api/corporate/profile-settings/notifications
 * @desc    Update notification settings
 * @access  Corporate
 * @body    { email: {...}, push: {...} }
 */
router.put('/notifications', corporateProfileSettingsController.updateNotifications);

/**
 * @route   POST /api/corporate/profile-settings/change-password
 * @desc    Change user password
 * @access  Corporate
 * @body    { currentPassword, newPassword }
 */
router.post('/change-password', corporateProfileSettingsController.changePassword);

/**
 * @route   GET /api/corporate/profile-settings/export
 * @desc    Export user data
 * @access  Corporate
 */
router.get('/export', corporateProfileSettingsController.exportData);

module.exports = router;
