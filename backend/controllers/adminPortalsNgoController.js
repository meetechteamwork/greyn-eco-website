const { NGO } = require('../models/User');
const NgoPortalActivity = require('../models/NgoPortalActivity');
const NgoPortalHealth = require('../models/NgoPortalHealth');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

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

function mapStatus(status) {
  return status === 'inactive' ? 'suspended' : status;
}

/**
 * GET /api/admin/portals/ngo
 * Full dashboard: stats, entities, activities, health
 */
exports.getDashboard = async (req, res) => {
  try {
    const [ngos, activities, healthDoc] = await Promise.all([
      NGO.find(NO_SEED).lean().sort({ createdAt: -1 }),
      NgoPortalActivity.find(NO_SEED)
        .populate('ngo', 'organizationName')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      NgoPortalHealth.findOne(NO_SEED).lean()
    ]);

    const entities = ngos.map((n) => ({
      id: String(n._id),
      name: n.organizationName,
      email: n.email,
      status: mapStatus(n.status),
      projects: n.projects ?? 0,
      totalFunding: n.totalFunding ?? 0,
      lastActive: formatRelative(n.lastLogin),
      joinedDate: n.createdAt ? new Date(n.createdAt).toISOString().slice(0, 10) : null,
      location: n.location || ''
    }));

    const activeCount = entities.filter((e) => e.status === 'active').length;
    const pendingCount = entities.filter((e) => e.status === 'pending').length;
    const suspendedCount = entities.filter((e) => e.status === 'suspended').length;

    const stats = {
      total: entities.length,
      active: activeCount,
      pending: pendingCount,
      suspended: suspendedCount,
      totalProjects: entities.reduce((s, e) => s + (e.projects || 0), 0),
      totalFunding: entities.reduce((s, e) => s + (e.totalFunding || 0), 0)
    };

    const activityList = activities.map((a) => ({
      id: String(a._id),
      type: a.type,
      entity: a.entityName || (a.ngo && a.ngo.organizationName) || '—',
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
      data: { stats, entities, activities: activityList, health }
    });
  } catch (error) {
    console.error('Error in getDashboard (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load NGO portal dashboard',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/ngo/entities
 * List NGOs with optional ?status=&search=
 */
exports.getEntities = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { source: { $ne: 'seed' } };

    if (status && status !== 'all') {
      filter.status = status === 'suspended' ? { $in: ['suspended', 'inactive'] } : status;
    }
    if (search && String(search).trim()) {
      const q = String(search).trim();
      filter.$or = [
        { organizationName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { contactPerson: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }

    const ngos = await NGO.find(filter).lean().sort({ createdAt: -1 });
    const entities = ngos.map((n) => ({
      id: String(n._id),
      name: n.organizationName,
      email: n.email,
      status: mapStatus(n.status),
      projects: n.projects ?? 0,
      totalFunding: n.totalFunding ?? 0,
      lastActive: formatRelative(n.lastLogin),
      joinedDate: n.createdAt ? new Date(n.createdAt).toISOString().slice(0, 10) : null,
      location: n.location || ''
    }));

    res.json({ success: true, data: entities });
  } catch (error) {
    console.error('Error in getEntities (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NGO entities',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/ngo/activities
 * List recent activities. Query: ?limit=50
 */
exports.getActivities = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const activities = await NgoPortalActivity.find(NO_SEED)
      .populate('ngo', 'organizationName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const data = activities.map((a) => ({
      id: String(a._id),
      type: a.type,
      entity: a.entityName || (a.ngo && a.ngo.organizationName) || '—',
      description: a.description,
      timestamp: formatRelative(a.createdAt),
      createdAt: a.createdAt
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getActivities (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/ngo/stats
 * Aggregated stats for the NGO portal
 */
exports.getStats = async (req, res) => {
  try {
    const ngos = await NGO.find(NO_SEED).lean();
    const entities = ngos.map((n) => ({
      status: mapStatus(n.status),
      projects: n.projects ?? 0,
      totalFunding: n.totalFunding ?? 0
    }));

    const stats = {
      total: entities.length,
      active: entities.filter((e) => e.status === 'active').length,
      pending: entities.filter((e) => e.status === 'pending').length,
      suspended: entities.filter((e) => e.status === 'suspended').length,
      totalProjects: entities.reduce((s, e) => s + e.projects, 0),
      totalFunding: entities.reduce((s, e) => s + e.totalFunding, 0)
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getStats (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/portals/ngo/health
 * Portal health metrics
 */
exports.getHealth = async (req, res) => {
  try {
    const doc = await NgoPortalHealth.findOne(NO_SEED).lean();
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
    console.error('Error in getHealth (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portal health',
      error: error.message
    });
  }
};

/**
 * PATCH /api/admin/portals/ngo/entities/:id/status
 * Body: { action: 'disable' | 'approve' | 'review' }
 */
exports.updateEntityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const valid = ['disable', 'approve', 'review'];
    if (!action || !valid.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${valid.join(', ')}`
      });
    }

    const statusMap = { disable: 'suspended', approve: 'active', review: 'pending' };
    const ngo = await NGO.findOneAndUpdate(
      { _id: id, ...NO_SEED },
      { status: statusMap[action] },
      { new: true }
    ).lean();

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    res.json({
      success: true,
      data: {
        id: String(ngo._id),
        name: ngo.organizationName,
        email: ngo.email,
        status: mapStatus(ngo.status),
        projects: ngo.projects ?? 0,
        totalFunding: ngo.totalFunding ?? 0,
        lastActive: formatRelative(ngo.lastLogin),
        joinedDate: ngo.createdAt ? new Date(ngo.createdAt).toISOString().slice(0, 10) : null,
        location: ngo.location || ''
      },
      message: `Entity ${action === 'disable' ? 'disabled' : action === 'approve' ? 'approved' : 'marked for review'} successfully`
    });
  } catch (error) {
    console.error('Error in updateEntityStatus (admin/portals/ngo):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update entity status',
      error: error.message
    });
  }
};
