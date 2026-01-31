const Role = require('../models/Role');

/**
 * Get all roles
 */
const getAllRoles = async () => {
  try {
    const roles = await Role.find({ isActive: true })
      .sort({ name: 1 })
      .select('-__v')
      .lean()
      .maxTimeMS(5000); // 5 second timeout

    if (!roles || !Array.isArray(roles)) {
      throw new Error('Invalid response from database');
    }

    return roles.map(role => {
      // Ensure all required fields exist
      if (!role._id || !role.name || !role.permissions) {
        console.warn('Invalid role data found:', role);
        return null;
      }

      return {
        id: role._id.toString(),
        name: role.name,
        description: role.description || '',
        permissions: {
          view: role.permissions.view === true,
          create: role.permissions.create === true,
          approve: role.permissions.approve === true,
          delete: role.permissions.delete === true,
        },
        isSystem: role.isSystem === true,
        isActive: role.isActive !== false,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      };
    }).filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error('Error fetching all roles:', error);
    
    // Handle specific database errors
    if (error.name === 'MongoTimeoutError' || error.name === 'MongoNetworkError') {
      const dbError = new Error('Database connection timeout. Please try again.');
      dbError.statusCode = 503;
      throw dbError;
    }
    
    throw error;
  }
};

/**
 * Get role by ID
 */
