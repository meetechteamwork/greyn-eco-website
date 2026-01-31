const userService = require('../services/userService');

/**
 * Get all users with filtering
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, status, role, portal } = req.query;

    const filters = {
      search: search || '',
      status: status || 'all',
      role: role || 'all',
      portal: portal || 'all'
    };

    const users = await userService.getAllUsers(filters);

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get user statistics
 * GET /api/admin/users/stats
 */
const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

/**
 * Get single user by ID
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Update user status (suspend/reactivate)
 * PUT /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, suspended, or pending)'
      });
    }

    const user = await userService.updateUserStatus(id, status);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : status === 'active' ? 'reactivated' : 'status updated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

/**
 * Update user role
 * PUT /api/admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['simple-user', 'ngo', 'corporate', 'carbon', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (simple-user, ngo, corporate, carbon, or admin)'
      });
    }

    const user = await userService.updateUserRole(id, role);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  updateUserRole
};
