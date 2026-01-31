const roleService = require('../services/roleService');

/**
 * Get all roles
 * GET /api/admin/roles
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();

    if (!Array.isArray(roles)) {
      throw new Error('Invalid response from role service');
    }

    res.json({
      success: true,
      data: roles,
      count: roles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error fetching roles',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get role statistics
 * GET /api/admin/roles/stats
 */
const getRoleStats = async (req, res) => {
  try {
    const stats = await roleService.getRoleStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching role stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role statistics',
      error: error.message
    });
  }
};

/**
 * Get role by ID
 * GET /api/admin/roles/:id
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await roleService.getRoleById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message
    });
  }
};

/**
 * Update role permissions
 * PUT /api/admin/roles/:id/permissions
 */
const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    const updatedBy = req.user?.userId || null;

    // Validation
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid role ID is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Permissions object is required',
        timestamp: new Date().toISOString()
      });
    }

    // Validate permission structure
    const validPermissions = ['view', 'create', 'approve', 'delete'];
    const permissionKeys = Object.keys(permissions);
    const invalidKeys = permissionKeys.filter(key => !validPermissions.includes(key));
    
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid permission keys: ${invalidKeys.join(', ')}. Valid keys are: ${validPermissions.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    // Validate permission values are booleans
    for (const key of permissionKeys) {
      if (typeof permissions[key] !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: `Permission ${key} must be a boolean value`,
          timestamp: new Date().toISOString()
        });
      }
    }

    const role = await roleService.updateRolePermissions(id, permissions, updatedBy);

    res.json({
      success: true,
      message: 'Role permissions updated successfully',
      data: role,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    
    const statusCode = error.statusCode || 
      (error.message === 'Role not found' ? 404 : 
       error.message.includes('Cannot modify') ? 403 : 500);

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error updating role permissions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Update single permission for a role
 * PUT /api/admin/roles/:id/permissions/:permission
 */
const updateRolePermission = async (req, res) => {
  try {
    const { id, permission } = req.params;
    const { value } = req.body;
    const updatedBy = req.user?.userId || null;

    if (typeof value !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Permission value must be a boolean'
      });
    }

    const validPermissions = ['view', 'create', 'approve', 'delete'];
    if (!validPermissions.includes(permission)) {
      return res.status(400).json({
        success: false,
        message: `Invalid permission. Must be one of: ${validPermissions.join(', ')}`
      });
    }

    const role = await roleService.updateRolePermission(id, permission, value, updatedBy);

    res.json({
      success: true,
      message: `Role permission ${permission} updated successfully`,
      data: role
    });
  } catch (error) {
    console.error('Error updating role permission:', error);
    
    if (error.message === 'Role not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Cannot modify')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating role permission',
      error: error.message
    });
  }
};

/**
 * Update all permissions for a role
 * PUT /api/admin/roles/:id/permissions/all
 */
const updateAllRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const updatedBy = req.user?.userId || null;

    if (typeof value !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Permission value must be a boolean'
      });
    }

    const role = await roleService.updateAllRolePermissions(id, value, updatedBy);

    res.json({
      success: true,
      message: `All role permissions ${value ? 'enabled' : 'disabled'} successfully`,
      data: role
    });
  } catch (error) {
    console.error('Error updating all role permissions:', error);
    
    if (error.message === 'Role not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Cannot modify')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating all role permissions',
      error: error.message
    });
  }
};

/**
 * Create new role
 * POST /api/admin/roles
 */
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const createdBy = req.user?.userId || null;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    const roleData = {
      name: name.trim(),
      description: description || '',
      permissions: permissions || {
        view: false,
        create: false,
        approve: false,
        delete: false
      }
    };

    const role = await roleService.createRole(roleData, createdBy);

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Error creating role:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

/**
 * Delete role
 * DELETE /api/admin/roles/:id
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await roleService.deleteRole(id);

    res.json({
      success: true,
      message: 'Role deleted successfully',
      data: role
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    
    if (error.message === 'Role not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Cannot delete')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
};

/**
 * Reset roles to default
 * POST /api/admin/roles/reset
 */
const resetRolesToDefault = async (req, res) => {
  try {
    const updatedBy = req.user?.userId || null;

    const results = await roleService.resetRolesToDefault(updatedBy);

    res.json({
      success: true,
      message: 'Roles reset to default successfully',
      data: results
    });
  } catch (error) {
    console.error('Error resetting roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting roles to default',
      error: error.message
    });
  }
};

/**
 * Export roles
 * GET /api/admin/roles/export
 */
const exportRoles = async (req, res) => {
  try {
    const roles = await roleService.exportRoles();

    res.json({
      success: true,
      data: roles,
      count: roles.length,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting roles',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleStats,
  getRoleById,
  updateRolePermissions,
  updateRolePermission,
  updateAllRolePermissions,
  createRole,
  deleteRole,
  resetRolesToDefault,
  exportRoles
};
