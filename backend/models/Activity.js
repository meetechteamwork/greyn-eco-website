const mongoose = require('mongoose');

/**
 * Activity Model
 * Stores user-submitted eco-friendly activities for credit earning
 * Collection: activities
 */
const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'plant-tree',
        'cleanup',
        'recycle',
        'energy-save',
        'water-conserve',
        'education',
        'compost',
        'bike-walk'
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    proofImage: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: [0, 'Credits cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'unverified'],
      default: 'pending',
      index: true,
    },
    submittedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    verifiedDate: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'activities',
  }
);

// Compound indexes for efficient queries
activitySchema.index({ userId: 1, status: 1 });
activitySchema.index({ userId: 1, submittedDate: -1 });
activitySchema.index({ status: 1, submittedDate: -1 });

// Activity type credit mapping
const activityCredits = {
  'plant-tree': 50,
  'cleanup': 75,
  'recycle': 30,
  'energy-save': 25,
  'water-conserve': 40,
  'education': 60,
  'compost': 35,
  'bike-walk': 20
};

// Static method to get credits for activity type
activitySchema.statics.getCreditsForType = function(type) {
  return activityCredits[type] || 0;
};

// Static method to get user's total verified credits
activitySchema.statics.getUserTotalCredits = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const result = await this.aggregate([
    { $match: { userId: userIdObj, status: 'verified' } },
    { $group: { _id: null, total: { $sum: '$credits' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get user's activity stats
activitySchema.statics.getUserStats = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const stats = await this.aggregate([
    { $match: { userId: userIdObj } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalCredits: { $sum: '$credits' }
      }
    }
  ]);

  const result = {
    total: 0,
    verified: 0,
    pending: 0,
    unverified: 0,
    totalCredits: 0
  };

  stats.forEach(stat => {
    result.total += stat.count;
    if (stat._id === 'verified') {
      result.verified = stat.count;
      result.totalCredits = stat.totalCredits;
    } else if (stat._id === 'pending') {
      result.pending = stat.count;
    } else if (stat._id === 'unverified') {
      result.unverified = stat.count;
    }
  });

  return result;
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
