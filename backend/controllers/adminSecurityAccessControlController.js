const AccessRule = require('../models/AccessRule');
const IPAccessRule = require('../models/IPAccessRule');
const RoleAccessConfig = require('../models/RoleAccessConfig');
const mongoose = require('mongoose');

/** Exclude seed by default; set includeSeed=1 to include (access rules and IP rules). */
function buildBaseFilter(query) {
  const includeSeed = String(query.includeSeed || '').toLowerCase() === '1' || String(query.includeSeed) === 'true';
  return includeSeed ? {} : { source: { $ne: 'seed' } };
}

/**
 * Validate IP or CIDR (e.g. 192.168.1.1 or 10.0.0.0/24).
 * @returns {boolean}
 */
function isValidIPOrCIDR(s) {
  if (!s || typeof s !== 'string') return false;
  const trimmed = s.trim();
  const parts = trimmed.split('/');
  const ip = parts[0];
  const octets = ip.split('.');
  if (octets.length !== 4) return false;
  for (const o of octets) {
    const n = parseInt(o, 10);
    if (isNaN(n) || n < 0 || n > 255) return false;
  }
  if (parts.length === 2) {
    const cidr = parseInt(parts[1], 10);
    if (isNaN(cidr) || cidr < 1 || cidr > 32) return false;
  } else if (parts.length > 2) return false;
  return true;
}

function getActor(req) {
  return req.user?.email || req.user?.id || req.user?.sub || 'system';
}

// --- Access Rule response ---
function toAccessRuleResponse(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(d._id),
    name: d.name,
    type: d.type,
    description: d.description,
    status: d.status,
    priority: d.priority,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 10) : undefined,
    createdBy: d.createdBy,
    lastModified: d.lastModified ? new Date(d.lastModified).toISOString().slice(0, 10) : undefined,
    conditions: d.conditions || [],
    affectedUsers: d.affectedUsers,
    affectedIPs: d.affectedIPs,
  };
}

// --- IP Access Rule response ---
function toIPAccessRuleResponse(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(d._id),
    ipAddress: d.ipAddress,
    cidr: d.cidr,
    type: d.type,
    reason: d.reason,
    status: d.status,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 10) : undefined,
    expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 10) : undefined,
    createdBy: d.createdBy,
    location: d.location,
  };
}

// --- Role Access response ---
function toRoleAccessResponse(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    role: d.role,
    permissions: d.permissions || [],
    resources: d.resources || [],
    restrictions: d.restrictions || [],
  };
}

// --- Overview ---

/**
 * GET /api/admin/security/access-control/overview
 * Stats: totalRules, activeRules, ipRules, blockedIPs, allowedIPs, roles.
 * Recent activity: last 3 access rules (name, lastModified, status).
 */
exports.getOverview = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);

    const [accessRules, ipRules, roleCount, recentRules] = await Promise.all([
      AccessRule.find(base).lean(),
      IPAccessRule.find(base).lean(),
      RoleAccessConfig.countDocuments(),
      AccessRule.find(base).sort({ lastModified: -1 }).limit(3).select('name lastModified status').lean(),
    ]);

    const totalRules = accessRules.length;
    const activeRules = accessRules.filter((r) => r.status === 'active').length;
    const blockedIPs = ipRules.filter((r) => r.type === 'deny').length;
    const allowedIPs = ipRules.filter((r) => r.type === 'allow').length;

    const stats = {
      totalRules,
      activeRules,
      ipRules: ipRules.length,
      blockedIPs,
      allowedIPs,
      roles: roleCount,
    };

    const recentActivity = recentRules.map((r) => ({
      name: r.name,
      lastModified: r.lastModified ? new Date(r.lastModified).toISOString().slice(0, 10) : undefined,
      status: r.status,
    }));

    res.json({
      success: true,
      data: {
        stats,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Error in getOverview (admin/security/access-control):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview',
      error: error.message,
    });
  }
};

// --- Access Rules (Policies) ---

/**
 * GET /api/admin/security/access-control/access-rules
 * Query: search, status, type, includeSeed, page, limit
 */
