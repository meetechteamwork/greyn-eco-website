const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateReportsController = require('../controllers/corporateReportsController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/reports
 * @desc    List all reports with pagination and filtering
 * @access  Corporate
 * @query   page, limit, status, reportType, period, search
 */
router.get('/', corporateReportsController.getReports);

/**
 * @route   GET /api/corporate/reports/:id
 * @desc    Get single report details
 * @access  Corporate
 */
router.get('/:id', corporateReportsController.getReport);

/**
 * @route   POST /api/corporate/reports/generate
 * @desc    Generate ESG report
 * @access  Corporate
 * @body    { reportType, period, includeEmissions, includeDonations, includeVolunteers }
 */
router.post('/generate', corporateReportsController.generateReport);

/**
 * @route   GET /api/corporate/reports/export/:id
 * @desc    Export single report as CSV/JSON
 * @access  Corporate
 * @query   format: 'csv' | 'json'
 */
router.get('/export/:id', corporateReportsController.exportReport);

/**
 * @route   POST /api/corporate/reports/export-all
 * @desc    Export all reports as CSV
 * @access  Corporate
 * @body    { status?, reportType? }
 */
router.post('/export-all', corporateReportsController.exportAllReports);

/**
 * @route   DELETE /api/corporate/reports/:id
 * @desc    Delete a report
 * @access  Corporate
 */
router.delete('/:id', corporateReportsController.deleteReport);

/**
 * @route   PATCH /api/corporate/reports/:id/status
 * @desc    Update report status
 * @access  Corporate
 * @body    { status: 'draft' | 'published' | 'archived' }
 */
router.patch('/:id/status', corporateReportsController.updateReportStatus);

module.exports = router;
