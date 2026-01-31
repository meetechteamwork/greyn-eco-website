const mongoose = require('mongoose');

/**
 * NGO Project Team Model
 * Stores team members for NGO projects
 * Collection: ngo_project_teams
 */
const ngoProjectTeamSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NgoProject',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
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
  collection: 'ngo_project_teams'
});

// Indexes
ngoProjectTeamSchema.index({ project: 1, order: 1 });

module.exports = mongoose.model('NgoProjectTeam', ngoProjectTeamSchema);
