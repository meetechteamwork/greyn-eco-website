const crypto = require('crypto');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

/** Exclude seed by default; set includeSeed=1 to include */
function buildBaseFilter(query) {
  const includeSeed = String(query.includeSeed || '').toLowerCase() === '1' || String(query.includeSeed) === 'true';
  return includeSeed ? {} : { source: { $ne: 'seed' } };
}

/**
 * Compute integrity hash for an audit log document.
 * Must match between create/seed and verify.
 * @param {{ timestamp: Date, actor: string, action: string, resource: string, details: string, severity: string, status: string, ipAddress: string, userAgent?: string, sessionId?: string }} doc
 * @returns {string} '0x' + hex
 */
function computeIntegrityHash(doc) {
  const ts = doc.timestamp instanceof Date ? doc.timestamp.toISOString() : String(doc.timestamp || '');
  const payload = [ts, doc.actor || '', doc.action || '', doc.resource || '', doc.details || '', doc.severity || '', doc.status || '', doc.ipAddress || '', doc.userAgent || '', doc.sessionId || ''].join('|');
  return '0x' + crypto.createHash('sha256').update(payload).digest('hex');
}

function buildFilter(query) {
  const filter = buildBaseFilter(query);
  const { search, severity, action, status, dateRange } = query;

  if (search && String(search).trim()) {
    const q = String(search).trim();
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { actor: re },
      { resource: re },
      { details: re },
      { ipAddress: re },
      { hash: re },
    ];
  }
  if (severity && severity !== 'all') filter.severity = severity;
  if (action && action !== 'all') filter.action = action;
  if (status && status !== 'all') filter.status = status;

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    let start;
    if (dateRange === 'today') {
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (dateRange === 'week') {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'month') {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'year') {
      start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    if (start) filter.timestamp = { $gte: start };
  }

  return filter;
}

function toResponseDoc(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(d._id),
    timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : null,
    actor: d.actor,
    actorRole: d.actorRole,
    action: d.action,
    resource: d.resource,
    details: d.details,
    severity: d.severity,
    status: d.status,
    ipAddress: d.ipAddress,
    userAgent: d.userAgent || '',
    location: d.location,
    hash: d.hash,
    sessionId: d.sessionId,
  };
}

/**
 * GET /api/admin/security/audit-logs
 * List with filters, pagination, and stats.
 * Query: search, severity, action, status, dateRange, page, limit, includeSeed
 */
exports.getList = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const [faceted] = await AuditLog.aggregate([
      { $match: filter },
      {
        $facet: {
          list: [
            { $sort: { timestamp: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                id: { $toString: '$_id' },
                timestamp: 1,
                actor: 1,
                actorRole: 1,
                action: 1,
                resource: 1,
                details: 1,
                severity: 1,
                status: 1,
                ipAddress: 1,
                userAgent: 1,
                location: 1,
                hash: 1,
                sessionId: 1,
              },
            },
          ],
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
                high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
                medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
                low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
                warning: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } },
              },
            },
            { $project: { _id: 0 } },
          ],
        },
      },
    ]);

    const list = (faceted && faceted.list) || [];
    const logs = list.map((d) => ({
      ...d,
      timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : null,
      userAgent: d.userAgent || '',
    }));

    const rawStats = (faceted && faceted.stats && faceted.stats[0]) || {};
    const stats = {
      total: rawStats.total || 0,
      critical: rawStats.critical || 0,
      high: rawStats.high || 0,
      medium: rawStats.medium || 0,
      low: rawStats.low || 0,
      failed: rawStats.failed || 0,
      success: rawStats.success || 0,
      warning: rawStats.warning || 0,
    };

    const total = stats.total;
    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      data: {
        logs,
        stats,
        pagination: { page, limit, total, totalPages },
      },
    });
  } catch (error) {
    console.error('Error in getList (admin/security/audit-logs):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/audit-logs/:id
 */
exports.getOne = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AuditLog.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }
    res.json({ success: true, data: toResponseDoc(doc) });
  } catch (error) {
    console.error('Error in getOne (admin/security/audit-logs):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit log',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/audit-logs/export
 * Export filtered logs as CSV or JSON. Query: same as list + format=csv|json, includeSeed
 */
exports.getExport = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const format = (req.query.format || 'json').toLowerCase() === 'csv' ? 'csv' : 'json';

    const docs = await AuditLog.find(filter).sort({ timestamp: -1 }).lean();
    const logs = docs.map((d) => toResponseDoc({ toObject: () => d, _id: d._id, ...d }));

    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'actor', 'actorRole', 'action', 'resource', 'details', 'severity', 'status', 'ipAddress', 'userAgent', 'location', 'hash', 'sessionId'];
      const escape = (v) => {
        const s = v == null ? '' : String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = [headers.join(',')].concat(logs.map((r) => headers.map((h) => escape(r[h])).join(',')));
      const csv = rows.join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.send(csv);
    }

    res.json({ success: true, data: { logs } });
  } catch (error) {
    console.error('Error in getExport (admin/security/audit-logs):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audit logs',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/audit-logs/:id/export
 * Export a single log as JSON.
 */
exports.getExportOne = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AuditLog.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }
    res.json({ success: true, data: toResponseDoc(doc) });
  } catch (error) {
    console.error('Error in getExportOne (admin/security/audit-logs):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audit log',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/security/audit-logs/:id/verify
 * Verify integrity hash. Returns { valid: boolean, message?: string }.
 */
exports.getVerify = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AuditLog.findOne({ _id: id, ...base }).lean();
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    if (!doc.hash) {
      return res.json({
        success: true,
        data: { valid: false, message: 'No integrity hash stored for this log' },
      });
    }

    const expected = computeIntegrityHash(doc);
    const valid = doc.hash === expected;

    res.json({
      success: true,
      data: {
        valid,
        message: valid ? 'Integrity verified' : 'Hash mismatch - log may have been altered',
      },
    });
  } catch (error) {
    console.error('Error in getVerify (admin/security/audit-logs):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify audit log',
      error: error.message,
    });
  }
};

/** Export for use in seed and other modules */
exports.computeIntegrityHash = computeIntegrityHash;
