const { Corporate } = require('../models/User');
const CorporateEmissions = require('../models/CorporateEmissions');
const CorporateDonations = require('../models/CorporateDonations');
const CorporateVolunteers = require('../models/CorporateVolunteers');
const CorporateCampaigns = require('../models/CorporateCampaigns');
const CorporateReports = require('../models/CorporateReports');
const mongoose = require('mongoose');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

/**
 * Calculate date range based on period
 */
function getDateRange(period) {
  const now = new Date();
  const start = new Date();
  
  switch (period) {
    case 'This Month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'This Quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'This Year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'All Time':
      start.setFullYear(2000, 0, 1);
      break;
    default:
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
  }
  
  return { start, end: now };
}

/**
 * Calculate percentage change
 */
function calculateChange(current, previous) {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate sustainability scores
 */
function calculateSustainabilityScores(emissions, donations, volunteers, campaigns, reports = { count: 0 }) {
  // Environmental Score (0-100)
  const emissionsReduction = emissions.total > 0 && emissions.offset > 0 
    ? Math.min(100, (emissions.offset / emissions.total) * 100) 
    : 0;
  const environmentalScore = Math.round(Math.min(100, emissionsReduction + (campaigns.active * 5)));

  // Social Score (0-100)
  const donationScore = Math.min(50, (donations.total / 100000) * 50); // $100k = 50 points
  const volunteerScore = Math.min(50, (volunteers.totalHours / 1000) * 50); // 1000 hours = 50 points
  const socialScore = Math.round(Math.min(100, donationScore + volunteerScore));

  // Governance Score (0-100) - based on reporting and compliance
  const governanceScore = Math.round(Math.min(100, 70 + (campaigns.active * 3) + (reports.count > 0 ? 10 : 0)));

  // Overall Score (weighted average)
  const overallScore = Math.round((environmentalScore * 0.4) + (socialScore * 0.4) + (governanceScore * 0.2));

  return {
    overall: overallScore,
    environmental: environmentalScore,
    social: socialScore,
    governance: governanceScore
  };
}

/**
 * GET /api/corporate/dashboard
 * Get corporate dashboard data
 */
exports.getDashboard = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { period = 'This Year' } = req.query;

    const { start, end } = getDateRange(period);
    const previousPeriodStart = new Date(start);
    const previousPeriodEnd = new Date(start);
    
    // Calculate previous period for comparison
    const periodDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    previousPeriodStart.setTime(start.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    previousPeriodEnd.setTime(start.getTime() - 1);

    // Get corporate info
    const corporate = await Corporate.findById(corporateId).lean();
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate account not found'
      });
    }

    // Get emissions data
    const [currentEmissions, previousEmissions] = await Promise.all([
      CorporateEmissions.find({
        corporate: corporateId,
        periodDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean(),
      CorporateEmissions.find({
        corporate: corporateId,
        periodDate: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
        ...NO_SEED
      }).lean()
    ]);

    const totalEmissions = currentEmissions.reduce((sum, e) => sum + (e.emissions || 0), 0);
    const previousTotalEmissions = previousEmissions.reduce((sum, e) => sum + (e.emissions || 0), 0);
    const emissionsChange = calculateChange(totalEmissions, previousTotalEmissions);

    // Get offset data (from donations or separate tracking)
    const offsetDonations = await CorporateDonations.find({
      corporate: corporateId,
      donationDate: { $gte: start, $lte: end },
      category: 'environmental',
      ...NO_SEED
    }).lean();

    // Estimate offset based on donations (1 ton CO2 = ~$50)
    const estimatedOffset = offsetDonations.reduce((sum, d) => sum + ((d.amount || 0) / 50), 0);
    const previousOffsetDonations = await CorporateDonations.find({
      corporate: corporateId,
      donationDate: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
      category: 'environmental',
      ...NO_SEED
    }).lean();
    const previousOffset = previousOffsetDonations.reduce((sum, d) => sum + ((d.amount || 0) / 50), 0);
    const offsetChange = calculateChange(estimatedOffset, previousOffset);

    // Get donations data
    const [currentDonations, previousDonations] = await Promise.all([
      CorporateDonations.find({
        corporate: corporateId,
        donationDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean(),
      CorporateDonations.find({
        corporate: corporateId,
        donationDate: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
        ...NO_SEED
      }).lean()
    ]);

    const totalDonations = currentDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const previousTotalDonations = previousDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const donationsChange = calculateChange(totalDonations, previousTotalDonations);

    // Get volunteer data
    const [currentVolunteers, previousVolunteers] = await Promise.all([
      CorporateVolunteers.find({
        corporate: corporateId,
        eventDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean(),
      CorporateVolunteers.find({
        corporate: corporateId,
        eventDate: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
        ...NO_SEED
      }).lean()
    ]);

    const totalVolunteerHours = currentVolunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);
    const previousVolunteerHours = previousVolunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);
    const volunteerChange = calculateChange(totalVolunteerHours, previousVolunteerHours);

    // Get campaigns data
    const activeCampaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      status: 'active',
      ...NO_SEED
    }).countDocuments();

    const previousActiveCampaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      status: 'active',
      createdAt: { $lte: previousPeriodEnd },
      ...NO_SEED
    }).countDocuments();
    const campaignsChange = activeCampaigns - previousActiveCampaigns;

    // Get employee count
    const employeeCount = corporate.employees || 0;

    // Get reports for sustainability score calculation
    const reports = await CorporateReports.find({
      corporate: corporateId,
      status: 'completed',
      ...NO_SEED
    }).lean();

    // Calculate sustainability scores
    const scores = calculateSustainabilityScores(
      { total: totalEmissions, offset: estimatedOffset },
      { total: totalDonations },
      { totalHours: totalVolunteerHours },
      { active: activeCampaigns },
      { count: reports.length }
    );

    // Get chart data (last 12 months)
    const chartStart = new Date();
    chartStart.setMonth(chartStart.getMonth() - 12);
    chartStart.setDate(1);
    chartStart.setHours(0, 0, 0, 0);

    const monthlyEmissions = await CorporateEmissions.aggregate([
      {
        $match: {
          corporate: new mongoose.Types.ObjectId(corporateId),
          periodDate: { $gte: chartStart },
          ...NO_SEED
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$periodDate' },
            month: { $month: '$periodDate' }
          },
          total: { $sum: '$emissions' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyDonations = await CorporateDonations.aggregate([
      {
        $match: {
          corporate: new mongoose.Types.ObjectId(corporateId),
          donationDate: { $gte: chartStart },
          ...NO_SEED
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyVolunteers = await CorporateVolunteers.aggregate([
      {
        $match: {
          corporate: new mongoose.Types.ObjectId(corporateId),
          eventDate: { $gte: chartStart },
          ...NO_SEED
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$eventDate' },
            month: { $month: '$eventDate' }
          },
          total: { $sum: '$totalHours' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get additional stats
    const totalProjects = await CorporateCampaigns.find({
      corporate: corporateId,
      ...NO_SEED
    }).countDocuments();

    const partners = await CorporateDonations.distinct('recipient', {
      corporate: corporateId,
      ...NO_SEED
    });

    const countries = await CorporateVolunteers.distinct('location', {
      corporate: corporateId,
      location: { $ne: null, $ne: '' },
      ...NO_SEED
    });

    const awards = 0; // Placeholder - can be added later

    res.json({
      success: true,
      data: {
        kpis: {
          totalEmissions: {
            value: totalEmissions,
            unit: 'tons',
            change: emissionsChange,
            trend: emissionsChange < 0 ? 'down' : 'up'
          },
          emissionsOffset: {
            value: estimatedOffset,
            unit: 'tons',
            change: offsetChange,
            trend: offsetChange > 0 ? 'up' : 'down'
          },
          totalDonations: {
            value: totalDonations,
            unit: 'USD',
            change: donationsChange,
            trend: donationsChange > 0 ? 'up' : 'down'
          },
          volunteerHours: {
            value: totalVolunteerHours,
            unit: 'hours',
            change: volunteerChange,
            trend: volunteerChange > 0 ? 'up' : 'down'
          },
          activeCampaigns: {
            value: activeCampaigns,
            unit: 'campaigns',
            change: campaignsChange,
            trend: campaignsChange > 0 ? 'up' : 'down'
          },
          employees: {
            value: employeeCount,
            unit: 'people',
            change: 0,
            trend: 'up'
          },
          sustainabilityScore: {
            value: scores.overall,
            unit: '/100',
            change: 0,
            trend: 'up'
          }
        },
        sustainabilityScores: {
          overall: scores.overall,
          environmental: scores.environmental,
          social: scores.social,
          governance: scores.governance
        },
        charts: {
          emissions: monthlyEmissions,
          donations: monthlyDonations,
          volunteers: monthlyVolunteers
        },
        quickStats: {
          projects: totalProjects,
          partners: partners.length,
          countries: countries.length,
          awards: awards
        },
        period: period
      }
    });
  } catch (error) {
    console.error('Error in getDashboard (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/reports/generate
 * Generate ESG report
 */
exports.generateReport = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { period = 'This Year', reportType = 'esg' } = req.body;

    const { start, end } = getDateRange(period);

    // Create report record
    const report = await CorporateReports.create({
      corporate: corporateId,
      reportType,
      period: period === 'This Month' ? 'monthly' : period === 'This Quarter' ? 'quarterly' : 'yearly',
      periodStart: start,
      periodEnd: end,
      title: `${reportType.toUpperCase()} Report - ${period}`,
      status: 'generating'
    });

    // Calculate metrics (simplified - in production, this would be more comprehensive)
    const emissions = await CorporateEmissions.find({
      corporate: corporateId,
      periodDate: { $gte: start, $lte: end },
      ...NO_SEED
    }).lean();

    const donations = await CorporateDonations.find({
      corporate: corporateId,
      donationDate: { $gte: start, $lte: end },
      ...NO_SEED
    }).lean();

    const volunteers = await CorporateVolunteers.find({
      corporate: corporateId,
      eventDate: { $gte: start, $lte: end },
      ...NO_SEED
    }).lean();

    const campaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      status: 'active',
      ...NO_SEED
    }).countDocuments();

    const totalEmissions = emissions.reduce((sum, e) => sum + (e.emissions || 0), 0);
    const estimatedOffset = donations
      .filter(d => d.category === 'environmental')
      .reduce((sum, d) => sum + ((d.amount || 0) / 50), 0);
    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const volunteerHours = volunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);

    // Get existing reports count
    const existingReports = await CorporateReports.find({
      corporate: corporateId,
      status: 'completed',
      ...NO_SEED
    }).countDocuments();

    // Calculate scores
    const scores = calculateSustainabilityScores(
      { total: totalEmissions, offset: estimatedOffset },
      { total: totalDonations },
      { totalHours: volunteerHours },
      { active: campaigns },
      { count: existingReports + 1 }
    );

    // Update report with metrics
    report.metrics = {
      totalEmissions,
      emissionsOffset: estimatedOffset,
      totalDonations,
      volunteerHours,
      activeCampaigns: campaigns,
      sustainabilityScore: scores.overall,
      environmentalScore: scores.environmental,
      socialScore: scores.social,
      governanceScore: scores.governance
    };

    report.status = 'completed';
    report.generatedAt = new Date();
    await report.save();

    res.json({
      success: true,
      message: 'Report generated successfully',
      data: {
        reportId: report._id,
        report: report
      }
    });
  } catch (error) {
    console.error('Error in generateReport (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/reports/export/:reportId
 * Export report as JSON/CSV
 */
exports.exportReport = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { reportId } = req.params;
    const { format = 'json' } = req.query;

    const report = await CorporateReports.findOne({
      _id: reportId,
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (format === 'csv') {
      // Generate CSV
      const csv = [
        ['Metric', 'Value'],
        ['Report Type', report.reportType],
        ['Period', report.period],
        ['Period Start', report.periodStart],
        ['Period End', report.periodEnd],
        ['Total Emissions (tons)', report.metrics.totalEmissions],
        ['Emissions Offset (tons)', report.metrics.emissionsOffset],
        ['Total Donations (USD)', report.metrics.totalDonations],
        ['Volunteer Hours', report.metrics.volunteerHours],
        ['Active Campaigns', report.metrics.activeCampaigns],
        ['Sustainability Score', report.metrics.sustainabilityScore],
        ['Environmental Score', report.metrics.environmentalScore],
        ['Social Score', report.metrics.socialScore],
        ['Governance Score', report.metrics.governanceScore]
      ].map(row => row.join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="esg-report-${reportId}.csv"`);
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: report
      });
    }
  } catch (error) {
    console.error('Error in exportReport (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};
