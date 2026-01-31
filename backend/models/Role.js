const mongoose = require('mongoose');

/**
 * Role Model
 * Manages role-based access control (RBAC) with permissions
 */
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    enum: ['Admin', 'Corporate Admin', 'NGO Admin', 'Verifier', 'Investor'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Role description is required'],
    trim: true
  },
  permissions: {
    view: {
      type: Boolean,
      default: false,
      required: true
    },
    create: {
      type: Boolean,
      default: false,
      required: true
    },
    approve: {
      type: Boolean,
      default: false,
      required: true
    },
    delete: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  isSystem: {
    type: Boolean,
    default: false,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true,
  collection: 'roles'
});

// Indexes for performance
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ isSystem: 1 });

// Prevent deletion of system roles
roleSchema.pre('remove', function(next) {
  if (this.isSystem) {
    const error = new Error('Cannot delete system role');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

// Prevent modification of system role permissions (except by super admin)
roleSchema.pre('save', function(next) {
  if (this.isModified('permissions') && this.isSystem && this.name === 'Admin') {
    // Admin role should always have all permissions
    this.permissions = {
      view: true,
      create: true,
      approve: true,
      delete: true
    };
  }
  next();
});

// Instance method to check if role has a specific permission
roleSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true;
};

// Instance method to check if role has any of the given permissions
roleSchema.methods.hasAnyPermission = function(permissionArray) {
  return permissionArray.some(permission => this.permissions[permission] === true);
};

// Instance method to check if role has all of the given permissions
roleSchema.methods.hasAllPermissions = function(permissionArray) {
  return permissionArray.every(permission => this.permissions[permission] === true);
};

// Static method to get role by name
roleSchema.statics.findByName = function(name) {
  return this.findOne({ name, isActive: true });
};

// Static method to get all active roles
roleSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get system roles
roleSchema.statics.findSystem = function() {
  return this.find({ isSystem: true, isActive: true });
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
