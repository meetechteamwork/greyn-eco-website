const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  updateUserRole
} = require('../controllers/adminUsersController');

/**
 * Admin Users Routes
 * All routes require admin authentication
 */

// Get user statistics
router.get('/stats', authenticateAdmin, getUserStats);

// Get all users with filtering
router.get('/', authenticateAdmin, getAllUsers);

// Get single user by ID
router.get('/:id', authenticateAdmin, getUserById);

// Update user status
router.put('/:id/status', authenticateAdmin, updateUserStatus);

// Update user role
router.put('/:id/role', authenticateAdmin, updateUserRole);

module.exports = router;
