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
 * Calculate date range based on period string
 */
function getDateRangeFromPeriod(periodString) {
  const now = new Date();
  const start = new Date();
  const end = new Date(now);
  
  // Parse period string (e.g., "2023", "Q4 2023", "January 2024")
  if (/^\d{4}$/.test(periodString.trim())) {
    // Year
    const year = parseInt(periodString.trim());
    start.setFullYear(year, 0, 1);
    start.setHours(0, 0, 0, 0);
    end.setFullYear(year, 11, 31);
    end.setHours(23, 59, 59, 999);
  } else if (/^Q[1-4]\s+\d{4}$/i.test(periodString.trim())) {
    // Quarter
    const match = periodString.trim().match(/^Q([1-4])\s+(\d{4})$/i);
    const quarter = parseInt(match[1]);
    const year = parseInt(match[2]);
    start.setFullYear(year, (quarter - 1) * 3, 1);
    start.setHours(0, 0, 0, 0);
    end.setFullYear(year, quarter * 3, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    // Try to parse as month name + year
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december'];
    const parts = periodString.trim().toLowerCase().split(/\s+/);
    const monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
    if (monthIndex !== -1 && parts[1]) {
      const year = parseInt(parts[1]);
      start.setFullYear(year, monthIndex, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(year, monthIndex + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      // Default to current year
      start.setFullYear(now.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
    }
  }
  
  return { start, end };
}

/**
 * Calculate sustainability scores
 */
function calculateSustainabilityScores(emissions, donations, volunteers, campaigns, reports = { count: 0 }) {
  const emissionsReduction = emissions.total > 0 && emissions.offset > 0 
    ? Math.min(100, (emissions.offset / emissions.total) * 100) 
    : 0;
  const environmentalScore = Math.round(Math.min(100, emissionsReduction + (campaigns.active * 5)));

  const donationScore = Math.min(50, (donations.total / 100000) * 50);
  const volunteerScore = Math.min(50, (volunteers.totalHours / 1000) * 50);
  const socialScore = Math.round(Math.min(100, donationScore + volunteerScore));

  const governanceScore = Math.round(Math.min(100, 70 + (campaigns.active * 3) + (reports.count > 0 ? 10 : 0)));

  const overallScore = Math.round((environmentalScore * 0.4) + (socialScore * 0.4) + (governanceScore * 0.2));

  return {
    overall: overallScore,
    environmental: environmentalScore,
    social: socialScore,
    governance: governanceScore
  };
}

/**
 * GET /api/corporate/reports
 * List all reports with pagination and filtering
 */
exports.getReports = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      reportType, 
      period,
      search 
    } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (status && status !== 'all') {
      query.status = status === 'published' ? 'completed' : status;
    }
    if (reportType && reportType !== 'all') {
      query.reportType = reportType.toLowerCase();
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      CorporateReports.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CorporateReports.countDocuments(query)
    ]);

    // Map status for frontend (completed -> published, draft -> draft, generating -> draft)
    const mappedReports = reports.map(report => ({
      id: String(report._id),
      title: report.title,
      period: report.period === 'yearly' ? new Date(report.periodStart).getFullYear().toString() :
              report.period === 'quarterly' ? `Q${Math.floor(new Date(report.periodStart).getMonth() / 3) + 1} ${new Date(report.periodStart).getFullYear()}` :
              report.period === 'monthly' ? new Date(report.periodStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
              `${new Date(report.periodStart).toLocaleDateString()} - ${new Date(report.periodEnd).toLocaleDateString()}`,
      generatedDate: report.generatedAt ? report.generatedAt.toISOString().split('T')[0] : report.createdAt.toISOString().split('T')[0],
      status: report.status === 'completed' ? 'published' : report.status === 'generating' ? 'draft' : report.status,
      type: report.period === 'yearly' ? 'Annual' : report.period === 'quarterly' ? 'Quarterly' : report.period === 'monthly' ? 'Monthly' : 'Custom',
      emissions: report.metrics?.totalEmissions || 0,
      offsetPurchased: report.metrics?.emissionsOffset || 0,
      donations: report.metrics?.totalDonations || 0,
      volunteerHours: report.metrics?.volunteerHours || 0,
      metrics: report.metrics,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      reportType: report.reportType
    }));

    // Get stats
    const stats = {
      total: await CorporateReports.countDocuments({ corporate: corporateId, ...NO_SEED }),
      published: await CorporateReports.countDocuments({ corporate: corporateId, status: 'completed', ...NO_SEED }),
      draft: await CorporateReports.countDocuments({ corporate: corporateId, status: { $in: ['draft', 'generating'] }, ...NO_SEED }),
      archived: 0 // Can be implemented later
    };

    res.json({
      success: true,
      data: {
        reports: mappedReports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats
      }
    });
  } catch (error) {
    console.error('Error in getReports (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load reports',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/reports/:id
 * Get single report details
 */
exports.getReport = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const report = await CorporateReports.findOne({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const mappedReport = {
      id: String(report._id),
      title: report.title,
      period: report.period === 'yearly' ? new Date(report.periodStart).getFullYear().toString() :
              report.period === 'quarterly' ? `Q${Math.floor(new Date(report.periodStart).getMonth() / 3) + 1} ${new Date(report.periodStart).getFullYear()}` :
              report.period === 'monthly' ? new Date(report.periodStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
              `${new Date(report.periodStart).toLocaleDateString()} - ${new Date(report.periodEnd).toLocaleDateString()}`,
      generatedDate: report.generatedAt ? report.generatedAt.toISOString().split('T')[0] : report.createdAt.toISOString().split('T')[0],
      status: report.status === 'completed' ? 'published' : report.status === 'generating' ? 'draft' : report.status,
      type: report.period === 'yearly' ? 'Annual' : report.period === 'quarterly' ? 'Quarterly' : report.period === 'monthly' ? 'Monthly' : 'Custom',
      emissions: report.metrics?.totalEmissions || 0,
      offsetPurchased: report.metrics?.emissionsOffset || 0,
      donations: report.metrics?.totalDonations || 0,
      volunteerHours: report.metrics?.volunteerHours || 0,
      metrics: report.metrics,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      reportType: report.reportType,
      summary: report.summary
    };

    res.json({
      success: true,
      data: mappedReport
    });
  } catch (error) {
    console.error('Error in getReport (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load report',
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
    const { reportType = 'Annual', period, includeEmissions = true, includeDonations = true, includeVolunteers = true } = req.body;

    if (!period) {
      return res.status(400).json({
        success: false,
        message: 'Period is required'
      });
    }

    const { start, end } = getDateRangeFromPeriod(period);

    // Determine period type
    let periodType = 'custom';
    const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 35) {
      periodType = 'monthly';
    } else if (daysDiff <= 100) {
      periodType = 'quarterly';
    } else if (daysDiff <= 370) {
      periodType = 'yearly';
    }

    // Create report record
    const report = await CorporateReports.create({
      corporate: corporateId,
      reportType: reportType.toLowerCase() === 'annual' ? 'esg' : 
                  reportType.toLowerCase() === 'quarterly' ? 'quarterly' :
                  reportType.toLowerCase() === 'monthly' ? 'monthly' : 'esg',
      period: periodType,
      periodStart: start,
      periodEnd: end,
      title: `${reportType} ESG Report - ${period}`,
      status: 'generating',
      summary: `ESG report for ${period} covering ${includeEmissions ? 'emissions, ' : ''}${includeDonations ? 'donations, ' : ''}${includeVolunteers ? 'volunteer activities' : ''}`
    });

    // Calculate metrics based on included sections
    let totalEmissions = 0;
    let estimatedOffset = 0;
    let totalDonations = 0;
    let volunteerHours = 0;

    if (includeEmissions) {
      const emissions = await CorporateEmissions.find({
        corporate: corporateId,
        periodDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean();
      totalEmissions = emissions.reduce((sum, e) => sum + (e.emissions || 0), 0);
    }

    if (includeDonations) {
      const donations = await CorporateDonations.find({
        corporate: corporateId,
        donationDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean();
      totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      estimatedOffset = donations
        .filter(d => d.category === 'environmental')
        .reduce((sum, d) => sum + ((d.amount || 0) / 50), 0);
    }

    if (includeVolunteers) {
      const volunteers = await CorporateVolunteers.find({
        corporate: corporateId,
        eventDate: { $gte: start, $lte: end },
        ...NO_SEED
      }).lean();
      volunteerHours = volunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);
    }

    const campaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      status: 'active',
      ...NO_SEED
    }).countDocuments();

    const existingReports = await CorporateReports.find({
      corporate: corporateId,
      status: 'completed',
      ...NO_SEED
    }).countDocuments();

    const scores = calculateSustainabilityScores(
      { total: totalEmissions, offset: estimatedOffset },
      { total: totalDonations },
      { totalHours: volunteerHours },
      { active: campaigns },
      { count: existingReports + 1 }
    );

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

    const mappedReport = {
      id: String(report._id),
      title: report.title,
      period: period,
      generatedDate: report.generatedAt.toISOString().split('T')[0],
      status: 'published',
      type: reportType,
      emissions: totalEmissions,
      offsetPurchased: estimatedOffset,
      donations: totalDonations,
      volunteerHours: volunteerHours,
      metrics: report.metrics
    };

    res.json({
      success: true,
      message: 'Report generated successfully',
      data: mappedReport
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
 * GET /api/corporate/reports/export/:id
 * Export single report
 */
exports.exportReport = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;
    const { format = 'csv' } = req.query;

    const report = await CorporateReports.findOne({
      _id: id,
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
      const csv = [
        ['Metric', 'Value'],
        ['Report Type', report.reportType],
        ['Period', report.period],
        ['Period Start', new Date(report.periodStart).toISOString().split('T')[0]],
        ['Period End', new Date(report.periodEnd).toISOString().split('T')[0]],
        ['Title', report.title],
        ['Total Emissions (tons)', report.metrics?.totalEmissions || 0],
        ['Emissions Offset (tons)', report.metrics?.emissionsOffset || 0],
        ['Total Donations (USD)', report.metrics?.totalDonations || 0],
        ['Volunteer Hours', report.metrics?.volunteerHours || 0],
        ['Active Campaigns', report.metrics?.activeCampaigns || 0],
        ['Sustainability Score', report.metrics?.sustainabilityScore || 0],
        ['Environmental Score', report.metrics?.environmentalScore || 0],
        ['Social Score', report.metrics?.socialScore || 0],
        ['Governance Score', report.metrics?.governanceScore || 0]
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="esg-report-${id}.csv"`);
      res.send(csv);
    } else {
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

/**
 * POST /api/corporate/reports/export-all
 * Export all reports as CSV
 */
exports.exportAllReports = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { status, reportType } = req.body;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (status && status !== 'all') {
      query.status = status === 'published' ? 'completed' : status;
    }
    if (reportType && reportType !== 'all') {
      query.reportType = reportType.toLowerCase();
    }

    const reports = await CorporateReports.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const csvRows = [
      ['Report ID', 'Title', 'Period', 'Type', 'Status', 'Generated Date', 'Total Emissions', 'Emissions Offset', 'Total Donations', 'Volunteer Hours', 'Sustainability Score']
    ];

    reports.forEach(report => {
      csvRows.push([
        String(report._id),
        report.title,
        report.period,
        report.reportType,
        report.status === 'completed' ? 'published' : report.status,
        report.generatedAt ? new Date(report.generatedAt).toISOString().split('T')[0] : '',
        report.metrics?.totalEmissions || 0,
        report.metrics?.emissionsOffset || 0,
        report.metrics?.totalDonations || 0,
        report.metrics?.volunteerHours || 0,
        report.metrics?.sustainabilityScore || 0
      ]);
    });

    const csv = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="all-esg-reports-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error in exportAllReports (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export reports',
      error: error.message
    });
  }
};

/**
 * DELETE /api/corporate/reports/:id
 * Delete a report
 */
exports.deleteReport = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const report = await CorporateReports.findOneAndDelete({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteReport (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

/**
 * PATCH /api/corporate/reports/:id/status
 * Update report status
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, or archived'
      });
    }

    const dbStatus = status === 'published' ? 'completed' : status === 'archived' ? 'draft' : status;

    const report = await CorporateReports.findOneAndUpdate(
      {
        _id: id,
        corporate: corporateId,
        ...NO_SEED
      },
      { status: dbStatus },
      { new: true }
    ).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        id: String(report._id),
        status: status
      }
    });
  } catch (error) {
    console.error('Error in updateReportStatus (corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error.message
    });
  }
};
