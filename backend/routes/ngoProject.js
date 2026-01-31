const express = require('express');
const router = express.Router();
const { authenticateNGO } = require('../middleware/auth');
const ngoProjectController = require('../controllers/ngoProjectController');

router.use(authenticateNGO);

/**
 * @route   POST /api/ngo/projects
 * @desc    Create a new project
 * @access  NGO
 * @body    { projectName, category, description, longDescription, location, fundingGoal, minInvestment, duration, carbonImpact, carbonCreditsPerHundred }
 */
router.post('/', ngoProjectController.createProject);

/**
 * @route   GET /api/ngo/projects
 * @desc    Get all projects for the authenticated NGO
 * @access  NGO
 * @query   { status, page, limit }
 */
router.get('/', ngoProjectController.getProjects);

/**
 * @route   GET /api/ngo/projects/:id
 * @desc    Get a single project by ID with milestones and team
 * @access  NGO
 */
router.get('/:id', ngoProjectController.getProject);

/**
 * @route   PUT /api/ngo/projects/:id
 * @desc    Update a project
 * @access  NGO
 * @body    { projectName?, category?, description?, longDescription?, location?, fundingGoal?, minInvestment?, duration?, carbonImpact?, carbonCreditsPerHundred? }
 */
router.put('/:id', ngoProjectController.updateProject);

module.exports = router;
