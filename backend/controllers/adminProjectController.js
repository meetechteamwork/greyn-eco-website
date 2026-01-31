const NgoProject = require('../models/NgoProject');
const { sendProjectApprovalEmail, sendProjectRejectionEmail } = require('../services/emailService');

/**
 * Admin Project Controller
 * Handles CRUD operations for NGO projects (approval workflow)
 */

/**
 * Get all projects with filtering and pagination
 */
exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      featured,
      search
    } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      NgoProject.find(query)
        .populate('ngo', 'organizationName email contactPerson')
        .populate('approvedBy', 'name email')
        .populate('rejectedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      NgoProject.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

/**
 * Get single project by ID
 */
exports.getProject = async (req, res) => {
  try {
    const project = await NgoProject.findById(req.params.id)
      .populate('ngo', 'organizationName email contactPerson')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

/**
 * Approve a project
 */
exports.approveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const project = await NgoProject.findById(id).populate('ngo');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Project is already ${project.status}. Only pending projects can be approved.`
      });
    }

    project.status = 'active';
    project.approvedBy = req.user.userId;
    project.approvedAt = new Date();

    await project.save();
    await project.populate('approvedBy', 'name email');

    // Send approval email
    try {
      if (project.ngo && project.ngo.email) {
        await sendProjectApprovalEmail(project.ngo.email, {
          projectName: project.name,
          organizationName: project.ngo.organizationName || 'Your Organization'
        });
      }
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Project approved successfully',
      data: project
    });
  } catch (error) {
    console.error('Error approving project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve project',
      error: error.message
    });
  }
};

/**
 * Reject a project
 */
exports.rejectProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const project = await NgoProject.findById(id).populate('ngo');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Project is already ${project.status}. Only pending projects can be rejected.`
      });
    }

    project.status = 'rejected';
    project.rejectedBy = req.user.userId;
    project.rejectedAt = new Date();
    project.rejectionReason = reason.trim();

    await project.save();
    await project.populate('rejectedBy', 'name email');

    // Send rejection email
    try {
      if (project.ngo && project.ngo.email) {
        await sendProjectRejectionEmail(project.ngo.email, {
          projectName: project.name,
          organizationName: project.ngo.organizationName || 'Your Organization',
          reason: reason.trim()
        });
      }
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Project rejected successfully',
      data: project
    });
  } catch (error) {
    console.error('Error rejecting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject project',
      error: error.message
    });
  }
};


/**
 * Delete project
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await NgoProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await NgoProject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

/**
 * Get project statistics
 */
exports.getProjectStats = async (req, res) => {
  try {
    const [total, pending, active, completed, rejected, byCategory] = await Promise.all([
      NgoProject.countDocuments(),
      NgoProject.countDocuments({ status: 'pending' }),
      NgoProject.countDocuments({ status: 'active' }),
      NgoProject.countDocuments({ status: 'completed' }),
      NgoProject.countDocuments({ status: 'rejected' }),
      NgoProject.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        active,
        completed,
        rejected,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error.message
    });
  }
};
