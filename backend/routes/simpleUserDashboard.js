const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getInvestments,
  getMonthlyAnalytics,
  getPortfolioDistribution,
  getTopPerformingProjects,
  createInvestment
} = require('../controllers/simpleUserDashboardController');
const { authenticate } = require('../middleware/auth');

/**
 * Simple User Dashboard Routes
 * All routes require authentication and simple-user role
 */

// Get dashboard statistics
router.get('/stats', authenticate, getDashboardStats);

// Get user investments
router.get('/investments', authenticate, getInvestments);

// Get monthly analytics
router.get('/analytics/monthly', authenticate, getMonthlyAnalytics);

// Get portfolio distribution
router.get('/analytics/portfolio-distribution', authenticate, getPortfolioDistribution);

// Get top performing projects
router.get('/analytics/top-projects', authenticate, getTopPerformingProjects);

// Create new investment
router.post('/investments', authenticate, createInvestment);

module.exports = router;
