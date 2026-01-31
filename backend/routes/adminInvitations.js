const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  getAllInvitations,
  getInvitationStats,
  getInvitationById,
  createInvitation,
  resendInvitation,
  revokeInvitation,
  exportInvitations
} = require('../controllers/adminInvitationsController');

// All routes require admin authentication
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/invitations
 * @desc    Get all invitations with optional filters
 * @access  Admin
 */
router.get('/', getAllInvitations);

/**
 * @route   GET /api/admin/invitations/stats
 * @desc    Get invitation statistics
 * @access  Admin
 */
router.get('/stats', getInvitationStats);

/**
 * @route   GET /api/admin/invitations/export
 * @desc    Export invitations to CSV
 * @access  Admin
 */
router.get('/export', exportInvitations);

/**
 * @route   GET /api/admin/invitations/:id
 * @desc    Get invitation by ID
 * @access  Admin
 * NOTE: This must come after /stats and /export to avoid route conflicts
 */
router.get('/:id', getInvitationById);

/**
 * @route   POST /api/admin/invitations
 * @desc    Create new invitation
 * @access  Admin
 */
router.post('/', createInvitation);

/**
 * @route   PUT /api/admin/invitations/:id/resend
 * @desc    Resend invitation
 * @access  Admin
 */
router.put('/:id/resend', resendInvitation);

/**
 * @route   PUT /api/admin/invitations/:id/revoke
 * @desc    Revoke invitation
 * @access  Admin
 */
router.put('/:id/revoke', revokeInvitation);

module.exports = router;
