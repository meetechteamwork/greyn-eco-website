const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateCampaignsController = require('../controllers/corporateCampaignsController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/campaigns
 * @desc    List all campaigns with pagination and filtering
 * @access  Corporate
 * @query   status, category, search, page, limit
 */
router.get('/', corporateCampaignsController.getCampaigns);

/**
 * @route   GET /api/corporate/campaigns/:id
 * @desc    Get single campaign details
 * @access  Corporate
 */
router.get('/:id', corporateCampaignsController.getCampaign);

/**
 * @route   POST /api/corporate/campaigns
 * @desc    Create new campaign
 * @access  Corporate
 * @body    { title, description, ngoName, category, targetAmount, startDate, endDate }
 */
router.post('/', corporateCampaignsController.createCampaign);

/**
 * @route   PUT /api/corporate/campaigns/:id
 * @desc    Update campaign
 * @access  Corporate
 * @body    { title?, description?, ngoName?, category?, targetAmount?, startDate?, endDate? }
 */
router.put('/:id', corporateCampaignsController.updateCampaign);

/**
 * @route   DELETE /api/corporate/campaigns/:id
 * @desc    Delete campaign
 * @access  Corporate
 */
router.delete('/:id', corporateCampaignsController.deleteCampaign);

/**
 * @route   GET /api/corporate/campaigns/export
 * @desc    Export campaigns as CSV
 * @access  Corporate
 */
router.get('/export', corporateCampaignsController.exportCampaigns);

module.exports = router;
