const PlatformStatistics = require('../models/PlatformStatistics');
const CarbonCredit = require('../models/CarbonCredit');
const PlatformMetrics = require('../models/PlatformMetrics');
const PortalActivity = require('../models/PortalActivity');
const { SimpleUser, NGO, Corporate, CarbonUser } = require('../models/User');

/**
 * Get real-time user counts from role-specific collections.
 * @returns {{ totalUsers: number, activeCorporates: number, ngosRegistered: number }}
 */
async function getUserCountsByRole() {
  const [simple, ngo, corp, carbon] = await Promise.all([
    SimpleUser.countDocuments(),
    NGO.countDocuments(),
    Corporate.countDocuments(),
    CarbonUser.countDocuments()
  ]);
  return {
    totalUsers: simple + carbon,
    activeCorporates: corp,
    ngosRegistered: ngo
  };
}

/**
 * Get all KPI statistics for the admin overview dashboard
 */
exports.getKPIs = async (req, res) => {
  try {
    // Get current statistics
    const stats = await PlatformStatistics.getCurrentStats();
    const userStats = await getUserCountsByRole();

    // Update stats with real counts if different
    if (userStats.totalUsers !== stats.totalUsers) {
      stats.totalUsers = userStats.totalUsers;
    }
    if (userStats.activeCorporates !== stats.activeCorporates) {
      stats.activeCorporates = userStats.activeCorporates;
    }
    if (userStats.ngosRegistered !== stats.ngosRegistered) {
      stats.ngosRegistered = userStats.ngosRegistered;
    }
    
    // Calculate changes
    const kpis = [
      {
        label: 'Total Users',
        value: stats.totalUsers.toLocaleString(),
        change: stats.usersThisMonth > 0 
          ? `+${stats.usersThisMonth.toLocaleString()} this month`
          : 'No change this month',
        changeType: stats.usersThisMonth > 0 ? 'positive' : 'neutral',
        rawValue: stats.totalUsers
      },
      {
        label: 'Active Corporates',
        value: stats.activeCorporates.toLocaleString(),
        change: stats.corporatesThisQuarter > 0
          ? `+${stats.corporatesThisQuarter.toLocaleString()} this quarter`
          : 'No change this quarter',
        changeType: stats.corporatesThisQuarter > 0 ? 'positive' : 'neutral',
        rawValue: stats.activeCorporates
      },
      {
        label: 'NGOs Registered',
        value: stats.ngosRegistered.toLocaleString(),
        change: stats.ngosThisQuarter > 0
          ? `+${stats.ngosThisQuarter.toLocaleString()} this quarter`
          : 'No change this quarter',
        changeType: stats.ngosThisQuarter > 0 ? 'positive' : 'neutral',
        rawValue: stats.ngosRegistered
      },
      {
        label: 'Carbon Credits Issued',
        value: stats.carbonCreditsIssued.toFixed(1),
        unit: 'tCO₂e',
        change: stats.creditsIssuedThisMonth > 0
          ? `+${stats.creditsIssuedThisMonth.toFixed(1)} this month`
          : 'No change this month',
        changeType: stats.creditsIssuedThisMonth > 0 ? 'positive' : 'neutral',
        rawValue: stats.carbonCreditsIssued
      },
      {
        label: 'Credits Retired',
        value: stats.creditsRetired.toFixed(1),
        unit: 'tCO₂e',
        change: stats.creditsRetiredThisMonth > 0
          ? `+${stats.creditsRetiredThisMonth.toFixed(1)} this month`
          : 'No change this month',
        changeType: stats.creditsRetiredThisMonth > 0 ? 'positive' : 'neutral',
        rawValue: stats.creditsRetired
      },
      {
        label: 'Platform Revenue',
        value: `$${(stats.platformRevenue / 1000000).toFixed(2)}M`,
        change: stats.revenueLastYear > 0
          ? `+${((stats.revenueThisYear - stats.revenueLastYear) / stats.revenueLastYear * 100).toFixed(1)}% YoY`
          : 'No YoY data',
        changeType: stats.revenueThisYear > stats.revenueLastYear ? 'positive' : 'neutral',
        rawValue: stats.platformRevenue
      }
    ];
    
    res.json({
      success: true,
      data: {
        kpis,
        lastUpdated: stats.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPI statistics',
      error: error.message
    });
  }
};

/**
 * Get credits lifecycle funnel data
 */
exports.getCreditsLifecycle = async (req, res) => {
  try {
    const lifecycleStats = await CarbonCredit.getLifecycleStats();
    
    // Calculate percentages based on issued count
    const issuedCount = lifecycleStats.issued.count || 1;
    const activeCount = lifecycleStats.active.count || 0;
    const verifiedCount = lifecycleStats.verified.count || 0;
    const retiredCount = lifecycleStats.retired.count || 0;
    
    // Calculate percentages
    const activePercentage = ((activeCount / issuedCount) * 100).toFixed(1);
    const verifiedPercentage = ((verifiedCount / issuedCount) * 100).toFixed(1);
    const retiredPercentage = ((retiredCount / issuedCount) * 100).toFixed(1);
    
    const funnelData = [
      {
        label: 'Issued',
        value: lifecycleStats.issued.quantity || lifecycleStats.issued.count,
        percentage: 100,
        color: 'from-blue-500 to-blue-600'
      },
      {
        label: 'Active',
        value: lifecycleStats.active.quantity || lifecycleStats.active.count,
        percentage: parseFloat(activePercentage),
        color: 'from-green-500 to-green-600'
      },
      {
        label: 'Verified',
        value: lifecycleStats.verified.quantity || lifecycleStats.verified.count,
        percentage: parseFloat(verifiedPercentage),
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        label: 'Retired',
        value: lifecycleStats.retired.quantity || lifecycleStats.retired.count,
        percentage: parseFloat(retiredPercentage),
        color: 'from-purple-500 to-purple-600'
      }
    ];
    
    res.json({
      success: true,
      data: {
        funnel: funnelData,
        conversionRate: parseFloat(retiredPercentage)
      }
    });
  } catch (error) {
    console.error('Error fetching credits lifecycle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits lifecycle data',
      error: error.message
    });
  }
};

