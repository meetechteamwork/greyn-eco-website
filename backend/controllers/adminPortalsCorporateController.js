const { Corporate } = require('../models/User');
const CorporatePortalActivity = require('../models/CorporatePortalActivity');
const CorporatePortalHealth = require('../models/CorporatePortalHealth');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

/**
 * Format a date as a relative time string (e.g. "2 hours ago", "Never")
 */
function formatRelative(date) {
  if (!date) return 'Never';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Never';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  return d.toLocaleDateString();
}

/**
 * Map internal status to frontend-friendly status (inactive -> suspended)
 */
function mapStatus(status) {
  return status === 'inactive' ? 'suspended' : status;
}

/**
 * GET /api/admin/portals/corporate
 * Returns full dashboard data: stats, entities, activities, health
 */
exports.getDashboard = async (req, res) => {
  try {
    const [corporates, activities, healthDoc] = await Promise.all([
      Corporate.find(NO_SEED).lean().sort({ createdAt: -1 }),
      CorporatePortalActivity.find(NO_SEED)
        .populate('corporate', 'companyName')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      CorporatePortalHealth.findOne(NO_SEED).lean()
    ]);

    const entities = corporates.map((c) => ({
      id: String(c._id),
      name: c.companyName,
      email: c.email,
      status: mapStatus(c.status),
      employees: c.employees ?? 0,
      campaigns: c.campaigns ?? 0,
      lastActive: formatRelative(c.lastLogin),
      joinedDate: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : null
    }));

    const activeCount = entities.filter((e) => e.status === 'active').length;
    const pendingCount = entities.filter((e) => e.status === 'pending').length;
    const suspendedCount = entities.filter((e) => e.status === 'suspended').length;

    const stats = {
      total: entities.length,
      active: activeCount,
      pending: pendingCount,
      suspended: suspendedCount,
      totalEmployees: entities.reduce((s, e) => s + (e.employees || 0), 0),
      totalCampaigns: entities.reduce((s, e) => s + (e.campaigns || 0), 0)
    };

    const activityList = activities.map((a) => ({
      id: String(a._id),
      type: a.type,
      entity: a.entityName || (a.corporate && a.corporate.companyName) || '—',
      description: a.description,
      timestamp: formatRelative(a.createdAt)
    }));

    const health = healthDoc
      ? {
          status: healthDoc.status,
          uptime: healthDoc.uptime ?? null,
          responseTime: healthDoc.responseTime ?? null,
          activeSessions: healthDoc.activeSessions ?? 0,
          maxSessions: healthDoc.maxSessions ?? null,
          lastChecked: healthDoc.lastChecked,
          message: healthDoc.message ?? null
        }
      : null;

    res.json({
      success: true,
      data: {
        stats,
        entities,
        activities: activityList,
        health
      }
    });
  } catch (error) {
    console.error('Error in getDashboard (admin/portals/corporate):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load corporate portal dashboard',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/corporate/entities
 * List corporate entities with filters
 */
exports.getEntities = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status === 'suspended' ? { $in: ['suspended', 'inactive'] } : status;
    if (search && search.trim()) {
      filter.$or = [
        { companyName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { contactPerson: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    filter.source = { $ne: 'seed' };

    const corporates = await Corporate.find(filter).lean().sort({ createdAt: -1 });

    const entities = corporates.map((c) => ({
      id: String(c._id),
      name: c.companyName,
      email: c.email,
      status: mapStatus(c.status),
      employees: c.employees ?? 0,
      campaigns: c.campaigns ?? 0,
      lastActive: formatRelative(c.lastLogin),
      joinedDate: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : null
    }));

    res.json({ success: true, data: entities });
  } catch (error) {
    console.error('Error in getEntities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch corporate entities',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/corporate/activities
 * List recent corporate portal activities
 */
exports.getActivities = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const activities = await CorporatePortalActivity.find(NO_SEED)
      .populate('corporate', 'companyName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const data = activities.map((a) => ({
      id: String(a._id),
      type: a.type,
      entity: a.entityName || (a.corporate && a.corporate.companyName) || '—',
      description: a.description,
      timestamp: formatRelative(a.createdAt),
      createdAt: a.createdAt
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getActivities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/corporate/stats
 * Aggregated statistics for the corporate portal
 */
exports.getStats = async (req, res) => {
  try {
    const corporates = await Corporate.find(NO_SEED).lean();
    const entities = corporates.map((c) => ({
      status: mapStatus(c.status),
      employees: c.employees ?? 0,
      campaigns: c.campaigns ?? 0
    }));

    const stats = {
      total: entities.length,
      active: entities.filter((e) => e.status === 'active').length,
      pending: entities.filter((e) => e.status === 'pending').length,
      suspended: entities.filter((e) => e.status === 'suspended').length,
      totalEmployees: entities.reduce((s, e) => s + e.employees, 0),
      totalCampaigns: entities.reduce((s, e) => s + e.campaigns, 0)
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/corporate/health
 * Portal health and operational metrics
 */
exports.getHealth = async (req, res) => {
  try {
    const doc = await CorporatePortalHealth.findOne(NO_SEED).lean();
    const health = doc
      ? {
          status: doc.status,
          uptime: doc.uptime ?? null,
          responseTime: doc.responseTime ?? null,
          activeSessions: doc.activeSessions ?? 0,
          maxSessions: doc.maxSessions ?? null,
          lastChecked: doc.lastChecked,
          message: doc.message ?? null
        }
      : null;

    res.json({ success: true, data: health });
  } catch (error) {
    console.error('Error in getHealth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portal health',
      error: error.message
    });
  }
};

/**
 * PATCH /api/admin/portals/corporate/entities/:id/status
 * Update entity status: action = 'disable' | 'approve' | 'review'
 */
exports.updateEntityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const validActions = ['disable', 'approve', 'review'];
    if (!action || !validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`
      });
    }

    const statusMap = { disable: 'suspended', approve: 'active', review: 'pending' };
    const newStatus = statusMap[action];

    const corporate = await Corporate.findOneAndUpdate(
      { _id: id, ...NO_SEED },
      { status: newStatus },
      { new: true }
    ).lean();

    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate entity not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: String(corporate._id),
        name: corporate.companyName,
        email: corporate.email,
        status: mapStatus(corporate.status),
        employees: corporate.employees ?? 0,
        campaigns: corporate.campaigns ?? 0,
        lastActive: formatRelative(corporate.lastLogin),
        joinedDate: corporate.createdAt ? new Date(corporate.createdAt).toISOString().slice(0, 10) : null
      },
      message: `Entity ${action === 'disable' ? 'disabled' : action === 'approve' ? 'approved' : 'marked for review'} successfully`
    });
  } catch (error) {
    console.error('Error in updateEntityStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update entity status',
      error: error.message
    });
  }
};
