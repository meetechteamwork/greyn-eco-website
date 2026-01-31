const { Corporate } = require('../models/User');
const CorporateCampaigns = require('../models/CorporateCampaigns');
const CorporateDonations = require('../models/CorporateDonations');
const mongoose = require('mongoose');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

/**
 * Determine campaign status based on dates
 */
function getCampaignStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (end && now > end) {
    return 'completed';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'active';
  }
}

/**
 * Map category from frontend to database
 */
function mapCategoryToDb(category) {
  const categoryMap = {
    'Environmental': 'environmental',
    'Social': 'social',
    'Education': 'education',
    'Health': 'health',
    'Other': 'other'
  };
  return categoryMap[category] || 'other';
}

/**
 * Map category from database to frontend
 */
function mapCategoryToFrontend(category) {
  const categoryMap = {
    'environmental': 'Environmental',
    'social': 'Social',
    'education': 'Education',
    'health': 'Health',
    'governance': 'Other',
    'sustainability': 'Environmental',
    'other': 'Other'
  };
  return categoryMap[category] || 'Other';
}

/**
 * Map status from database to frontend
 */
function mapStatusToFrontend(status, startDate, endDate) {
  // If status is already one of the frontend statuses, use it
  if (['active', 'completed', 'upcoming'].includes(status)) {
    return status;
  }
  // Otherwise calculate based on dates
  return getCampaignStatus(startDate, endDate);
}

/**
 * GET /api/corporate/campaigns
 * List all campaigns with pagination and filtering
 */
exports.getCampaigns = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (category && category !== 'all') {
      query.category = mapCategoryToDb(category);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ngoName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [campaigns, total] = await Promise.all([
      CorporateCampaigns.find(query)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CorporateCampaigns.countDocuments(query)
    ]);

    // Map campaigns with calculated status
    const mappedCampaigns = campaigns.map(campaign => {
      const frontendStatus = mapStatusToFrontend(campaign.status, campaign.startDate, campaign.endDate);
      return {
        id: String(campaign._id),
        title: campaign.name,
        description: campaign.description || '',
        ngoName: campaign.ngoName || '',
        category: mapCategoryToFrontend(campaign.category),
        targetAmount: campaign.targetAmount || campaign.budget || 0,
        raisedAmount: campaign.raisedAmount || 0,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
        status: frontendStatus
      };
    });

    // Filter by status if provided (after mapping)
    let filteredCampaigns = mappedCampaigns;
    if (status && status !== 'all') {
      filteredCampaigns = mappedCampaigns.filter(c => c.status === status);
    }

    // Get statistics
    const allCampaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    const totalRaised = allCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const totalTarget = allCampaigns.reduce((sum, c) => sum + (c.targetAmount || c.budget || 0), 0);
    const activeCampaigns = allCampaigns.filter(c => {
      const s = mapStatusToFrontend(c.status, c.startDate, c.endDate);
      return s === 'active';
    }).length;

    res.json({
      success: true,
      data: {
        campaigns: filteredCampaigns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredCampaigns.length,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          totalRaised,
          totalTarget,
          activeCampaigns
        }
      }
    });
  } catch (error) {
    console.error('Error in getCampaigns (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load campaigns',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/campaigns/:id
 * Get single campaign details
 */
exports.getCampaign = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const campaign = await CorporateCampaigns.findOne({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const frontendStatus = mapStatusToFrontend(campaign.status, campaign.startDate, campaign.endDate);

    res.json({
      success: true,
      data: {
        id: String(campaign._id),
        title: campaign.name,
        description: campaign.description || '',
        ngoName: campaign.ngoName || '',
        category: mapCategoryToFrontend(campaign.category),
        targetAmount: campaign.targetAmount || campaign.budget || 0,
        raisedAmount: campaign.raisedAmount || 0,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
        status: frontendStatus,
        metrics: campaign.metrics || {}
      }
    });
  } catch (error) {
    console.error('Error in getCampaign (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load campaign',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/campaigns
 * Create new campaign
 */
exports.createCampaign = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { title, description, ngoName, category, targetAmount, startDate, endDate } = req.body;

    if (!title || !startDate || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and category are required'
      });
    }

    const campaign = await CorporateCampaigns.create({
      corporate: corporateId,
      name: title,
      description: description || '',
      ngoName: ngoName || '',
      category: mapCategoryToDb(category),
      targetAmount: parseFloat(targetAmount) || 0,
      budget: parseFloat(targetAmount) || 0,
      raisedAmount: 0,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: getCampaignStatus(new Date(startDate), endDate ? new Date(endDate) : null)
    });

    const frontendStatus = mapStatusToFrontend(campaign.status, campaign.startDate, campaign.endDate);

    res.json({
      success: true,
      message: 'Campaign created successfully',
      data: {
        id: String(campaign._id),
        title: campaign.name,
        description: campaign.description || '',
        ngoName: campaign.ngoName || '',
        category: mapCategoryToFrontend(campaign.category),
        targetAmount: campaign.targetAmount || 0,
        raisedAmount: campaign.raisedAmount || 0,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
        status: frontendStatus
      }
    });
  } catch (error) {
    console.error('Error in createCampaign (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/campaigns/:id
 * Update campaign
 */
exports.updateCampaign = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;
    const { title, description, ngoName, category, targetAmount, startDate, endDate } = req.body;

    const updateData = {};
    if (title) updateData.name = title;
    if (description !== undefined) updateData.description = description;
    if (ngoName !== undefined) updateData.ngoName = ngoName;
    if (category) updateData.category = mapCategoryToDb(category);
    if (targetAmount !== undefined) {
      updateData.targetAmount = parseFloat(targetAmount);
      updateData.budget = parseFloat(targetAmount);
    }
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    // Recalculate status if dates changed
    if (startDate || endDate !== undefined) {
      const campaign = await CorporateCampaigns.findOne({
        _id: id,
        corporate: corporateId,
        ...NO_SEED
      });
      if (campaign) {
        const newStartDate = startDate ? new Date(startDate) : campaign.startDate;
        const newEndDate = endDate !== undefined ? (endDate ? new Date(endDate) : null) : campaign.endDate;
        updateData.status = getCampaignStatus(newStartDate, newEndDate);
      }
    }

    const campaign = await CorporateCampaigns.findOneAndUpdate(
      {
        _id: id,
        corporate: corporateId,
        ...NO_SEED
      },
      updateData,
      { new: true }
    ).lean();

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const frontendStatus = mapStatusToFrontend(campaign.status, campaign.startDate, campaign.endDate);

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: {
        id: String(campaign._id),
        title: campaign.name,
        description: campaign.description || '',
        ngoName: campaign.ngoName || '',
        category: mapCategoryToFrontend(campaign.category),
        targetAmount: campaign.targetAmount || campaign.budget || 0,
        raisedAmount: campaign.raisedAmount || 0,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
        status: frontendStatus
      }
    });
  } catch (error) {
    console.error('Error in updateCampaign (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign',
      error: error.message
    });
  }
};

