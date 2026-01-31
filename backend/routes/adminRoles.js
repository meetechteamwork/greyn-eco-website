const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/adminRolesController');

/**
 * Admin Roles Routes
 * All routes require admin authentication
 */

// Get role statistics
router.get('/stats', authenticateAdmin, getRoleStats);

// Export roles
router.get('/export', authenticateAdmin, exportRoles);

// Reset roles to default
router.post('/reset', authenticateAdmin, resetRolesToDefault);

// Get all roles
router.get('/', authenticateAdmin, getAllRoles);

// Create new role
router.post('/', authenticateAdmin, createRole);

// Get role by ID
router.get('/:id', authenticateAdmin, getRoleById);

// Update all permissions for a role
router.put('/:id/permissions/all', authenticateAdmin, updateAllRolePermissions);

// Update single permission for a role
router.put('/:id/permissions/:permission', authenticateAdmin, updateRolePermission);

// Update role permissions
router.put('/:id/permissions', authenticateAdmin, updateRolePermissions);

// Delete role
router.delete('/:id', authenticateAdmin, deleteRole);

module.exports = router;
