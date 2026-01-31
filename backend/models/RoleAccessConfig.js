const mongoose = require('mongoose');

const PERMISSIONS = ['read', 'write', 'delete', 'admin', 'export', 'approve'];

/**
 * Role Access Config Model (RBAC)
 * Collection: role_access_config
 * Used by Admin Security Access Control at /admin/security/access-control.
 * Separate from the Role model; defines permissions, resources, and restrictions per role.
 */
const roleAccessConfigSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          if (!Array.isArray(v)) return false;
          return v.every((p) => PERMISSIONS.includes(p));
        },
        message: `Each permission must be one of: ${PERMISSIONS.join(', ')}`,
      },
    },
    resources: {
      type: [String],
      default: [],
    },
    restrictions: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      default: undefined,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
    collection: 'role_access_config',
  }
);

module.exports = mongoose.model('RoleAccessConfig', roleAccessConfigSchema);
module.exports.PERMISSIONS = PERMISSIONS;