/**
 * DELETE /api/corporate/campaigns/:id
 * Delete campaign
 */
exports.deleteCampaign = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const campaign = await CorporateCampaigns.findOneAndDelete({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCampaign (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/campaigns/export
 * Export campaigns as CSV
 */
exports.exportCampaigns = async (req, res) => {
  try {
    const corporateId = req.user.userId;

    const campaigns = await CorporateCampaigns.find({
      corporate: corporateId,
      ...NO_SEED
    }).sort({ startDate: -1 }).lean();

    const csvRows = [
      ['Title', 'NGO Name', 'Category', 'Status', 'Start Date', 'End Date', 'Target Amount', 'Raised Amount', 'Progress %']
    ];

    campaigns.forEach(campaign => {
      const frontendStatus = mapStatusToFrontend(campaign.status, campaign.startDate, campaign.endDate);
      const targetAmount = campaign.targetAmount || campaign.budget || 0;
      const raisedAmount = campaign.raisedAmount || 0;
      const progress = targetAmount > 0 ? (raisedAmount / targetAmount * 100).toFixed(1) : '0';

      csvRows.push([
        campaign.name,
        campaign.ngoName || '',
        mapCategoryToFrontend(campaign.category),
        frontendStatus,
        new Date(campaign.startDate).toISOString().split('T')[0],
        campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
        targetAmount,
        raisedAmount,
        progress
      ]);
    });

    const csv = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="campaigns-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error in exportCampaigns (corporate/campaigns):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export campaigns',
      error: error.message
    });
  }
};
