const mongoose = require('mongoose');

/**
 * NGO Project Milestone Model
 * Stores milestones for NGO projects
 * Collection: ngo_project_milestones
 */
const ngoProjectMilestoneSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NgoProject',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    index: true
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  source: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'ngo_project_milestones'
});

// Indexes
ngoProjectMilestoneSchema.index({ project: 1, order: 1 });
ngoProjectMilestoneSchema.index({ project: 1, status: 1 });
ngoProjectMilestoneSchema.index({ project: 1, date: 1 });

module.exports = mongoose.model('NgoProjectMilestone', ngoProjectMilestoneSchema);
