const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateEmissionsController = require('../controllers/corporateEmissionsController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/emissions
 * @desc    List all emissions with pagination and filtering
 * @access  Corporate
 * @query   category, country, search, startDate, endDate, page, limit
 */
router.get('/', corporateEmissionsController.getEmissions);

/**
 * @route   POST /api/corporate/emissions
 * @desc    Create new emission entry(ies)
 * @access  Corporate
 * @body    { electricity?, fuel?, travel?, wasteRecycled?, country? }
 */
router.post('/', corporateEmissionsController.createEmission);

/**
 * @route   GET /api/corporate/emissions/export
 * @desc    Export emissions as CSV
 * @access  Corporate
 * @query   category?, country?, startDate?, endDate?
 */
router.get('/export', corporateEmissionsController.exportEmissions);

/**
 * @route   DELETE /api/corporate/emissions/:id
 * @desc    Delete emission entry
 * @access  Corporate
 */
router.delete('/:id', corporateEmissionsController.deleteEmission);

module.exports = router;
