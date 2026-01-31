const Invitation = require('../models/Invitation');
const { Admin } = require('../models/User');

// Try to load email service, but don't fail if it's not available
let sendInvitationEmail = null;
try {
  const emailService = require('./emailService');
  sendInvitationEmail = emailService.sendInvitationEmail;
} catch (error) {
  console.warn('⚠️  Email service not available. Invitations will be created without sending emails.');
  sendInvitationEmail = async () => {
    console.warn('Email service not configured. Email not sent.');
    return { success: false, message: 'Email service not configured' };
  };
}

/**
 * Get all invitations with filters
 */
const getAllInvitations = async (filters = {}) => {
  try {
    const query = {};

    // Status filter
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      query.role = filters.role;
    }

    // Portal filter
    if (filters.portal && filters.portal !== 'all') {
      query.portal = filters.portal;
    }

    // Search filter (email, invitationCode, or inviter name)
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      const adminIds = await Admin.find({ 
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id').lean();
      
      query.$or = [
        { email: searchRegex },
        { invitationCode: searchRegex },
        { invitedBy: { $in: adminIds.map(a => a._id) } }
      ];
    }

    // Auto-expire old pending invitations
    const expiredInvitations = await Invitation.find({
      status: 'pending',
      expiresAt: { $lt: new Date() }
    });
    
    if (expiredInvitations.length > 0) {
      await Invitation.updateMany(
        { _id: { $in: expiredInvitations.map(i => i._id) } },
        { $set: { status: 'expired' } }
      );
    }

    const invitations = await Invitation.find(query)
      .populate('invitedBy', 'name email')
      .populate('revokedBy', 'name email')
      .sort({ invitedAt: -1 })
      .lean()
      .maxTimeMS(5000);

    return invitations.map(inv => ({
      id: inv._id.toString(),
      email: inv.email,
      invitationCode: inv.invitationCode,
      role: inv.role,
      portal: inv.portal,
      status: inv.status,
      invitedBy: inv.invitedBy?.name || 'Unknown',
      invitedByEmail: inv.invitedBy?.email || '',
      invitedByUserId: inv.invitedBy?._id?.toString() || '',
      invitedAt: inv.invitedAt,
      expiresAt: inv.expiresAt,
      acceptedAt: inv.acceptedAt,
      revokedAt: inv.revokedAt,
      revokedBy: inv.revokedBy?.name || null,
      resendCount: inv.resendCount || 0,
      lastResentAt: inv.lastResentAt,
      token: inv.token // Include for API responses
    }));
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
};

/**
 * Get invitation by ID
 */
const getInvitationById = async (id) => {
  try {
    const invitation = await Invitation.findById(id)
      .populate('invitedBy', 'name email')
      .populate('revokedBy', 'name email')
      .lean();

    if (!invitation) {
      return null;
    }

    return {
      id: invitation._id.toString(),
      email: invitation.email,
      invitationCode: invitation.invitationCode,
      role: invitation.role,
      portal: invitation.portal,
      status: invitation.status,
      invitedBy: invitation.invitedBy?.name || 'Unknown',
      invitedByEmail: invitation.invitedBy?.email || '',
      invitedByUserId: invitation.invitedBy?._id?.toString() || '',
      invitedAt: invitation.invitedAt,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      revokedAt: invitation.revokedAt,
      revokedBy: invitation.revokedBy?.name || null,
      resendCount: invitation.resendCount || 0,
      lastResentAt: invitation.lastResentAt,
      token: invitation.token
    };
  } catch (error) {
    console.error('Error fetching invitation:', error);
    throw error;
  }
};

/**
 * Get invitation by token
 */
const getInvitationByToken = async (token) => {
  try {
    const invitation = await Invitation.findOne({ token })
      .populate('invitedBy', 'name email')
      .lean();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (invitation.status === 'pending' && new Date() > invitation.expiresAt) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
      invitation.status = 'expired';
    }

    return {
      id: invitation._id.toString(),
      email: invitation.email,
      invitationCode: invitation.invitationCode,
      role: invitation.role,
      portal: invitation.portal,
      status: invitation.status,
      invitedBy: invitation.invitedBy?.name || 'Unknown',
      invitedAt: invitation.invitedAt,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      token: invitation.token
    };
  } catch (error) {
    console.error('Error fetching invitation by token:', error);
    throw error;
  }
};

/**
 * Create new invitation
 */
