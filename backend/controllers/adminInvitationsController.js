const invitationService = require('../services/invitationService');

/**
 * Get all invitations
 * GET /api/admin/invitations
 */
const getAllInvitations = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      status: req.query.status,
      role: req.query.role,
      portal: req.query.portal
    };

    const invitations = await invitationService.getAllInvitations(filters);

    res.json({
      success: true,
      data: invitations,
      count: invitations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invitations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get invitation statistics
 * GET /api/admin/invitations/stats
 */
const getInvitationStats = async (req, res) => {
  try {
    const stats = await invitationService.getInvitationStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching invitation stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invitation stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get invitation by ID
 * GET /api/admin/invitations/:id
 */
const getInvitationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invitation ID is required',
        timestamp: new Date().toISOString()
      });
    }

    const invitation = await invitationService.getInvitationById(id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: invitation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Create new invitation
 * POST /api/admin/invitations
 */
const createInvitation = async (req, res) => {
  try {
    const { email, role, portal, daysUntilExpiry } = req.body;
    const invitedBy = req.user?.userId || null;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!portal) {
      return res.status(400).json({
        success: false,
        message: 'Portal is required',
        timestamp: new Date().toISOString()
      });
    }

    const validRoles = ['corporate', 'ngo', 'carbon', 'admin', 'verifier'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    const validPortals = ['Corporate ESG', 'Carbon Marketplace', 'NGO Portal', 'Admin Portal'];
    if (!validPortals.includes(portal)) {
      return res.status(400).json({
        success: false,
        message: `Invalid portal. Must be one of: ${validPortals.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    if (!invitedBy) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    }

    const invitation = await invitationService.createInvitation(
      { email, role, portal },
      invitedBy,
      daysUntilExpiry || 7
    );

    res.status(201).json({
      success: true,
      message: 'Invitation created successfully',
      data: invitation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    
    const statusCode = error.message?.includes('already exists') ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error creating invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Resend invitation
 * PUT /api/admin/invitations/:id/resend
 */
const resendInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { daysUntilExpiry } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invitation ID is required',
        timestamp: new Date().toISOString()
      });
    }

    const invitation = await invitationService.resendInvitation(id, daysUntilExpiry || 7);

    res.json({
      success: true,
      message: 'Invitation resent successfully',
      data: invitation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resending invitation:', error);
    
    const statusCode = error.message?.includes('not found') ? 404 :
                      error.message?.includes('Cannot') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error resending invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Revoke invitation
 * PUT /api/admin/invitations/:id/revoke
 */
const revokeInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const revokedBy = req.user?.userId || null;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invitation ID is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!revokedBy) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    }

    const invitation = await invitationService.revokeInvitation(id, revokedBy);

    res.json({
      success: true,
      message: 'Invitation revoked successfully',
      data: invitation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    
    const statusCode = error.message?.includes('not found') ? 404 :
                      error.message?.includes('Cannot') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error revoking invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Export invitations to CSV
 * GET /api/admin/invitations/export
 */
const exportInvitations = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      status: req.query.status,
      role: req.query.role,
      portal: req.query.portal
    };

    const exportData = await invitationService.exportInvitations(filters);

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=invitations-${new Date().toISOString().split('T')[0]}.csv`);

    // Convert to CSV string
    const csvRows = [
      exportData.headers.join(','),
      ...exportData.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ];

    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Error exporting invitations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error exporting invitations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getAllInvitations,
  getInvitationStats,
  getInvitationById,
  createInvitation,
  resendInvitation,
  revokeInvitation,
  exportInvitations
};
