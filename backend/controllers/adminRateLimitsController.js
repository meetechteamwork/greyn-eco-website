const RateLimit = require('../models/RateLimit');
const mongoose = require('mongoose');

/**
 * Build base filter for excluding/including seed data
 */
function buildBaseFilter(query) {
  const includeSeed = String(query.includeSeed || '').toLowerCase() === '1' || String(query.includeSeed) === 'true';
  return includeSeed ? {} : { source: { $ne: 'seed' } };
}

/**
 * Build filter from query parameters
 */
function buildFilter(query) {
  const filter = buildBaseFilter(query);
  const { search, status, category, method, enabled } = query;

  // Search across endpoint and description
  if (search && String(search).trim()) {
    const q = String(search).trim();
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { endpoint: re },
      { description: re },
    ];
  }

  // Filter by status
  if (status && status !== 'all') {
    filter.status = status;
  }

  // Filter by category
  if (category && category !== 'all') {
    filter.category = category;
  }

  // Filter by method
  if (method && method !== 'all') {
    filter.method = method;
  }

  // Filter by enabled status
  if (enabled !== undefined && enabled !== 'all') {
    filter.enabled = String(enabled).toLowerCase() === 'true';
  }

  return filter;
}

/**
 * Convert mongoose doc to response format
 */
function toResponseDoc(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(d._id),
    endpoint: d.endpoint,
    method: d.method,
    limit: d.limit,
    window: d.window,
    current: d.current,
    status: d.status,
    description: d.description,
    lastReset: d.lastReset ? new Date(d.lastReset).toISOString() : null,
    nextReset: d.nextReset ? new Date(d.nextReset).toISOString() : null,
    blockedRequests: d.blockedRequests || 0,
    averageResponseTime: d.averageResponseTime || 0,
    category: d.category,
    enabled: d.enabled !== undefined ? d.enabled : true,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    createdBy: d.createdBy,
    lastModified: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
  };
}

/**
 * GET /api/admin/security/rate-limits
 * List rate limits with filters and stats
 */