/**
 * Get platform usage trend data
 */
exports.getUsageTrend = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const monthlyMetrics = await PlatformMetrics.getMonthlyMetrics(months);
    
    // Format data for chart
    const trendData = monthlyMetrics.map(metric => ({
      month: new Date(metric.date).toLocaleDateString('en-US', { month: 'short' }),
      activeUsers: metric.activeUsers || 0,
      revenue: metric.transactionVolume || 0,
      users: metric.newUsers || 0
    }));
    
    // If no data exists, return empty array (frontend can handle this)
    res.json({
      success: true,
      data: {
        trend: trendData,
        period: `${months} months`
      }
    });
  } catch (error) {
    console.error('Error fetching usage trend:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage trend data',
      error: error.message
    });
  }
};

/**
 * Get portal activity heatmap data
 */
exports.getPortalActivity = async (req, res) => {
  try {
    const portals = req.query.portals 
      ? req.query.portals.split(',')
      : ['corporate', 'carbon', 'ngo'];
    
    const heatmapData = await PortalActivity.getWeeklyHeatmap(portals);
    
    // Format data for frontend
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const formattedData = portals.map(portal => {
      const portalData = heatmapData[portal] || {};
      const heatmap = days.map((day, dayIndex) => {
        const dayData = portalData[dayIndex] || {};
        return {
          day,
          hours: hours.map(hour => ({
            hour,
            activity: dayData[hour] || 0
          }))
        };
      });
      
      return {
        portal,
        heatmap
      };
    });
    
    res.json({
      success: true,
      data: {
        portals: formattedData
      }
    });
  } catch (error) {
    console.error('Error fetching portal activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portal activity data',
      error: error.message
    });
  }
};

/**
 * Get complete overview data (all metrics combined)
 */