const createInvitation = async (invitationData, invitedByUserId, daysUntilExpiry = 7) => {
  try {
    // Check if there's already a pending invitation for this email
    const existingInvitation = await Invitation.findOne({
      email: invitationData.email.toLowerCase().trim(),
      status: 'pending'
    });

    if (existingInvitation) {
      // Check if it's expired
      if (new Date() > existingInvitation.expiresAt) {
        // Mark as expired and create new one
        existingInvitation.status = 'expired';
        await existingInvitation.save();
      } else {
        throw new Error('A pending invitation already exists for this email');
      }
    }

    // Generate invitation code
    let invitationCode = Invitation.generateInvitationCode(invitationData.role);
    let codeExists = await Invitation.findOne({ invitationCode });
    
    // Ensure unique code
    let attempts = 0;
    while (codeExists && attempts < 10) {
      invitationCode = Invitation.generateInvitationCode(invitationData.role);
      codeExists = await Invitation.findOne({ invitationCode });
      attempts++;
    }

    if (codeExists) {
      throw new Error('Failed to generate unique invitation code');
    }

    // Generate token
    const token = Invitation.generateToken();
    
    // Calculate expiry date
    const expiresAt = new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      email: invitationData.email.toLowerCase().trim(),
      invitationCode,
      role: invitationData.role.toLowerCase(),
      portal: invitationData.portal,
      token,
      invitedBy: invitedByUserId,
      expiresAt
    });

    const populated = await Invitation.findById(invitation._id)
      .populate('invitedBy', 'name email')
      .lean();

    // Send invitation email (non-blocking, fire and forget)
    if (sendInvitationEmail) {
      sendInvitationEmail({
        email: populated.email,
        invitationCode: populated.invitationCode,
        role: populated.role,
        portal: populated.portal,
        expiresAt: populated.expiresAt,
        token: populated.token
      })
        .then((result) => {
          if (result && result.success) {
            console.log(`✅ Invitation email sent to ${populated.email}`);
          } else {
            console.warn(`⚠️  Invitation created for ${populated.email} but email not sent: ${result?.message || 'Email service not configured'}`);
          }
        })
        .catch((emailError) => {
          console.error('❌ Failed to send invitation email:', emailError.message || emailError);
          // Don't fail the invitation creation if email fails
        });
    } else {
      console.warn(`⚠️  Invitation created for ${populated.email} but email service not available.`);
    }

    return {
      id: populated._id.toString(),
      email: populated.email,
      invitationCode: populated.invitationCode,
      role: populated.role,
      portal: populated.portal,
      status: populated.status,
      invitedBy: populated.invitedBy?.name || 'Unknown',
      invitedByEmail: populated.invitedBy?.email || '',
      invitedByUserId: populated.invitedBy?._id?.toString() || '',
      invitedAt: populated.invitedAt,
      expiresAt: populated.expiresAt,
      token: populated.token
    };
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

/**
 * Resend invitation
 */
const resendInvitation = async (id, daysUntilExpiry = 7) => {
  try {
    const invitation = await Invitation.findById(id);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status === 'accepted') {
      throw new Error('Cannot resend an accepted invitation');
    }

    if (invitation.status === 'revoked') {
      throw new Error('Cannot resend a revoked invitation');
    }

    // Resend the invitation
    await invitation.resend(daysUntilExpiry);

    const populated = await Invitation.findById(invitation._id)
      .populate('invitedBy', 'name email')
      .lean();

    // Send invitation email (non-blocking, fire and forget)
    if (sendInvitationEmail) {
      sendInvitationEmail({
        email: populated.email,
        invitationCode: populated.invitationCode,
        role: populated.role,
        portal: populated.portal,
        expiresAt: populated.expiresAt,
        token: populated.token
      })
        .then((result) => {
          if (result && result.success) {
            console.log(`✅ Resent invitation email to ${populated.email}`);
          } else {
            console.warn(`⚠️  Invitation resent for ${populated.email} but email not sent: ${result?.message || 'Email service not configured'}`);
          }
        })
        .catch((emailError) => {
          console.error('❌ Failed to resend invitation email:', emailError.message || emailError);
          // Don't fail the resend if email fails
        });
    } else {
      console.warn(`⚠️  Invitation resent for ${populated.email} but email service not available.`);
    }

    return {
      id: populated._id.toString(),
      email: populated.email,
      invitationCode: populated.invitationCode,
      role: populated.role,
      portal: populated.portal,
      status: populated.status,
      invitedBy: populated.invitedBy?.name || 'Unknown',
      invitedByEmail: populated.invitedBy?.email || '',
      invitedByUserId: populated.invitedBy?._id?.toString() || '',
      invitedAt: populated.invitedAt,
      expiresAt: populated.expiresAt,
      resendCount: populated.resendCount,
      lastResentAt: populated.lastResentAt,
      token: populated.token
    };
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
};