exports.getList = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [faceted] = await RateLimit.aggregate([
      { $match: filter },
      {
        $facet: {
          list: [
            { $sort: { status: -1, current: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                normal: { $sum: { $cond: [{ $eq: ['$status', 'normal'] }, 1, 0] } },
                warning: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } },
                critical: { $sum: { $cond: [{ $eq: ['$status', 'critical'] }, 1, 0] } },
                exceeded: { $sum: { $cond: [{ $eq: ['$status', 'exceeded'] }, 1, 0] } },
                totalRequests: { $sum: '$current' },
                totalBlocked: { $sum: '$blockedRequests' },
                enabled: { $sum: { $cond: ['$enabled', 1, 0] } },
                disabled: { $sum: { $cond: ['$enabled', 0, 1] } },
              },
            },
            { $project: { _id: 0 } },
          ],
        },
      },
    ]);

    const list = (faceted && faceted.list) || [];
    const limits = list.map(toResponseDoc);

    const rawStats = (faceted && faceted.stats && faceted.stats[0]) || {};
    const stats = {
      total: rawStats.total || 0,
      normal: rawStats.normal || 0,
      warning: rawStats.warning || 0,
      critical: rawStats.critical || 0,
      exceeded: rawStats.exceeded || 0,
      totalRequests: rawStats.totalRequests || 0,
      totalBlocked: rawStats.totalBlocked || 0,
      enabled: rawStats.enabled || 0,
      disabled: rawStats.disabled || 0,
      averageUsage: rawStats.total > 0 
        ? Math.round((limits.reduce((sum, l) => sum + (l.current / l.limit) * 100, 0) / limits.length) * 10) / 10
        : 0,
    };

    const total = stats.total;
    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      data: {
        limits,
        stats,
        pagination: { page, limit, total, totalPages },
      },
    });
  } catch (error) {
    console.error('Error in getList (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rate limits',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/rate-limits/:id
 * Get single rate limit by ID
 */
exports.getOne = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid rate limit ID' });
    }

    const doc = await RateLimit.findOne({ _id: id, ...base });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Rate limit not found' });
    }

    res.json({ success: true, data: toResponseDoc(doc) });
  } catch (error) {
    console.error('Error in getOne (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rate limit',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/security/rate-limits
 * Create new rate limit
 */
exports.create = async (req, res) => {
  try {
    const { endpoint, method, limit, window, description, category, createdBy } = req.body;

    // Validation
    if (!endpoint || !method || !limit || !window || !description || !category || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: endpoint, method, limit, window, description, category, createdBy',
      });
    }

    // Check for duplicate
    const existing = await RateLimit.findOne({ endpoint, method });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Rate limit already exists for ${method} ${endpoint}`,
      });
    }

    const rateLimit = new RateLimit({
      endpoint,
      method,
      limit: parseInt(limit, 10),
      window,
      description,
      category,
      createdBy,
      source: 'manual',
    });

    await rateLimit.save();

    res.status(201).json({
      success: true,
      message: 'Rate limit created successfully',
      data: toResponseDoc(rateLimit),
    });
  } catch (error) {
    console.error('Error in create (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rate limit',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/security/rate-limits/:id
 * Update rate limit
 */
exports.update = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid rate limit ID' });
    }

    const doc = await RateLimit.findOne({ _id: id, ...base });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Rate limit not found' });
    }

    const { endpoint, method, limit, window, description, category, enabled } = req.body;

    // Update allowed fields
    if (endpoint !== undefined) doc.endpoint = endpoint;
    if (method !== undefined) doc.method = method;
    if (limit !== undefined) doc.limit = parseInt(limit, 10);
    if (window !== undefined) doc.window = window;
    if (description !== undefined) doc.description = description;
    if (category !== undefined) doc.category = category;
    if (enabled !== undefined) doc.enabled = enabled;

    await doc.save();

    res.json({
      success: true,
      message: 'Rate limit updated successfully',
      data: toResponseDoc(doc),
    });
  } catch (error) {
    console.error('Error in update (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rate limit',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/security/rate-limits/:id
 * Delete rate limit
 */
exports.delete = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid rate limit ID' });
    }

    const doc = await RateLimit.findOneAndDelete({ _id: id, ...base });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Rate limit not found' });
    }

    res.json({
      success: true,
      message: 'Rate limit deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rate limit',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/security/rate-limits/:id/reset
 * Reset rate limit counter
 */
exports.reset = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid rate limit ID' });
    }

    const doc = await RateLimit.findOne({ _id: id, ...base });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Rate limit not found' });
    }

    doc.resetCounter();
    await doc.save();

    res.json({
      success: true,
      message: 'Rate limit counter reset successfully',
      data: toResponseDoc(doc),
    });
  } catch (error) {
    console.error('Error in reset (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset rate limit',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/rate-limits/export
 * Export rate limits as CSV or JSON
 */
exports.exportLimits = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const format = (req.query.format || 'json').toLowerCase() === 'csv' ? 'csv' : 'json';

    const docs = await RateLimit.find(filter).sort({ status: -1, current: -1 }).lean();
    const limits = docs.map((d) => toResponseDoc({ toObject: () => d, _id: d._id, ...d }));

    if (format === 'csv') {
      const headers = ['id', 'endpoint', 'method', 'limit', 'window', 'current', 'status', 'description', 'category', 'blockedRequests', 'averageResponseTime', 'enabled', 'createdAt', 'createdBy', 'lastModified'];
      const escape = (v) => {
        const s = v == null ? '' : String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = [headers.join(',')].concat(limits.map((r) => headers.map((h) => escape(r[h])).join(',')));
      const csv = rows.join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="rate-limits-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.send(csv);
    }

    res.json({ success: true, data: { limits } });
  } catch (error) {
    console.error('Error in exportLimits (rate-limits):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export rate limits',
      error: error.message,
    });
  }
};
