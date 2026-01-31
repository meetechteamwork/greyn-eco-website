const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivity,
  createActivity,
  getStats,
  getActivityTypes,
  uploadProofImage
} = require('../controllers/simpleUserActivityController');
const { authenticate } = require('../middleware/auth');

/**
 * Simple User Activity Routes
 * All routes require authentication and simple-user role
 */

// Get activity types
router.get('/types', authenticate, getActivityTypes);

// Get user's activity statistics
router.get('/stats', authenticate, getStats);

// Get user's activities
router.get('/', authenticate, getActivities);

// Get single activity by ID
router.get('/:id', authenticate, getActivity);

// Create new activity (with image upload)
router.post('/', authenticate, uploadProofImage, createActivity);

module.exports = router;
