const Activity = require('../models/Activity');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Check if multer is available
let multer;
try {
  multer = require('multer');
} catch (err) {
  console.warn('⚠️  Multer not installed. Please run: npm install multer');
  multer = null;
}

/**
 * Simple User Activity Controller
 * Handles all activity-related operations for simple users
 */

// Configure multer for image uploads
let upload;
if (multer) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads/activities');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `activity-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
      }
    }
  });
}

// Middleware for single file upload
exports.uploadProofImage = multer ? upload.single('proofImage') : (req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'File upload not configured. Please install multer: npm install multer'
  });
};

/**
 * Get user's activities
 */
exports.getActivities = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, limit = 50, skip = 0, sortBy = 'submittedDate', sortOrder = 'desc' } = req.query;

    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const activities = await Activity.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-metadata -__v')
      .lean();

    // Convert proofImage paths to URLs
    const activitiesWithUrls = activities.map(activity => ({
      ...activity,
      id: activity._id.toString(),
      _id: activity._id.toString(),
      proofImage: activity.proofImage.startsWith('http') 
        ? activity.proofImage 
        : `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/activities/${path.basename(activity.proofImage)}`
    }));

    res.json({
      success: true,
      data: activitiesWithUrls,
      count: activitiesWithUrls.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get activity by ID
 */
exports.getActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const activity = await Activity.findOne({ _id: id, userId })
      .select('-metadata -__v')
      .lean();

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Convert proofImage path to URL
    activity.id = activity._id.toString();
    activity._id = activity._id.toString();
    activity.proofImage = activity.proofImage.startsWith('http')
      ? activity.proofImage
      : `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/activities/${path.basename(activity.proofImage)}`;

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Create new activity
 */
exports.createActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, title, description } = req.body;

    // Validate input
    if (!type || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and description are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Proof image is required'
      });
    }

    // Get credits for activity type
    const credits = Activity.getCreditsForType(type);

    // Create activity
    const activity = new Activity({
      userId,
      type,
      title,
      description,
      proofImage: req.file.filename,
      credits,
      status: 'pending'
    });

    await activity.save();

    // Convert proofImage path to URL
    const activityData = activity.toObject();
    activityData.id = activityData._id.toString();
    activityData._id = activityData._id.toString();
    activityData.proofImage = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/activities/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: 'Activity submitted successfully. Admin will review it soon.',
      data: activityData
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    
    // Clean up uploaded file if activity creation failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get user's activity statistics
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [stats, totalCredits] = await Promise.all([
      Activity.getUserStats(userId),
      Activity.getUserTotalCredits(userId)
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        totalCredits
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity statistics',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/**
 * Get activity types with credits
 */
exports.getActivityTypes = async (req, res) => {
  try {
    const activityTypes = [
      { value: 'plant-tree', label: '🌳 Plant Tree', credits: 50, description: 'Plant trees and provide proof with photos' },
      { value: 'cleanup', label: '🧹 Cleanup Activity', credits: 75, description: 'Organize or participate in beach/park/street cleanup' },
      { value: 'recycle', label: '♻️ Recycling', credits: 30, description: 'Recycle materials and document the process' },
      { value: 'energy-save', label: '⚡ Energy Saving', credits: 25, description: 'Implement energy-saving measures and show proof' },
      { value: 'water-conserve', label: '💧 Water Conservation', credits: 40, description: 'Install water-saving devices or practices' },
      { value: 'education', label: '📚 Environmental Education', credits: 60, description: 'Educate others about environmental issues' },
      { value: 'compost', label: '🍃 Composting', credits: 35, description: 'Start composting and document the process' },
      { value: 'bike-walk', label: '🚴 Bike/Walk Commute', credits: 20, description: 'Use eco-friendly transportation methods' }
    ];

    res.json({
      success: true,
      data: activityTypes
    });
  } catch (error) {
    console.error('Error fetching activity types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity types',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};
