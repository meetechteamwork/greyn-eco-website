const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const adminProjectController = require('../controllers/adminProjectController');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/projects
 * @desc    Get all projects with filtering and pagination
 * @access  Admin
 * @query   { status, category, search, page, limit }
 */
router.get('/', adminProjectController.getProjects);

/**
 * @route   GET /api/admin/projects/:id
 * @desc    Get a single project by ID
 * @access  Admin
 */
router.get('/:id', adminProjectController.getProject);

/**
 * @route   PATCH /api/admin/projects/:id/approve
 * @desc    Approve a project
 * @access  Admin
 * @body    { comment?: string }
 */
router.patch('/:id/approve', adminProjectController.approveProject);

/**
 * @route   PATCH /api/admin/projects/:id/reject
 * @desc    Reject a project
 * @access  Admin
 * @body    { reason: string }
 */
router.patch('/:id/reject', adminProjectController.rejectProject);

/**
 * @route   DELETE /api/admin/projects/:id
 * @desc    Delete a project
 * @access  Admin
 */
router.delete('/:id', adminProjectController.deleteProject);

module.exports = router;
