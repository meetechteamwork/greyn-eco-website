const NgoDetails = require('../models/NgoDetails');
const { NGO } = require('../models/User');
const mongoose = require('mongoose');

const NO_SEED = { source: { $ne: 'seed' } };

/**
 * GET /api/ngo/details
 * Get NGO details for the authenticated NGO user
 */
exports.getNgoDetails = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    // Get NGO details
    let ngoDetails = await NgoDetails.findOne({ ngo: ngoId }).lean();

    // If no details exist, create default from NGO basic info
    if (!ngoDetails) {
      const ngo = await NGO.findById(ngoId).lean();
      if (!ngo) {
        return res.status(404).json({
          success: false,
          message: 'NGO not found'
        });
      }

      // Create default details
      ngoDetails = await NgoDetails.create({
        ngo: ngoId,
        organizationName: ngo.organizationName || '',
        registrationNumber: ngo.registrationNumber || '',
        contactEmail: ngo.email || '',
        location: ngo.location || '',
        mission: '',
        focusAreas: [],
        certifications: [],
        teamSize: 0,
        annualBudget: 0,
        impactMetrics: {
          treesPlanted: 0,
          carbonOffset: 0,
          communitiesImpacted: 0,
          hectaresRestored: 0
        }
      });
    }

    // Get project count from NGO model
    const ngo = await NGO.findById(ngoId).lean();
    const totalProjectsLaunched = ngo?.projects || 0;

    // Format response
    const response = {
      organizationName: ngoDetails.organizationName,
      registrationNumber: ngoDetails.registrationNumber,
      establishedDate: ngoDetails.establishedDate ? ngoDetails.establishedDate.toISOString().split('T')[0] : null,
      location: ngoDetails.location,
      contactEmail: ngoDetails.contactEmail,
      contactPhone: ngoDetails.contactPhone,
      website: ngoDetails.website,
      mission: ngoDetails.mission,
      focusAreas: ngoDetails.focusAreas || [],
      certifications: ngoDetails.certifications || [],
      teamSize: ngoDetails.teamSize || 0,
      annualBudget: ngoDetails.annualBudget || 0,
      totalProjectsLaunched: totalProjectsLaunched,
      totalImpact: {
        treesPlanted: ngoDetails.impactMetrics?.treesPlanted || 0,
        carbonOffset: ngoDetails.impactMetrics?.carbonOffset || 0,
        communitiesImpacted: ngoDetails.impactMetrics?.communitiesImpacted || 0,
        hectaresRestored: ngoDetails.impactMetrics?.hectaresRestored || 0
      }
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in getNgoDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NGO details',
      error: error.message
    });
  }
};

/**
 * PUT /api/ngo/details
 * Update NGO details
 */
exports.updateNgoDetails = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const {
      organizationName,
      registrationNumber,
      establishedDate,
      location,
      contactEmail,
      contactPhone,
      website,
      mission,
      focusAreas,
      certifications,
      teamSize,
      annualBudget,
      impactMetrics
    } = req.body;

    // Validate required fields
    if (!organizationName || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Organization name and registration number are required'
      });
    }

    // Check if NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // Prepare update data
    const updateData = {
      organizationName: organizationName.trim(),
      registrationNumber: registrationNumber.trim(),
      location: location?.trim() || '',
      contactEmail: contactEmail?.trim().toLowerCase() || '',
      contactPhone: contactPhone?.trim() || '',
      website: website?.trim() || '',
      mission: mission?.trim() || '',
      focusAreas: Array.isArray(focusAreas) ? focusAreas.map(a => a.trim()).filter(a => a) : [],
      certifications: Array.isArray(certifications) ? certifications.map(c => c.trim()).filter(c => c) : [],
      teamSize: parseInt(teamSize) || 0,
      annualBudget: parseFloat(annualBudget) || 0,
      updatedAt: new Date()
    };

    // Add established date if provided
    if (establishedDate) {
      updateData.establishedDate = new Date(establishedDate);
    }

    // Add impact metrics if provided
    if (impactMetrics) {
      updateData.impactMetrics = {
        treesPlanted: parseInt(impactMetrics.treesPlanted) || 0,
        carbonOffset: parseFloat(impactMetrics.carbonOffset) || 0,
        communitiesImpacted: parseInt(impactMetrics.communitiesImpacted) || 0,
        hectaresRestored: parseFloat(impactMetrics.hectaresRestored) || 0
      };
    }

    // Update or create NGO details
    const ngoDetails = await NgoDetails.findOneAndUpdate(
      { ngo: ngoId },
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).lean();

    // Also update basic NGO info if changed
    if (ngo.organizationName !== organizationName || ngo.registrationNumber !== registrationNumber) {
      await NGO.findByIdAndUpdate(ngoId, {
        organizationName: organizationName.trim(),
        registrationNumber: registrationNumber.trim(),
        location: location?.trim() || ngo.location,
        email: contactEmail?.trim().toLowerCase() || ngo.email
      });
    }

    // Format response
    const response = {
      organizationName: ngoDetails.organizationName,
      registrationNumber: ngoDetails.registrationNumber,
      establishedDate: ngoDetails.establishedDate ? ngoDetails.establishedDate.toISOString().split('T')[0] : null,
      location: ngoDetails.location,
      contactEmail: ngoDetails.contactEmail,
      contactPhone: ngoDetails.contactPhone,
      website: ngoDetails.website,
      mission: ngoDetails.mission,
      focusAreas: ngoDetails.focusAreas || [],
      certifications: ngoDetails.certifications || [],
      teamSize: ngoDetails.teamSize || 0,
      annualBudget: ngoDetails.annualBudget || 0,
      totalProjectsLaunched: ngo.projects || 0,
      totalImpact: {
        treesPlanted: ngoDetails.impactMetrics?.treesPlanted || 0,
        carbonOffset: ngoDetails.impactMetrics?.carbonOffset || 0,
        communitiesImpacted: ngoDetails.impactMetrics?.communitiesImpacted || 0,
        hectaresRestored: ngoDetails.impactMetrics?.hectaresRestored || 0
      }
    };

    res.json({
      success: true,
      message: 'NGO details updated successfully',
      data: response
    });
  } catch (error) {
    console.error('Error in updateNgoDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update NGO details',
      error: error.message
    });
  }
};