exports.getOverview = async (req, res) => {
  try {
    // Fetch all data in parallel using helper functions with error handling
    let stats, lifecycleStats, monthlyMetrics, heatmapData;
    
    try {
      stats = await PlatformStatistics.getCurrentStats();
    } catch (error) {
      console.error('Error fetching platform statistics:', error);
      // Create default stats if error
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      const currentQuarter = `${currentDate.getFullYear()}-Q${quarter}`;
      stats = {
        totalUsers: 0,
        usersThisMonth: 0,
        activeCorporates: 0,
        corporatesThisQuarter: 0,
        ngosRegistered: 0,
        ngosThisQuarter: 0,
        carbonCreditsIssued: 0,
        creditsIssuedThisMonth: 0,
        creditsRetired: 0,
        creditsRetiredThisMonth: 0,
        platformRevenue: 0,
        revenueThisYear: 0,
        revenueLastYear: 0,
        lastUpdated: new Date(),
        currentMonth,
        currentQuarter,
        currentYear: String(currentDate.getFullYear())
      };
    }
    
    try {
      lifecycleStats = await CarbonCredit.getLifecycleStats();
      // Ensure all fields exist
      if (!lifecycleStats) {
        lifecycleStats = { issued: {}, active: {}, verified: {}, retired: {} };
      }
    } catch (error) {
      console.error('Error fetching lifecycle stats:', error);
      lifecycleStats = { issued: {}, active: {}, verified: {}, retired: {} };
    }
    
    try {
      monthlyMetrics = await PlatformMetrics.getMonthlyMetrics(12);
      if (!Array.isArray(monthlyMetrics)) {
        monthlyMetrics = [];
      }
    } catch (error) {
      console.error('Error fetching monthly metrics:', error);
      monthlyMetrics = [];
    }
    
    try {
      heatmapData = await PortalActivity.getWeeklyHeatmap(['corporate', 'carbon', 'ngo']);
      if (!heatmapData || typeof heatmapData !== 'object') {
        heatmapData = {};
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      heatmapData = {};
    }
    
    // Format KPIs - Get user counts from role-specific collections
    let userStats = { totalUsers: 0, activeCorporates: 0, ngosRegistered: 0 };
    try {
      userStats = await getUserCountsByRole();
    } catch (error) {
      console.error('Error fetching user counts:', error);
      // Keep defaults above
    }
    
    const kpis = [
      {
        label: 'Total Users',
        value: userStats.totalUsers.toLocaleString(),
        change: `+${stats.usersThisMonth || 0} this month`,
        changeType: 'positive',
        rawValue: userStats.totalUsers
      },
      {
        label: 'Active Corporates',
        value: userStats.activeCorporates.toLocaleString(),
        change: `+${stats.corporatesThisQuarter || 0} this quarter`,
        changeType: 'positive',
        rawValue: userStats.activeCorporates
      },
      {
        label: 'NGOs Registered',
        value: userStats.ngosRegistered.toLocaleString(),
        change: `+${stats.ngosThisQuarter || 0} this quarter`,
        changeType: 'positive',
        rawValue: userStats.ngosRegistered
      },
      {
        label: 'Carbon Credits Issued',
        value: stats.carbonCreditsIssued.toFixed(1),
        unit: 'tCO₂e',
        change: `+${stats.creditsIssuedThisMonth || 0} this month`,
        changeType: 'positive',
        rawValue: stats.carbonCreditsIssued
      },
      {
        label: 'Credits Retired',
        value: stats.creditsRetired.toFixed(1),
        unit: 'tCO₂e',
        change: `+${stats.creditsRetiredThisMonth || 0} this month`,
        changeType: 'positive',
        rawValue: stats.creditsRetired
      },
      {
        label: 'Platform Revenue',
        value: `$${(stats.platformRevenue / 1000000).toFixed(2)}M`,
        change: stats.revenueLastYear > 0
          ? `+${((stats.revenueThisYear - stats.revenueLastYear) / stats.revenueLastYear * 100).toFixed(1)}% YoY`
          : 'No YoY data',
        changeType: 'positive',
        rawValue: stats.platformRevenue
      }
    ];
    
    // Format lifecycle funnel - handle empty data
    const issuedCount = (lifecycleStats.issued && (lifecycleStats.issued.count || lifecycleStats.issued.quantity)) || 0;
    const issuedValue = issuedCount || 0;
    const activeCount = (lifecycleStats.active && (lifecycleStats.active.count || lifecycleStats.active.quantity)) || 0;
    const verifiedCount = (lifecycleStats.verified && (lifecycleStats.verified.count || lifecycleStats.verified.quantity)) || 0;
    const retiredCount = (lifecycleStats.retired && (lifecycleStats.retired.count || lifecycleStats.retired.quantity)) || 0;
    
    const denominator = issuedValue || 1; // Avoid division by zero
    
    const funnelData = [
      {
        label: 'Issued',
        value: issuedValue,
        percentage: 100,
        color: 'from-blue-500 to-blue-600'
      },
      {
        label: 'Active',
        value: activeCount,
        percentage: parseFloat(((activeCount / denominator) * 100).toFixed(1)),
        color: 'from-green-500 to-green-600'
      },
      {
        label: 'Verified',
        value: verifiedCount,
        percentage: parseFloat(((verifiedCount / denominator) * 100).toFixed(1)),
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        label: 'Retired',
        value: retiredCount,
        percentage: parseFloat(((retiredCount / denominator) * 100).toFixed(1)),
        color: 'from-purple-500 to-purple-600'
      }
    ];
    
    // Format trend data
    const trendData = monthlyMetrics.map(metric => ({
      month: new Date(metric.date).toLocaleDateString('en-US', { month: 'short' }),
      activeUsers: metric.activeUsers || 0,
      revenue: metric.transactionVolume || 0,
      users: metric.newUsers || 0
    }));
    
    // Format heatmap data for frontend (matching getPortalActivity format)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const portals = ['corporate', 'carbon', 'ngo'];
    
    const formattedActivityData = portals.map(portal => {
      const portalData = heatmapData[portal] || {};
      const heatmap = days.map((day, dayIndex) => {
        const dayData = portalData[dayIndex] || {};
        return {
          day,
          hours: hours.map(hour => ({
            hour,
            activity: dayData[hour] || 0
          }))
        };
      });
      
      return {
        portal,
        heatmap
      };
    });
    
    res.json({
      success: true,
      data: {
        kpis,
        lifecycle: {
          funnel: funnelData,
          conversionRate: funnelData.length > 3 ? parseFloat(funnelData[3].percentage) : 0
        },
        trend: {
          trend: trendData,
          period: '12 months'
        },
        activity: {
          portals: formattedActivityData
        },
        lastUpdated: stats.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview data',
      error: error.message || 'Unknown error occurred'
    });
  }
};
