const { Corporate } = require('../models/User');
const CorporateProfileSettings = require('../models/CorporateProfileSettings');
const bcrypt = require('bcryptjs');

/**
 * GET /api/corporate/profile-settings
 * Get profile settings for the authenticated corporate user
 */
exports.getProfileSettings = async (req, res) => {
  try {
    const corporateId = req.user.userId;

    // Get corporate user data
    const corporate = await Corporate.findById(corporateId).lean();
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate account not found'
      });
    }

    // Get or create profile settings
    let settings = await CorporateProfileSettings.findOne({ corporate: corporateId }).lean();

    if (!settings) {
      // Create default settings
      settings = await CorporateProfileSettings.create({
        corporate: corporateId,
        profile: {
          name: corporate.name || corporate.contactPerson || '',
          email: corporate.email || '',
          timezone: 'America/Los_Angeles'
        }
      });
      settings = settings.toObject();
    }

    // Merge with corporate user data
    const profileData = {
      ...settings.profile,
      name: settings.profile.name || corporate.name || corporate.contactPerson || '',
      email: settings.profile.email || corporate.email || '',
      companyName: corporate.companyName || ''
    };

    res.json({
      success: true,
      data: {
        profile: profileData,
        security: settings.security,
        preferences: settings.preferences,
        notifications: settings.notifications
      }
    });
  } catch (error) {
    console.error('Error in getProfileSettings (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load profile settings',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/profile-settings/profile
 * Update profile information
 */
exports.updateProfile = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const profileData = req.body;

    // Validate required fields
    if (!profileData.name || !profileData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email is already in use by another corporate
    const existingCorporate = await Corporate.findOne({
      email: profileData.email.toLowerCase(),
      _id: { $ne: corporateId }
    });

    if (existingCorporate) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use by another account'
      });
    }

    // Update or create profile settings
    let settings = await CorporateProfileSettings.findOne({ corporate: corporateId });

    if (!settings) {
      settings = await CorporateProfileSettings.create({
        corporate: corporateId,
        profile: profileData
      });
    } else {
      settings.profile = {
        ...settings.profile,
        ...profileData
      };
      await settings.save();
    }

    // Also update the corporate user record
    await Corporate.findByIdAndUpdate(corporateId, {
      name: profileData.name,
      email: profileData.email.toLowerCase(),
      contactPerson: profileData.name
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: settings.profile
      }
    });
  } catch (error) {
    console.error('Error in updateProfile (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/profile-settings/security
 * Update security settings
 */
exports.updateSecurity = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const securityData = req.body;

    // Update or create profile settings
    let settings = await CorporateProfileSettings.findOne({ corporate: corporateId });

    if (!settings) {
      settings = await CorporateProfileSettings.create({
        corporate: corporateId,
        security: securityData
      });
    } else {
      settings.security = {
        ...settings.security,
        ...securityData
      };
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: {
        security: settings.security
      }
    });
  } catch (error) {
    console.error('Error in updateSecurity (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/profile-settings/preferences
 * Update application preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const preferencesData = req.body;

    // Update or create profile settings
    let settings = await CorporateProfileSettings.findOne({ corporate: corporateId });

    if (!settings) {
      settings = await CorporateProfileSettings.create({
        corporate: corporateId,
        preferences: preferencesData
      });
    } else {
      settings.preferences = {
        ...settings.preferences,
        ...preferencesData
      };
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: settings.preferences
      }
    });
  } catch (error) {
    console.error('Error in updatePreferences (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/profile-settings/notifications
 * Update notification settings
 */
exports.updateNotifications = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const notificationsData = req.body;

    // Update or create profile settings
    let settings = await CorporateProfileSettings.findOne({ corporate: corporateId });

    if (!settings) {
      settings = await CorporateProfileSettings.create({
        corporate: corporateId,
        notifications: notificationsData
      });
    } else {
      settings.notifications = {
        ...settings.notifications,
        ...notificationsData
      };
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: {
        notifications: settings.notifications
      }
    });
  } catch (error) {
    console.error('Error in updateNotifications (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/profile-settings/change-password
 * Change user password
 */
exports.changePassword = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get corporate user
    const corporate = await Corporate.findById(corporateId);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate account not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, corporate.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password (using same salt rounds as User model: 12)
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password directly using findByIdAndUpdate to bypass pre-save hook
    // This prevents double hashing
    await Corporate.findByIdAndUpdate(corporateId, {
      password: hashedPassword
    }, { runValidators: false });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error in changePassword (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/profile-settings/export
 * Export user data
 */
exports.exportData = async (req, res) => {
  try {
    const corporateId = req.user.userId;

    // Get corporate user
    const corporate = await Corporate.findById(corporateId).lean();
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate account not found'
      });
    }

    // Get profile settings
    const settings = await CorporateProfileSettings.findOne({ corporate: corporateId }).lean();

    // Prepare export data (exclude sensitive information)
    const exportData = {
      profile: {
        name: corporate.name || corporate.contactPerson,
        email: corporate.email,
        companyName: corporate.companyName,
        taxId: corporate.taxId,
        ...(settings?.profile || {})
      },
      preferences: settings?.preferences || {},
      notifications: settings?.notifications || {},
      accountCreated: corporate.createdAt,
      lastUpdated: settings?.updatedAt || corporate.updatedAt
    };

    // Remove password from corporate data
    delete corporate.password;

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Error in exportData (corporate/profile-settings):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};