exports.getAccessRules = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { search, status, type } = req.query;
    const filter = { ...base };
    if (search && String(search).trim()) {
      const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { description: re }, { type: re }];
    }
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [list, total] = await Promise.all([
      AccessRule.find(filter).sort({ priority: 1, lastModified: -1 }).skip(skip).limit(limit).lean(),
      AccessRule.countDocuments(filter),
    ]);

    const accessRules = list.map((d) => toAccessRuleResponse({ toObject: () => d, _id: d._id, ...d }));

    res.json({
      success: true,
      data: {
        accessRules,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (error) {
    console.error('Error in getAccessRules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch access rules', error: error.message });
  }
};

/**
 * GET /api/admin/security/access-control/access-rules/:id
 */
exports.getAccessRuleById = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Access rule not found' });
    }
    res.json({ success: true, data: toAccessRuleResponse(doc) });
  } catch (error) {
    console.error('Error in getAccessRuleById:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch access rule', error: error.message });
  }
};

/**
 * POST /api/admin/security/access-control/access-rules
 * Body: name, type, description, status?, priority?, conditions?, affectedUsers?, affectedIPs?
 */
exports.createAccessRule = async (req, res) => {
  try {
    const { name, type, description, status, priority, conditions, affectedUsers, affectedIPs } = req.body;
    if (!name || !type || !description) {
      return res.status(400).json({ success: false, message: 'name, type, and description are required' });
    }
    const validTypes = ['ip_whitelist', 'ip_blacklist', 'role_based', 'time_based', 'geographic', 'device_fingerprint'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of: ${validTypes.join(', ')}` });
    }
    const validStatuses = ['active', 'inactive', 'expired'];
    const st = status && validStatuses.includes(status) ? status : 'active';

    const doc = await AccessRule.create({
      name: String(name).trim(),
      type,
      description: String(description).trim(),
      status: st,
      priority: Math.max(1, parseInt(priority, 10) || 1),
      conditions: Array.isArray(conditions) ? conditions : [],
      affectedUsers: affectedUsers != null ? Number(affectedUsers) : undefined,
      affectedIPs: Array.isArray(affectedIPs) ? affectedIPs : undefined,
      createdBy: getActor(req),
      lastModified: new Date(),
    });

    res.status(201).json({ success: true, data: toAccessRuleResponse(doc) });
  } catch (error) {
    console.error('Error in createAccessRule:', error);
    res.status(500).json({ success: false, message: 'Failed to create access rule', error: error.message });
  }
};

/**
 * PUT /api/admin/security/access-control/access-rules/:id
 * Body: name?, type?, description?, status?, priority?, conditions?, affectedUsers?, affectedIPs?
 */
exports.updateAccessRule = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    const { name, type, description, status, priority, conditions, affectedUsers, affectedIPs } = req.body;

    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Access rule not found' });
    }

    const validTypes = ['ip_whitelist', 'ip_blacklist', 'role_based', 'time_based', 'geographic', 'device_fingerprint'];
    const validStatuses = ['active', 'inactive', 'expired'];

    const update = {};
    if (name != null) update.name = String(name).trim();
    if (type != null) {
      if (!validTypes.includes(type)) {
        return res.status(400).json({ success: false, message: `type must be one of: ${validTypes.join(', ')}` });
      }
      update.type = type;
    }
    if (description != null) update.description = String(description).trim();
    if (status != null) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(', ')}` });
      }
      update.status = status;
    }
    if (priority != null) update.priority = Math.max(1, parseInt(priority, 10) || 1);
    if (conditions != null) update.conditions = Array.isArray(conditions) ? conditions : [];
    if (affectedUsers !== undefined) update.affectedUsers = affectedUsers == null ? undefined : Number(affectedUsers);
    if (affectedIPs !== undefined) update.affectedIPs = Array.isArray(affectedIPs) ? affectedIPs : undefined;

    update.lastModified = new Date();
    update.updatedBy = getActor(req);

    const updated = await AccessRule.findByIdAndUpdate(id, { $set: update }, { new: true });
    res.json({ success: true, data: toAccessRuleResponse(updated) });
  } catch (error) {
    console.error('Error in updateAccessRule:', error);
    res.status(500).json({ success: false, message: 'Failed to update access rule', error: error.message });
  }
};

/**
 * DELETE /api/admin/security/access-control/access-rules/:id
 */
exports.deleteAccessRule = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await AccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Access rule not found' });
    }
    await AccessRule.deleteOne({ _id: id });
    res.json({ success: true, message: 'Access rule deleted' });
  } catch (error) {
    console.error('Error in deleteAccessRule:', error);
    res.status(500).json({ success: false, message: 'Failed to delete access rule', error: error.message });
  }
};

