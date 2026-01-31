const { NGO } = require('../models/User');
const NgoProject = require('../models/NgoProject');
const NgoWalletTransaction = require('../models/NgoWalletTransaction');
const CorporateDonations = require('../models/CorporateDonations');
const CarbonCredit = require('../models/CarbonCredit');
const NgoDetails = require('../models/NgoDetails');

/**
 * GET /api/ngo/dashboard
 * Get NGO dashboard analytics
 */
exports.getDashboard = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { timeframe = '12M' } = req.query;

    // Get NGO basic info
    const ngo = await NGO.findById(ngoId).lean();
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();
    if (timeframe === '6M') {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeframe === '12M') {
      startDate.setMonth(now.getMonth() - 12);
    } else {
      startDate = new Date(0); // All time
    }

    // Get projects
    const allProjects = await NgoProject.find({ ngo: ngoId }).lean();
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === 'active').length;
    const pendingApproval = allProjects.filter(p => p.status === 'pending').length;
    const completedProjects = allProjects.filter(p => p.status === 'completed').length;

    // Get transactions for calculations
    const transactions = await NgoWalletTransaction.find({
      ngo: ngoId,
      status: 'completed',
      createdAt: { $gte: startDate }
    }).lean();

    // Calculate total investments (donations + revenue)
    const totalInvestments = transactions
      .filter(tx => tx.type === 'donation' || tx.type === 'revenue')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Count unique donors from transactions
    const uniqueDonors = new Set(
      transactions
        .filter(tx => tx.type === 'donation' && tx.donorName)
        .map(tx => tx.donorName)
    ).size;

    // Get total donors count (from all time, not just timeframe)
    const allTimeTransactions = await NgoWalletTransaction.find({
      ngo: ngoId,
      status: 'completed',
      type: 'donation'
    }).lean();
    const totalDonors = new Set(
      allTimeTransactions
        .filter(tx => tx.donorName)
        .map(tx => tx.donorName)
    ).size;

    // Get carbon credits generated
    let carbonCreditsGenerated = 0;
    if (allProjects.length > 0) {
      const projectNames = allProjects.map(p => p.name);
      const carbonCredits = await CarbonCredit.find({
        projectName: { $in: projectNames },
        status: { $in: ['issued', 'active', 'verified'] }
      }).lean();
      carbonCreditsGenerated = carbonCredits.reduce((sum, cc) => sum + (cc.quantity || 0), 0);
    }

    // Calculate revenue
    const revenue = transactions
      .filter(tx => tx.type === 'revenue')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate growth rate (compare current month to previous month)
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthInvestments = transactions
      .filter(tx => tx.type === 'donation' || tx.type === 'revenue')
      .filter(tx => new Date(tx.createdAt) >= currentMonth)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const previousMonthInvestments = await NgoWalletTransaction.find({
      ngo: ngoId,
      status: 'completed',
      type: { $in: ['donation', 'revenue'] },
      createdAt: { $gte: previousMonth, $lt: currentMonth }
    }).lean().then(txs => txs.reduce((sum, tx) => sum + tx.amount, 0));

    const growthRate = previousMonthInvestments > 0
      ? ((currentMonthInvestments - previousMonthInvestments) / previousMonthInvestments * 100).toFixed(1)
      : currentMonthInvestments > 0 ? '100.0' : '0.0';

    // Count new projects this month
    const newProjectsThisMonth = allProjects.filter(p => {
      const projectDate = new Date(p.createdAt);
      return projectDate >= currentMonth;
    }).length;

    // Calculate average project funding
    const avgProjectFunding = totalProjects > 0
      ? allProjects.reduce((sum, p) => sum + (p.currentFunding || 0), 0) / totalProjects
      : 0;

    // Get monthly funding data (last 12 months)
    const monthlyFundingData = [];
    const monthlyRevenueData = [];
    const monthlyDonorData = [];
    const monthlyCreditsData = [];

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });

      const monthTransactions = await NgoWalletTransaction.find({
        ngo: ngoId,
        status: 'completed',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      }).lean();

      const monthFunding = monthTransactions
        .filter(tx => tx.type === 'donation')
        .reduce((sum, tx) => sum + tx.amount, 0);

      const monthRevenue = monthTransactions
        .filter(tx => tx.type === 'revenue')
        .reduce((sum, tx) => sum + tx.amount, 0);

      const monthDonors = new Set(
        monthTransactions
          .filter(tx => tx.type === 'donation' && tx.donorName)
          .map(tx => tx.donorName)
      ).size;

      const monthProjects = await NgoProject.countDocuments({
        ngo: ngoId,
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      // Get carbon credits for this month
      let monthCreditsTotal = 0;
      if (allProjects.length > 0) {
        const projectNames = allProjects.map(p => p.name);
        const monthCredits = await CarbonCredit.find({
          projectName: { $in: projectNames },
          issuedAt: { $gte: monthStart, $lte: monthEnd },
          status: { $in: ['issued', 'active', 'verified'] }
        }).lean();
        monthCreditsTotal = monthCredits.reduce((sum, cc) => sum + (cc.quantity || 0), 0);
      }

      monthlyFundingData.push({
        month: monthName,
        funding: monthFunding,
        projects: monthProjects,
        donors: monthDonors
      });

      monthlyRevenueData.push({
        month: monthName,
        revenue: monthRevenue,
        donors: monthDonors
      });

      monthlyCreditsData.push({
        month: monthName,
        credits: monthCreditsTotal
      });
    }

    // Get top performing projects
    const topProjects = allProjects
      .sort((a, b) => (b.currentFunding || 0) - (a.currentFunding || 0))
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        funding: p.currentFunding || 0,
        goal: p.fundingGoal,
        donors: p.donors || 0,
        credits: p.carbonCredits || 0,
        progress: p.progress || 0
      }));

    // Calculate category distribution
    const categoryStats = {};
    allProjects.forEach(p => {
      const category = p.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { amount: 0, projects: 0 };
      }
      categoryStats[category].amount += (p.currentFunding || 0);
      categoryStats[category].projects += 1;
    });

    const totalCategoryAmount = Object.values(categoryStats).reduce((sum, stat) => sum + stat.amount, 0);
    const categoryDistribution = Object.entries(categoryStats).map(([category, stats]) => {
      const percentage = totalCategoryAmount > 0 ? (stats.amount / totalCategoryAmount * 100).toFixed(0) : 0;
      return {
        category,
        percentage: parseFloat(percentage),
        amount: stats.amount,
        projects: stats.projects,
        color: getCategoryColor(category)
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Format response
    const response = {
      analytics: {
        totalProjects,
        activeProjects,
        pendingApproval,
        completedProjects,
        totalInvestments,
        totalDonors,
        carbonCreditsGenerated,
        revenue,
        growthRate: `+${growthRate}%`,
        newProjectsThisMonth,
        avgProjectFunding
      },
      monthlyFundingData,
      revenueData: monthlyRevenueData,
      carbonCreditsData: monthlyCreditsData,
      topProjects,
      categoryDistribution
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Helper function to get category color
 */
function getCategoryColor(category) {
  const colors = {
    'Reforestation': 'bg-green-500',
    'Solar Energy': 'bg-yellow-500',
    'Wind Energy': 'bg-blue-500',
    'Ocean Cleanup': 'bg-cyan-500',
    'Urban Sustainability': 'bg-purple-500',
    'Wildlife Protection': 'bg-orange-500',
    'Other': 'bg-gray-500'
  };
  return colors[category] || 'bg-gray-500';
}