/**
 * Revoke invitation
 */
const revokeInvitation = async (id, revokedByUserId) => {
  try {
    const invitation = await Invitation.findById(id);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status === 'accepted') {
      throw new Error('Cannot revoke an accepted invitation');
    }

    if (invitation.status === 'revoked') {
      throw new Error('Invitation is already revoked');
    }

    await invitation.markAsRevoked(revokedByUserId);

    const populated = await Invitation.findById(invitation._id)
      .populate('invitedBy', 'name email')
      .populate('revokedBy', 'name email')
      .lean();

    return {
      id: populated._id.toString(),
      email: populated.email,
      invitationCode: populated.invitationCode,
      role: populated.role,
      portal: populated.portal,
      status: populated.status,
      invitedBy: populated.invitedBy?.name || 'Unknown',
      invitedByEmail: populated.invitedBy?.email || '',
      invitedByUserId: populated.invitedBy?._id?.toString() || '',
      invitedAt: populated.invitedAt,
      expiresAt: populated.expiresAt,
      revokedAt: populated.revokedAt,
      revokedBy: populated.revokedBy?.name || null,
      token: populated.token
    };
  } catch (error) {
    console.error('Error revoking invitation:', error);
    throw error;
  }
};

/**
 * Get invitation statistics
 */
const getInvitationStats = async () => {
  try {
    // Auto-expire old pending invitations first
    await Invitation.updateMany(
      { status: 'pending', expiresAt: { $lt: new Date() } },
      { $set: { status: 'expired' } }
    );

    const [total, pending, accepted, expired, revoked] = await Promise.all([
      Invitation.countDocuments({}).maxTimeMS(5000),
      Invitation.countDocuments({ status: 'pending' }).maxTimeMS(5000),
      Invitation.countDocuments({ status: 'accepted' }).maxTimeMS(5000),
      Invitation.countDocuments({ status: 'expired' }).maxTimeMS(5000),
      Invitation.countDocuments({ status: 'revoked' }).maxTimeMS(5000)
    ]);

    return {
      total: Number(total) || 0,
      pending: Number(pending) || 0,
      accepted: Number(accepted) || 0,
      expired: Number(expired) || 0,
      revoked: Number(revoked) || 0
    };
  } catch (error) {
    console.error('Error fetching invitation stats:', error);
    throw error;
  }
};

/**
 * Export invitations to CSV format
 */
const exportInvitations = async (filters = {}) => {
  try {
    const invitations = await getAllInvitations(filters);
    
    // Convert to CSV format
    const headers = ['Email', 'Invitation Code', 'Role', 'Portal', 'Status', 'Invited By', 'Invited At', 'Expires At', 'Accepted At', 'Resend Count'];
    const rows = invitations.map(inv => [
      inv.email,
      inv.invitationCode,
      inv.role,
      inv.portal,
      inv.status,
      inv.invitedBy,
      inv.invitedAt ? new Date(inv.invitedAt).toISOString() : '',
      inv.expiresAt ? new Date(inv.expiresAt).toISOString() : '',
      inv.acceptedAt ? new Date(inv.acceptedAt).toISOString() : '',
      inv.resendCount || 0
    ]);

    return {
      headers,
      rows,
      data: invitations
    };
  } catch (error) {
    console.error('Error exporting invitations:', error);
    throw error;
  }
};

/**
 * Accept invitation (used during signup)
 */
const acceptInvitation = async (token) => {
  try {
    const invitation = await Invitation.findOne({ token });
    
    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.status !== 'pending') {
      throw new Error(`Invitation is ${invitation.status}`);
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      throw new Error('Invitation has expired');
    }

    await invitation.markAsAccepted();

    return {
      id: invitation._id.toString(),
      email: invitation.email,
      role: invitation.role,
      portal: invitation.portal,
      invitationCode: invitation.invitationCode
    };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

module.exports = {
  getAllInvitations,
  getInvitationById,
  getInvitationByToken,
  createInvitation,
  resendInvitation,
  revokeInvitation,
  getInvitationStats,
  exportInvitations,
  acceptInvitation
};
