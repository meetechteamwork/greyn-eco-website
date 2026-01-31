const NgoPersonDetails = require('../models/NgoPersonDetails');
const { NGO } = require('../models/User');

/**
 * GET /api/ngo/person-details
 * Get person details for the authenticated NGO user
 */
exports.getPersonDetails = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    // Get person details
    let personDetails = await NgoPersonDetails.findOne({ ngo: ngoId }).lean();

    // If no details exist, create default from NGO basic info
    if (!personDetails) {
      const ngo = await NGO.findById(ngoId).lean();
      if (!ngo) {
        return res.status(404).json({
          success: false,
          message: 'NGO not found'
        });
      }

      // Create default details from NGO contact person
      personDetails = await NgoPersonDetails.create({
        ngo: ngoId,
        name: ngo.contactPerson || '',
        role: '',
        email: ngo.email || '',
        phone: '',
        bio: '',
        expertise: [],
        education: [],
        projectsLed: 0,
        yearsExperience: 0,
        publications: 0,
        awards: [],
        socialLinks: {
          linkedin: '',
          researchGate: '',
          twitter: '',
          website: ''
        }
      });
    }

    // Get project count from NGO model
    const ngo = await NGO.findById(ngoId).lean();
    const projectsLed = personDetails.projectsLed || ngo?.projects || 0;

    // Format response
    const response = {
      name: personDetails.name,
      role: personDetails.role || '',
      email: personDetails.email,
      phone: personDetails.phone || '',
      bio: personDetails.bio || '',
      expertise: personDetails.expertise || [],
      education: personDetails.education || [],
      projectsLed: projectsLed,
      yearsExperience: personDetails.yearsExperience || 0,
      publications: personDetails.publications || 0,
      awards: personDetails.awards || [],
      socialLinks: personDetails.socialLinks || {
        linkedin: '',
        researchGate: '',
        twitter: '',
        website: ''
      }
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in getPersonDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch person details',
      error: error.message
    });
  }
};

/**
 * PUT /api/ngo/person-details
 * Update person details
 */
exports.updatePersonDetails = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const {
      name,
      role,
      email,
      phone,
      bio,
      expertise,
      education,
      projectsLed,
      yearsExperience,
      publications,
      awards,
      socialLinks
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
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
      name: name.trim(),
      role: role?.trim() || '',
      email: email?.trim().toLowerCase() || '',
      phone: phone?.trim() || '',
      bio: bio?.trim() || '',
      expertise: Array.isArray(expertise) ? expertise.map(e => e.trim()).filter(e => e) : [],
      education: Array.isArray(education) ? education.map(edu => ({
        degree: edu.degree?.trim() || '',
        institution: edu.institution?.trim() || '',
        year: edu.year?.trim() || ''
      })).filter(edu => edu.degree && edu.institution) : [],
      projectsLed: parseInt(projectsLed) || 0,
      yearsExperience: parseInt(yearsExperience) || 0,
      publications: parseInt(publications) || 0,
      awards: Array.isArray(awards) ? awards.map(a => a.trim()).filter(a => a) : [],
      socialLinks: {
        linkedin: socialLinks?.linkedin?.trim() || '',
        researchGate: socialLinks?.researchGate?.trim() || '',
        twitter: socialLinks?.twitter?.trim() || '',
        website: socialLinks?.website?.trim() || ''
      },
      updatedAt: new Date()
    };

    // Update or create person details
    const personDetails = await NgoPersonDetails.findOneAndUpdate(
      { ngo: ngoId },
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).lean();

    // Also update basic NGO contact person if changed
    if (ngo.contactPerson !== name) {
      await NGO.findByIdAndUpdate(ngoId, {
        contactPerson: name.trim()
      });
    }

    // Format response
    const response = {
      name: personDetails.name,
      role: personDetails.role || '',
      email: personDetails.email,
      phone: personDetails.phone || '',
      bio: personDetails.bio || '',
      expertise: personDetails.expertise || [],
      education: personDetails.education || [],
      projectsLed: personDetails.projectsLed || 0,
      yearsExperience: personDetails.yearsExperience || 0,
      publications: personDetails.publications || 0,
      awards: personDetails.awards || [],
      socialLinks: personDetails.socialLinks || {
        linkedin: '',
        researchGate: '',
        twitter: '',
        website: ''
      }
    };

    res.json({
      success: true,
      message: 'Person details updated successfully',
      data: response
    });
  } catch (error) {
    console.error('Error in updatePersonDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update person details',
      error: error.message
    });
  }
};
