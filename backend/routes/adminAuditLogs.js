const express = require('express');
const router = express.Router();
const adminAuditLogsController = require('../controllers/adminAuditLogsController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/security/audit-logs
 * @desc    List audit logs with filters, pagination, stats. Query: search, severity, action, status, dateRange, page, limit, includeSeed
 * @access  Admin
 */
router.get('/', adminAuditLogsController.getList);

/**
 * @route   GET /api/admin/security/audit-logs/export
 * @desc    Export filtered audit logs as CSV or JSON. Query: same as list + format=csv|json, includeSeed
 * @access  Admin
 */
router.get('/export', adminAuditLogsController.getExport);

/**
 * @route   GET /api/admin/security/audit-logs/:id/export
 * @desc    Export single audit log as JSON
 * @access  Admin
 */
router.get('/:id/export', adminAuditLogsController.getExportOne);

/**
 * @route   GET /api/admin/security/audit-logs/:id/verify
 * @desc    Verify integrity hash of an audit log. Returns { valid, message }
 * @access  Admin
 */
router.get('/:id/verify', adminAuditLogsController.getVerify);

/**
 * @route   GET /api/admin/security/audit-logs/:id
 * @desc    Get single audit log by id
 * @access  Admin
 */
router.get('/:id', adminAuditLogsController.getOne);

module.exports = router;
