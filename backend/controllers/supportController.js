const SupportContact = require('../models/SupportContact');
const { Corporate } = require('../models/User');
const emailService = require('../services/emailService');

/**
 * POST /api/corporate/support/contact
 * Submit a support contact form
 */
exports.submitContact = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get corporate user info
    const corporate = await Corporate.findById(corporateId);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate account not found'
      });
    }

    // Create support contact
    const supportContact = await SupportContact.create({
      corporate: corporateId,
      subject: subject.trim(),
      message: message.trim(),
      email: corporate.email,
      name: corporate.name || corporate.contactPerson || 'Corporate User'
    });

    // Send email to support team
    const supportEmail = process.env.SUPPORT_EMAIL || 'mfaranakbar30@gmail.com';
    const corporateEmail = corporate.email;
    const corporateName = corporate.name || corporate.contactPerson || 'Corporate User';
    const companyName = corporate.companyName || 'Corporate User';

    // Send email to support team (don't await to avoid blocking response)
    emailService.sendSupportEmail({
      to: supportEmail,
      from: corporateEmail,
      fromName: corporateName,
      companyName: companyName,
      subject: `[Support Request] ${subject.trim()}`,
      message: message.trim(),
      contactId: supportContact._id.toString()
    }).catch(err => {
      console.error('Failed to send support email to team:', err);
    });

    // Send confirmation email to corporate user (don't await to avoid blocking response)
    emailService.sendSupportConfirmationEmail({
      to: corporateEmail,
      name: corporateName,
      subject: subject.trim(),
      contactId: supportContact._id.toString()
    }).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.',
      data: {
        id: supportContact._id,
        subject: supportContact.subject,
        createdAt: supportContact.createdAt
      }
    });
  } catch (error) {
    console.error('Error in submitContact (corporate/support):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit support request',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/support/contacts
 * Get support contacts for the authenticated corporate user
 */
exports.getContacts = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await SupportContact.find({ corporate: corporateId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await SupportContact.countDocuments({ corporate: corporateId });

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getContacts (corporate/support):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support contacts',
      error: error.message
    });
  }
};
