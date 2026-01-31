const Investment = require('../models/Investment');
const Project = require('../models/Project');
const mongoose = require('mongoose');

/**
 * Simple User Dashboard Controller
 * Handles all dashboard-related operations for simple users (investors)
 */

/**
 * Get dashboard statistics
 * Returns: total invested, total returns, total carbon credits, investment count
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      totalInvested,
      totalReturns,
      totalCarbonCredits,
      investmentCount
    ] = await Promise.all([
      Investment.getUserTotalInvested(userId),
      Investment.getUserTotalReturns(userId),
      Investment.getUserTotalCarbonCredits(userId),
      Investment.countDocuments({ userId, status: { $in: ['active', 'completed'] } })
    ]);

    res.json({
      success: true,
      data: {
        totalInvested,
        totalReturns,
        totalCarbonCredits,
        investmentCount,
        carbonTonsEquivalent: (totalCarbonCredits * 0.5).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get user investments list
 * Returns: array of investments with project details
 */
exports.getInvestments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const investments = await Investment.find(query)
      .sort({ investmentDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-metadata -__v');

    // Populate project details if needed
    const investmentsWithDetails = await Promise.all(
      investments.map(async (inv) => {
        try {
          const project = await Project.findById(inv.projectId)
            .select('name category image description status');
          
          return {
            id: inv._id.toString(),
            _id: inv._id.toString(),
            projectId: inv.projectId.toString(),
            projectName: inv.projectName || project?.name || 'Unknown Project',
            category: inv.projectCategory || project?.category || 'Other',
            amount: inv.amount,
            returns: inv.returns,
            carbonCredits: inv.carbonCredits,
            status: inv.status,
            investmentDate: inv.investmentDate,
            projectImage: project?.image,
            projectDescription: project?.description
          };
        } catch (err) {
          // If project not found, return investment without project details
          return {
            id: inv._id.toString(),
            _id: inv._id.toString(),
            projectId: inv.projectId.toString(),
            projectName: inv.projectName,
            category: inv.projectCategory,
            amount: inv.amount,
            returns: inv.returns,
            carbonCredits: inv.carbonCredits,
            status: inv.status,
            investmentDate: inv.investmentDate
          };
        }
      })
    );

    res.json({
      success: true,
      data: investmentsWithDetails,
      count: investmentsWithDetails.length
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investments',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get monthly analytics data
 * Returns: array of monthly data (investments, returns, carbon credits)
 */
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const months = parseInt(req.query.months) || 12;

    const monthlyData = await Investment.getMonthlyData(userId, months);

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly analytics',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get portfolio distribution by category
 * Returns: array of categories with percentages and amounts
 */
exports.getPortfolioDistribution = async (req, res) => {
  try {
    const userId = req.user.userId;

    const distribution = await Investment.getPortfolioDistribution(userId);

    // Map categories to colors (matching frontend)
    const categoryColors = {
      'Solar Energy': 'bg-yellow-500',
      'Wind Energy': 'bg-blue-500',
      'Reforestation': 'bg-green-500',
      'Ocean Conservation': 'bg-cyan-500',
      'Urban Sustainability': 'bg-emerald-500',
      'Clean Transportation': 'bg-purple-500',
      'Other': 'bg-gray-500'
    };

    const distributionWithColors = distribution.map(item => ({
      category: item.category,
      percentage: item.percentage,
      amount: item.amount,
      count: item.count,
      color: categoryColors[item.category] || 'bg-gray-500'
    }));

    res.json({
      success: true,
      data: distributionWithColors
    });
  } catch (error) {
    console.error('Error fetching portfolio distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio distribution',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get top performing projects
 * Returns: array of top investments by returns
 */
exports.getTopPerformingProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 5;

    const topProjects = await Investment.find({
      userId,
      status: { $in: ['active', 'completed'] }
    })
      .sort({ returns: -1 })
      .limit(limit)
      .select('projectName projectCategory amount returns carbonCredits status investmentDate');

    const topProjectsWithDetails = await Promise.all(
      topProjects.map(async (inv) => {
        try {
          const project = await Project.findById(inv.projectId)
            .select('name image');
          
          return {
            id: inv._id.toString(),
            projectId: inv.projectId.toString(),
            projectName: inv.projectName || project?.name || 'Unknown Project',
            category: inv.projectCategory,
            amount: inv.amount,
            returns: inv.returns,
            carbonCredits: inv.carbonCredits,
            status: inv.status,
            projectImage: project?.image
          };
        } catch (err) {
          return {
            id: inv._id.toString(),
            projectId: inv.projectId.toString(),
            projectName: inv.projectName,
            category: inv.projectCategory,
            amount: inv.amount,
            returns: inv.returns,
            carbonCredits: inv.carbonCredits,
            status: inv.status
          };
        }
      })
    );

    res.json({
      success: true,
      data: topProjectsWithDetails
    });
  } catch (error) {
    console.error('Error fetching top performing projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performing projects',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Create a new investment
 * Used when user invests in a project
 */
exports.createInvestment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectId, amount, notes } = req.body;

    // Validate input
    if (!projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Investment amount must be positive'
      });
    }

    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Project is not available for investment'
      });
    }

    // Calculate expected returns and carbon credits
    // Assuming 10% return rate and carbon credits based on investment amount
    const expectedReturnRate = project.expectedReturnRate || 10;
    const expectedReturns = (amount * expectedReturnRate) / 100;
    
    // Calculate carbon credits (example: $100 = 1 carbon credit)
    const carbonCreditsPerDollar = 0.01;
    const carbonCredits = amount * carbonCreditsPerDollar;

    // Create investment
    const investment = new Investment({
      userId,
      projectId,
      projectName: project.name,
      projectCategory: project.category,
      amount,
      returns: 0, // Will be updated as project progresses
      carbonCredits,
      status: 'pending',
      expectedReturnRate,
      notes
    });

    await investment.save();

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: {
        id: investment._id.toString(),
        projectId: investment.projectId.toString(),
        projectName: investment.projectName,
        amount: investment.amount,
        carbonCredits: investment.carbonCredits,
        status: investment.status,
        investmentDate: investment.investmentDate
      }
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create investment',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};