const getRoleById = async (roleId) => {
  try {
    const role = await Role.findById(roleId).lean();
    
    if (!role) {
      return null;
    }

    return {
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
};

/**
 * Get role by name
 */
const getRoleByName = async (roleName) => {
  try {
    const role = await Role.findByName(roleName);
    
    if (!role) {
      return null;
    }

    return {
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  } catch (error) {
    console.error('Error fetching role by name:', error);
    throw error;
  }
};

/**
 * Update role permissions
 */
const updateRolePermissions = async (roleId, permissions, updatedBy = null) => {
  try {
    // Validate roleId
    if (!roleId || typeof roleId !== 'string') {
      throw new Error('Valid role ID is required');
    }

    const role = await Role.findById(roleId);
    
    if (!role) {
      const error = new Error('Role not found');
      error.statusCode = 404;
      throw error;
    }

    // Prevent modification of Admin role permissions
    if (role.isSystem && role.name === 'Admin') {
      const error = new Error('Cannot modify Admin role permissions');
      error.statusCode = 403;
      throw error;
    }

    // Validate permissions object
    const validPermissions = ['view', 'create', 'approve', 'delete'];
    const updatedPermissions = { ...role.permissions };

    // Update only provided permissions
    for (const key of validPermissions) {
      if (permissions.hasOwnProperty(key)) {
        if (typeof permissions[key] !== 'boolean') {
          const error = new Error(`Permission ${key} must be a boolean`);
          error.statusCode = 400;
          throw error;
        }
        updatedPermissions[key] = permissions[key];
      }
    }

    role.permissions = updatedPermissions;
    if (updatedBy) {
      role.updatedBy = updatedBy;
    }
    
    const savedRole = await role.save();

    return {
      id: savedRole._id.toString(),
      name: savedRole.name,
      description: savedRole.description,
      permissions: savedRole.permissions,
      isSystem: savedRole.isSystem,
      isActive: savedRole.isActive,
      createdAt: savedRole.createdAt,
      updatedAt: savedRole.updatedAt
    };
  } catch (error) {
    console.error('Error updating role permissions:', error);
    // Re-throw with status code if available
    if (error.statusCode) {
      throw error;
    }
    // Wrap database errors
    if (error.name === 'CastError') {
      const castError = new Error('Invalid role ID format');
      castError.statusCode = 400;
      throw castError;
    }
    throw error;
  }
};

/**
 * Update single permission for a role
 */
const updateRolePermission = async (roleId, permission, value, updatedBy = null) => {
  try {
    // Validate inputs
    if (!roleId || typeof roleId !== 'string') {
      const error = new Error('Valid role ID is required');
      error.statusCode = 400;
      throw error;
    }

    if (typeof value !== 'boolean') {
      const error = new Error('Permission value must be a boolean');
      error.statusCode = 400;
      throw error;
    }

    const validPermissions = ['view', 'create', 'approve', 'delete'];
    if (!validPermissions.includes(permission)) {
      const error = new Error(`Invalid permission: ${permission}. Must be one of: ${validPermissions.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const role = await Role.findById(roleId);
    
    if (!role) {
      const error = new Error('Role not found');
      error.statusCode = 404;
      throw error;
    }

    // Prevent modification of Admin role permissions
    if (role.isSystem && role.name === 'Admin') {
      const error = new Error('Cannot modify Admin role permissions');
      error.statusCode = 403;
      throw error;
    }

    role.permissions[permission] = value;
    if (updatedBy) {
      role.updatedBy = updatedBy;
    }
    
    const savedRole = await role.save();

    return {
      id: savedRole._id.toString(),
      name: savedRole.name,
      description: savedRole.description,
      permissions: savedRole.permissions,
      isSystem: savedRole.isSystem,
      isActive: savedRole.isActive,
      createdAt: savedRole.createdAt,
      updatedAt: savedRole.updatedAt
    };
  } catch (error) {
    console.error('Error updating role permission:', error);
    
    // Re-throw with status code if available
    if (error.statusCode) {
      throw error;
    }
    
    // Wrap database errors
    if (error.name === 'CastError') {
      const castError = new Error('Invalid role ID format');
      castError.statusCode = 400;
      throw castError;
    }
    
    throw error;
  }
};

/**
 * Update all permissions for a role
 */
const updateAllRolePermissions = async (roleId, value, updatedBy = null) => {
  try {
    // Validate inputs
    if (!roleId || typeof roleId !== 'string') {
      const error = new Error('Valid role ID is required');
      error.statusCode = 400;
      throw error;
    }

    if (typeof value !== 'boolean') {
      const error = new Error('Permission value must be a boolean');
      error.statusCode = 400;
      throw error;
    }

    const role = await Role.findById(roleId);
    
    if (!role) {
      const error = new Error('Role not found');
      error.statusCode = 404;
      throw error;
    }

    // Prevent modification of Admin role permissions
    if (role.isSystem && role.name === 'Admin') {
      const error = new Error('Cannot modify Admin role permissions');
      error.statusCode = 403;
      throw error;
    }

    role.permissions = {
      view: value,
      create: value,
      approve: value,
      delete: value
    };
    
    if (updatedBy) {
      role.updatedBy = updatedBy;
    }
    
    const savedRole = await role.save();

    return {
      id: savedRole._id.toString(),
      name: savedRole.name,
      description: savedRole.description,
      permissions: savedRole.permissions,
      isSystem: savedRole.isSystem,
      isActive: savedRole.isActive,
      createdAt: savedRole.createdAt,
      updatedAt: savedRole.updatedAt
    };
  } catch (error) {
    console.error('Error updating all role permissions:', error);
    
    // Re-throw with status code if available
    if (error.statusCode) {
      throw error;
    }
    
    // Wrap database errors
    if (error.name === 'CastError') {
      const castError = new Error('Invalid role ID format');
      castError.statusCode = 400;
      throw castError;
    }
    
    throw error;
  }
};

/**
 * Create new role
 */
const createRole = async (roleData, createdBy = null) => {
  try {
    // Check if role with same name already exists
    const existingRole = await Role.findOne({ 
      name: roleData.name,
      isActive: true 
    });

    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    const role = await Role.create({
      name: roleData.name,
      description: roleData.description || '',
      permissions: roleData.permissions || {
        view: false,
        create: false,
        approve: false,
        delete: false
      },
      isSystem: false,
      isActive: true,
      createdBy: createdBy
    });

    return {
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Delete role (soft delete by setting isActive to false)
 */
const deleteRole = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    
    if (!role) {
      throw new Error('Role not found');
    }

    if (role.isSystem) {
      throw new Error('Cannot delete system role');
    }

    role.isActive = false;
    await role.save();

    return {
      id: role._id.toString(),
      name: role.name,
      isActive: false
    };
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

/**
 * Get role statistics
 */
const getRoleStats = async () => {
  try {
    const [totalRoles, activeRoles, systemRoles, totalPermissions] = await Promise.all([
      Role.countDocuments({ isActive: true }).maxTimeMS(5000),
      Role.countDocuments({ isActive: true }).maxTimeMS(5000),
      Role.countDocuments({ isSystem: true, isActive: true }).maxTimeMS(5000),
      Role.aggregate([
        { $match: { isActive: true } },
        {
          $project: {
            total: {
              $add: [
                { $cond: ['$permissions.view', 1, 0] },
                { $cond: ['$permissions.create', 1, 0] },
                { $cond: ['$permissions.approve', 1, 0] },
                { $cond: ['$permissions.delete', 1, 0] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]).maxTimeMS(5000)
    ]);

    // Validate and sanitize results
    const stats = {
      totalRoles: Number(totalRoles) || 0,
      activeRoles: Number(activeRoles) || 0,
      systemRoles: Number(systemRoles) || 0,
      customRoles: Math.max(0, (Number(totalRoles) || 0) - (Number(systemRoles) || 0)),
      totalPermissions: Number(totalPermissions[0]?.total) || 0,
      permissionTypes: 4 // view, create, approve, delete
    };

    return stats;
  } catch (error) {
    console.error('Error fetching role stats:', error);
    
    // Handle specific database errors
    if (error.name === 'MongoTimeoutError' || error.name === 'MongoNetworkError') {
      const dbError = new Error('Database connection timeout. Please try again.');
      dbError.statusCode = 503;
      throw dbError;
    }
    
    throw error;
  }
};

/**
 * Reset roles to default
 */
const resetRolesToDefault = async (updatedBy = null) => {
  try {
    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full system access with all permissions',
        permissions: { view: true, create: true, approve: true, delete: true },
        isSystem: true
      },
      {
        name: 'Corporate Admin',
        description: 'Manage corporate ESG portal and campaigns',
        permissions: { view: true, create: true, approve: true, delete: false },
        isSystem: true
      },
      {
        name: 'NGO Admin',
        description: 'Manage NGO projects and submissions',
        permissions: { view: true, create: true, approve: false, delete: false },
        isSystem: true
      },
      {
        name: 'Verifier',
        description: 'Verify and approve carbon credit projects',
        permissions: { view: true, create: false, approve: true, delete: false },
        isSystem: true
      },
      {
        name: 'Investor',
        description: 'View and purchase carbon credits',
        permissions: { view: true, create: false, approve: false, delete: false },
        isSystem: true
      }
    ];

    const results = [];
    
    for (const defaultRole of defaultRoles) {
      let role = await Role.findOne({ name: defaultRole.name });
      
      if (role) {
        // Update existing role
        role.description = defaultRole.description;
        role.permissions = defaultRole.permissions;
        role.isSystem = true;
        role.isActive = true;
        if (updatedBy) {
          role.updatedBy = updatedBy;
        }
        await role.save();
        results.push({
          id: role._id.toString(),
          name: role.name,
          action: 'updated'
        });
      } else {
        // Create new role
        role = await Role.create({
          ...defaultRole,
          createdBy: updatedBy
        });
        results.push({
          id: role._id.toString(),
          name: role.name,
          action: 'created'
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error resetting roles to default:', error);
    throw error;
  }
};

/**
 * Export roles as JSON
 */
const exportRoles = async () => {
  try {
    const roles = await Role.find({ isActive: true })
      .select('-__v -createdBy -updatedBy')
      .sort({ name: 1 })
      .lean();

    return roles.map(role => ({
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }));
  } catch (error) {
    console.error('Error exporting roles:', error);
    throw error;
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleByName,
  updateRolePermissions,
  updateRolePermission,
  updateAllRolePermissions,
  createRole,
  deleteRole,
  getRoleStats,
  resetRolesToDefault,
  exportRoles
};
