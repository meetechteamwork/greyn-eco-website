const NgoProject = require('../models/NgoProject');
const NgoProjectMilestone = require('../models/NgoProjectMilestone');
const NgoProjectTeam = require('../models/NgoProjectTeam');
const { NGO } = require('../models/User');
const NgoPortalActivity = require('../models/NgoPortalActivity');

/**
 * POST /api/ngo/projects
 * Create a new project
 */
exports.createProject = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const {
      projectName,
      category,
      description,
      longDescription,
      location,
      fundingGoal,
      minInvestment,
      duration,
      carbonImpact,
      carbonCreditsPerHundred
    } = req.body;

    // Validation
    if (!projectName || !category || !description || !location || !fundingGoal) {
      return res.status(400).json({
        success: false,
        message: 'Project name, category, description, location, and funding goal are required'
      });
    }

    if (parseFloat(fundingGoal) < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Funding goal must be at least $1,000'
      });
    }

    if (minInvestment && parseFloat(minInvestment) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum investment must be at least $1'
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

    // Create project
    const project = await NgoProject.create({
      ngo: ngoId,
      name: projectName.trim(),
      category: category,
      description: description.trim(),
      longDescription: longDescription ? longDescription.trim() : '',
      location: location.trim(),
      fundingGoal: parseFloat(fundingGoal),
      minInvestment: minInvestment ? parseFloat(minInvestment) : 0,
      duration: duration ? duration.trim() : '',
      carbonImpact: carbonImpact ? carbonImpact.trim() : '',
      carbonCreditsPerHundred: carbonCreditsPerHundred ? parseFloat(carbonCreditsPerHundred) : 0,
      status: 'pending',
      currentFunding: 0,
      donors: 0,
      carbonCredits: 0,
      progress: 0
    });

    // Update NGO project count
    await NGO.findByIdAndUpdate(ngoId, {
      $inc: { projects: 1 }
    });

    // Create activity log
    try {
      await NgoPortalActivity.create({
        type: 'project_launched',
        ngo: ngoId,
        entityName: project.name,
        description: `New project "${project.name}" submitted for review`,
        metadata: {
          projectId: project._id.toString(),
          category: project.category,
          fundingGoal: project.fundingGoal
        }
      });
    } catch (activityError) {
      console.error('Failed to create activity log:', activityError);
      // Don't fail the request if activity log fails
    }

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully! It will be reviewed by our team.',
      data: {
        id: project._id.toString(),
        name: project.name,
        category: project.category,
        status: project.status,
        fundingGoal: project.fundingGoal,
        location: project.location
      }
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

/**
 * GET /api/ngo/projects
 * Get all projects for the authenticated NGO
 */
exports.getProjects = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { ngo: ngoId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await NgoProject.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await NgoProject.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects: projects.map(p => ({
          id: p._id.toString(),
          name: p.name,
          category: p.category,
          description: p.description,
          longDescription: p.longDescription,
          location: p.location,
          fundingGoal: p.fundingGoal,
          minInvestment: p.minInvestment,
          currentFunding: p.currentFunding,
          donors: p.donors,
          carbonCredits: p.carbonCredits,
          carbonImpact: p.carbonImpact,
          carbonCreditsPerHundred: p.carbonCreditsPerHundred,
          duration: p.duration,
          status: p.status,
          progress: p.progress,
          startDate: p.startDate,
          endDate: p.endDate,
          createdAt: p.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

/**
 * GET /api/ngo/projects/:id
 * Get a single project by ID with milestones and team
 */
exports.getProject = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { id } = req.params;

    const project = await NgoProject.findOne({
      _id: id,
      ngo: ngoId
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get milestones
    const milestones = await NgoProjectMilestone.find({ project: id })
      .sort({ order: 1, date: 1 })
      .lean();

    // Get team members
    const team = await NgoProjectTeam.find({ project: id })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      data: {
        id: project._id.toString(),
        name: project.name,
        category: project.category,
        description: project.description,
        longDescription: project.longDescription,
        location: project.location,
        fundingGoal: project.fundingGoal,
        minInvestment: project.minInvestment,
        currentFunding: project.currentFunding,
        donors: project.donors,
        carbonCredits: project.carbonCredits,
        carbonImpact: project.carbonImpact,
        carbonCreditsPerHundred: project.carbonCreditsPerHundred,
        duration: project.duration,
        status: project.status,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        milestones: milestones.map(m => ({
          id: m._id.toString(),
          title: m.title,
          description: m.description,
          date: m.date ? m.date.toISOString().split('T')[0] : null,
          status: m.status
        })),
        team: team.map(t => ({
          id: t._id.toString(),
          name: t.name,
          role: t.role,
          email: t.email,
          phone: t.phone,
          bio: t.bio
        }))
      }
    });
  } catch (error) {
    console.error('Error in getProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

/**
 * PUT /api/ngo/projects/:id
 * Update a project
 */
exports.updateProject = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { id } = req.params;
    const {
      projectName,
      category,
      description,
      longDescription,
      location,
      fundingGoal,
      minInvestment,
      duration,
      carbonImpact,
      carbonCreditsPerHundred
    } = req.body;

    const project = await NgoProject.findOne({
      _id: id,
      ngo: ngoId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only allow updates if project is pending or active
    if (project.status !== 'pending' && project.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only pending or active projects can be updated'
      });
    }

    // Update fields
    if (projectName) project.name = projectName.trim();
    if (category) project.category = category;
    if (description !== undefined) project.description = description.trim();
    if (longDescription !== undefined) project.longDescription = longDescription.trim();
    if (location) project.location = location.trim();
    if (fundingGoal) {
      const goal = parseFloat(fundingGoal);
      if (goal < 1000) {
        return res.status(400).json({
          success: false,
          message: 'Funding goal must be at least $1,000'
        });
      }
      project.fundingGoal = goal;
    }
    if (minInvestment !== undefined) {
      const min = parseFloat(minInvestment);
      if (min < 1) {
        return res.status(400).json({
          success: false,
          message: 'Minimum investment must be at least $1'
        });
      }
      project.minInvestment = min;
    }
    if (duration !== undefined) project.duration = duration.trim();
    if (carbonImpact !== undefined) project.carbonImpact = carbonImpact.trim();
    if (carbonCreditsPerHundred !== undefined) project.carbonCreditsPerHundred = parseFloat(carbonCreditsPerHundred);

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        id: project._id.toString(),
        name: project.name,
        category: project.category,
        status: project.status
      }
    });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};
