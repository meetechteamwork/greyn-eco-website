const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

/**
 * Public Projects Routes
 * Publicly accessible - no authentication required
 * Users only need to login when clicking Invest/Buy buttons
 */

/**
 * Get all active projects (public view)
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      limit = 50
    } = req.query;

    const query = {
      status: { $in: ['active', 'funded'] }
    };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .select('-createdBy -updatedBy -__v')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

/**
 * Get single project by ID (public view)
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select('-createdBy -updatedBy -__v');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only show active or funded projects to public
    if (!['active', 'funded'].includes(project.status)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

module.exports = router;
