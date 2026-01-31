const express = require('express');
const router = express.Router();
const adminSecurityAccessControlController = require('../controllers/adminSecurityAccessControlController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/security/access-control/overview
 * @desc    Overview: stats (totalRules, activeRules, ipRules, blockedIPs, allowedIPs, roles) and recentActivity
 * @access  Admin
 */
router.get('/overview', adminSecurityAccessControlController.getOverview);

/**
 * @route   GET /api/admin/security/access-control/access-rules
 * @desc    List access rules. Query: search, status, type, includeSeed, page, limit
 * @access  Admin
 */
router.get('/access-rules', adminSecurityAccessControlController.getAccessRules);

/**
 * @route   POST /api/admin/security/access-control/access-rules
 * @desc    Create access rule. Body: name, type, description, status?, priority?, conditions?, affectedUsers?, affectedIPs?
 * @access  Admin
 */
router.post('/access-rules', adminSecurityAccessControlController.createAccessRule);

/**
 * @route   GET /api/admin/security/access-control/access-rules/:id
 * @desc    Get one access rule by id
 * @access  Admin
 */
router.get('/access-rules/:id', adminSecurityAccessControlController.getAccessRuleById);

/**
 * @route   PUT /api/admin/security/access-control/access-rules/:id
 * @desc    Update access rule
 * @access  Admin
 */
router.put('/access-rules/:id', adminSecurityAccessControlController.updateAccessRule);

/**
 * @route   DELETE /api/admin/security/access-control/access-rules/:id
 * @desc    Delete access rule
 * @access  Admin
 */
router.delete('/access-rules/:id', adminSecurityAccessControlController.deleteAccessRule);

/**
 * @route   GET /api/admin/security/access-control/ip-rules
 * @desc    List IP rules. Query: search, status, includeSeed, page, limit
 * @access  Admin
 */
router.get('/ip-rules', adminSecurityAccessControlController.getIPRules);

/**
 * @route   POST /api/admin/security/access-control/ip-rules
 * @desc    Create IP rule. Body: ipAddress, cidr?, type, reason, status?, expiresAt?, location?
 * @access  Admin
 */
router.post('/ip-rules', adminSecurityAccessControlController.createIPRule);

/**
 * @route   GET /api/admin/security/access-control/ip-rules/:id
 * @desc    Get one IP rule by id
 * @access  Admin
 */
router.get('/ip-rules/:id', adminSecurityAccessControlController.getIPRuleById);

/**
 * @route   PUT /api/admin/security/access-control/ip-rules/:id
 * @desc    Update IP rule
 * @access  Admin
 */
router.put('/ip-rules/:id', adminSecurityAccessControlController.updateIPRule);

/**
 * @route   DELETE /api/admin/security/access-control/ip-rules/:id
 * @desc    Delete IP rule
 * @access  Admin
 */
router.delete('/ip-rules/:id', adminSecurityAccessControlController.deleteIPRule);

/**
 * @route   GET /api/admin/security/access-control/role-access
 * @desc    List all role access configs
 * @access  Admin
 */
router.get('/role-access', adminSecurityAccessControlController.getRoleAccess);

/**
 * @route   GET /api/admin/security/access-control/role-access/:role
 * @desc    Get role access by role name (e.g. "Admin", "Corporate Admin")
 * @access  Admin
 */
router.get('/role-access/:role', adminSecurityAccessControlController.getRoleAccessByRole);

/**
 * @route   PUT /api/admin/security/access-control/role-access/:role
 * @desc    Update role access (upsert). Body: permissions?, resources?, restrictions?
 * @access  Admin
 */
router.put('/role-access/:role', adminSecurityAccessControlController.updateRoleAccess);

module.exports = router;