// --- IP Rules ---

/**
 * GET /api/admin/security/access-control/ip-rules
 * Query: search, status, includeSeed, page, limit
 */
exports.getIPRules = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { search, status } = req.query;
    const filter = { ...base };
    if (search && String(search).trim()) {
      const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ ipAddress: re }, { reason: re }, { location: re }];
    }
    if (status && status !== 'all') filter.status = status;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [list, total] = await Promise.all([
      IPAccessRule.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      IPAccessRule.countDocuments(filter),
    ]);

    const ipRules = list.map((d) => toIPAccessRuleResponse({ toObject: () => d, _id: d._id, ...d }));

    res.json({
      success: true,
      data: {
        ipRules,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (error) {
    console.error('Error in getIPRules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch IP rules', error: error.message });
  }
};

/**
 * GET /api/admin/security/access-control/ip-rules/:id
 */
exports.getIPRuleById = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await IPAccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'IP rule not found' });
    }
    res.json({ success: true, data: toIPAccessRuleResponse(doc) });
  } catch (error) {
    console.error('Error in getIPRuleById:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch IP rule', error: error.message });
  }
};

/**
 * POST /api/admin/security/access-control/ip-rules
 * Body: ipAddress, cidr?, type, reason, status?, expiresAt?, location?
 */
exports.createIPRule = async (req, res) => {
  try {
    const { ipAddress, cidr, type, reason, status, expiresAt, location } = req.body;
    if (!ipAddress || !type || !reason) {
      return res.status(400).json({ success: false, message: 'ipAddress, type, and reason are required' });
    }
    const ip = String(ipAddress).trim();
    if (!isValidIPOrCIDR(ip)) {
      return res.status(400).json({ success: false, message: 'ipAddress must be a valid IPv4 or CIDR (e.g. 192.168.1.1 or 10.0.0.0/24)' });
    }
    if (cidr != null && cidr !== '') {
      const c = String(cidr).trim();
      if (!/^\/\d{1,2}$/.test(c) || c === '/0') {
        return res.status(400).json({ success: false, message: 'cidr must be like /8, /16, /24, /32' });
      }
      const n = parseInt(c.slice(1), 10);
      if (n < 1 || n > 32) {
        return res.status(400).json({ success: false, message: 'cidr must be /1 to /32' });
      }
    }
    if (!['allow', 'deny'].includes(type)) {
      return res.status(400).json({ success: false, message: 'type must be allow or deny' });
    }
    const validStatuses = ['active', 'inactive', 'expired'];
    const st = status && validStatuses.includes(status) ? status : 'active';

    const doc = await IPAccessRule.create({
      ipAddress: ip,
      cidr: cidr != null && cidr !== '' ? String(cidr).trim() : undefined,
      type,
      reason: String(reason).trim(),
      status: st,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: getActor(req),
      location: location != null && location !== '' ? String(location).trim() : undefined,
    });

    res.status(201).json({ success: true, data: toIPAccessRuleResponse(doc) });
  } catch (error) {
    console.error('Error in createIPRule:', error);
    res.status(500).json({ success: false, message: 'Failed to create IP rule', error: error.message });
  }
};

/**
 * PUT /api/admin/security/access-control/ip-rules/:id
 * Body: ipAddress?, cidr?, type?, reason?, status?, expiresAt?, location?
 */
