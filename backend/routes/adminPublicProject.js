const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  getProjects: getPublicProjects,
  getProject: getPublicProject,
  createProject: createPublicProject,
  updateProject: updatePublicProject,
  deleteProject: deletePublicProject,
  getProjectStats: getPublicProjectStats
} = require('../controllers/adminPublicProjectController');

/**
 * Admin Public Projects Routes
 * All routes require admin authentication
 */

// Get project statistics
router.get('/stats', authenticateAdmin, getPublicProjectStats);

// Get all projects with filtering
router.get('/', authenticateAdmin, getPublicProjects);

// Get single project
router.get('/:id', authenticateAdmin, getPublicProject);

// Create new project
router.post('/', authenticateAdmin, createPublicProject);

// Update project
router.put('/:id', authenticateAdmin, updatePublicProject);

// Delete project
router.delete('/:id', authenticateAdmin, deletePublicProject);

module.exports = router;
