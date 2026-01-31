const express = require('express');
const router = express.Router();
const { authenticateNGO } = require('../middleware/auth');
const ngoDetailsController = require('../controllers/ngoDetailsController');

router.use(authenticateNGO);

/**
 * @route   GET /api/ngo/details
 * @desc    Get NGO details
 * @access  NGO
 */
router.get('/', ngoDetailsController.getNgoDetails);

/**
 * @route   PUT /api/ngo/details
 * @desc    Update NGO details
 * @access  NGO
 * @body    { organizationName, registrationNumber, establishedDate, location, contactEmail, contactPhone, website, mission, focusAreas[], certifications[], teamSize, annualBudget, impactMetrics }
 */
router.put('/', ngoDetailsController.updateNgoDetails);

module.exports = router;