exports.updateIPRule = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    const { ipAddress, cidr, type, reason, status, expiresAt, location } = req.body;

    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await IPAccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'IP rule not found' });
    }

    const update = {};
    if (ipAddress != null) {
      const ip = String(ipAddress).trim();
      if (!isValidIPOrCIDR(ip)) {
        return res.status(400).json({ success: false, message: 'ipAddress must be a valid IPv4 or CIDR' });
      }
      update.ipAddress = ip;
    }
    if (cidr !== undefined) {
      if (cidr == null || cidr === '') {
        update.cidr = undefined;
      } else {
        const c = String(cidr).trim();
        if (!/^\/\d{1,2}$/.test(c)) {
          return res.status(400).json({ success: false, message: 'cidr must be like /8, /16, /24, /32' });
        }
        const n = parseInt(c.slice(1), 10);
        if (n < 1 || n > 32) return res.status(400).json({ success: false, message: 'cidr must be /1 to /32' });
        update.cidr = c;
      }
    }
    if (type != null) {
      if (!['allow', 'deny'].includes(type)) {
        return res.status(400).json({ success: false, message: 'type must be allow or deny' });
      }
      update.type = type;
    }
    if (reason != null) update.reason = String(reason).trim();
    if (status != null) {
      if (!['active', 'inactive', 'expired'].includes(status)) {
        return res.status(400).json({ success: false, message: 'status must be active, inactive, or expired' });
      }
      update.status = status;
    }
    if (expiresAt !== undefined) update.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
    if (location !== undefined) update.location = location == null || location === '' ? undefined : String(location).trim();

    const updated = await IPAccessRule.findByIdAndUpdate(id, { $set: update }, { new: true });
    res.json({ success: true, data: toIPAccessRuleResponse(updated) });
  } catch (error) {
    console.error('Error in updateIPRule:', error);
    res.status(500).json({ success: false, message: 'Failed to update IP rule', error: error.message });
  }
};

/**
 * DELETE /api/admin/security/access-control/ip-rules/:id
 */
exports.deleteIPRule = async (req, res) => {
  try {
    const base = buildBaseFilter(req.query);
    const { id } = req.params;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
      doc = await IPAccessRule.findOne({ _id: id, ...base });
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: 'IP rule not found' });
    }
    await IPAccessRule.deleteOne({ _id: id });
    res.json({ success: true, message: 'IP rule deleted' });
  } catch (error) {
    console.error('Error in deleteIPRule:', error);
    res.status(500).json({ success: false, message: 'Failed to delete IP rule', error: error.message });
  }
};

// --- Role Access ---

/**
 * GET /api/admin/security/access-control/role-access
 * List all role access configs. Seed data is always included (no source filter).
 */
exports.getRoleAccess = async (req, res) => {
  try {
    const list = await RoleAccessConfig.find().sort({ role: 1 }).lean();
    const roleAccess = list.map((d) => toRoleAccessResponse({ toObject: () => d, ...d }));
    res.json({ success: true, data: { roleAccess } });
  } catch (error) {
    console.error('Error in getRoleAccess:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch role access', error: error.message });
  }
};

/**
 * GET /api/admin/security/access-control/role-access/:role
 * :role is URL-decoded (e.g. "Corporate%20Admin" -> "Corporate Admin").
 */
exports.getRoleAccessByRole = async (req, res) => {
  try {
    const role = decodeURIComponent(String(req.params.role || ''));
    const doc = await RoleAccessConfig.findOne({ role });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Role access not found' });
    }
    res.json({ success: true, data: toRoleAccessResponse(doc) });
  } catch (error) {
    console.error('Error in getRoleAccessByRole:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch role access', error: error.message });
  }
};

const VALID_PERMISSIONS = ['read', 'write', 'delete', 'admin', 'export', 'approve'];

/**
 * PUT /api/admin/security/access-control/role-access/:role
 * Body: permissions?, resources?, restrictions?
 * Upserts: if role does not exist, creates it.
 */
exports.updateRoleAccess = async (req, res) => {
  try {
    const role = decodeURIComponent(String(req.params.role || '').trim());
    if (!role) {
      return res.status(400).json({ success: false, message: 'role is required' });
    }
    const { permissions, resources, restrictions } = req.body;

    const update = {};
    if (permissions != null) {
      const arr = Array.isArray(permissions) ? permissions : [];
      const invalid = arr.filter((p) => !VALID_PERMISSIONS.includes(p));
      if (invalid.length) {
        return res.status(400).json({ success: false, message: `Invalid permissions: ${invalid.join(', ')}. Valid: ${VALID_PERMISSIONS.join(', ')}` });
      }
      update.permissions = arr;
    }
    if (resources != null) update.resources = Array.isArray(resources) ? resources : [];
    if (restrictions != null) update.restrictions = Array.isArray(restrictions) ? restrictions : [];

    const doc = await RoleAccessConfig.findOneAndUpdate(
      { role },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: toRoleAccessResponse(doc) });
  } catch (error) {
    console.error('Error in updateRoleAccess:', error);
    res.status(500).json({ success: false, message: 'Failed to update role access', error: error.message });
  }
};
