const express = require('express');
const router = express.Router();
const { authenticateNGO } = require('../middleware/auth');
const ngoPersonDetailsController = require('../controllers/ngoPersonDetailsController');

router.use(authenticateNGO);

/**
 * @route   GET /api/ngo/person-details
 * @desc    Get person details
 * @access  NGO
 */
router.get('/', ngoPersonDetailsController.getPersonDetails);

/**
 * @route   PUT /api/ngo/person-details
 * @desc    Update person details
 * @access  NGO
 * @body    { name, role, email, phone, bio, expertise[], education[], projectsLed, yearsExperience, publications, awards[], socialLinks }
 */
router.put('/', ngoPersonDetailsController.updatePersonDetails);

module.exports = router;
